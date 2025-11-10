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
      uSize: { value: 0.4 },
      uResolution: {
        value: new THREE.Vector2(
          this.sizes.width * this.sizes.pixelRatio,
          this.sizes.height * this.sizes.pixelRatio,
        ),
      },
      uProgress: { value: 0 },
      uFrequency: { value: 0.2 },
      uDuration: { value: 0.4 },

      uColorA: { value: new THREE.Color(0x00bfff) },
      uColorB: { value: new THREE.Color(0x001eff) },
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
    const ui = this?.debug?.ui;
    if (!ui) return;

    const f = (this.debug.particleMorphingFolder ||=
      ui.addFolder?.("Particle Morphing"));

    f.add(this.uniforms.uSize, "value", 0.01, 2.0, 0.01).name("uSize");
    f.add(this.uniforms.uProgress, "value", 0.0, 1.0, 0.01).name("uProgress");
    f.add(this.uniforms.uFrequency, "value", 0.01, 1.0, 0.01).name(
      "uFrequency",
    );
    f.add(this.uniforms.uDuration, "value", 0.01, 1.0, 0.01).name("uDuration");
    f.addColor(this.uniforms.uColorA, "value");
    f.addColor(this.uniforms.uColorB, "value");
  }
}
