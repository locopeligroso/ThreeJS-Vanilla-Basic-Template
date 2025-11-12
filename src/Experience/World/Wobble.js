import Experience from "../Experience";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";
import WobbleMaterial from "../../Materials/WobbleMaterial";

export default class Wobble {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.debugLabel = "Blob";

    this.initMesh(true);
    this.initMaterial();
    this.scene.add(this.model);
    this.initDebug();
  }

  initMesh(visible) {
    //let geometry = new THREE.PlaneGeometry(10, 10, 500, 500);
    let geometry = new THREE.IcosahedronGeometry(7.5, 128);
    //let geometry = new THREE.BoxGeometry(3, 3, 3, 512, 512, 512);

    geometry = mergeVertices(geometry);
    geometry.computeVertexNormals();

    this.model = new THREE.Mesh(geometry);
    this.model.castShadow = true;
    this.model.receiveShadow = true;
    this.model.visible = visible;
    this.model.position.set(0, -20, -10);
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
