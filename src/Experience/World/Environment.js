import * as THREE from "three";

import Experience from "../Experience";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.debug = this.experience.debug;

    this.setSunLight();
    this.setHdriMap();

    this.setDebug();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 0);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);

    this.scene.add(this.sunLight);
  }

  setHdriMap() {
    this.hdriMap = {};
    this.hdriMap.intensity = 0.55;

    this.hdriMap.textures = {};

    const tex = this.hdriMap.textures;
    const maps = this.resources.items;

    tex.bluePhotoStudio = maps.hdriBluePhotoStudio;
    tex.goldenGateHills = maps.hdriGoldenGateHills;
    tex.overcastSoilPuresky = maps.hdriOvercastSoilPuresky;
    tex.provenceStudio = maps.hdriProvenceStudio;
    tex.qwantaniDuskPuresky = maps.hdriQwantaniDuskPuresky;
    tex.studioSmall02 = maps.hdriStudioSmall02;

    this.hdriMap.current = "bluePhotoStudio";

    this.hdriMap.apply = (name) => {
      const texture = this.hdriMap.textures[name];
      if (!texture) return;

      texture.mapping = THREE.EquirectangularReflectionMapping;

      this.scene.environment = texture;
      // this.scene.background = texture

      // Aggiorna tutti i materiali
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          (child.material instanceof THREE.MeshStandardMaterial ||
            child.material instanceof THREE.MeshPhysicalMaterial ||
            child.material instanceof CustomShaderMaterial ||
            child.material instanceof THREE.ShaderMaterial)
        ) {
          child.material.envMap = texture;
          child.material.envMapIntensity = this.hdriMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };

    this.hdriMap.apply(this.hdriMap.current);
  }

  setDebug() {
    const ui = this?.debug?.ui;
    if (!ui) return;

    ui.add(this.sunLight, "intensity", 0, 5, 0.01).name("Sun intensity");

    ui.add(this.hdriMap, "intensity", 0, 5, 0.01)
      .name("HDRI intensity")
      .onChange(() => {
        this.hdriMap.apply(this.hdriMap.current);
      });

    ui.add(this.hdriMap, "current", Object.keys(this.hdriMap.textures))
      .name("HDRI map")
      .onChange((value) => {
        this.hdriMap.apply(value);
      });
  }
}
