import { PerspectiveCamera, Vector3 } from "three";
import Experience from "./Experience";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.canvas = this.experience.canvas;

    this.cameras = [];
  }

  /**
   * Creates a new perspective camera configured for one of the scenes.
   * @param {Object} options
   * @param {Vector3} [options.position]
   * @param {Vector3} [options.lookAt]
   * @returns {PerspectiveCamera}
   */
  createCamera({ position, lookAt } = {}) {
    const camera = new PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      1000,
    );

    const defaultPosition = new Vector3(0, 0, 25);
    camera.position.copy(position ?? defaultPosition);

    if (lookAt) {
      camera.lookAt(lookAt);
    }

    this.cameras.push(camera);

    return camera;
  }

  resize() {
    for (const camera of this.cameras) {
      camera.aspect = this.sizes.width / this.sizes.height;
      camera.updateProjectionMatrix();
    }
  }

  update() {}
}
