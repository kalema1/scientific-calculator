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
const fractionElement = document.getElementById("fraction");

let displayExpresionValue = "";
let results = "";
let hasDot = false;
let hasOperator = false;
let answer;
let isRadian = false;
let radian = Math.PI / 180;
const OPERATORS = ["+", "-", "x", String.fromCharCode(247)];

numbersElement.forEach((number) => {
  number.addEventListener("click", appendNumber);
});

operatorsElement.forEach((operator) => {
  operator.addEventListener("click", (event) => {
    if (!displayExpresionValue) {
      return;
    }
    if (event.target.innerText && !hasOperator) {
      hasOperator = true;
    } else if (event.target.innerText && hasOperator) {
      return;
    }
    hasDot = false;
    displayExpresionValue += event.target.innerText;
    displayElement.value = displayExpresionValue;
  });
});

equalElement.addEventListener("click", () => {
  try {
    if (!displayExpresionValue) return;

    let powerSearchResults = searchOperator(displayExpresionValue, "²");
    let powerExponentialSearchResults = searchOperator(
      displayExpresionValue,
      "^("
    );

    const bases = getExponentBase(
      displayExpresionValue,
      powerSearchResults,
      "²"
    );
    const exponetialBases = getExponentBase(
      displayExpresionValue,
      powerExponentialSearchResults,
      "^("
    );
    bases.forEach((base) => {
      let toReplace = base + "²";
      let replacement = "Math.pow(" + base + ",2)";
      displayExpresionValue = displayExpresionValue.replace(
        toReplace,
        replacement
      );
    });

    exponetialBases.forEach((base) => {
      let toReplace = base + "^(";
      let replacement = "Math.pow(" + base + ",";
      displayExpresionValue = displayExpresionValue.replace(
        toReplace,
        replacement
      );
    });

    if (displayExpresionValue.includes("x")) {
      displayExpresionValue = displayExpresionValue.replaceAll("x", "*");
    }
    if (displayExpresionValue.includes(String.fromCharCode(247))) {
      displayExpresionValue = displayExpresionValue.replaceAll(
        String.fromCharCode(247),
        "/"
      );
    }
    if (displayExpresionValue.includes("ans")) {
      displayExpresionValue = displayExpresionValue.replaceAll("ans", answer);
    }

    if (displayExpresionValue.includes(String.fromCharCode(8730) + "(")) {
      displayExpresionValue = displayExpresionValue.replaceAll(
        String.fromCharCode(8730) + "(",
        "Math.sqrt("
      );
    }

    if (displayExpresionValue.includes("sin(")) {
      displayExpresionValue = displayExpresionValue.replaceAll(
        "sin(",
        "getTrigonometry(Math.sin,"
      );
    }

    if (displayExpresionValue.includes("cos(")) {
      displayExpresionValue = displayExpresionValue.replaceAll(
        "cos(",
        "getTrigonometry(Math.cos,"
      );
    }
    if (displayExpresionValue.includes("tan(")) {
      displayExpresionValue = displayExpresionValue.replaceAll(
        "tan(",
        "getTrigonometry(Math.tan,"
      );
    }

    let piSearch = searchOperator(
      displayExpresionValue,
      String.fromCharCode(960)
    );

    piSearch.forEach((element) => {
      if (!displayExpresionValue[element - 1]) {
        displayExpresionValue = displayExpresionValue.replace(
          displayExpresionValue[element],
          "Math.PI"
        );
      } else {
        displayExpresionValue = displayExpresionValue.replace(
          displayExpresionValue[element],
          "* Math.PI"
        );
      }
    });

    let nthRootSearchResults = searchOperator(
      displayExpresionValue,
      nthRootformula
    );

    nthRootSearchResults.forEach((element) => {
      const beforeRoot = displayExpresionValue[element - 1];
      const afterRoot = displayExpresionValue[element - 1];
      let toReplace = beforeRoot + displayExpresionValue[element] + afterRoot;
      let replacement = "Math.pow(" + afterRoot + 1 / beforeRoot + ")";
      displayExpresionValue = displayExpresionValue.replace(
        toReplace,
        replacement
      );
    });

    results = eval(displayExpresionValue);
    displayElement.value = results;
    answer = results;
    displayExpresionValue = "";
  } catch (err) {
    results = "SYNTAX ERROR";
    displayElement.value = results;
    console.log(err);
  }
});

