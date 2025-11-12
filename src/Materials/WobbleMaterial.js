import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import Experience from "../Experience/Experience";
import vertexShader from "./shaders/wobble/vertex.glsl";
import fragmentShader from "./shaders/wobble/fragment.glsl";

export default class WobbleMaterial {
  constructor({ colorA = "#ffffff", colorB = "#bababa" } = {}) {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.setUniforms(colorA, colorB);
    this.setMaterial();
    this.setDebug();
  }

  setUniforms(colorA, colorB) {
    this.uniforms = {
      uTime: new THREE.Uniform(0),
      uPositionFrequency: new THREE.Uniform(0.4),
      uTimeFrequency: new THREE.Uniform(0.4),
      uStrength: new THREE.Uniform(0.3),
      uWarpPositionFrequency: new THREE.Uniform(0.38),
      uWarpTimeFrequency: new THREE.Uniform(0.12),
      uWarpStrength: new THREE.Uniform(1.7),
      uColorA: new THREE.Uniform(new THREE.Color(colorA)),
      uColorB: new THREE.Uniform(new THREE.Color(colorB)),
    };
  }

  setMaterial() {
    this.material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshStandardMaterial,
      metalness: 1,
      roughness: 0.05,
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
    });

    this.depthMaterial = new CustomShaderMaterial({
      baseMaterial: THREE.MeshDepthMaterial,
      vertexShader,
      uniforms: this.uniforms,
      depthPacking: THREE.RGBADepthPacking,
    });
  }

  update() {
    this.uniforms.uTime.value = this.time.elapsed * 0.001;
  }

  setDebug() {
    const ui = this?.debug?.ui;
    if (!ui) return;
    const f = ui.addFolder?.("Wobble Material");

    f.add(this.uniforms.uPositionFrequency, "value", 0, 2, 0.001).name(
      "uPositionFrequency",
    );
    f.add(this.uniforms.uTimeFrequency, "value", 0, 2, 0.001).name(
      "uTimeFrequency",
    );
    f.add(this.uniforms.uStrength, "value", 0, 2, 0.001).name("uStrength");
    f.add(this.uniforms.uWarpPositionFrequency, "value", 0, 2, 0.001).name(
      "uWarpPosFreq",
    );
    f.add(this.uniforms.uWarpTimeFrequency, "value", 0, 2, 0.001).name(
      "uWarpTimeFreq",
    );
    f.add(this.uniforms.uWarpStrength, "value", 0, 3, 0.001).name(
      "uWarpStrength",
    );

    const colors = {
      colorA: `#${this.uniforms.uColorA.value.getHexString()}`,
      colorB: `#${this.uniforms.uColorB.value.getHexString()}`,
    };
    f.addColor(colors, "colorA").onChange((v) =>
      this.uniforms.uColorA.value.set(v),
    );
    f.addColor(colors, "colorB").onChange((v) =>
      this.uniforms.uColorB.value.set(v),
    );

    // controlli fisici
    f.add(this.material, "metalness", 0, 1, 0.001);
    f.add(this.material, "roughness", 0, 1, 0.001);
  }

  dispose() {
    this.material?.dispose?.();
    this.depthMaterial?.dispose?.();
  }
}
