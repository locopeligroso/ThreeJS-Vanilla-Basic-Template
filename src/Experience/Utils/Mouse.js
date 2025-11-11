import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

export default class Mouse extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    this.width = this.experience.sizes.width;
    this.height = this.experience.sizes.height;

    this.setScroll();

    console.log(this.width, this.height);
  }

  setResize() {}

  setScroll() {
    this.scrollY;

    window.addEventListener("scroll", () => {
      this.scrollY = window.scrollY;
      console.log(this.scrollY);
    });
  }
}
