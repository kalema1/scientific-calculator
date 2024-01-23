// This file contain the displays of my application.
// it observes the state of the application and displays the values

import { CalculatorState } from "./calculatorState.js";

const displayElement = document.getElementById("display");
const numbersElement = document.querySelectorAll(".numbers");
const operatorsElement = document.querySelectorAll(".operators");

class CalculatorDisplay {
  // display string on the calculator screen
  displayString = "";

  constructor() {
    this.calculatorState = new CalculatorState(this.displayString);
  }

  /**
   * diisplay numbers on the screen
   */
  displayNumbers() {
    numbersElement.forEach((number) => {
      number.addEventListener("click", () => {
        displayElement.value = this.calculatorState.appendNumber(
          number.innerText
        );
      });
    });
  }
}

const calculatorDisplay = new CalculatorDisplay();
calculatorDisplay.displayNumbers();
