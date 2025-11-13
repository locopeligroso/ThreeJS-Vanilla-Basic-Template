import * as THREE from "three";

import Experience from "../Experience";
import BackdropMaterial from "../../Materials/BackdropMaterial";

export default class Start {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.init();
    this.setMaterials();
    this.assignMaterials();

    this.setScene(this.instance.scene);
    this.setDebug();
  }

  init() {
    this.instance = this.resources.items.start;
    this.models = this.instance.scene.children;

    console.log(this.models);

    this.models.forEach((child, i) => {
      this[`model${i}`] = child;
    });
  }

  setMaterials() {
    this.backdropMat = new BackdropMaterial();

    this.colorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x26e9f5),
      metalness: 0,
      roughness: 0.61,
      clearcoat: 0,
      clearcoatRoughness: 0.7,
    });
    this.metalMat = new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: 0.2,
    });
  }

  assignMaterials() {
    this.instance.scene.traverse((child) => {
      if (!child.isMesh) return;
      else {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.models.forEach((model) => {
      const mesh = model.children.filter((element) => element.isMesh);

      if (mesh[0]) mesh[0].material = this.colorMat;
      if (mesh[1]) mesh[1].material = this.metalMat;
      if (model.name == "Backdrop_1") model.material = this.backdropMat;
    });
  }

  setScene(object) {
    this.scene.add(object);
  }

  setDebug() {
    const ui = this?.debug?.ui;
    if (!ui) return;

    const f = ui.addFolder?.("Backdrop Material");
    f.addColor(this.backdropMat, "color");
    f.add(this.backdropMat, "roughness", 0, 1, 0.01);
    f.add(this.backdropMat, "bumpScale", 0, 1, 0.01);
  }
}
