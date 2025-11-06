import Experience from "../Experience";
import Environment from "./Environment";
import Wobble from "./Wobble";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      // Setup
      this.environment = new Environment();

      this.wobble = new Wobble();
    });
  }
  update() {
    if (this.wobble) this.wobble.update();
  }
}
