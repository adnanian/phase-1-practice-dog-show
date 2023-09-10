let loadedId = 0;
const URL_PREFIX = 'http://localhost:3000/dogs';

/*
On page load, render a list of already registered dogs in the table. 
You can fetch these dogs from http://localhost:3000/dogs.
*/
function fetchRegisteredDogs() {
    return fetch(URL_PREFIX)
        .then((response) => response.json())
        .then((data) => {
            const tb = document.getElementById('table-body');
            for (const dog of data) {
                tb.appendChild(createTableRow(dog));
            }
        });
}

/*
Iterates through the keys of a given object. Generates a table row
of those key's values, unless the key is an id. Then adds an editable
button. Finally returns the table row.
*/
function createTableRow(object) {
    const tr = document.createElement('tr');
    const keys = [];
    for (const key in object) {
        if (key !== 'id') {
            tr.appendChild(createTableData(object[key]));
            keys.push(key);
        }
    }
    const buttonTD = document.createElement('td');
    const button = document.createElement('button');
    button.textContent = 'Edit Dog';
    button.addEventListener('click', (event) => {
        for (const key of keys) {
            document.getElementsByName(key)[0].value = object[key];
            loadedId = object.id;
        }
    });
    buttonTD.appendChild(button);
    tr.appendChild(buttonTD);
    return tr;
}

// Creates a table cell and returns it.
function createTableData(value) {
    const td = document.createElement('td');
    td.textContent = value;
    return td;
}

function patchDog(dogId) {
    try {
        return fetch(`${URL_PREFIX}/${dogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "name": document.getElementsByName('name')[0].value,
                "breed": document.getElementsByName('breed')[0].value,
                "sex": document.getElementsByName('sex')[0].value
            })
        })
            .then((response) => response.json())
            .then((datum) => {
                const tableRow = Array.from(document.getElementById('table-body').children)[dogId - 1];
                let tableRowArray = Array.from(tableRow.children);
                console.log(tableRow);
                let colIndex = 0;
                for (const key in datum) {
                    if (key !== 'id') {
                        console.log(tableRowArray[colIndex]);
                        tableRowArray[colIndex].textContent = datum[key];
                        colIndex++;
                    }
                }
            });
    } catch (err) {
        console.error(err.message);
        alert(err.message);
    }
}

// Begin running script.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('body').style.backgroundColor = '#444';
    console.log(fetchRegisteredDogs());
    document.getElementById('dog-form').addEventListener('submit', (event) => {
        event.preventDefault();
        console.log(patchDog(loadedId));
    });
})