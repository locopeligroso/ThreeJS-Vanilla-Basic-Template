import "./style.css";

import Experience from "./Experience/Experience";
import Stats from "stats.js";

/* STATS */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

const experience = new Experience(document.querySelector("canvas.webgl"));
const camera = experience.camera;

const modal = document.getElementById("modal-section-2");
const openBtn = document.getElementById("open-modal-btn");
const closeBtn = modal.querySelector("[data-modal-close]");

function openModal() {
  const scrollY = window.scrollY;
  document.body.style.top = `-${scrollY}px`;
  document.body.classList.add("modal-open");
  modal.classList.add("is-visible");
  camera.setModalOpen(true);
}

function closeModal() {
  document.body.classList.remove("modal-open");
  modal.classList.remove("is-visible");
  camera.setModalOpen(false);

  document.body.style.top = "";
  window.scrollTo(0, scrollY);
}

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal__backdrop")) {
    closeModal();
  }
}); // 👈 ti mancava questa parentesi + punto e virgola
