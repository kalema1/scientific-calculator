const displayElement = document.querySelector(".display");
const numbersElement = document.querySelectorAll(".numbers");
const operatorsElement = document.querySelectorAll(".operators");
const equalElement = document.querySelector(".equal");
const leftBracketElement = document.querySelector(".left-bracket");
const rightBracketElement = document.querySelector(".right-bracket");

let display = "";
let results = "";
let hasDot = false;
let hasOperator = false;

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
    if (display.includes("x")) {
      display = display.replaceAll("x", "*");
    }
    if (display.includes(String.fromCharCode(247))) {
      display = display.replaceAll(String.fromCharCode(247), "/");
    }
    results = eval(display);
    displayElement.value = results;
    display = "";
  } catch (err) {
    results = "SYNTAX ERROR";
    displayElement.value = results;
  }
});

leftBracketElement.addEventListener("click", (e) => {
  display += e.target.innerText;
  displayElement.value = display;
});
rightBracketElement.addEventListener("click", (e) => {
  if (display.at(-1) === ")") {
    display += "x(";
  } else {
    display += e.target.innerText;
  }

  displayElement.value = display;
});

/**
 * Returns true if the specified string has the balanced brackets and false otherwise.
 * Balanced means that is, whether it consists entirely of pairs of opening/closing brackets
 * (in that order), none of which mis-nest.
 *
 *
 * @param {string} str
 * @return {boolean}
 *
 * @example:
 *   '()'   => true
 */
function isBracketsBalanced(str) {
  const stack = [];
  const bracketPairs = {
    "(": ")",
  };

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (bracketPairs[char]) {
      // If it's an opening bracket, push it onto the stack.
      stack.push(char);
    } else if (Object.values(bracketPairs).includes(char)) {
      // If it's a closing bracket, check if it matches the top of the stack.
      if (stack.length === 0 || bracketPairs[stack.pop()] !== char) {
        return false; // Mismatched brackets
      }
    }
    // Ignore other characters
  }

  return stack.length === 0; // True if the stack is empty (all brackets matched)
}
