import * as THREE from "three";
import Experience from "../Experience";
import ParticleMaterial from "../../Materials/ParticleMaterial";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import gpgpuParticleShader from "../../Materials/shaders/gpgpu/particles.glsl";
export default class Gancio {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.resources = this.experience.resources;
    this.model = this.resources.items.boatModel.scene;

    this.init();
    this.setGPGPU();
    this.setPoints();

    this.setScene(this.particles.points);
    this.test();
  }

  init() {
    this.particles = {};
    this.particles.material = new ParticleMaterial();

    this.baseGeometry = {};
    this.baseGeometry.instance = new THREE.SphereGeometry(3);

    this.baseGeometry.count =
      this.baseGeometry.instance.attributes.position.count;
  }

  setGPGPU() {
    this.gpgpu = {};

    this.gpgpu.size = Math.ceil(Math.sqrt(this.baseGeometry.count));

    this.gpgpu.computation = new GPUComputationRenderer(
      this.gpgpu.size,
      this.gpgpu.size,
      this.experience.renderer,
    );

    this.baseParticleTexture = this.gpgpu.computation.createTexture();

    this.gpgpu.particlesVariable = this.gpgpu.computation.addVariable(
      "uParticles",
      gpgpuParticleShader,
      this.baseParticleTexture,
    );

    this.gpgpu.computation.setVariableDependencies(
      this.gpgpu.particlesVariable,
      [this.gpgpu.particlesVariable],
    );
  }

  setPoints() {
    this.particles.points = new THREE.Points(
      this.baseGeometry.instance,
      this.particles.material,
    );
  }

  setScene(object) {
    this.scene.add(object);
  }

  update() {
    this.gpgpu.computation.compute();
  }

  test() {
    this.gpgpu.debug = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3),
      // new THREE.MeshBasicMaterial({
      //   map: gpgpu.computation.getCurrentRenderTarget(
      //     this.gpgpu.particlesVariable,
      //   ).texture,
      // }),
    );

    this.gpgpu.debug.position.set(3, 0, 0);
    this.scene.add(this.gpgpu.debug);
  }
}
