class Hourglass {
  constructor(element, display, time) {
    this.element = element;
    this.time = time;
    this.upperTime = 0;
    this.lowerTime = time;
    this.display = display;

    this.updateDisplay();
  }

  flip() {
    this.upperTime = this.lowerTime;
    this.lowerTime = this.time - this.upperTime;

    this.element.classList.toggle("rotate");
    this.updateDisplay();
  }

  tick() {
    if (this.upperTime > 0) {
      this.upperTime--;
      this.lowerTime++;
    }

    this.updateDisplay();
  }

  updateDisplay() {
    this.element.classList.remove(
      "running",
      "paused",
      "sand-above",
      "sand-below",
    );

    if (this.lowerTime === 0) {
      this.element.classList.add("paused");
      this.element.classList.add("sand-above");
    } else if (this.upperTime === 0) {
      this.element.classList.add("paused");
      this.element.classList.add("sand-below");
    } else {
      this.element.classList.add("running");
    }

    this.display.innerText = this.upperTime + "|" + this.lowerTime;
  }

  reset() {
    this.upperTime = 0;
    this.lowerTime = this.time;
    this.updateDisplay();
  }
}

export default Hourglass;
