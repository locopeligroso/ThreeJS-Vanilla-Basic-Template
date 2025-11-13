import * as THREE from "three";

import Experience from "../Experience";
import BackdropMaterial from "../../Materials/BackdropMaterial";

export default class Start {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.debug = this.experience.debug;

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
    this.backdropMat = new BackdropMaterial({ metalness: 1, roughness: 0.8 });

    this.colorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#39d4da"),
      metalness: 0.1,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      sheen: 0.2,
      sheenColor: new THREE.Color("#ffffff"),
    });

    this.metalMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#e0e0e0"),
      metalness: 1,
      roughness: 0.25,
      envMapIntensity: 1,
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

    console.log(this.backdropMat);

    f.addColor(this.backdropMat, "color");
    f.add(this.backdropMat, "metalness", 0, 1, 0.01);
    f.add(this.backdropMat, "roughness", 0, 1, 0.01);
    f.add(this.backdropMat, "bumpScale", 0, 5, 0.01);

    f.add(this.backdropMat, "wrapRepeat", 0, 10, 0.001).name("Texture repeat");
  }
}
