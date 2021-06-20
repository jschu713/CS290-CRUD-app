// URL we are referencing to contact our server
const baseUrl = `http://flip2.engr.oregonstate.edu:8321/`;

// Deletes entire table from DOM/HTML/display
const deleteTable = () => {
    // Removes the old table when we add additional workouts to the table.
    let tbl = document.getElementById('workout');

    if (tbl) {
        tbl.parentNode.removeChild(tbl);
    }

};

// Makes the table
const makeTable = (allRows) => {
    // Iterate over the rows to add them

    let tableTitle = document.getElementById('table-title');
    let tbl = document.createElement('table');
    tbl.setAttribute('id', 'workout')

    if (allRows.rows.length != 0) {
        tbl.appendChild(makeHeaderRow());
    }

    for (i = 0; i < allRows.rows.length; i++) {

        tbl.appendChild(makeRow(allRows.rows[i]))
    }

    tableTitle.appendChild(tbl);
};

// Makes table header row
const makeHeaderRow = () => {
    // Use data in row to create the table header cells

    let headerRow = document.createElement('tr');

    // Hidden ID header
    let hiddenId = document.createElement('th');
    hiddenId.textContent = "id"
    hiddenId.setAttribute('hidden', true);
    headerRow.appendChild(hiddenId)

    const headings = ["name", "reps", "weight", "unit", "date"]

    headings.forEach(element => {
        let headerCell = document.createElement('th');
        let headerData = element;

        headerCell.textContent = headerData;

        headerRow.appendChild(headerCell);
    });

    // Empty cells to hold the edit and delete buttons
    headerRow.appendChild(document.createElement('th'))
    headerRow.appendChild(document.createElement('th'))

    return headerRow
};

// Makes rows in table
const makeRow = (rowData) => {
    // Use data in row to create the table data cells
    // Make the form that wraps the table data cells

    let newRow = document.createElement('tr')

    newRow.innerHTML = `
                            <td class="id" hidden="true">${rowData.id}</td>
                            <td><input type="text" class="name" name="name" disabled="true" value="${rowData.name}"></td>
                            <td><input type="number" class="reps" name="reps" disabled="true" value="${rowData.reps}"></td>
                            <td><input type="number" class="weight" name="weight" disabled="true" value="${rowData.weight}"></td>

                            ${makeRadio(rowData.unit)}

                            <td><input type="date" class="date" name="date" disabled="true" value="${rowData.date.slice(0, 10)}"></td>

                            <td><button onclick="onEdit(this, event)">Edit</button></td>
                            <td><button onclick="onDelete(this)">Delete</button></td>
                        `
    return newRow

};

// Creates form input
const makeRadio = (value) => {

    // Determines which unit is checked, if any
    let lbChecked = "";
    let kgChecked = "";

    if (value == 0) {
        lbChecked = "checked";
        kgChecked = "";
    }
    else if (value == 1) {
        kgChecked = "checked";
        lbChecked = "";
    }

    let radioResult = `<td><form>
                        <input type="radio" class="unit" name="unit" value="lbs" disabled="true" ${lbChecked}>
                        <label for="lbs">Pounds</label>
                        <input type="radio" class="unit" name="unit" value="kgs" disabled="true" ${kgChecked}>
                        <label for="kgs">Kilograms</label>
                        </form></td>`

    return radioResult

};

// Displays table on page load
const getData = async () => {
    let req = new XMLHttpRequest();

    req.open("GET", baseUrl, true)
    req.setRequestHeader('Content-Type', 'application/json')
    req.addEventListener('load', function () {

        if (req.status >= 200 && req.status < 400) {
            let response = JSON.parse(req.responseText);
            makeTable(response)
        }
        else {
            console.log("Error in network request: " + req.statusText);
        }

    });
    req.send(baseUrl);
};

// Gets value of radio buttons
const displayRadioValue = () => {
    let radioBtnName = document.getElementsByName('unit');
    // Lbs = 0, Kgs = 1, else neither of them are checked.
    for (i = 0; i < radioBtnName.length; i++) {
        if (radioBtnName[i].checked & radioBtnName[i].value == "lbs") {
            return 0
        }
        else if (radioBtnName[i].checked & radioBtnName[i].value == "kgs") {
            return 1
        }
    }
}

