import * as THREE from "three";
import Experience from "../Experience/Experience";
import vertexShader from "../Materials/shaders/particles/vertexShader.glsl";
import fragmentShader from "../Materials/shaders/particles/fragmentShader.glsl";

export default class ParticleMaterial extends THREE.ShaderMaterial {
  constructor() {
    super();

    this.experience = new Experience();
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    this.setUniforms();
    this.setMaterial();

    this.setDebug();
  }

  setUniforms() {
    this.uniforms = {
      uSize: { value: 0.4 },
      uResolution: {
        value: new THREE.Vector2(
          this.sizes.width * this.sizes.pixelRatio,
          this.sizes.height * this.sizes.pixelRatio,
        ),
      },
    };
  }

  setMaterial() {
    this.setValues({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
  }

  setDebug() {
    const ui = this?.debug?.ui;
    if (!ui) return;
    const f = ui.addFolder?.("Particle Material");

    f.add(this.uniforms.uSize, "value", 0.01, 2.0, 0.01).name("uSize");
  }

  update() {}
}
