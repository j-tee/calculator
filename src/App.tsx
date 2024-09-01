import React, { useState } from 'react';
import './App.css';
import { evaluate } from 'mathjs';

function App() {
  const [answer, setAnswer] = useState<string>("");
  const [expression, setExpression] = useState<string>("0");
  const [lastClicked, setLastClicked] = useState<string>("");

  const isOperator = (symbol: string) => /[*/+-]/.test(symbol);

  const buttonPress = (value: string) => {
    let currentExpression = expression;

    if (value === "clear") {
      setAnswer("");
      setExpression("0");
      setLastClicked("");
      return;
    }

    if (value === "negative") {
      if (lastClicked === "=") {
        setAnswer((prevAnswer) =>
          prevAnswer.charAt(0) === "-" ? prevAnswer.slice(1) : "-" + prevAnswer
        );
        setExpression("");
      } else {
        // Handle the negative sign
        if (currentExpression === "0" || lastClicked === "=") {
          // For initial state or after "="
          currentExpression = "-";
        } else if (isOperator(currentExpression.slice(-1)) || currentExpression.slice(-1) === " ") {
          // Add negative before the next number after an operator or space
          currentExpression += "-";
        } else if (currentExpression.slice(-1) === "-") {
          // Remove negative if it's the last character
          currentExpression = currentExpression.slice(0, -1);
        }
        setExpression(currentExpression);
      }
      setLastClicked(value);
      return;
    }

    if (value === "percentage") {
      setAnswer((prevAnswer) =>
        (parseFloat(prevAnswer) / 100).toString()
      );
      setExpression("");
      setLastClicked(value);
      return;
    }

    if (value === "=") {
      if (lastClicked !== "=") {
        calculate();
        setLastClicked(value);
      }
      return;
    }

    if (value === ".") {
      const lastNumber = expression.split(/[-+/*]/g).pop();
      if (lastNumber?.includes(".")) return;
    }

    if (isOperator(value)) {
      if (lastClicked === "=") {
        setExpression(answer + value);
      } else {
        // Handle consecutive operators
        if (isOperator(currentExpression.slice(-1))) {
          // Handle special case for sequences like "5 * - 5"
          if (value === "-" && (currentExpression.slice(-1) === "*" || currentExpression.slice(-1) === "/")) {
            currentExpression += value; // Allow "-" after "*" or "/"
          } else {
            // Replace consecutive operators with the last one entered
            currentExpression = currentExpression.slice(0, -1) + value;
          }
        } else {
          currentExpression += value;
        }
        setExpression(currentExpression);
      }
    } else {
      setExpression(
        currentExpression === "0" || lastClicked === "="
          ? value
          : currentExpression + value
      );
    }
    setLastClicked(value);
  };

  const calculate = () => {
    try {
      let cleanExpression = expression;

      // Normalize expression: remove spaces
      cleanExpression = cleanExpression.replace(/\s+/g, '');

      // Handle special cases where the last operator is "-" and the following number should be negative
      cleanExpression = cleanExpression.replace(/(\d+)\s*([+\-*/])\s*-\s*(\d+)/g, (match, num1, operator, num2) => {
        // Convert sequences like "5 * - 5" to "5 * -5"
        return `${num1} ${operator} -${num2}`;
      });

      // Handle multiple consecutive operators: convert to valid operator sequence
      cleanExpression = cleanExpression.replace(/([-+*/]{2,})/g, (match) => {
        // Replace consecutive operators with the last operator
        if (match.includes('-')) {
          return '-';
        } else {
          return match.slice(-1); // Keep only the last operator
        }
      });

      // Evaluate the cleaned expression
      const result = evaluate(cleanExpression);
      setAnswer(result.toString());
      setExpression("");
    } catch (error) {
      setAnswer("Error");
      console.error("Evaluation error:", error);
    }
  };

  return (
    <>
      <div className="container">
        <h1>Calculator Application</h1>
        <div id="calculator">
          <div id="display">
            <div id="answer">{answer}</div>
            <div id="expression">{expression}</div>
          </div>
          <button id="clear" onClick={() => buttonPress("clear")} className="light-gray">C</button>
          <button id="negative" onClick={() => buttonPress("negative")} className="light-gray">+/-</button>
          <button id="percentage" onClick={() => buttonPress("percentage")} className="light-gray">%</button>
          <button id="divide" onClick={() => buttonPress("/")} className="yellow">/</button>
          <button id="seven" onClick={() => buttonPress("7")} className="dark-gray">7</button>
          <button id="eight" onClick={() => buttonPress("8")} className="dark-gray">8</button>
          <button id="nine" onClick={() => buttonPress("9")} className="dark-gray">9</button>
          <button id="multiply" onClick={() => buttonPress("*")} className="yellow">*</button>
          <button id="four" onClick={() => buttonPress("4")} className="dark-gray">4</button>
          <button id="five" onClick={() => buttonPress("5")} className="dark-gray">5</button>
          <button id="six" onClick={() => buttonPress("6")} className="dark-gray">6</button>
          <button id="subtract" onClick={() => buttonPress("-")} className="yellow">-</button>
          <button id="one" onClick={() => buttonPress("1")} className="dark-gray">1</button>
          <button id="two" onClick={() => buttonPress("2")} className="dark-gray">2</button>
          <button id="three" onClick={() => buttonPress("3")} className="dark-gray">3</button>
          <button id="add" onClick={() => buttonPress("+")} className="yellow">+</button>
          <button id="zero" onClick={() => buttonPress("0")} className="dark-gray">0</button>
          <button id="decimal" onClick={() => buttonPress(".")} className="dark-gray">.</button>
          <button id="equals" onClick={() => buttonPress("=")} className="yellow">=</button>
        </div>
      </div>
    </>
  );
}

export default App;
