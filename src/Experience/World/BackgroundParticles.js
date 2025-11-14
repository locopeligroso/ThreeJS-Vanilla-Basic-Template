import * as THREE from "three";
import Experience from "../Experience";

export default class BackgroundParticles {
  constructor(options = {}) {
    const { particleCount = 200, dimentions = [20, 100, 20], color } = options;

    this.opts = {
      particleCount,
      dimentions,
      color,
    };
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.init();

    this.setScene(this.particles);
  }

  init() {
    this.particles = {};
    this.particles.count = this.opts.particleCount;
    this.particles.positions = new Float32Array(this.particles.count * 3);

    for (let i = 0; i < this.particles.count; i++) {
      const positions = this.particles.positions;

      positions[i * 3 + 0] = (Math.random() - 0.5) * this.opts.dimentions[0];
      positions[i * 3 + 1] = (Math.random() - 0.5) * this.opts.dimentions[1];
      positions[i * 3 + 2] = (Math.random() - 0.5) * this.opts.dimentions[2];
    }

    this.particles.geometry = new THREE.BufferGeometry();
    this.particles.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.particles.positions, 3),
    );

    this.particles.material = new THREE.PointsMaterial();
    this.particles.material.color = new THREE.Color(this.opts.color);
    this.particles.material.sizeAttenuation = true;
    this.particles.material.size = 0.2;

    this.particles = new THREE.Points(
      this.particles.geometry,
      this.particles.material,
    );
  }

  setScene(object) {
    this.scene.add(object);
  }
}
