let signAdded = false;
let operationArray = [];
let bracketStack = [];

ALLSIGNS = ['-', '+', '/', 'x'];
BRACKETS = ['(', ')'];
const resultRef = document.querySelector('.result');
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
const plusRef = document.querySelector('.plus');
const minusRef = document.querySelector('.minus');
const multiplyRef = document.querySelector('.multiply');
const divideRef = document.querySelector('.divide');
const equalRef = document.querySelector('.equal');
const deleteRef = document.querySelector('.delete');
const allClearRef = document.querySelector('.all-clear');
const decimalRef = document.querySelector('.decimal');
const openBracketRef = document.querySelector('.opening-bracket');
const closeBracketRef = document.querySelector('.closing-bracket');

function eventListeners(){
  zeroButtonRef.addEventListener('click', () => addNumberToResult('0'));
  oneButtonRef.addEventListener('click', () => addNumberToResult('1'));
  twoButtonRef.addEventListener('click', () =>  addNumberToResult('2'));
  threeButtonRef.addEventListener('click', () => addNumberToResult('3'));
  fourButtonRef.addEventListener('click', () =>  addNumberToResult('4'));
  fiveButtonRef.addEventListener('click', () =>  addNumberToResult('5'));
  sixButtonRef.addEventListener('click', () =>  addNumberToResult('6'));
  sevenButtonRef.addEventListener('click', () =>  addNumberToResult('7'));
  eightButtonRef.addEventListener('click', () =>  addNumberToResult('8'));
  nineButtonRef.addEventListener('click',  () => addNumberToResult('9'));
  plusRef.addEventListener('click', () => changeCurrentSign('+'));
  minusRef.addEventListener('click', () => changeCurrentSign('-'));
  multiplyRef.addEventListener('click', () => changeCurrentSign('x'));
  divideRef.addEventListener('click',  () => changeCurrentSign('/'));
  decimalRef.addEventListener('click', () => addDecimalToResult());
  allClearRef.addEventListener('click', () => clearArray());
  deleteRef.addEventListener('click', () => popArray());
  openBracketRef.addEventListener('click', () => addBrackets('('));
  closeBracketRef.addEventListener('click', () => addBrackets(')'));
  equalRef.addEventListener('click', () => checkForBalancedBrackets());
}

function addBrackets(bracket){
  if (!(operationArray.at(-1) === '(' &&  bracket === ')')){
    operationArray.push(bracket);
    bracketStack.push(bracket);
    resultRef.innerText += `${bracket}`;
  }
}

function changeCurrentSign(newSign){
  if (!(ALLSIGNS.includes(operationArray.at(-1)))){
    resultRef.innerText += `${newSign}`;
  }
  else if (ALLSIGNS.includes(operationArray.at(-1))){
    operationArray.pop();
    resultRef.innerText = resultRef.innerText.slice(0, resultRef.innerText.length - 1) + newSign;
  }
  operationArray.push(newSign);
}

function addDecimalToResult(){
  if (ALLSIGNS.includes(operationArray.at(-1))){
    resultRef.innerText += `0.`;
    operationArray.push(`0.`);
  }
  else if (!(operationArray.at(-1).includes('.'))){
      resultRef.innerText += `.`;
      operationArray[operationArray.length - 1] = operationArray[operationArray.length - 1] + '.';
  }
}

function addNumberToResult(number){
  if (signAdded){
    resultRef.innerText = ``;
    signAdded = false;
  }
  resultRef.innerText += `${number}`;
  if (ALLSIGNS.includes(operationArray.at(-1)) || operationArray.length === 0){
    operationArray.push(number);
  }
  else{
    operationArray[operationArray.length - 1] += number;
  }
}

function clearArray(){
  operationArray = [];
  resultRef.innerText = '';
}

function popArray(){
  if (BRACKETS.includes(operationArray.at(-1))){
    bracketStack.pop();
  }
  operationArray[operationArray.length - 1] = operationArray[operationArray.length - 1].slice(0, operationArray[operationArray.length - 1].length - 1);
  resultRef.innerText = resultRef.innerText.slice(0, resultRef.innerText.length - 1);
  if (operationArray.at(-1).length === 0){
    operationArray.pop();
  }
}

function checkForBalancedBrackets(){
  let testStack = [];
  for (let i = 0; i < bracketStack.length; i++){
    let currentCharacter = bracketStack[i];
    if (currentCharacter === '('){
      testStack.push(currentCharacter);
    }
    else{
      let poppedCharacter = currentCharacter.pop();
      if (!poppedCharacter || poppedCharacter === currentCharacter){
        alert('Unbalanced brackets!');
        return; 
      }
    }
  }
  if (testStack.length > 0){
    alert('Unbalanced brackets!');
    return; 
  }
  computeAnswer();
}

function trickleDownAddAndSub(currentCalculation){
  let newCalculation = [];
  let newSign = "";
  for (let i = 0; i < currentCalculation.length; i++){
    let newCharacter = currentCalculation[i];
    if (ALLSIGNS.includes(newCharacter)){
      newSign = newCharacter;
    }
    else{
      newCalculation.push(Number(newCharacter));
      if (newCalculation.length === 2){
        let result;
        if (newSign === "+"){
          result = add(newCalculation[0], newCalculation[1]);
        }
        else{
          result = subtract(newCalculation[0], newCalculation[1]);
        }
        newCalculation = [];
        newCalculation.push(result);
      }
    }
  }
  console.log(newCalculation);
  return newCalculation;
}

function computeAnswer(beginningIndex = 0){
  console.log(operationArray);
  let currentCalculation = [];
  let previousSign = "";
  let index = 0;
  while (index < operationArray.length){
    let currentElement = operationArray[index];
    if (!isNaN(currentElement)){
      currentCalculation.push(Number(currentElement));
    }
    else if (ALLSIGNS.includes(currentElement)){
      // add and subtract
      if (ALLSIGNS.indexOf(currentElement) < 2){
        // 6 + 6 + -> means you can add 6 + 6
        if (ALLSIGNS.indexOf(previousSign) < 2 && previousSign){
          currentCalculation = trickleDownAddAndSub(currentCalculation);
        }
        currentCalculation.push(currentElement);
      }
      // multiply and divide
      else{
        index++;
        let nextNumber = Number(operationArray.at(index));
        if (nextNumber === NaN){
          alert('Incomplete expression!');
          return;
        }
        // Implement multiplication or division
        if (currentElement === "x"){
          currentCalculation.push(multiply(currentCalculation.pop(), nextNumber));
        }
        else{
          currentCalculation.push(divide(currentCalculation.pop(), nextNumber));
        }
        //
        if (ALLSIGNS.indexOf(previousSign) < 2 && previousSign){
          currentCalculation = trickleDownAddAndSub(currentCalculation);
        }
      }
      previousSign = currentElement;
    }
    else{
      continue; // brackets implementation
    }
    index++;
  }
  if (ALLSIGNS.includes(operationArray.at(-1))){
    alert('Incomplete expression!');
    return;
  }
  console.log(currentCalculation);
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

eventListeners();