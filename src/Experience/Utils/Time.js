import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.start = performance.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
  }

  tick(now) {
    // `now` è passato da rAF ed è già basato su performance.now()
    if (typeof now !== "number") now = performance.now();

    this.delta = now - this.current;
    // opzionale: clamp per evitare salti enormi quando la tab è sospesa
    if (this.delta > 100) this.delta = 100;

    this.current = now;
    this.elapsed = now - this.start;

    this.trigger("tick", { delta: this.delta, elapsed: this.elapsed });

    requestAnimationFrame(this.tick);
  }
}
