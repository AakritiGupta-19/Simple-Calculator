// ================================
// GET HTML ELEMENTS
// ================================

const display = document.getElementById("display");
const previousDisplay = document.getElementById("previousDisplay");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");

const equalsButton = document.getElementById("equals");
const clearButton = document.getElementById("clear");
const backspaceButton = document.getElementById("backspace");


// ================================
// VARIABLES
// ================================

let currentNumber = "";
let previousNumber = "";
let selectedOperator = null;

let shouldResetDisplay = false;


// ================================
// UPDATE DISPLAY
// ================================

function updateDisplay() {

    if (currentNumber === "") {
        display.textContent = "0";
    } else {
        display.textContent = currentNumber;
    }

}


// ================================
// DISPLAY BUTTON PRESS ANIMATION
// ================================

function animateDisplay() {

    display.classList.remove("active");

    // Force browser to restart animation
    void display.offsetWidth;

    display.classList.add("active");

}


// ================================
// NUMBER BUTTONS
// ================================

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        const number = button.dataset.number;

        inputNumber(number);

    });

});


// ================================
// INPUT NUMBER
// ================================

function inputNumber(number) {

    // If result was just calculated
    if (shouldResetDisplay) {

        currentNumber = "";

        shouldResetDisplay = false;

    }


    // Prevent multiple decimal points
    if (number === "." && currentNumber.includes(".")) {

        return;

    }


    // Prevent unnecessary leading zeros
    if (currentNumber === "0" && number !== ".") {

        currentNumber = number;

    } else {

        currentNumber += number;

    }


    updateDisplay();

    animateDisplay();

}


// ================================
// OPERATOR BUTTONS
// ================================

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        const operator = button.dataset.operator;

        selectOperator(operator);

    });

});


// ================================
// SELECT OPERATOR
// ================================

function selectOperator(operator) {

    if (currentNumber === "") {

        return;

    }


    // If an operation is already selected,
    // calculate the previous operation first.

    if (selectedOperator !== null && previousNumber !== "") {

        calculate();

    }


    previousNumber = currentNumber;

    selectedOperator = operator;

    currentNumber = "";

    shouldResetDisplay = false;


    // Show expression on top
    previousDisplay.textContent =
        `${previousNumber} ${getOperatorSymbol(operator)}`;

    updateDisplay();

}


// ================================
// GET DISPLAY OPERATOR
// ================================

function getOperatorSymbol(operator) {

    if (operator === "*") {
        return "×";
    }

    if (operator === "/") {
        return "÷";
    }

    if (operator === "-") {
        return "−";
    }

    return operator;

}


// ================================
// EQUAL BUTTON
// ================================

equalsButton.addEventListener("click", () => {

    calculate();

});


// ================================
// CALCULATE RESULT
// ================================

function calculate() {

    if (
        selectedOperator === null ||
        previousNumber === "" ||
        currentNumber === ""
    ) {

        return;

    }


    const firstNumber = parseFloat(previousNumber);
    const secondNumber = parseFloat(currentNumber);

    let result;


    switch (selectedOperator) {

        // Addition
        case "+":

            result = firstNumber + secondNumber;

            break;


        // Subtraction
        case "-":

            result = firstNumber - secondNumber;

            break;


        // Multiplication
        case "*":

            result = firstNumber * secondNumber;

            break;


        // Division
        case "/":

            if (secondNumber === 0) {

                display.textContent = "Error";

                previousDisplay.textContent =
                    "Cannot divide by zero";

                resetCalculator();

                return;

            }

            result = firstNumber / secondNumber;

            break;


        // Modulo
        case "%":

            if (secondNumber === 0) {

                display.textContent = "Error";

                previousDisplay.textContent =
                    "Cannot divide by zero";

                resetCalculator();

                return;

            }

            result = firstNumber % secondNumber;

            break;

    }


    // Remove unnecessary decimal
    if (Number.isInteger(result)) {

        currentNumber = result.toString();

    } else {

        currentNumber = parseFloat(result.toFixed(10)).toString();

    }


    previousDisplay.textContent =
        `${firstNumber} ${getOperatorSymbol(selectedOperator)} ${secondNumber} =`;


    previousNumber = "";

    selectedOperator = null;

    shouldResetDisplay = true;


    updateDisplay();

    animateDisplay();

}


// ================================
// CLEAR BUTTON
// ================================

clearButton.addEventListener("click", () => {

    resetCalculator();

});


// ================================
// RESET CALCULATOR
// ================================

function resetCalculator() {

    currentNumber = "";

    previousNumber = "";

    selectedOperator = null;

    shouldResetDisplay = false;

    previousDisplay.textContent = "";

    updateDisplay();

}


// ================================
// BACKSPACE BUTTON
// ================================

backspaceButton.addEventListener("click", () => {

    if (shouldResetDisplay) {

        return;

    }


    currentNumber = currentNumber.slice(0, -1);

    updateDisplay();

    animateDisplay();

});


// ================================
// KEYBOARD SUPPORT
// ================================

document.addEventListener("keydown", (event) => {

    const key = event.key;


    // Numbers
    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {

        inputNumber(key);

    }


    // Operators
    else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "%"
    ) {

        selectOperator(key);

    }


    // Equal
    else if (key === "Enter" || key === "=") {

        calculate();

    }


    // Backspace
    else if (key === "Backspace") {

        currentNumber = currentNumber.slice(0, -1);

        updateDisplay();

        animateDisplay();

    }


    // Clear
    else if (key === "Escape" || key.toLowerCase() === "c") {

        resetCalculator();

    }

});