import * as THREE from "three";
import Experience from "../Experience/Experience";
import vertexShader from "../Materials/shaders/particles/vertexShader.glsl";
import fragmentShader from "../Materials/shaders/particles/fragmentShader.glsl";

export default class ParticleGPGPUMaterial extends THREE.ShaderMaterial {
  constructor(size, opacity) {
    super();

    this.experience = new Experience();
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    this.setUniforms(size, opacity);
    this.setMaterial();

    this.setDebug();
  }

  setUniforms(size, opacity) {
    this.uniforms = {
      uSize: { value: size },
      uResolution: {
        value: new THREE.Vector2(
          this.sizes.width * this.sizes.pixelRatio,
          this.sizes.height * this.sizes.pixelRatio,
        ),
      },
      uParticlesTexture: new THREE.Uniform(),
      uOpacity: { value: opacity },
    };
  }

  setMaterial() {
    this.setValues({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
    });
  }

  setDebug() {}

  update() {}
}
