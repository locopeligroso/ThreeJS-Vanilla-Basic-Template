import * as THREE from "three";
import Experience from "../../Experience";
import ParticleMophingMaterial from "../../../Materials/ParticleMorphingMaterial";

export default class ParticleMorphing {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.init();
    this.setParticles();
    this.setGeometry();

    this.setScene(this.particles.points);
  }

  init() {
    this.models = this.resources.items.particleMorphing;

    this.particles = {};
    this.positions = this.models.scene.children.map(
      (child) => child.geometry.attributes.position,
    );

    console.log(this.positions);

    this.particles.material = new ParticleMophingMaterial();
  }

  setParticles() {
    this.particles.maxCount = 0;
    for (const position of this.positions) {
      if (position.count > this.particles.maxCount)
        this.particles.maxCount = position.count;
    }

    this.particles.positions = [];
    for (const position of this.positions) {
      const originalArray = position.array;
      const newArray = new Float32Array(this.particles.maxCount * 3);

      for (let i = 0; i < this.particles.maxCount; i++) {
        const i3 = i * 3;

        if (i3 < originalArray.length) {
          newArray[i3 + 0] = originalArray[i3 + 0];
          newArray[i3 + 1] = originalArray[i3 + 1];
          newArray[i3 + 2] = originalArray[i3 + 2];
        } else {
          const randomIndex = Math.floor(position.count * Math.random()) * 3;
          newArray[i3 + 0] = originalArray[randomIndex + 0];
          newArray[i3 + 1] = originalArray[randomIndex + 1];
          newArray[i3 + 2] = originalArray[randomIndex + 2];
        }
      }

      this.particles.positions.push(
        new THREE.Float32BufferAttribute(newArray, 3),
      );
    }

    console.log(this.particles.positions);
  }

  setGeometry() {
    this.particles.geometry = new THREE.BufferGeometry();
    this.particles.geometry.setAttribute(
      "position",
      this.particles.positions[1],
    );

    this.particles.geometry.setAttribute(
      "aPositionTarget",
      this.particles.positions[3],
    );

    this.particles.points = new THREE.Points(
      this.particles.geometry,
      this.particles.material,
    );

    //this.particles.geometry.setIndex(null);
  }

  setScene(object) {
    this.scene.add(object);
  }
}
