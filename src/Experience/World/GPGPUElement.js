import * as THREE from "three";
import Experience from "../Experience";
import ParticleMaterial from "../../Materials/ParticleMaterial";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import gpgpuParticleShader from "../../Materials/shaders/gpgpu/particles.glsl";
import Time from "../Utils/Time";

export default class GPGPUElement {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.time = new Time();

    this.init();
    this.setParticles();
    this.setGPGPU();

    this.test();

    this.setScene(this.particles.points);
    // this.setScene(this.model.scene);
  }

  init() {
    this.particles = {};
    this.particles.material = new ParticleMaterial();

    this.model = this.resources.items.boatModel;

    this.baseGeometry = {};
    this.baseGeometry.instance = this.model.scene.children[0].geometry;
    this.baseGeometry.count =
      this.baseGeometry.instance.attributes.position.count;

    this.gpgpu = {};
    this.gpgpu.size = Math.ceil(Math.sqrt(this.baseGeometry.count));
    this.gpgpu.computation = new GPUComputationRenderer(
      this.gpgpu.size,
      this.gpgpu.size,
      this.experience.renderer.instance,
    );

    this.baseParticlesTexture = this.gpgpu.computation.createTexture();
  }

  setParticles() {
    const image = this.baseParticlesTexture.image;
    const position = this.baseGeometry.instance.attributes.position;

    for (let i = 0; i < this.baseGeometry.count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;
      image.data[i4 + 0] = position.array[i3 + 0];
      image.data[i4 + 1] = position.array[i3 + 1];
      image.data[i4 + 2] = position.array[i3 + 2];
      image.data[i4 + 3] = 0;
    }

    // Geometry
    this.particlesUvArray = new Float32Array(this.baseGeometry.count * 2);
    this.sizesArray = new Float32Array(this.baseGeometry.count * 1);

    for (let y = 0; y < this.gpgpu.size; y++) {
      for (let x = 0; x < this.gpgpu.size; x++) {
        const i = y * this.gpgpu.size + x;
        const i2 = i * 2;

        // Particles UV
        const uvX = (x + 0.5) / this.gpgpu.size;
        const uvY = (y + 0.5) / this.gpgpu.size;

        this.particlesUvArray[i2 + 0] = uvX;
        this.particlesUvArray[i2 + 1] = uvY;

        // Sizes
        this.sizesArray[i] = Math.random();
      }
    }

    // Points
    this.particles.geometry = new THREE.BufferGeometry();
    this.particles.geometry.setDrawRange(0, this.baseGeometry.count);

    this.setAttributes();
  }

  setGPGPU() {
    this.gpgpu.particlesVariable = this.gpgpu.computation.addVariable(
      "uParticles",
      gpgpuParticleShader,
      this.baseParticlesTexture,
    );

    this.gpgpu.computation.setVariableDependencies(
      this.gpgpu.particlesVariable,
      [this.gpgpu.particlesVariable],
    );

    this.setUniforms();

    this.gpgpu.computation.init();
  }

  setUniforms() {
    this.gpgpu.particlesVariable.material.uniforms.uTime = new THREE.Uniform(0);
  }

  setAttributes() {
    this.particles.geometry.setAttribute(
      "aParticlesUv",
      new THREE.BufferAttribute(this.particlesUvArray, 2),
    );

    this.particles.geometry.setAttribute(
      "aColor",
      this.baseGeometry.instance.attributes.color,
    );

    this.particles.geometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(this.sizesArray, 1),
    );

    this.particles.points = new THREE.Points(
      this.particles.geometry,
      this.particles.material,
    );
  }

  setScene(object) {
    this.scene.add(object);
  }

  update() {
    this.gpgpu.particlesVariable.material.uniforms.uTime.value =
      this.time.elapsed;

    this.gpgpu.computation.compute();

    this.particles.material.uniforms.uParticlesTexture.value =
      this.gpgpu.computation.getCurrentRenderTarget(
        this.gpgpu.particlesVariable,
      ).texture;
  }

  test() {
    const test = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      new THREE.MeshBasicMaterial({
        map: this.gpgpu.computation.getCurrentRenderTarget(
          this.gpgpu.particlesVariable,
        ).texture,
      }),
    );

    test.position.set(3, 0, 0);
    this.setScene(test);
  }
}
