import * as THREE from "three";
import { RenderTransitionPass } from "three/examples/jsm/postprocessing/RenderTransitionPass.js";

import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.transitionActive = false;
    this.transitionPass = null;
    this.transitionTexture = null;
    this.baseSceneEntry = null;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.toneMapping = THREE.LinearToneMapping;
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.instance.setClearColor("#0b0d16");
  }

  setBaseScene(entry) {
    this.baseSceneEntry = entry;
  }

  prepareTransition(fromEntry, toEntry) {
    if (!this.transitionPass) {
      this.transitionPass = new RenderTransitionPass(
        toEntry.scene,
        toEntry.camera,
        fromEntry.scene,
        fromEntry.camera,
      );
      this.transitionPass.renderToScreen = true;
      this.transitionPass.useTexture(true);
      this.transitionPass.setTextureThreshold(0.35);
      this.transitionPass.setTexture(this.getTransitionTexture());
      this.transitionPass.setSize(this.sizes.width, this.sizes.height);
    } else {
      this.transitionPass.sceneA = toEntry.scene;
      this.transitionPass.cameraA = toEntry.camera;
      this.transitionPass.sceneB = fromEntry.scene;
      this.transitionPass.cameraB = fromEntry.camera;
    }

    this.transitionPass.setTransition(0);
    this.transitionActive = true;
  }

  setTransitionProgress(value) {
    if (!this.transitionPass) return;

    this.transitionPass.setTransition(THREE.MathUtils.clamp(value, 0, 1));
  }

  finishTransition(entry) {
    this.transitionActive = false;
    this.setBaseScene(entry);
    if (this.transitionPass) {
      this.transitionPass.setTransition(0);
    }
  }

  getTransitionTexture() {
    if (this.transitionTexture) return this.transitionTexture;

    const size = 64;
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size; i++) {
      const stride = i * 4;
      const value = Math.random() * 255;
      data[stride + 0] = value;
      data[stride + 1] = value;
      data[stride + 2] = value;
      data[stride + 3] = 255;
    }

    this.transitionTexture = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RGBAFormat,
    );
    this.transitionTexture.needsUpdate = true;
    this.transitionTexture.wrapS = THREE.RepeatWrapping;
    this.transitionTexture.wrapT = THREE.RepeatWrapping;
    this.transitionTexture.minFilter = THREE.LinearFilter;
    this.transitionTexture.magFilter = THREE.LinearFilter;

    return this.transitionTexture;
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));

    if (this.transitionPass) {
      this.transitionPass.setSize(this.sizes.width, this.sizes.height);
    }
  }

  update() {
    if (this.transitionActive && this.transitionPass) {
      this.transitionPass.render(this.instance, null);
      return;
    }

    if (!this.baseSceneEntry) return;

    this.instance.setRenderTarget(null);
    this.instance.render(this.baseSceneEntry.scene, this.baseSceneEntry.camera);
  }
}
