import { Group, PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import Experience from "./Experience";

export default class Camera {
  constructor({ distance = 20 } = {}) {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.mouse = this.experience.mouse;
    this.time = this.experience.time;

    this.distance = distance;

    this.setInstance();

    // this.setOrbitControls();
  }

  setInstance() {
    this.instance = new PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      1000,
    );
    this.instance.position.set(0, 0, 20);
    this.cntrl = new Group();
    this.cntrl.add(this.instance);
    this.scene.add(this.cntrl);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 0, 0);
  }

  setModalOpen(isOpen) {
    const targetX = isOpen ? 7.5 : 0;
    const targetZ = isOpen ? -10 : 0;

    gsap.to(this.cntrl.position, {
      x: targetX,
      z: targetZ,
      duration: 1.5,
      ease: "expo.out",
    });

    console.log("camera, isOpen = " + isOpen);
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    if (this.mouse.scrollY) {
      const scrollY = (-this.mouse.scrollY / this.sizes.height) * this.distance;
      this.cntrl.position.y = scrollY;
    }

    // parallax
    if (this.mouse.cursor) {
      const parallaxX = -this.mouse.cursor.x;
      const parallaxY = -this.mouse.cursor.y;

      this.instance.position.x +=
        (parallaxX - this.instance.position.x) * 0.1 * this.time.delta;
      this.instance.position.y +=
        (parallaxY - this.instance.position.y) * 0.1 * this.time.delta;
    }
  }
}
