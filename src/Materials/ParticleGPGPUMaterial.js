import * as THREE from "three";
import Experience from "../Experience/Experience";
import vertexShader from "../Materials/shaders/particles/vertexShader.glsl";
import fragmentShader from "../Materials/shaders/particles/fragmentShader.glsl";

export default class ParticleGPGPUMaterial extends THREE.ShaderMaterial {
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
      uSize: { value: 0.075 },
      uResolution: {
        value: new THREE.Vector2(
          this.sizes.width * this.sizes.pixelRatio,
          this.sizes.height * this.sizes.pixelRatio,
        ),
      },
      uParticlesTexture: new THREE.Uniform(),
      uOpacity: { value: 1 },
    };
  }

  setMaterial() {
    this.setValues({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }

  setDebug() {
    const ui = this?.debug?.ui;
    if (!ui) return;
    const f = (this.debug.particleGPGPUFolder ||=
      ui.addFolder?.("Particle Material"));

    f.add(this.uniforms.uSize, "value", 0.01, 2.0, 0.01).name("uSize");
    f.add(this.uniforms.uOpacity, "value", 0.0, 1.0, 0.01).name("uOpacity");

    f.add(this, "blending", {
      None: THREE.NoBlending,
      Normal: THREE.NormalBlending,
      Additive: THREE.AdditiveBlending,
      Subtractive: THREE.SubtractiveBlending,
      Multiply: THREE.MultiplyBlending,
    })
      .name("Blending")
      .onChange(() => {
        this.transparent = this.blending !== THREE.NoBlending;
        this.needsUpdate = true;
      });
  }

  update() {}
}
