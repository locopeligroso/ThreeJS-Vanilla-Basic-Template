import Experience from "../Experience";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";
import WobbleMaterial from "../../Materials/WobbleMaterial";

export default class Wobble {
  constructor({
    visible = true,
    debugLabel = "Blob",
    colorA = "#00e1ff",
    colorB = "#1f69ff",
  } = {}) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.debugLabel = debugLabel;

    this.initMesh(visible);
    this.initMaterial({ colorA, colorB });
    this.scene.add(this.model);
    this.initDebug();
  }

  initMesh(visible) {
    let geometry = new THREE.IcosahedronGeometry(2.5, 50);
    geometry = mergeVertices(geometry);
    geometry.computeVertexNormals();

    this.model = new THREE.Mesh(geometry);
    this.model.castShadow = true;
    this.model.receiveShadow = true;
    this.model.visible = visible;
  }

  initMaterial({ colorA, colorB }) {
    this.wobbleMat = new WobbleMaterial({ colorA, colorB });
    this.model.material = this.wobbleMat.material;
    this.model.customDepthMaterial = this.wobbleMat.depthMaterial;
  }

  update() {
    this.wobbleMat.update();
  }

  initDebug() {
    const ui = this?.debug?.ui;
    if (!ui) return;
    const f = ui.addFolder(this.debugLabel);
    f.add(this.model, "visible").name("Visible");
  }

  setVisible(flag) {
    if (this.model) this.model.visible = !!flag;
  }
  toggleVisible() {
    if (this.model) this.model.visible = !this.model.visible;
  }
}
