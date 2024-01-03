import { generateReturnsArray } from "./src/investmentGoals";

const $investmentForm = document.getElementById('investment-form');
const $clearFormButton = document.getElementById('clear-form');


function renderProgression(event){
    event.preventDefault();  //Previne o comportamento padrão de apagar os campos após o evento Submit

    if(document.querySelector('.error')){
        return;
    };

    const startingAmount = Number(document.getElementById('starting-amount').value.replace(',','.'));
    const additionalContribution = Number(document.getElementById('additional-contribution').value.replace(',','.'));
    const timeAmount = Number(document.getElementById('time-amount').value);
    const timeAmountPeriod = document.getElementById('time-amount-period').value;
    const returnRate = Number(document.getElementById('return-rate').value.replace(',','.'));
    const evaluationPeriod = document.getElementById('evaluation-period').value;
    const taxRate = Number(document.getElementById('tax-rate').value.replace(',','.'));
    
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

function clearForm(){
    $investmentForm['starting-amount'].value = '';
    $investmentForm['additional-contribution'].value = '';
    $investmentForm['time-amount'].value = '';
    $investmentForm['return-rate'].value = '';
    $investmentForm['tax-rate'].value = '';

    const errorInputs = document.querySelectorAll('.error');

    for(const errorInput of errorInputs){
        errorInput.classList.remove('error');
        errorInput.parentElement.querySelector('p').remove();
    }
};

function validadeInput(event){
    if(event.target.value === ''){
        return;
    };

    const parentElement = event.target.parentElement;
    const grandParentElement = event.target.parentElement.parentElement;
    const inputValue = event.target.value.replace(',','.');

    if((isNaN(inputValue) || Number(inputValue) <= 0) && !parentElement.classList.contains('error')){
        const errorTextElement = document.createElement('p');
        errorTextElement.classList.add('text-red-500');
        errorTextElement.innerText = 'Insira um valor numérico e maior que zero!';

        parentElement.classList.add('error');
        grandParentElement.appendChild(errorTextElement);
    }else if(parentElement.classList.contains('error') && !isNaN(inputValue) && Number(inputValue) > 0){
        parentElement.classList.remove('error');
        grandParentElement.querySelector('p').remove();
    };
};

for(const formElement of $investmentForm){
    if(formElement.tagName === 'INPUT' && formElement.hasAttribute('name')){
        formElement.addEventListener('blur', validadeInput);
    };
};

$investmentForm.addEventListener('submit', renderProgression);
$clearFormButton.addEventListener('click', clearForm);