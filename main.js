import { generateReturnsArray } from "./src/investmentGoals";
import { Chart } from "chart.js/auto";
import { createTable, clearTable } from "./src/table";

const $finalMoneyChart = document.getElementById('final-money-distribution');
const $progressionChart = document.getElementById('progression');

const $investmentForm = document.getElementById('investment-form');
const $clearFormButton = document.getElementById('clear-form');

let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
    { columnLabel: 'Mês', accessor: 'month' },
    { columnLabel: 'Total Investido', accessor: 'investedAmount', format: (numberInfo) => formatCurrencyToTable(numberInfo) },
    { columnLabel: 'Rendimento Mensal', accessor: 'interestReturns', format: (numberInfo) => formatCurrencyToTable(numberInfo) },
    { columnLabel: 'Rendimento Total', accessor: 'totalInterestReturns', format: (numberInfo) => formatCurrencyToTable(numberInfo) },
    { columnLabel: 'Quantia Total', accessor: 'totalAmount', format: (numberInfo) => formatCurrencyToTable(numberInfo) }
];


//------------------------------FUNCTIONS------------------------------

function formatCurrencyToTable(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

function formatCurrencyToChart(value) {
    return value.toFixed(2);
};


function renderProgression(event) {
    event.preventDefault();  //Previne o comportamento padrão de apagar os campos após o evento Submit

    if (document.querySelector('.error')) {
        return;
    };

    resetCharts();
    clearTable('results-table');

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
                    formatCurrencyToChart(finalInvestmentsObject.investedAmount),
                    formatCurrencyToChart(finalInvestmentsObject.totalInterestReturns * (1 - taxRate / 100)),
                    formatCurrencyToChart(finalInvestmentsObject.totalInterestReturns * (taxRate / 100))
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
                data: returnsArray.map(investmentObject => formatCurrencyToChart(investmentObject.investedAmount)),
                backgroundColor: 'rgb(255, 99, 132)'

            }, {
                label: 'Retorno do Investimento',
                data: returnsArray.map(investmentObject => formatCurrencyToChart(investmentObject.interestReturns)),
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
    });

    createTable(columnsArray, returnsArray, 'results-table');

};

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
};

function resetCharts() {
    if (!isObjectEmpty(doughnutChartReference) && !isObjectEmpty(progressionChartReference)) {
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
    clearTable('results-table');

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


const $main = document.querySelector('main');
const $carousel = document.getElementById('carousel');
const $nextButton = document.getElementById('slide-arrow-next');
const $previousButton = document.getElementById('slide-arrow-previous');

$nextButton.addEventListener('click', () => {
    $carousel.scrollLeft += $main.clientWidth;
});

$previousButton.addEventListener('click', () => {
    $carousel.scrollLeft -= $main.clientWidth;
});

$investmentForm.addEventListener('submit', renderProgression);
$clearFormButton.addEventListener('click', clearForm);