import * as THREE from "three";

import Experience from "./Experience";

export default class SceneManager {
  constructor() {
    this.experience = new Experience();
    this.cameraManager = this.experience.camera;
    this.time = this.experience.time;

    this.sections = Array.from(document.querySelectorAll(".section"));
    this.scenes = [];
    this.currentIndex = 0;
    this.targetIndex = 0;
    this.isTransitioning = false;
    this.transitionDuration = 1.2; // seconds
    this.transitionElapsed = 0;

    this.createScenes();
    this.setupObserver();
  }

  setRenderer(renderer) {
    this.renderer = renderer;
    if (this.scenes.length > 0) {
      this.renderer.setBaseScene(this.getCurrentEntry());
      this.experience.scene = this.getCurrentEntry().scene;
    }
  }

  createScenes() {
    if (!this.sections.length) return;

    const colors = [
      { background: "#10121f", mesh: "#ffd166", light: "#ffe066" },
      { background: "#0f1c2e", mesh: "#06d6a0", light: "#8dffcd" },
      { background: "#1d0f2e", mesh: "#ff006e", light: "#ff80ab" },
      { background: "#2a0f1f", mesh: "#118ab2", light: "#9ad4f3" },
    ];

    const geometryFactories = [
      () => new THREE.IcosahedronGeometry(5, 1),
      () => new THREE.TorusKnotGeometry(3, 1, 160, 32),
      () => new THREE.ConeGeometry(4.5, 7, 64, 16),
      () => new THREE.TorusGeometry(4, 1.2, 32, 100),
    ];

    this.sections.forEach((section, index) => {
      const colorSet = colors[index % colors.length];
      const geometry = geometryFactories[index % geometryFactories.length]();
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(colorSet.background);

      const camera = this.cameraManager.createCamera({
        position: new THREE.Vector3(0, 0, 15),
        lookAt: new THREE.Vector3(0, 0, 0),
      });

      const material = new THREE.MeshStandardMaterial({
        color: colorSet.mesh,
        roughness: 0.3,
        metalness: 0.4,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const group = new THREE.Group();
      group.add(mesh);

      const ambient = new THREE.AmbientLight(colorSet.light, 0.35);
      const mainLight = new THREE.DirectionalLight(colorSet.light, 1.4);
      mainLight.position.set(6, 6, 10);
      mainLight.castShadow = true;

      scene.add(group);
      scene.add(ambient);
      scene.add(mainLight);

      const speed = 0.4 + index * 0.1;

      this.scenes.push({
        scene,
        camera,
        section,
        update: (delta) => {
          group.rotation.y += delta * speed;
          group.rotation.x += delta * 0.25;
        },
      });
    });
  }

  setupObserver() {
    if (!this.sections.length) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = this.sections.indexOf(entry.target);
            if (index !== -1) {
              this.startTransition(index);
            }
          }
        });
      },
      { threshold: 0.6 },
    );

    this.sections.forEach((section) => this.observer.observe(section));
  }

  startTransition(index) {
    if (index === this.currentIndex) return;
    if (!this.renderer) return;

    const fromEntry = this.getCurrentEntry();
    const toEntry = this.scenes[index];
    if (!toEntry) return;

    this.targetIndex = index;
    this.transitionElapsed = 0;
    this.isTransitioning = true;
    this.renderer.prepareTransition(fromEntry, toEntry);
  }

  getCurrentEntry() {
    return this.scenes[this.currentIndex];
  }

  update() {
    const delta = this.time.delta / 1000;

    for (const entry of this.scenes) {
      entry.update?.(delta);
    }

    if (!this.isTransitioning) return;

    this.transitionElapsed += delta;

    const progress = Math.min(
      this.transitionElapsed / this.transitionDuration,
      1,
    );
    this.renderer?.setTransitionProgress(progress);

    if (progress >= 1) {
      this.isTransitioning = false;
      this.currentIndex = this.targetIndex;
      this.renderer?.finishTransition(this.getCurrentEntry());
      this.experience.scene = this.getCurrentEntry()?.scene ?? null;
    }
  }
}
