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
const resultDisplayElement = document.getElementById("result-display");
const undoElement = document.getElementById("undo");
const redoElement = document.getElementById("redo");

let displayExpresionValue = "";
let results = "";
let hasDot = false;
let hasOperator = false;
let answer;
let isRadian = false;
let radian = Math.PI / 180;

const nthRootformula =
  String.fromCharCode(8718) + String.fromCharCode(8730) + "(";
const powerSign = String.fromCharCode(9213) + "(";
let undoRedoExpresionArray = [];
let undoRedoResultArray = [];
let undoRedoExpresionIndex = -1;
let undoRedoResultIndex = -1;

numbersElement.forEach((number) => {
  number.addEventListener("click", appendNumber);
});

operatorsElement.forEach((operator) => {
  operator.addEventListener("click", appendOperator);
});

equalElement.addEventListener("click", calculateResults);

leftBracketElement.addEventListener("click", appendLeftBracket);
rightBracketElement.addEventListener("click", appendFormulaOnDisplay);

answerElement.addEventListener("click", appendFormulaOnDisplay);

squareNumberElement.addEventListener("click", appendFormulaOnDisplay);

powerElement.addEventListener("click", appendFormulaOnDisplay);

magnitudeElement.addEventListener("click", appendFormulaOnDisplay);

squarerootElement.addEventListener("click", appendFormulaOnDisplay);

piElement.addEventListener("click", appendFormulaOnDisplay);

trigonometryElement.forEach((trig) => {
  trig.addEventListener("click", appendFormulaOnDisplay);
});

clearElement.addEventListener("click", clearAllOnDisplay);

deleteElement.addEventListener("click", deleteLastEntryValue);

fractionElement.addEventListener("click", appendFormulaOnDisplay);

nthrootElement.addEventListener("click", appendFormulaOnDisplay);

undoElement.addEventListener("click", undoOperation);

redoElement.addEventListener("click", redoOperation);
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
  resultDisplayElement.innerText = "";
}

/*
 * appends a value on the screen
 * @param {object} event
 * @return {string}
 */
function appendOperator(event) {
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
}

/**
 *returns an array of indexes of keyword that occurred in a string
 *
 * @param {string} str
 * @param {string} keyword
 * @returns {array}
 */
function searchOperator(displayExpresionValue, keyword) {
  let displayEpressionArray = displayExpresionValue.split("");
  let searchResults = [];
  displayEpressionArray.forEach((element, index) => {
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
      if (displayExpresionValue[previousIndex] === "(") {
        parenthesisCount--;
      }
      if (displayExpresionValue[previousIndex] === ")") {
        parenthesisCount++;
      }

      let isOperatorCharacter = isOperator(
        displayExpresionValue[previousIndex]
      );
      let isPower = displayExpresionValue[previousIndex] === keyword;
      if ((isOperatorCharacter && parenthesisCount === 0) || isPower) {
        return;
      }

      base.unshift(displayExpresionValue[previousIndex]);
      previousIndex--;
    }
    powerBases.push(base.join(""));
  });

  return powerBases;
}

/**
 *
 *check if character of the display value is operator
 */
function isOperator(characterOndisplay) {
  const OPERATORS = ["+", "-", "x", String.fromCharCode(247)];
  return OPERATORS.includes(characterOndisplay);
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
  resultDisplayElement.innerText = "";
}

/**
 * appends formula on the screen
 */
function appendFormulaOnDisplay(event) {
  let formulaValue = event.target.getAttribute("formula");
  const validFormulaValues = ["²", "/", nthRootformula, powerSign];
  if (validFormulaValues.includes(formulaValue)) {
    if (!displayExpresionValue || displayExpresionValue === "") {
      return "";
    } else {
      displayExpresionValue += formulaValue;
    }
  } else {
    displayExpresionValue += formulaValue;
  }
  displayElement.value = displayExpresionValue;
  resultDisplayElement.innerText = "";
}
/**
 * append right bracket on the screen
 *
 */
function appendLeftBracket(event) {
  const lastCharacterInDisplay = displayExpresionValue.slice(-1);

  if (lastCharacterInDisplay === ")") {
    displayExpresionValue += "x(";
  } else {
    displayExpresionValue += event.target.getAttribute("formula");
  }
  displayElement.value = displayExpresionValue;
  resultDisplayElement.innerText = "";
}

/**
 * gives the rsults from the calculation of the display expression
 */
