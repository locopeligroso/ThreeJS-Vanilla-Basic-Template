import * as THREE from "three";
import vertexShader from "../Materials/shaders/particles-morphing/vertex.glsl";
import fragmentShader from "../Materials/shaders/particles-morphing/fragment.glsl";
import Experience from "../Experience/Experience";

export default class ParticleMophingMaterial extends THREE.ShaderMaterial {
  constructor() {
    super();

    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    this.setUniforms();
    this.setMaterial();

    this.setDebug();
  }

  setUniforms() {
    this.uniforms = {
      uSize: { value: 0.2 },
      uResolution: {
        value: new THREE.Vector2(
          this.sizes.width * this.sizes.pixelRatio,
          this.sizes.height * this.sizes.pixelRatio,
        ),
      },
      uProgress: { value: 0 },
    };
  }

  setMaterial() {
    this.setValues({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }

  setDebug() {
    console.log("ok");
    const ui = this?.debug?.ui;
    if (!ui) return;
    const f = ui.addFolder?.("Particle Morphing");

    f.add(this.uniforms.uSize, "value", 0.01, 2.0, 0.01).name("uSize");
    f.add(this.uniforms.uProgress, "value", 0.01, 1.0, 0.01).name("uProgress");
  }
}
