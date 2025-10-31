import * as THREE from "three";

import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setSunLight();
    this.setHdriMap();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 0.5);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);

    this.scene.add(this.sunLight);
  }

  setHdriMap() {
    this.hdriMap = {};
    this.hdriMap.intensity = 0.5;
    this.hdriMap.texture = this.resources.items.hdriMap;
    this.hdriMap.texture.mapping = THREE.EquirectangularReflectionMapping;

    this.scene.environment = this.hdriMap.texture;
    // this.scene.background = this.hdriMap.texture;

    this.hdriMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          (child.material instanceof THREE.MeshStandardMaterial ||
            child.material instanceof THREE.MeshPhysicalMaterial)
        ) {
          child.material.envMap = this.hdriMap.texture;
          child.material.envMapIntensity = this.hdriMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.hdriMap.updateMaterials();
  }
}
