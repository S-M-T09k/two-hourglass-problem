import * as el from "./elements.js";

class Hourglass {
  constructor(side, time) {
    this.time = time;
    this.upperTime = 0;
    this.lowerTime = time;

    if (side === "left") {
      this.element = el.leftHg;
      this.display = el.leftDisplay;
    } else if (side === "right") {
      this.element = el.rightHg;
      this.display = el.rightDisplay;
    }

    // this.updateDisplay();
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
