import * as THREE from "three";
import Experience from "../Experience/Experience";

export default class BackdropMaterial extends THREE.MeshStandardMaterial {
  constructor({ color, metalness, roughness, bumpScale, wrap } = {}) {
    super();

    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.textures = [];

    this.setValues({ color, metalness, roughness, bumpScale, wrap });
    this.setTexturesMap();
    this.setMaterial();
  }

  setValues({ color, metalness, roughness, bumpScale, wrap } = {}) {
    this.color = new THREE.Color(color ?? 0x1c1c1c);
    this.metalness = metalness ?? 1;
    this.roughness = roughness ?? 1;
    this.bumpScale = bumpScale ?? 0.2;
    this.wrap = wrap ?? THREE.RepeatWrapping;
  }

  setTexturesMap() {
    const items = this.resources.items;
    console.log(items);

    const keys = [
      "backdropMap",
      "backdropRough",
      "backdropNormal",
      "backdropBump",
    ];

    keys.forEach((key) => this.textures.push((this[key] = items[key])));
  }

  setMaterial() {
    this.map = this.backdropMap;
    this.roughnessMap = this.backdropRough;
    this.normalMap = this.backdropNormal;
    this.bumpMap = this.backdropBump;

    this.textures.forEach((tex) => {
      if (!tex) return;
      tex.wrapS = tex.wrapT = this.wrap;
      tex.needsUpdate = true;
    });
  }
}
