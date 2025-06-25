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
  if (ALLSIGNS.includes(operationArray.at(-1) || BRACKETS.includes(operationArray.at(-1)))){
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
  if (ALLSIGNS.includes(operationArray.at(-1)) || operationArray.length === 0 || BRACKETS.includes(operationArray.at(-1))){
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
      let poppedCharacter = testStack.pop();
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

function calculateSign(currentCalculation, previousNumber, previousSign){
  if (!previousSign || previousSign === "+"){
    currentCalculation.push(previousNumber);
  }
  else if (previousSign === "-"){
    currentCalculation.push(-previousNumber);
  }
  else if (previousSign === "x"){
    let firstNumber = currentCalculation.pop();
    currentCalculation.push(firstNumber * previousNumber);
  }
  else if (previousSign === "/"){
    let firstNumber = currentCalculation.pop();
    currentCalculation.push(firstNumber / previousNumber);
  }
  return currentCalculation;
}

// used my previous soluton from leetcode
// my initial solution would work, but is hard to maintain and understand, causing me to switch over
function computeAnswer(beginningIndex = 0){

  let currentCalculation = [];
  let previousSign = "";
  let previousNumber = null;
  let index = beginningIndex;

  while (index < operationArray.length){
    let currentElement = operationArray[index];
    if (!isNaN(currentElement)){
      previousNumber = Number(currentElement);
    }
    else if (ALLSIGNS.includes(currentElement)){
      currentCalculation = calculateSign(currentCalculation, previousNumber, previousSign);
      previousSign = currentElement;
    }
    else{
      if (currentElement === "("){
        // (12)(2)
        if (operationArray[index - 1] === ")"){
          previousSign = "x";
        }
        const bracketResult = computeAnswer(index + 1);
        index = bracketResult[0];
        currentCalculation.push(bracketResult[1]);
      }
      else if (currentElement === ")"){
        if (previousSign){
          currentCalculation = calculateSign(currentCalculation, previousNumber, previousSign);
        }
        return [index, currentCalculation[0]];
      }
    }
    index++;
  }
  if (previousSign){
    currentCalculation = calculateSign(currentCalculation, previousNumber, previousSign);
  }
  return currentCalculation[0];
}

eventListeners();