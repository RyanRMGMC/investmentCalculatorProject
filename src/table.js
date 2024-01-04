//CONTRACT
//1 - System must use Tailwindcss
//2 - System must have an element of type '<table>' (with defined id) prepared and without information inside
//3 - Two arrays are needed to generate the table:
//3.1 - An array of data
//3.2 - An array with objects that characterize the columns
//3.3 - Not necessary, but you can pass a column data formatting function in the second array



const isNonEmptyArray = (arrayElement) => {
    return Array.isArray(arrayElement) && arrayElement.length > 0;
};

export const createTable = (columnsArray, dataArray, tableId) => {
    if (!isNonEmptyArray(columnsArray) || !isNonEmptyArray(dataArray) || !tableId) {
        throw new Error('Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento tabela selecionado.');
    };

    const $table = document.getElementById(tableId);
    if (!$table || $table.nodeName !== 'TABLE') {
        throw new Error('Id informado não corresponde a nenhum elemento table.');
    };

    createTableHeader($table, columnsArray);
    createTableBody($table, dataArray, columnsArray);
};


function createTableHeader(tableReference, columnsArray) {
    function createTheadElement() {
        const thead = document.createElement('thead');
        tableReference.appendChild(thead);
        return thead;
    };

    const tableHeaderReference = tableReference.querySelector('thead') ?? createTheadElement(tableReference);
    const headerRow = document.createElement('tr');
    ['bg-amber-800', 'text-white', 'sticky', 'top-0'].forEach(cssClass => headerRow.classList.add(cssClass));

    for (const tableColumnObject of columnsArray) {
        const headerElement = /*html*/`<th class="text-center">${tableColumnObject.columnLabel}</th>`;
        headerRow.innerHTML += headerElement;
    };

    tableHeaderReference.appendChild(headerRow);
};


function createTableBody(tableReference, tableItems, columnsArray) {
    function createTbodyElement() {
        const tbody = document.createElement('tbody');
        tableReference.appendChild(tbody);
        return tbody;
    };

    const tableBodyReference = tableReference.querySelector('tbody') ?? createTbodyElement(tableReference);

    for(const [itemIndex, tableItem] of tableItems.entries()){
        const tableRow = document.createElement('tr');

        if(itemIndex % 2 !== 0){
            tableRow.classList.add('bg-orange-200');
        }else{
            tableRow.classList.add('bg-orange-50');
        };

        for(const tableColumn of columnsArray){
            const formatFunction = tableColumn.format ?? ((info) => info);
            tableRow.innerHTML += /*html*/ `<td class="text-center">${formatFunction(tableItem[tableColumn.accessor])}</td>`;
        };
        tableBodyReference.appendChild(tableRow);
    };
};