import Experience from "../Experience";

export default class ModalsHandler {
  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.mouse = this.experience.mouse;

    this.modal = document.getElementById("modal-section-2");
    this.openBtn = document.querySelector("#open-modal-btn");
    this.closeBtn = this.modal.querySelector("[data-modal-close]");

    this.scrollY = 0;

    this.handleModals();
  }

  handleModals() {
    const openModal = () => {
      this.scrollY = this.mouse.scrollY;

      document.body.style.top = `-${this.scrollY}px`;
      document.body.classList.add("modal-open");
      this.modal.classList.add("is-visible");
      this.camera.setModalOpen(true);
    };

    const closeModal = () => {
      document.body.classList.remove("modal-open");
      this.modal.classList.remove("is-visible");
      this.camera.setModalOpen(false);

      document.body.style.top = "";

      // torno dove ero prima
      window.scrollTo(0, this.scrollY);
    };

    this.openBtn.addEventListener("click", openModal);
    this.closeBtn.addEventListener("click", closeModal);

    this.modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal__backdrop")) {
        closeModal();
      }
    });
  }
}
