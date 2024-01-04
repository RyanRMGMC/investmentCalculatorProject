import { generateReturnsArray } from "./src/investmentGoals";
import { Chart } from "chart.js/auto";

const $finalMoneyChart = document.getElementById('final-money-distribution');
const $progressionChart = document.getElementById('progression');

const $investmentForm = document.getElementById('investment-form');
const $clearFormButton = document.getElementById('clear-form');

let doughnutChartReference = {};
let progressionChartReference = {};


//------------------------------FUNCTIONS------------------------------

function formatCurrency(value) {
    return value.toFixed(2);
};


function renderProgression(event) {
    event.preventDefault();  //Previne o comportamento padrão de apagar os campos após o evento Submit

    if (document.querySelector('.error')) {
        return;
    };

    resetCharts();
    
    const startingAmount = Number(document.getElementById('starting-amount').value.replace(',', '.'));
    const additionalContribution = Number(document.getElementById('additional-contribution').value.replace(',', '.'));
    const timeAmount = Number(document.getElementById('time-amount').value);
    const timeAmountPeriod = document.getElementById('time-amount-period').value;
    const returnRate = Number(document.getElementById('return-rate').value.replace(',', '.'));
    const evaluationPeriod = document.getElementById('evaluation-period').value;
    const taxRate = Number(document.getElementById('tax-rate').value.replace(',', '.'));

    const returnsArray = generateReturnsArray(
        startingAmount,
        timeAmount,
        timeAmountPeriod,
        additionalContribution,
        returnRate,
        evaluationPeriod
    );
    const finalInvestmentsObject = returnsArray[returnsArray.length - 1];

    doughnutChartReference = new Chart($finalMoneyChart, {
        type: 'doughnut',
        data: {
            labels: [
                'Total Investido',
                'Rendimento',
                'Imposto'
            ],
            datasets: [{
                data: [
                    formatCurrency(finalInvestmentsObject.investedAmount),
                    formatCurrency(finalInvestmentsObject.totalInterestReturns * (1 - taxRate / 100)),
                    formatCurrency(finalInvestmentsObject.totalInterestReturns * (taxRate / 100))
                ],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
            }]
        }
    });

    progressionChartReference = new Chart($progressionChart, {
        type: 'bar',
        data: {
            labels: returnsArray.map(investmentObject => investmentObject.month),
            datasets: [{
                label: 'Total Investido',
                data: returnsArray.map(investmentObject => formatCurrency(investmentObject.investedAmount)),
                backgroundColor: 'rgb(255, 99, 132)'

            }, {
                label: 'Retorno do Investimento',
                data: returnsArray.map(investmentObject => formatCurrency(investmentObject.interestReturns)),
                backgroundColor: 'rgb(54, 162, 235)'

            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    })

};

function isObjectEmpty(obj){
    return Object.keys(obj).length === 0;
};

function resetCharts(){
    if(!isObjectEmpty(doughnutChartReference) && !isObjectEmpty(progressionChartReference)){
        doughnutChartReference.destroy();
        progressionChartReference.destroy();

    }
};

function clearForm() {
    $investmentForm['starting-amount'].value = '';
    $investmentForm['additional-contribution'].value = '';
    $investmentForm['time-amount'].value = '';
    $investmentForm['return-rate'].value = '';
    $investmentForm['tax-rate'].value = '';

    resetCharts();

    const errorInputs = document.querySelectorAll('.error');

    for (const errorInput of errorInputs) {
        errorInput.classList.remove('error');
        errorInput.parentElement.querySelector('p').remove();
    }
};

function validadeInput(event) {
    if (event.target.value === '') {
        return;
    };

    const parentElement = event.target.parentElement;
    const grandParentElement = event.target.parentElement.parentElement;
    const inputValue = event.target.value.replace(',', '.');

    if ((isNaN(inputValue) || Number(inputValue) <= 0) && !parentElement.classList.contains('error')) {
        const errorTextElement = document.createElement('p');
        errorTextElement.classList.add('text-red-500');
        errorTextElement.innerText = 'Insira um valor numérico e maior que zero!';

        parentElement.classList.add('error');
        grandParentElement.appendChild(errorTextElement);
    } else if (parentElement.classList.contains('error') && !isNaN(inputValue) && Number(inputValue) > 0) {
        parentElement.classList.remove('error');
        grandParentElement.querySelector('p').remove();
    };
};

//---------------------------END OF FUNCTIONS---------------------------


for (const formElement of $investmentForm) {
    if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
        formElement.addEventListener('blur', validadeInput);
    };
};

// $investmentForm.addEventListener('submit', renderProgression);
$clearFormButton.addEventListener('click', clearForm);