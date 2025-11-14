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
    window.addEventListener("scroll", (e) => this.trigger("scroll", [e]));
    window.addEventListener("mousemove", (e) => this.trigger("mousemove", [e]));
  }

  setResize() {}

  setScroll() {
    this.on("scroll", () => {
      this.scrollY = window.scrollY;

      this.currentSection = 0;
      this.newSection = Math.round(this.scrollY / this.sizes.height);

      if (this.newSection != this.currentSection) {
        this.currentSection = this.newSection;
        console.log("changed", this.currentSection);
      }
    });
  }

  setCursorCoords() {
    this.cursor = {};
    this.cursor.x = 0;
    this.cursor.y = 0;

    this.on("mousemove", (e) => {
      this.cursor.x = e.clientX / this.sizes.width - 0.5;
      this.cursor.y = e.clientY / this.sizes.height - 0.5;
    });
  }
}
