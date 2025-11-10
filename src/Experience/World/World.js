import Experience from "../Experience";
import Environment from "./Environment";
import Wobble from "./Wobble";
import GPGPUElement from "./GPGPUElement";
import ParticleMorphing from "./Particle-Morphing/ParticleMorphing";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      this.init();

      this.environment = new Environment();
      // Setup

      //this.wobble = new Wobble();
      // this.particleMoprhing = new ParticleMorphing(this.particleMorphingModel);
      this.gancio = new GPGPUElement(this.gpgpuModel);
    });
  }

  init() {
    /*
     * MODELS
     */

    this.particleMorphingModel = this.resources.items.ganciParticleMorphing;
    this.particleMorphingModel = this.resources.items.particleMorphing;
    this.gpgpuModel = this.resources.items.boatModel;
  }
  update() {
    if (this.wobble) this.wobble.update();
    if (this.gancio) this.gancio.update();
  }
}
