let numberInputted = false;
let signAdded = false;
let operationArray = [];

const oneButtonRef = document.querySelector('.one');
const twoButtonRef = document.querySelector('.two');
const threeButtonRef = document.querySelector('.three');
const fourButtonRef = document.querySelector('.four');
const fiveButtonRef = document.querySelector('.five');
const sixButtonRef = document.querySelector('.six');
const sevenButtonRef = document.querySelector('.seven');
const eightButtonRef = document.querySelector('.eight');
const nineButtonRef = document.querySelector('.nine');
const zeroButtonRef = document.querySelector('.zero');
const resultRef = document.querySelector('.result');
const plusRef = document.querySelector('.plus');
const minusRef = document.querySelector('.minus');
const multiplyRef = document.querySelector('.multiply');
const divideRef = document.querySelector('.divide');
const equalRef = document.querySelector('.equal');
const deleteRef = document.querySelector('.delete');
const allClearRef = document.querySelector('.all-clear');
const decimalRef = document.querySelector('.decimal');

oneButtonRef.addEventListener('click', () => addNumberToResult('1'));
twoButtonRef.addEventListener('click', () =>  addNumberToResult('2'));
threeButtonRef.addEventListener('click', () => addNumberToResult('3'));
fourButtonRef.addEventListener('click', () =>  addNumberToResult('4'));
fiveButtonRef.addEventListener('click', () =>  addNumberToResult('5'));
sixButtonRef.addEventListener('click', () =>  addNumberToResult('6'));
sevenButtonRef.addEventListener('click', () =>  addNumberToResult('7'));
eightButtonRef.addEventListener('click', () =>  addNumberToResult('8'));
nineButtonRef.addEventListener('click',  () => addNumberToResult('9'));
zeroButtonRef.addEventListener('click', () => addNumberToResult('0'));
plusRef.addEventListener('click', () => changeCurrentSign('+'));
minusRef.addEventListener('click', () => changeCurrentSign('-'));
multiplyRef.addEventListener('click', () => changeCurrentSign('x'));
divideRef.addEventListener('click',  () => changeCurrentSign('/'));
equalRef.addEventListener('click',  () => computeAnswer());
deleteRef.addEventListener('click', () => popArray());
allClearRef.addEventListener('click', () => clearArray());
decimalRef.addEventListener('click', () => addDecimalToResult());

function addDecimalToResult(){
  if (operationArray.length === 0 || operationArray === 2){
    resultRef.innerText += `0.`;
    operationArray.push(resultRef.innerText);
  }
  else{
    if (!(resultRef.innerText.includes('.'))){
      resultRef.innerText += `.`;
      operationArray[operationArray.length - 1] = resultRef.innerText;
    }
  }
}

function addNumberToResult(number){
  // Deals with [78, +, 3] => press add => [81, +] => add another number
  if (signAdded){
    resultRef.innerText = ``;
    signAdded = false;
  }
  resultRef.innerText += `${number}`;
  if (operationArray.length === 0 || operationArray.length === 2){
    operationArray.push(resultRef.innerText);
  }
  else if (operationArray.length === 1 || operationArray.length === 3){
    operationArray[operationArray.length - 1] = resultRef.innerText;
  }
  console.log(operationArray);
}

function changeCurrentSign(newSign){
  // Clears result if an operator is added.
  if (operationArray.length === 1){
    resultRef.innerText = ``;
  }
  // Changes operator
  else if (operationArray.length === 2){
    operationArray.pop();
  }
  else if (operationArray.length === 3){
    computeAnswer();
    signAdded = true;
  }
  operationArray.push(newSign);
}

function popArray(){
  if (operationArray.length === 1 || operationArray.length === 3){
    if (resultRef.innerText.length > 1){
      operationArray[operationArray.length - 1] = resultRef.innerText.slice(0, resultRef.innerText.length - 1); 
    }
    else if (resultRef.innerText.length === 1){
      operationArray.pop();
    }
  }

}

function clearArray(){
  operationArray = [];
  resultRef.innerText = '';
}

function computeAnswer(){
  if (operationArray.length === 2){
    alert('Please add another number! Only a number and operator has been used!');
  }
  else if (operationArray.length === 3){
    let result;
    let firstNumber = Number(operationArray[0]);
    let secondNumber = Number(operationArray[2]);
    if (operationArray[1]  === '+'){
      result = add(firstNumber, secondNumber);
    }
    else if (operationArray[1] === "x"){
      result = multiply(firstNumber, secondNumber);
    }
    else if (operationArray[1] === "/"){
      result = divide(firstNumber, secondNumber);
    }
    else{
      result = subtract(firstNumber, secondNumber);
    }
    if (result !== NaN){
      clearArray();
      operationArray.push(result);
      resultRef.innerText = `${result.toFixed(3)}`;
    }
  }
  console.log(operationArray);
}

function multiply(firstNumber, secondNumber){
  return firstNumber * secondNumber;
}

function subtract(firstNumber, secondNumber){
  return firstNumber - secondNumber;
}

function add(firstNumber, secondNumber){
  return firstNumber + secondNumber;
}

function divide(firstNumber, secondNumber){
  if (secondNumber === 0){
    alert('Cannot divide by 0.');
    operationArray.pop();
    return NaN;
  }
  return firstNumber / secondNumber;
}


