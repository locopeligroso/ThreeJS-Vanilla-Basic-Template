import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import SceneManager from "./SceneManager";

let instance = null;

export default class Experience {
  constructor(canvas) {
    //
    if (instance) return instance;
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.camera = new Camera();
    this.sceneManager = new SceneManager();
    this.renderer = new Renderer();

    this.sceneManager.setRenderer(this.renderer);
    this.scene = this.sceneManager.getCurrentEntry()?.scene ?? null;

    // Sizes Resize Event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.sceneManager.update();
    this.renderer.update();
  }
}
