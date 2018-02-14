//globals
var myTable = document.createElement('TABLE');
if (sessionStorage.getItem('id') === null) { sessionStorage.setItem('id', 1); }

//ui setup
paintTableSkeleton();
loadCells();

//add button click event handler
document.getElementsByClassName('add')[0].addEventListener('click', addRow);

//submit button click event handler
document.querySelector('button[type="submit"]').addEventListener('click', function (e) {
    e.preventDefault();

    //load the json into <pre>
    document.querySelector('.debug').innerHTML = sessionStorage.getItem('hhbuilder');
    document.querySelector('.debug').style = "display: block";

    //send it to a fake server
    let request = new XMLHttpRequest();
    request.open('POST', '/', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(sessionStorage.getItem('hhbuilder'));
});

function validateAge() {
    let new_age = parseInt(document.getElementsByName('age')[0].value);
    if (isNaN(new_age) || new_age <= 0) {
        alert('Age should be a number > 0');
        return false;
    }
    return true;
}

function validateRelationship() {
    let new_relationship = document.getElementsByName('rel')[0];
    if (new_relationship.options[new_relationship.selectedIndex].value === '') {
        alert('Relationship is required');
        return false;
    }
    return true;
}

function validationsPassed() {
    return validateAge() && validateRelationship();
}

function paintTableSkeleton() {
    myTable.setAttribute('id', 'myTable');
    myTable.setAttribute('border', '2px');
    let myHeadRow = document.createElement('TR');
    myTable.appendChild(myHeadRow);
    //headers
    let th1 = document.createElement('TH');
    let th2 = document.createElement('TH');
    let th3 = document.createElement('TH');
    let th4 = document.createElement('TH');
    //header values
    th1.innerHTML = 'Age';
    th2.innerHTML = 'Relationship';
    th3.innerHTML = 'Smoker';
    th4.innerHTML = 'Action';

    myHeadRow.appendChild(th1);
    myHeadRow.appendChild(th2);
    myHeadRow.appendChild(th3);
    myHeadRow.appendChild(th4);

    document.getElementsByClassName('builder')[0].appendChild(myTable);
}

function loadCells() {
    let x = JSON.parse(sessionStorage.getItem('hhbuilder'));
    if (x != null && x.persons != null) {
        for (let i = 0; i < x.persons.length; i++) {
            let myDataRow = document.createElement('TR');

            //data cells
            let age = document.createElement('TD');
            let relationship = document.createElement('TD');
            let smoker = document.createElement('TD');
            let action = document.createElement('TD');
            //new cell values
            age.innerHTML = x.persons[i].age;
            relationship.innerHTML = x.persons[i].relationship;
            smoker.innerHTML = x.persons[i].smoker;

            //remove button
            let removeButton = document.createElement('input');
            removeButton.setAttribute('id', x.persons[i].id);
            removeButton.setAttribute('type', 'button');
            removeButton.setAttribute('value', 'Remove');
            removeButton.setAttribute('onclick', 'remove(this);');

            action.appendChild(removeButton);

            myDataRow.appendChild(age);
            myDataRow.appendChild(relationship);
            myDataRow.appendChild(smoker);
            myDataRow.appendChild(action);

            myTable.appendChild(myDataRow);
        }
    }
}

function addRow() {
    //in case of add after submit, need to hide the <pre> first
    document.querySelector('.debug').style = "display: none";

    let id = sessionStorage.getItem('id');
    if (validationsPassed()) {
        let x = JSON.parse(sessionStorage.getItem('hhbuilder'));
        if (x === null || x.persons.length == 0) {
            sessionStorage.setItem('hhbuilder', JSON.stringify({
                "persons": [
                    {
                        "id": id++,
                        "age": parseInt(document.getElementsByName('age')[0].value),
                        "relationship": document.getElementsByName('rel')[0].options[document.getElementsByName('rel')[0].selectedIndex].value,
                        "smoker": document.getElementsByName('smoker')[0].checked
                    }
                ]
            }, null, 2));

        } else {
            let y = JSON.parse(sessionStorage.getItem('hhbuilder'));
            let obj = {
                "id": id++,
                "age": parseInt(document.getElementsByName('age')[0].value),
                "relationship": document.getElementsByName('rel')[0].options[document.getElementsByName('rel')[0].selectedIndex].value,
                "smoker": document.getElementsByName('smoker')[0].checked
            };
            y.persons.push(obj);
            sessionStorage.setItem('hhbuilder', JSON.stringify(y, null, 2));
        }
    }
    sessionStorage.setItem('id', id);
}

function remove(button) {
    //in case of remove after submit, hide the <pre>
    document.querySelector('.debug').style = "display: none";

    //remove from ui
    var row = button.parentNode.parentNode;
    var table = document.getElementById('myTable');
    table.deleteRow(row.rowIndex);
    //remove from 'backend'
    let z = JSON.parse(sessionStorage.getItem('hhbuilder'));
    let i;
    for (i = 0; i < z.persons.length; i++) {
        if (z.persons[i].id == button.id) { z.persons.splice(i, 1); }
    }
    sessionStorage.setItem('hhbuilder', JSON.stringify(z, null, 2));
}
