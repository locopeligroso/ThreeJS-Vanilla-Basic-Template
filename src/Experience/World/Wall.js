import Experience from "../Experience";
import * as THREE from "three";

export default class Wall {
  constructor(options = {}) {
    const {
      pos = [0, 0, 0],
      dimensions = [100, 60],
      color = 0x1d1d1d,
    } = options;

    this.opts = { pos, dimensions, color };

    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.init();
    this.setTransform();

    this.setScene(this.instance);
  }

  init() {
    this.geometry = new THREE.PlaneGeometry(
      this.opts.dimensions[0],
      this.opts.dimensions[1],
    );
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.opts.color),
    });
    this.instance = new THREE.Mesh(this.geometry, this.material);
  }

  setTransform() {
    this.instance.position.set(...this.opts.pos);
  }

  setScene(object) {
    this.scene.add(object);
  }
}
