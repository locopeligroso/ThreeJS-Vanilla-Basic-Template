import * as THREE from "three";

import Experience from "../Experience";

export default class Start {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.init();
    this.setMaterials();
    this.assignMaterials();

    this.setScene(this.instance.scene);
  }

  init() {
    this.instance = this.resources.items.start;
    this.models = this.instance.scene.children;

    this.models.forEach((child, i) => {
      this[`model${i}`] = child;
    });
  }

  setMaterials() {
    this.colorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x26e9f5),
      metalness: 1,
      roughness: 0.5,
      clearcoat: 0,
      clearcoatRoughness: 0.7,
    });
    this.metalMat = new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: 0.2,
    });

    this.backdropMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1c1c1c),
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
      if (model.name == "Backdrop") model.material = this.backdropMat;
    });
  }

  setScene(object) {
    this.scene.add(object);
  }
}
