import * as el from "../modules/elements.js";
import Hourglass from "../modules/hourglass.js";

let recordedTime = 0;
let currentHourglasses = [];

el.leftRotateBtn.addEventListener("click", () => currentHourglasses[0].flip());
el.rightRotateBtn.addEventListener("click", () => currentHourglasses[1].flip());

el.continueBtn.addEventListener("click", () => {
  runHourGlasses(currentHourglasses);
});
el.skipBtn.addEventListener("click", () => {
  skipHourGlasses(currentHourglasses);
});
el.setBtn.addEventListener("click", () => {
  if (parseInt(el.leftInput.value) > 0 && parseInt(el.rightInput.value) > 0) {
    currentHourglasses = [
      new Hourglass("left", parseInt(el.leftInput.value)),
      new Hourglass("right", parseInt(el.rightInput.value)),
    ];

    toggleInputs();
    el.leftRotateBtn.disabled = false;
    el.rightRotateBtn.disabled = false;
    currentHourglasses.forEach((hourglass) => hourglass.updateDisplay());

    el.resetBtn.disabled = false;
  }
});
el.resetBtn.addEventListener("click", () => {
  resetHourglasses(currentHourglasses);
  toggleInputs();
  el.leftRotateBtn.disabled = true;
  el.rightRotateBtn.disabled = true;

  el.resetBtn.disabled = true;
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
      el.recordedTime.innerText = recordedTime;

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
      el.recordedTime.innerText = recordedTime;

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
  el.recordedTime.innerText = recordedTime;

  toggleBtns();
}

function resetHourglasses(hourglasses) {
  clearInterval(localStorage.getItem("nonZeroInterval"));
  clearInterval(localStorage.getItem("zeroedInterval"));

  hourglasses.forEach((hourglass) => hourglass.reset());

  el.leftRotateBtn.disabled = false;
  el.rightRotateBtn.disabled = false;

  el.continueBtn.hidden = false;
  el.skipBtn.hidden = true;

  el.recordedTime.innerText = recordedTime = 0;
}

//*utils
function toggleBtns() {
  el.leftRotateBtn.disabled = !el.leftRotateBtn.disabled;
  el.rightRotateBtn.disabled = !el.rightRotateBtn.disabled;

  el.continueBtn.hidden = !el.continueBtn.hidden;
  el.skipBtn.hidden = !el.skipBtn.hidden;
}

function toggleInputs() {
  el.leftInput.hidden = !el.leftInput.hidden;
  el.rightInput.hidden = !el.rightInput.hidden;

  el.leftDisplay.hidden = !el.leftDisplay.hidden;
  el.rightDisplay.hidden = !el.rightDisplay.hidden;

  el.setBtn.hidden = !el.setBtn.hidden;
  el.continueBtn.hidden = !el.continueBtn.hidden;
}