function calculateResults() {
  try {
    if (!displayExpresionValue) return;

    getPowerCalculationResults("²", ",2)");

    getPowerCalculationResults(powerSign, ",");

    replaceWithRightOperator("x", "*");

    replaceWithRightOperator(String.fromCharCode(247), "/");

    replaceWithRightOperator("ans", answer);

    replaceWithRightOperator(String.fromCharCode(8730) + "(", "Math.sqrt(");

    replaceWithRightOperator("sin(", "getTrigonometry(Math.sin,");

    replaceWithRightOperator("cos(", "getTrigonometry(Math.cos,");

    replaceWithRightOperator("tan(", "getTrigonometry(Math.tan,");

    replaceWithRightOperator("|(", "Math.abs(");

    replacePiWithRightOperator();

    replacenthRootWithRightOperator();

    results = eval(displayExpresionValue);
    resultDisplayElement.innerText = results;
    answer = results;
    undoRedoExpresionArray.push(displayExpresionValue);
    undoRedoResultArray.push(results);
    undoRedoExpresionIndex++;
    undoRedoResultIndex++;
    displayExpresionValue = "";
  } catch (err) {
    results = "SYNTAX ERROR";
    resultDisplayElement.innerText = results;
    displayExpresionValue = "";
    console.log(err);
  }
}

function getPowerCalculationResults(keywordSignValue, powerNumber) {
  let powerSearchResults = searchOperator(
    displayExpresionValue,
    keywordSignValue
  );
  const bases = getExponentBase(
    displayExpresionValue,
    powerSearchResults,
    keywordSignValue
  );
  bases.forEach((base) => {
    let toReplace = base + keywordSignValue;
    let replacement = "Math.pow(" + base + powerNumber;
    displayExpresionValue = displayExpresionValue.replace(
      toReplace,
      replacement
    );
  });
}

/**
 * replace display screen operators with right javascript operators
 *
 */
function replaceWithRightOperator(toReplace, replacement) {
  if (displayExpresionValue.includes(toReplace)) {
    displayExpresionValue = displayExpresionValue.replaceAll(
      toReplace,
      replacement
    );
  }
}

/**
 * replace pi screen operator with right javascript operator
 *
 */
function replacePiWithRightOperator() {
  let piSearch = searchOperator(
    displayExpresionValue,
    String.fromCharCode(960)
  );

  piSearch.forEach((element) => {
    if (
      typeof Number(displayExpresionValue[element - 1]) === "number" &&
      displayExpresionValue[element - 1]
    ) {
      displayExpresionValue = displayExpresionValue.replace(
        displayExpresionValue[element],
        "* Math.PI"
      );
    } else {
      displayExpresionValue = displayExpresionValue.replace(
        displayExpresionValue[element],
        "Math.PI"
      );
    }
  });
}

function replacenthRootWithRightOperator() {
  let nthRootSearchResults = searchOperator(
    displayExpresionValue,
    nthRootformula
  );

  nthRootSearchResults.forEach((element) => {
    const beforeRoot = displayExpresionValue[element - 1];
    const afterRoot = displayExpresionValue[element + 1];
    let toReplace = beforeRoot + displayExpresionValue[element] + afterRoot;
    let replacement = "Math.pow(" + afterRoot + 1 / beforeRoot + ")";
    displayExpresionValue = displayExpresionValue.replace(
      toReplace,
      replacement
    );
  });
}

/**
 * performs undo operation
 */
function undoOperation() {
  if (undoRedoExpresionIndex > 0 || undoRedoResultIndex > 0) {
    undoRedoExpresionIndex--;
    undoRedoResultIndex--;
  }
  displayElement.value = undoRedoExpresionArray[undoRedoExpresionIndex];
  resultDisplayElement.innerText = undoRedoResultArray[undoRedoResultIndex];
}

/**
 * performs redo operation
 */
function redoOperation() {
  let resultArrayLength = undoRedoResultArray.length - 1;
  let expresionArrayLength = undoRedoExpresionArray.length - 1;
  if (
    undoRedoExpresionIndex < expresionArrayLength ||
    undoRedoResultIndex < resultArrayLength
  ) {
    undoRedoExpresionIndex++;
    undoRedoResultIndex++;
    displayElement.value = undoRedoExpresionArray[undoRedoExpresionIndex];
    resultDisplayElement.innerText = undoRedoResultArray[undoRedoResultIndex];
  }
}
