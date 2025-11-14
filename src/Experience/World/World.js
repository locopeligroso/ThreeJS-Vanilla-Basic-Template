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

    console.log(this.resources.items);

    this.resources.on("ready", () => {
      this.init();

      this.environment = new Environment();

      this.test(6, 60);

      // INTRO
      /* this.start = new Start();
       */

      // WOBBLE
      this.wobble = new Wobble({ size: 5, pos: [0, -40, 0] });

      // GANCIO
      /* this.gancio = new GPGPUElement({
        model: this.gpgpuModel,
        uSize: 0.05,
        pos: [0, -60, 10],
        name: "gancio",
      });
      this.gancioBG = new GPGPUElement({
        model: this.gpgpuBackgroundModel,
        uSize: 0.025,
        pos: [0, -60, 10],
        name: "sfondo",
      });

      this.wall = new Wall(); */

      // GANCIO
      /* this.gancio2 = new GPGPUElement({
        model: this.gpgpuCatena,
        uSize: 0.0125,
        name: "catena",
        pos: [0, -30, 0],
      }); */
    });
  }

  init() {
    /* this.gpgpuModel = this.resources.items.gancioGpgpu;
    this.gpgpuBackgroundModel = this.resources.items.background;
    this.gpgpuCatena = this.resources.items.catena; */
  }
  update() {
    if (this.wobble) this.wobble.update();
    if (this.gancio) this.gancio.update();
    if (this.gancio2) this.gancio2.update();
    if (this.gancioBG) this.gancioBG.update();
    if (this.particleMoprhing) this.particleMoprhing.update();
  }

  test(length, distance) {
    const colors = ["blue", "red", "green", "yellow", "grey", "red"];

    this.walls = [];

    for (let i = 0; i < length; i++) {
      const wall = new Wall({
        color: colors[i % colors.length],
        pos: [0, i * -distance, 0],
        dimensions: [30, 10],
      });

      this.walls.push(wall);
    }
  }
}
