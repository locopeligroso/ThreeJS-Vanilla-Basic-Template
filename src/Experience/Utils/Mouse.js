import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

export default class Mouse extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.sizes = this.experience.sizes;

    this.init();
    this.setScroll();
    this.setCursorCoords();
  }

  init() {
    window.addEventListener("scroll", () => this.trigger("scroll"));
    window.addEventListener("mousemove", () => this.trigger("mousemove"));
  }

  setResize() {}

  setScroll() {
    this.scrollY;

    this.on("scroll", () => (this.scrollY = window.scrollY));
  }

  setCursorCoords() {
    this.cursor = {};
    this.cursor.x = 0;
    this.cursor.y = 0;

    this.on("mousemove", () => {
      this.cursor.x = event.clientX / this.sizes.width - 0.5;
      this.cursor.y = event.clientY / this.sizes.height - 0.5;

      //console.log(this.cursor);
    });
  }
}
