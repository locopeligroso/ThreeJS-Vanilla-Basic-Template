import Experience from "../Experience";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";
import WobbleMaterial from "../../Materials/WobbleMaterial";

export default class Wobble {
  constructor(options = {}) {
    const { size, pos = [0, 0, 0], rotationSpeed = Math.PI * 0.1 } = options;

    this.opts = {
      size,
      pos,
      rotationSpeed,
    };

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.init();
    this.initMaterial();
    this.scene.add(this.model);
    this.setDebug?.();
  }

  init() {
    // let geometry = new THREE.PlaneGeometry(10, 10, 500, 500)
    // let geometry = new THREE.BoxGeometry(3, 3, 3, 512, 512, 512)

    let geometry = new THREE.IcosahedronGeometry(this.opts.size, 128);
    geometry = mergeVertices(geometry);
    geometry.computeVertexNormals();

    this.model = new THREE.Mesh(geometry);
    this.model.castShadow = true;
    this.model.receiveShadow = true;

    this.model.position.set(...this.opts.pos);
    this.model.rotation.set(0, 0, 0);
  }

  initMaterial() {
    this.wobbleMat = new WobbleMaterial();
    this.model.material = this.wobbleMat.material;
    this.model.customDepthMaterial = this.wobbleMat.depthMaterial;
  }

  update() {
    this.wobbleMat.update();
  }

  setDebug() {
    const ui = this?.debug?.ui;
    if (!ui) return;

    const uniforms = this.model?.material?.uniforms;
    if (!uniforms) return;

    const f = ui.addFolder?.("Wobble");

    f.add(uniforms.uPositionFrequency, "value", 0, 2, 0.001).name(
      "uPositionFrequency",
    );
    f.add(uniforms.uTimeFrequency, "value", 0, 2, 0.001).name("uTimeFrequency");
    f.add(uniforms.uStrength, "value", 0, 2, 0.001).name("uStrength");
    f.add(uniforms.uWarpPositionFrequency, "value", 0, 2, 0.001).name(
      "uWarpPosFreq",
    );
    f.add(uniforms.uWarpTimeFrequency, "value", 0, 2, 0.001).name(
      "uWarpTimeFreq",
    );
    f.add(uniforms.uWarpStrength, "value", 0, 3, 0.001).name("uWarpStrength");

    const colors = {
      colorA: `#${uniforms.uColorA.value.getHexString()}`,
      colorB: `#${uniforms.uColorB.value.getHexString()}`,
    };

    f.addColor(colors, "colorA")
      .name("Color A")
      .onChange((v) => uniforms.uColorA.value.set(v));

    f.addColor(colors, "colorB")
      .name("Color B")
      .onChange((v) => uniforms.uColorB.value.set(v));

    f.add(this.model.material, "metalness", 0, 1, 0.001).name("metalness");
  }
}
