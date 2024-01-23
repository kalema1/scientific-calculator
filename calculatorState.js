// This file to contain the state of my application
//receives the buttton inputs

export class CalculatorState {
  constructor(inputButtons) {
    // input buttons
    this.inputButtons = inputButtons;
  }

  /**
   * apppend numbers on the application for operations
   * @param {string} numbers - number string to be appended
   * @return {string} -string of numbers
   */
  appendNumber(number) {
    return (this.inputButtons += number);
  }

  /**
   * apppend perands on the application for operations
   * @param {string} operands - operand string to be appended
   * @return {string}
   */
  appendOperands(operands) {
    return (this.inputButtons += operands);
  }
}
