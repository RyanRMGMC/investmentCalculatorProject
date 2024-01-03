import { generateReturnsArray } from "./src/investmentGoals";

const $investmentForm = document.getElementById('investment-form');


function renderProgression(evt){
    evt.preventDefault();  //Previne o comportamento padrão de apagar os campos após o evento Submit

    const startingAmount = Number(document.getElementById('starting-amount').value);
    const additionalContribution = Number(document.getElementById('additional-contribution').value);
    const timeAmount = Number(document.getElementById('time-amount').value);
    const timeAmountPeriod = document.getElementById('time-amount-period').value;
    const returnRate = Number(document.getElementById('return-rate').value);
    const evaluationPeriod = document.getElementById('evaluation-period').value;
    const taxRate = Number(document.getElementById('tax-rate').value);
    
    const returnsArray = generateReturnsArray(
        startingAmount, 
        timeAmount, 
        timeAmountPeriod, 
        additionalContribution, 
        returnRate, 
        evaluationPeriod
        );
    console.log(returnsArray);

};

$investmentForm.addEventListener('submit', renderProgression);