leftBracketElement.addEventListener("click", (event) => {
  const lastCharacterInDisplay = displayExpresionValue.slice(-1);
  if (lastCharacterInDisplay === ")") {
    displayExpresionValue += "x(";
  } else {
    displayExpresionValue += event.target.innerText;
  }

  displayElement.value = displayExpresionValue;
});
rightBracketElement.addEventListener("click", (event) => {
  displayExpresionValue += event.target.innerText;
  displayElement.value = displayExpresionValue;
});

answerElement.addEventListener("click", (event) => {
  displayExpresionValue += event.target.innerText;
  displayElement.value = displayExpresionValue;
});

squareNumberElement.addEventListener("click", () => {
  if (!displayExpresionValue) return;
  displayExpresionValue += "²";
  displayElement.value = displayExpresionValue;
});

powerElement.addEventListener("click", () => {
  if (!displayExpresionValue) return;
  displayExpresionValue += "^(";
  displayElement.value = displayExpresionValue;
});

magnitudeElement.addEventListener("click", () => {
  displayExpresionValue += "|";
  displayElement.value = displayExpresionValue;
});

squarerootElement.addEventListener("click", () => {
  displayExpresionValue += String.fromCharCode(8730) + "(";
  displayElement.value = displayExpresionValue;
});

piElement.addEventListener("click", () => {
  displayExpresionValue += String.fromCharCode(960);
  displayElement.value = displayExpresionValue;
});

trigonometryElement.forEach((trig) => {
  trig.addEventListener("click", appendFormulaOnDisplay);
});

clearElement.addEventListener("click", clearAllOnDisplay);

deleteElement.addEventListener("click", deleteLastEntryValue);

fractionElement.addEventListener("click", appendOperator);

nthrootElement.addEventListener("click", appendOperator);

/*
 * appends a value on the screen
 * @param {object} event
 * @return {string}
 */
function appendNumber(event) {
  /* check dot exists and not to add another */
  if (event.target.innerText === "." && !hasDot) {
    hasDot = true;
  } else if (event.target.innerText === "." && hasDot) {
    return;
  }
  hasOperator = false;

  /* check if its a first zero */
  if (displayExpresionValue === "0") {
    displayExpresionValue = "0";
  }

  /* displayExpresionValue numbers on screen */
  displayExpresionValue += event.target.innerText;
  displayElement.value = displayExpresionValue;
}

const nthRootformula =
  String.fromCharCode(8718) + String.fromCharCode(8730) + "(";

/*
 * appends a value on the screen
 * @param {object} event
 * @return {string}
 */
function appendOperator(event) {
  if (event.target.innerText === "a/b") {
    if (!displayExpresionValue) {
      return;
    }
    displayExpresionValue += "/";
  }
  if (event.target.innerText === "y" + String.fromCharCode(8730)) {
    if (!displayExpresionValue) {
      return;
    }
    displayExpresionValue += nthRootformula;
  }
  displayElement.value = displayExpresionValue;
}

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
 * @param {string} displayExpresionValue
 * @param {array} powerSearchResults
 * @returns {array}
 */
function getExponentBase(displayExpresionValue, powerSearchResults, keyword) {
  let powerBases = []; // save all the power bases
  powerSearchResults.forEach((powerIndex) => {
    let base = []; //store current base
    let parenthesisCount = 0;
    let previousIndex = powerIndex - 1;

    while (previousIndex >= 0) {
      if (displayExpresionValue[previousIndex] === "(") parenthesisCount--;
      if (displayExpresionValue[previousIndex] === ")") parenthesisCount++;
      let isOperator = false;
      OPERATORS.forEach((OPERATOR) => {
        if (displayExpresionValue[previousIndex] === OPERATOR)
          isOperator = true;
      });
      let isPower = displayExpresionValue[previousIndex] === keyword;
      if ((isOperator && parenthesisCount === 0) || isPower) break;

      base.unshift(displayExpresionValue[previousIndex]);
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

/**
 * deletes the last entry of the screen value.
 */
function deleteLastEntryValue() {
  displayExpresionValue = displayExpresionValue.slice(0, -1);
  displayElement.value = displayExpresionValue;
}

/**
 * clears all entry of the screen value.
 */
function clearAllOnDisplay() {
  displayExpresionValue = "";
  displayElement.value = "";
}

/**
 * appends formula on the screen
 */
function appendFormulaOnDisplay(event) {
  displayExpresionValue += event.target.getAttribute("formula");
  displayElement.value = displayExpresionValue;
  console.log(displayExpresionValue);
}
