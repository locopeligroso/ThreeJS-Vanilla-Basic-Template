import * as THREE from "three";
import Experience from "../../Experience";
import ParticleMophingMaterial from "../../../Materials/ParticleMorphingMaterial";
import gsap from "gsap";

export default class ParticleMorphing {
  constructor(model) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.debug = this.experience.debug;

    this.init(model);

    this.setParticlesPositions();
    this.setParticlesSizes();
    this.setGeometry();

    this.setMorphing();

    this.setDebug();

    this.setScene(this.particles.points);
  }

  init(model) {
    this.models = model;

    this.particles = {};
    this.particles.index = 0;
    this.positions = this.models.scene.children.map(
      (child) => child.geometry.attributes.position,
    );

    this.particles.material = new ParticleMophingMaterial();
  }

  setParticlesPositions() {
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
  }
  setParticlesSizes() {
    this.particles.sizes = new Float32Array(this.particles.maxCount);
    for (let i = 0; i < this.particles.maxCount; i++) {
      this.particles.sizes[i] = Math.random();
    }
  }

  setGeometry() {
    this.particles.geometry = new THREE.BufferGeometry();

    this.particles.geometry.setAttribute(
      "position",
      this.particles.positions[this.particles.index],
    );

    this.particles.geometry.setAttribute(
      "aPositionTarget",
      this.particles.positions[1],
    );

    this.particles.geometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(this.particles.sizes, 1),
    );

    this.particles.points = new THREE.Points(
      this.particles.geometry,
      this.particles.material,
    );

    // SOLO SE SE SI TRATTA DI UN PRIMITIVO
    //this.particles.geometry.setIndex(null);
  }

  setMorphing() {
    this.particles.morph = (index) => {
      this.particles.geometry.attributes.position =
        this.particles.positions[this.particles.index];
      this.particles.geometry.attributes.aPositionTarget =
        this.particles.positions[index];

      gsap.fromTo(
        this.particles.material.uniforms.uProgress,
        { value: 0 },
        { value: 1, duration: 3, ease: "linear" },
      );

      this.particles.index = index;
    };

    this.particles.morph0 = () => this.particles.morph(0);
    this.particles.morph1 = () => this.particles.morph(1);
    this.particles.morph2 = () => this.particles.morph(2);
    this.particles.morph3 = () => this.particles.morph(3);
  }

  setScene(object) {
    this.scene.add(object);
  }

  setDebug() {
    const ui = this?.debug?.ui;
    if (!ui) return;

    // cartella condivisa
    const f = (this.debug.particleMorphingFolder ||=
      ui.addFolder?.("Particle Morphing"));

    f.add(this.particles, "morph0").name("Morph 0");
    f.add(this.particles, "morph1").name("Morph 1");
    f.add(this.particles, "morph2").name("Morph 2");
    f.add(this.particles, "morph3").name("Morph 3");
  }
}
