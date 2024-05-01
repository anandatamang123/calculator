const form = document.getElementById("calc_form");
const output = document.getElementById("output");
const operandBtns = document.querySelectorAll("button[data-type='operand']");
const operatorBtns = document.querySelectorAll("button[data-type='operator']");

let isOperator = false;
let equation = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

// Handle operand button clicks
operandBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (output.value === "0" || isOperator) {
      output.value = e.target.value;
      isOperator = false;
    } else {
      // Prevent multiple decimals in one number
      if (e.target.value === "." && output.value.includes(".")) {
        return;
      }
      output.value += e.target.value;
    }
  });
});

// Handle operator button clicks
operatorBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let operator = e.target.value;
    if (operator === "=") {
      if (!isOperator) {
        equation.push(output.value);
      }
      output.value = calculateResult(equation);
      equation = [];
      isOperator = false;
    } else if (operator === "invert") {
      output.value = parseFloat(output.value) * -1;
    } else if (operator === "%") {
      output.value = parseFloat(output.value) / 100;
    } else {
      if (!isOperator) {
        equation.push(output.value);
        equation.push(operator);
        isOperator = true;
      } else {
        equation[equation.length - 1] = operator;
      }
    }
  });
});

function calculateResult(eq) {
  const stack = [];
  let currentNumber = "";
  
  for (let i = 0; i < eq.length; i++) {
    if (["/", "*", "+", "-"].includes(eq[i])) {
      stack.push(parseFloat(currentNumber));
      stack.push(eq[i]);
      currentNumber = "";
    } else {
      currentNumber += eq[i];
    }
  }
  stack.push(parseFloat(currentNumber));

  return stack.reduce((acc, val) => {
    if (!isNaN(val)) {
      return val;
    } else {
      switch (val) {
        case '+': return acc + stack.shift();
        case '-': return acc - stack.shift();
        case '*': return acc * stack.shift();
        case '/': return acc / stack.shift();
        default: return acc;
      }
    }
  });
}
