let signAdded = false;
let operationArray = [];
let bracketStack = [];

ALLSIGNS = ['-', '+', '/', 'x'];
BRACKETS = ['(', ')'];
EXPONENT = ['^('];

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
const exponentRef = document.querySelector('.exponent');

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
  exponentRef.addEventListener('click', () => addExponentToResult());
}

function addBrackets(bracket){
  if (!(operationArray.at(-1) === '(' &&  bracket === ')')){
    operationArray.push(bracket);
    bracketStack.push(bracket);
    resultRef.value += `${bracket}`;
  }
}

function addDecimalToResult(){
  if (ALLSIGNS.includes(operationArray.at(-1)) || BRACKETS.includes(operationArray.at(-1)) || EXPONENT.includes(operationArray.at(-1))){
    resultRef.value += `0.`;
    operationArray.push(`0.`);
  }
  else if (!(operationArray.at(-1).includes('.'))){
      resultRef.value += `.`;
      operationArray[operationArray.length - 1] = operationArray[operationArray.length - 1] + '.';
  }
}

function addNumberToResult(number){
  if (signAdded){
    resultRef.value = ``;
    signAdded = false;
  }
  resultRef.value += `${number}`;
  if (ALLSIGNS.includes(operationArray.at(-1)) || operationArray.length === 0 || BRACKETS.includes(operationArray.at(-1)) || EXPONENT.includes(operationArray.at(-1))){
    operationArray.push(number);
  }
  else{
    operationArray[operationArray.length - 1] += number;
  }
}

function addExponentToResult(){
  console.log(operationArray, !isNaN(operationArray.at(-1)));
  if (operationArray.at(-1) === ')' || !isNaN(operationArray.at(-1))){
    operationArray.push('^(');
    bracketStack.push('(');
    resultRef.value += '^(';
  }
}

function changeCurrentSign(newSign){
  if (!(ALLSIGNS.includes(operationArray.at(-1)))){
    resultRef.value += `${newSign}`;
  }
  else if (ALLSIGNS.includes(operationArray.at(-1))){
    operationArray.pop();
    resultRef.value = resultRef.value.slice(0, resultRef.value.length - 1) + newSign;
  }
  operationArray.push(newSign);
}

function clearArray(){
  operationArray = [];
  resultRef.value = '';
}

function popArray(){
  if (BRACKETS.includes(operationArray.at(-1)) || EXPONENT.includes(operationArray.at(-1))){
    bracketStack.pop();
    if (EXPONENT.includes(operationArray.at(-1))){
      resultRef.value = resultRef.value.slice(0, resultRef.value.length - 2);
    }
    else{
      resultRef.value = resultRef.value.slice(0, resultRef.value.length - 1);
    }
    operationArray.pop();
  }
  else{
      operationArray[operationArray.length - 1] = operationArray[operationArray.length - 1].slice(0, operationArray[operationArray.length - 1].length - 1);
      resultRef.value = resultRef.value.slice(0, resultRef.value.length - 1);
      if (operationArray.at(-1).length === 0){
        operationArray.pop();
    }
  }
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
  console.log(operationArray);
  computeAnswer();
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
      console.log(currentElement);
      previousNumber = Number(currentElement);
      if (index + 1 < operationArray.length && EXPONENT.includes(operationArray[index + 1])){
        // you are checking the next symbol, and it's an exponent, so one more after that
        const bracketResult = computeAnswer(index + 2);
        index = bracketResult[0];
        previousNumber = previousNumber ** bracketResult[1];
      }
    }
    if (BRACKETS.includes(currentElement)){
      if (currentElement === "("){
        const bracketResult = computeAnswer(index + 1);
        index = bracketResult[0];
        previousNumber = bracketResult[1];
        // (6)^(6)
        if (index + 1 < operationArray.length && EXPONENT.includes(operationArray[index + 1])){
          const bracketResult = computeAnswer(index + 2);
          index = bracketResult[0];
          previousNumber = previousNumber ** bracketResult[1];
        }
      }
      else if (currentElement === ")"){
        let finalSum;
        if (previousSign){
          currentCalculation = calculateSign(currentCalculation, previousNumber, previousSign);
          finalSum = currentCalculation.reduce((accumulator, next) => accumulator + next, 0);
        }
        else{
          finalSum = previousNumber;
        }
        return [index, finalSum];
      }
    }
    if (ALLSIGNS.includes(currentElement) || index === operationArray.length - 1){
      currentCalculation = calculateSign(currentCalculation, previousNumber, previousSign);
      previousSign = currentElement;
    }
    index++;
  }
  operationArray = [];
  const finalSum = currentCalculation.reduce((accumulator, next) => accumulator + next, 0);
  resultRef.value = `${finalSum}`;
  if (finalSum < 0){
    previousSign = "-";
    operationArray.push('-');
  }
  if (finalSum % 1 !== 0){
    operationArray.push(`${Math.abs(finalSum.toFixed(3))}`);
  }
  else{
    operationArray.push(`${Math.abs(finalSum)}`);
  }
}

eventListeners();