import Hourglass from "./hourglass.js";
import * as el from "./elements.js";

let currentHourglasses = [];
let recordedTime = 0;
let targetTime = 7;

const def1 = new Hourglass(el.leftHg, el.leftDisplay, 5);
const def2 = new Hourglass(el.rightHg, el.rightDisplay, 3);
currentHourglasses.push(def1, def2);

el.leftRotateBtn.addEventListener("click", () => currentHourglasses[0].flip());
el.rightRotateBtn.addEventListener("click", () => currentHourglasses[1].flip());

el.continueBtn.addEventListener("click", () => {
  runHourGlasses(currentHourglasses);
});

el.skipBtn.addEventListener("click", () => {
  skipHourGlasses(currentHourglasses);
});

el.resetBtn.addEventListener("click", () => {
  clearInterval(localStorage.getItem("nonZeroInterval"));
  clearInterval(localStorage.getItem("zeroedInterval"));

  currentHourglasses.forEach((hourglass) => hourglass.reset());

  el.leftRotateBtn.disabled = false;
  el.rightRotateBtn.disabled = false;

  el.continueBtn.hidden = false;
  el.skipBtn.hidden = true;

  el.recordedTimeDisplay.innerText = recordedTime = 0;
});

function runHourGlasses(hourglasses) {
  let emptyUpper = hourglasses.some((hourglass) => hourglass.upperTime === 0);
  toggleBtns();

  if (hourglasses.every((hourglass) => hourglass.upperTime === 0)) {
    toggleBtns();
    return console.log("sandless run");
  }

  if (emptyUpper) {
    const zeroedIntervalID = setInterval(() => {
      hourglasses.forEach((hourglass) => hourglass.tick());
      recordedTime++;
      el.recordedTimeDisplay.innerText = recordedTime;

      if (hourglasses.every((hourglass) => hourglass.upperTime === 0)) {
        clearInterval(zeroedIntervalID);
        toggleBtns();
      }
    }, 500);

    localStorage.setItem("zeroedInterval", zeroedIntervalID);
  } else {
    const nonZeroIntervalID = setInterval(() => {
      hourglasses.forEach((hourglass) => hourglass.tick());
      recordedTime++;
      el.recordedTimeDisplay.innerText = recordedTime;

      if (hourglasses.some((hourglass) => hourglass.upperTime === 0)) {
        clearInterval(nonZeroIntervalID);
        toggleBtns();
      }
    }, 500);

    localStorage.setItem("nonZeroInterval", nonZeroIntervalID);
  }
}

function skipHourGlasses(hourglasses) {
  clearInterval(localStorage.getItem("nonZeroInterval"));
  clearInterval(localStorage.getItem("zeroedInterval"));

  let emptyUpper = hourglasses.some((hourglass) => hourglass.upperTime === 0);

  if (emptyUpper) {
    while (hourglasses.some((hourglass) => hourglass.upperTime > 0)) {
      hourglasses.forEach((hourglass) => hourglass.tick());
      recordedTime++;
    }
  } else {
    while (hourglasses.every((hourglass) => hourglass.upperTime > 0)) {
      hourglasses.forEach((hourglass) => hourglass.tick());
      recordedTime++;
    }
  }
  el.recordedTimeDisplay.innerText = recordedTime;

  toggleBtns();
}

//TODO:maybe I'll use this one
function rewriteTest([hg1, hg2]) {
  clearInterval(localStorage.getItem("nonZeroInterval"));
  clearInterval(localStorage.getItem("zeroedInterval"));

  const hgs = [hg1, hg2];

  if (hg1.upperTime > 0 && hg2.upperTime > 0) {
    while (hg1.upperTime > 0 && hg2.upperTime > 0) {
      hgs.forEach((hourglass) => hourglass.tick());
      recordedTime++;
    }
  } else if (hg1.upperTime > 0 || hg2.upperTime > 0) {
    //could be just else{} or none
    while (hg1.upperTime > 0 || hg2.upperTime > 0) {
      hgs.forEach((hourglass) => hourglass.tick());
      recordedTime++;
    }
  }
  el.recordedTimeDisplay.innerText = recordedTime;

  toggleBtns();
}

function toggleBtns() {
  el.leftRotateBtn.disabled = !el.leftRotateBtn.disabled;
  el.rightRotateBtn.disabled = !el.rightRotateBtn.disabled;

  el.continueBtn.hidden = !el.continueBtn.hidden;
  el.skipBtn.hidden = !el.skipBtn.hidden;
}
