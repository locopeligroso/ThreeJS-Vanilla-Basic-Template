import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("/draco/");
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.loaders.hdriLoader = new RGBELoader();
  }

  startLoading() {
    // Load Sources
    for (const source of this.sources) {
      switch (source.type) {
        case "gltfModel":
          this.loaders.gltfLoader.load(
            source.path,
            (file) => this.sourceLoaded(source, file),
            undefined,
            (error) =>
              console.error(`Error loading GLTF model: ${source.path}`, error),
          );
          break;
        case "texture":
          this.loaders.textureLoader.load(
            source.path,
            (file) => {
              file.flipY = false;
              file.colorSpace = THREE.SRGBColorSpace;
              this.sourceLoaded(source, file);
            },
            undefined,
            (error) =>
              console.error(`Error loading texture: ${source.path}`, error),
          );
          break;
        case "cubeTexture":
          this.loaders.cubeTextureLoader.load(
            source.path,
            (file) => this.sourceLoaded(source, file),
            undefined,
            (error) =>
              console.error(
                `Error loading cube texture: ${source.path}`,
                error,
              ),
          );
          break;
        case "hdri":
          this.loaders.hdriLoader.load(
            source.path,
            (file) => this.sourceLoaded(source, file),
            undefined,
            (error) =>
              console.error(`Error loading HDRI: ${source.path}`, error),
          );
          break;
        default:
          console.warn(`Unknown resource type: ${source.type}`);
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;

    /* console.log(
      `Loaded ${source.type}: ${source.name} (${this.loaded}/${this.toLoad})`,
    ); */

    if (this.loaded === this.toLoad) {
      console.log("All resources loaded.");
      this.trigger("ready");
    }
  }
}
