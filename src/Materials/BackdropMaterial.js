import * as THREE from "three";
import Experience from "../Experience/Experience";

export default class BackdropMaterial extends THREE.MeshStandardMaterial {
  constructor(options = {}) {
    super();

    const {
      color = 0x1c1c1c,
      metalness = 1,
      roughness = 1,
      bumpScale = 0.2,
      normalScale = 1,
      wrapRepeat = 6,
    } = options;

    this.experience = new Experience();
    this.resources = this.experience.resources;

    // valori base del materiale
    this.color = new THREE.Color(color);
    this.metalness = metalness;
    this.roughness = roughness;
    this.bumpScale = bumpScale;
    this.normalScale = new THREE.Vector2(normalScale, normalScale);

    this.wrapRepeatValue = wrapRepeat;

    this.textures = [];

    this.setTextures();
  }

  get wrapRepeat() {
    return this.wrapRepeatValue;
  }

  set wrapRepeat(value) {
    this.wrapRepeatValue = value;
    this.updateRepeat();
  }

  setTextures() {
    const items = this.resources.items;

    const rough = items.backdropRough;
    const normal = items.backdropNormal;
    const bump = items.backdropBump;
    const spec = items.backdropSpec;

    this.roughnessMap = rough || null;
    this.normalMap = normal || null;
    this.bumpMap = bump || null;
    this.metalnessMap = spec || null;

    this.textures = [rough, normal, bump, spec].filter(Boolean);

    this.updateRepeat();
  }

  updateRepeat() {
    this.textures.forEach((tex) => {
      tex.wrapS = THREE.MirroredRepeatWrapping;
      tex.wrapT = THREE.MirroredRepeatWrapping;
      tex.offset.set(0, 0);
      tex.repeat.set(this.wrapRepeatValue, this.wrapRepeatValue);
      tex.needsUpdate = true;
    });
  }
}
