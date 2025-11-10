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
      // Setup
      this.environment = new Environment();
      //      this.gancio = new GPGPUElement();
      //     this.wobble = new Wobble();

      this.particleMoprhing = new ParticleMorphing();
    });
  }
  update() {
    if (this.wobble) this.wobble.update();
    if (this.gancio) this.gancio.update();
  }
}
