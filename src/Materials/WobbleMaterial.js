import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import Experience from "../Experience/Experience";
import vsh from "./shaders/wobble/vertex.glsl";
import fsh from "./shaders/wobble/fragment.glsl";

export default class WobbleMaterial {
  constructor({
    colorA = "#00e1ff",
    colorB = "#1f69ff",
    materialParams = {},
  } = {}) {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    // uniforms condivisi
    this.uniforms = {
      uTime: new THREE.Uniform(0),
      uPositionFrequency: new THREE.Uniform(0.5),
      uTimeFrequency: new THREE.Uniform(0.4),
      uStrength: new THREE.Uniform(0.3),
      uWarpPositionFrequency: new THREE.Uniform(0.38),
      uWarpTimeFrequency: new THREE.Uniform(0.12),
      uWarpStrength: new THREE.Uniform(1.7),
      uColorA: new THREE.Uniform(new THREE.Color(colorA)),
      uColorB: new THREE.Uniform(new THREE.Color(colorB)),
    };

    // materiale principale
    this.material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: vsh,
      fragmentShader: fsh,
      uniforms: this.uniforms,
      transmission: 0,
      ior: 1.5,
      thickness: 1.5,
      transparent: true,
      wireframe: false,
      ...materialParams,
    });

    // depth material con stessa deformazione (ombre corrette)
    this.depthMaterial = new CustomShaderMaterial({
      baseMaterial: THREE.MeshDepthMaterial,
      vertexShader: vsh,
      uniforms: this.uniforms,
      depthPacking: THREE.RGBADepthPacking,
    });

    this.setDebug();
  }

  update() {
    // come nello zip: elapsed è in ms → secondi
    this.uniforms.uTime.value = this.time.elapsed * 0.001;
  }

  setDebug() {
    const ui = this?.debug?.ui;
    if (!ui) return;
    const f = ui.addFolder?.("Wobble Material") || ui;

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
    f.add(this.material, "transmission", 0, 1, 0.001);
    f.add(this.material, "ior", 1, 3, 0.001);
    f.add(this.material, "thickness", 0, 10, 0.001);
    f.addColor(this.material, "color");
  }

  dispose() {
    this.material?.dispose?.();
    this.depthMaterial?.dispose?.();
  }
}
