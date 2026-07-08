const leftHg = document.querySelector("#left-hourglass");
const rightHg = document.querySelector("#right-hourglass");
const leftRotateBtn = document.querySelector("#rotate-left");
const rightRotateBtn = document.querySelector("#rotate-right");
const continueBtn = document.querySelector("#continue");
const resetBtn = document.querySelector("#reset");
const leftDisplay = document.querySelector("#left-display");
const rightDisplay = document.querySelector("#right-display");
const recordedTimeDisplay = document.querySelector("#recorded-time");

// console.log(document.querySelector("#left-content").className);

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
    if (this.lowerTime === 0) {
      this.element.classList.remove("running");
      this.element.classList.add("paused");

      this.element.classList.add("sand-above");
    } else if (this.upperTime === 0) {
      this.element.classList.remove("running");
      this.element.classList.add("paused");

      this.element.classList.add("sand-below");
    } else {
      this.element.classList.remove("paused");
      this.element.classList.add("running");

      this.element.classList.add("sand-above");
      this.element.classList.add("sand-below");
    }

    this.display.innerText = this.upperTime + "|" + this.lowerTime;
  }

  reset() {
    this.upperTime = 0;
    this.lowerTime = this.time;
    this.updateDisplay();
  }
}

const firstHourGlass = new Hourglass(leftHg, leftDisplay, 5);
const secondHourGlass = new Hourglass(rightHg, rightDisplay, 3);
const hourglasses = [firstHourGlass, secondHourGlass];
let recordedTime = 0;

leftRotateBtn.addEventListener("click", () => firstHourGlass.flip());
rightRotateBtn.addEventListener("click", () => secondHourGlass.flip());

continueBtn.addEventListener("click", runHourGlasses);

resetBtn.addEventListener("click", () => {
  clearInterval(localStorage.getItem("firstInterval"));
  clearInterval(localStorage.getItem("secondInterval"));

  hourglasses.forEach((hourglass) => hourglass.reset());

  recordedTimeDisplay.innerText = recordedTime = 0;
});

function runHourGlasses() {
  clearInterval(localStorage.getItem("firstInterval"));
  clearInterval(localStorage.getItem("secondInterval"));

  let emptyUpper = hourglasses.some((hourglass) => hourglass.upperTime === 0);

  if (hourglasses.every((hourglass) => hourglass.upperTime === 0)) {
    return;
  } else if (emptyUpper) {
    const secondIntervalID = setInterval(() => {
      hourglasses.forEach((hourglass) => hourglass.tick());
      recordedTimeDisplay.innerText = recordedTime++;

      if (hourglasses.every((hourglass) => hourglass.upperTime === 0)) {
        clearInterval(secondIntervalID);
      }
    }, 500);

    localStorage.setItem("secondInterval", secondIntervalID);
  } else {
    const firstIntervalID = setInterval(() => {
      hourglasses.forEach((hourglass) => hourglass.tick());
      recordedTimeDisplay.innerText = recordedTime++;

      if (hourglasses.some((hourglass) => hourglass.upperTime === 0)) {
        clearInterval(firstIntervalID);
      }
    }, 500);

    localStorage.setItem("firstInterval", firstIntervalID);
  }
}
