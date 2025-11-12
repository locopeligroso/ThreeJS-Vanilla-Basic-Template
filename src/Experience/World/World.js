import Experience from "../Experience";
import Environment from "./Environment";
import Wobble from "./Wobble";
import GPGPUElement from "./GPGPUElement";
import ParticleMorphing from "./Particle-Morphing/ParticleMorphing";
import Start from "./Start";
import Wall from "./Wall";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      this.init();

      this.environment = new Environment();
      // Setup
      this.start = new Start();

      this.wobble = new Wobble();
      //this.particleMoprhing = new ParticleMorphing(this.particleMorphingModel);
      this.gancio = new GPGPUElement({
        model: this.gpgpuModel,
        uSize: 0.05,
        name: "gancio",
      });
      this.gancioBG = new GPGPUElement({
        model: this.gpgpuBackgroundModel,
        uSize: 0.025,
        name: "sfondo",
      });
      this.wall = new Wall();
    });
  }

  init() {
    /*
     * MODELS
     */

    this.particleMorphingModel = this.resources.items.particleMorphing;
    this.gpgpuModel = this.resources.items.gancioGpgpu;
    this.gpgpuBackgroundModel = this.resources.items.background;
  }
  update() {
    if (this.wobble) this.wobble.update();
    if (this.gancio) this.gancio.update();
    if (this.gancioBG) this.gancioBG.update();
    if (this.particleMoprhing) this.particleMoprhing.update();
  }
}
