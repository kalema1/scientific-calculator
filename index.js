const displayElement = document.querySelector(".display");
const numbersElement = document.querySelectorAll(".numbers");
const operatorsElement = document.querySelectorAll(".operators");
const equalElement = document.querySelector(".equal");
const leftBracketElement = document.querySelector(".left-bracket");
const rightBracketElement = document.querySelector(".right-bracket");
const answerElement = document.querySelector(".answer");
const squareNumberElement = document.querySelector(".square-number");
const powerElement = document.querySelector(".power");
const magnitudeElement = document.querySelector(".magnitude");
const squarerootElement = document.querySelector(".square-root");
const nthrootElement = document.querySelector(".nth-root");
const piElement = document.querySelector(".pi");
const trigonometryElement = document.querySelectorAll(".trigonometry");
const clearElement = document.querySelector(".clear-all");
const deleteElement = document.querySelector(".delete");
const radianElement = document.querySelector(".toggle-checkox");

let display = "";
let results = "";
let hasDot = false;
let hasOperator = false;
let answer;
let isRadian = false;
let radian = Math.PI / 180;
const OPERATORS = ["+", "-", "x", String.fromCharCode(247)];

numbersElement.forEach((number) => {
  number.addEventListener("click", (e) => {
    /* check dot exists and not to add another */
    if (e.target.innerText === "." && !hasDot) {
      hasDot = true;
    } else if (e.target.innerText === "." && hasDot) {
      return;
    }
    hasOperator = false;

    /* check if its a first zero */
    if (display === "0") {
      display = "0";
    }

    /* display numbers on screen */
    display += e.target.innerText;
    displayElement.value = display;
  });
});

operatorsElement.forEach((operator) => {
  operator.addEventListener("click", (e) => {
    if (!display) return;
    if (e.target.innerText && !hasOperator) {
      hasOperator = true;
    } else if (e.target.innerText && hasOperator) {
      return;
    }
    hasDot = false;
    display += e.target.innerText;
    displayElement.value = display;
  });
});

equalElement.addEventListener("click", () => {
  try {
    if (!display) return;

    let powerSearchResults = searchOperator(display, "²");
    let powerExponentialSearchResults = searchOperator(display, "^(");

    /* get power bases */
    const bases = powerBaseGetter(display, powerSearchResults, "²");
    const exponetialBases = powerBaseGetter(
      display,
      powerExponentialSearchResults,
      "^("
    );
    bases.forEach((base) => {
      let toReplace = base + "²";
      let replacement = "Math.pow(" + base + ",2)";
      display = display.replace(toReplace, replacement);
    });

    exponetialBases.forEach((base) => {
      let toReplace = base + "^(";
      let replacement = "Math.pow(" + base + ",";
      display = display.replace(toReplace, replacement);
    });

    if (display.includes("x")) {
      display = display.replaceAll("x", "*");
    }
    if (display.includes(String.fromCharCode(247))) {
      display = display.replaceAll(String.fromCharCode(247), "/");
    }
    if (display.includes("ans")) {
      display = display.replaceAll("ans", answer);
    }

    if (display.includes(String.fromCharCode(8730) + "(")) {
      display = display.replaceAll(
        String.fromCharCode(8730) + "(",
        "Math.sqrt("
      );
    }

    if (display.includes("sin(")) {
      display = display.replaceAll("sin(", "getTrigonometry(Math.sin,");
    }

    if (display.includes("cos(")) {
      display = display.replaceAll("sin(", "getTrigonometry(Math.cos,");
    }
    if (display.includes("tan(")) {
      display = display.replaceAll("sin(", "getTrigonometry(Math.tan,");
    }

    results = eval(display);
    displayElement.value = results;
    answer = results;
    display = "";
  } catch (err) {
    results = "SYNTAX ERROR";
    displayElement.value = results;
    console.log(err);
  }
});

leftBracketElement.addEventListener("click", (e) => {
  if (display.slice(-1) === ")") {
    display += "x(";
  } else {
    display += e.target.innerText;
  }

  displayElement.value = display;
});
rightBracketElement.addEventListener("click", (e) => {
  display += e.target.innerText;
  displayElement.value = display;
});

answerElement.addEventListener("click", (e) => {
  display += e.target.innerText;
  displayElement.value = display;
});

squareNumberElement.addEventListener("click", () => {
  if (!display) return;
  display += "²";
  displayElement.value = display;
});

powerElement.addEventListener("click", () => {
  if (!display) return;
  display += "^(";
  displayElement.value = display;
});

magnitudeElement.addEventListener("click", () => {
  display += "|";
  displayElement.value = display;
});

squarerootElement.addEventListener("click", () => {
  display += String.fromCharCode(8730) + "(";
  displayElement.value = display;
});

piElement.addEventListener("click", () => {
  display += String.fromCharCode(960);
  displayElement.value = display;
});

trigonometryElement.forEach((trig) => {
  trig.addEventListener("click", (e) => {
    display += e.target.innerText + "(";
    displayElement.value = display;
  });
});

clearElement.addEventListener("click", () => {
  display = "";
  displayElement.value = "";
});

deleteElement.addEventListener("click", () => {
  display = display.slice(0, -1);
  displayElement.value = display;
});

/**
 *returns an array of indexes of keyword that occurred in a string
 *
 * @param {string} str
 * @param {string} keyword
 * @returns {array}
 */
function searchOperator(str, keyword) {
  let arr = str.split("");
  let searchResults = [];
  arr.forEach((element, index) => {
    if (element === keyword) {
      searchResults.push(index);
    }
  });

  return searchResults;
}

/*
 * returns the power bases array for the power operations
 * @param {string} display
 * @param {array} powerSearchResults
 * @returns {array}
 */
function powerBaseGetter(display, powerSearchResults, keyword) {
  let powerBases = []; // save all the power bases
  powerSearchResults.forEach((powerIndex) => {
    let base = []; //store current base
    let parenthesisCount = 0;
    let previousIndex = powerIndex - 1;

    while (previousIndex >= 0) {
      if (display[previousIndex] === "(") parenthesisCount--;
      if (display[previousIndex] === ")") parenthesisCount++;
      let isOperator = false;
      OPERATORS.forEach((OPERATOR) => {
        if (display[previousIndex] === OPERATOR) isOperator = true;
      });
      let isPower = display[previousIndex] === keyword;
      if ((isOperator && parenthesisCount === 0) || isPower) break;

      base.unshift(display[previousIndex]);
      previousIndex--;
    }
    powerBases.push(base.join(""));
  });

  return powerBases;
}

/* radian implementation */
radianElement.addEventListener("click", () => {
  isRadian = !isRadian;
  //console.log(isRadian);
});

/*
 * returns the callack method of the trigonometry
 * @param {function} callack
 * @param {number} angle
 * @returns {function}
 */
function getTrigonometry(callack, angle) {
  if (!isRadian) {
    angle = angle * radian;
  }

  return callack(angle);
}