// Gets value of radio buttons after editing
const displayRadioValueUpdate = (row) => {
    let radioBtnName = row.querySelectorAll('.unit');

    // Lbs = 0, Kgs = 1, else neither of them are checked.
    for (i = 0; i < radioBtnName.length; i++) {
        if (radioBtnName[i].checked & radioBtnName[i].value == "lbs") {
            return 0
        }
        else if (radioBtnName[i].checked & radioBtnName[i].value == "kgs") {
            return 1
        }
    }
}

// Submit the add form and rebuild the table
document.querySelector('#addForm').onsubmit = async (event) => {
    let req = new XMLHttpRequest();

    // Creates dict of keys, and adds their values from the user input
    let dict = {
        "name": null, "reps": null, "weight": null, "unit": null, "date": null
    }
    dict.name = document.getElementById('name').value;
    dict.reps = document.getElementById('reps').value;
    dict.weight = document.getElementById('weight').value;
    dict.unit = displayRadioValue()
    dict.date = document.getElementById('date').value;

    if (dict.name == "") {
        alert('Please enter a valid name.')
    }

    else {
        // Sends it as JSON
        req.open("POST", baseUrl, true)
        req.setRequestHeader('Content-Type', 'application/json')
        req.addEventListener('load', function () {

            if (req.status >= 200 && req.status < 400) {
                let response = JSON.parse(req.responseText);

                deleteTable();
                makeTable(response);


                // let createdTbl = document.getElementById('workout');
                // createdTbl.appendChild(makeRow(response))
            }
            else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        req.send(JSON.stringify(dict));

    }
    event.preventDefault();
    return false;
};

// Reset table
// document.getElementById('reset-table').onclick = async (event) => {
//     let req = new XMLHttpRequest();

//     req.open("GET", baseUrl, true)
//     req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
//     req.addEventListener('load', function () {
//         if (req.status >= 200 && req.status < 400) {
//             console.log('table is reset')
//         }
//         else {
//             console.log("Error in network request: " + req.statusText);
//         }
//     });
//     req.send(baseUrl);
// };

// // Makes script run everytime page first loads
(async () => {
    let tableData = await getData();
    // makeTable(tableData);
})();

// Allows editing of table data when edit button is clicked
const onEdit = (btn, event) => {
    let req = new XMLHttpRequest();

    let parentRow = btn.parentNode.parentNode
    btn.textContent = "Save"

    let rowId = parentRow.rowIndex

    let hiddenId = parentRow.querySelector('.id').textContent

    let dataRow = parentRow.querySelectorAll('input')

    // Allows editing of data in rows
    for (i = 0; i < dataRow.length; i++) {
        dataRow[i].disabled = false;
    }

    // Sends put/replace request after clicking the save button with the new info entered into the fields.
    event.target.onclick = () => {

        let dict = {
            "name": null, "reps": null, "weight": null, "unit": null, "date": null, "id": null
        }

        dict.name = parentRow.querySelector('.name').value;
        dict.reps = parentRow.querySelector('.reps').value;
        dict.weight = parentRow.querySelector('.weight').value;
        dict.unit = displayRadioValueUpdate(parentRow)
        dict.date = parentRow.querySelector('.date').value;
        dict.id = hiddenId

        if (dict.name == "") {
            alert('Please enter a valid name.')
            return
        }

        // Sends it as JSON
        req.open("PUT", baseUrl, true)
        req.setRequestHeader('Content-Type', 'application/json')
        req.addEventListener('load', function () {

            if (req.status >= 200 && req.status < 400) {
                let response = JSON.parse(req.responseText);

                deleteTable();
                makeTable(response);

            }
            else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        req.send(JSON.stringify(dict));
    }
};

// Deletes row from table and database
const onDelete = (btn) => {
    let req = new XMLHttpRequest();
    let parentRow = btn.parentNode.parentNode

    let rowId = parentRow.rowIndex

    // Deletes the row from the DOM/HTML
    let tbl = document.getElementById('workout')
    tbl.deleteRow(rowId)

    // Deletes header row if there is only 1 row in the table and it is deleted
    if (tbl.rows.length == 1) {
        tbl.deleteRow(0)
    }

    // Deletes data from DB
    let hiddenId = parentRow.querySelector('.id').textContent

    req.open("DELETE", baseUrl + `?id=${hiddenId}`, true)
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    req.addEventListener('load', function () {

        if (req.status >= 200 && req.status < 400) {
            console.log('success')

        }
        else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(baseUrl + `?id=${hiddenId}`);

};
