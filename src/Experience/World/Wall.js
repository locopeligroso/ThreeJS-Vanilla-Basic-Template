import Experience from "../Experience";
import * as THREE from "three";

export default class Wall {
  constructor() {
    this.experience = new Experience();

    this.geometry = new THREE.PlaneGeometry(50, 20);
    this.material = new THREE.MeshStandardMaterial({ color: "black" });

    this.instance = new THREE.Mesh(this.geometry, this.material);
    this.instance.position.set(0, -40, -10);

    this.experience.scene.add(this.instance);
  }
}
