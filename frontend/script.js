$(document).ready(() => {
    fetchSyllabusData();

    $('.add-row-button').click(() => {
        addEmptyRow();
    });

    $('.save-button').click(() => {
        saveDataToServer();
    });

    $(document).on('click', '.update-button', function () {
        const row = $(this).closest('tr');
        const cells = row.find('td');
        cells.attr('contenteditable', 'true'); // Make cells editable
        row.find('.update-button').hide();
        row.find('.delete-button').hide();
        row.find('.save-button').show();
    });

    $(document).on('click', '.delete-button', function () {
        const row = $(this).closest('tr');
        const moduleId = row.data('moduleId');
        deleteRow(moduleId);
    });

    $(document).on('click', '.save-button', function () {
        const row = $(this).closest('tr');
        const moduleId = row.data('moduleId');
        updateRow(moduleId, row);
    });
});

// ... (rest of your functions, like updateRow, deleteRow, fetchSyllabusData, addEmptyRow, saveDataToServer)


function updateRow(moduleId, row) {
    const cells = row.find('td');
    const updatedData = {
        ModuleNo: parseInt(cells.eq(0).text()),
        ModuleTitle: cells.eq(1).text(),
        Topics: cells.eq(2).text(),
        NoOfLectures: parseInt(cells.eq(3).text())
    };

    $.ajax({
        url: `/api/modules/${moduleId}`, // Change this URL to match your Express route
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(updatedData),
        success: function (response) {
            console.log('Data updated successfully:', response);
            fetchSyllabusData();
        },
        error: function (error) {
            console.error('Error updating data:', error);
        }
    });

    // Restore UI state
    cells.attr('contenteditable', 'false');
    row.find('.save-button').hide();
    row.find('.update-button').show();
    row.find('.delete-button').show();
}

function deleteRow(moduleId) {
    $.ajax({
        url: `/api/modules/${moduleId}`, // Change this URL to match your Express route
        type: 'DELETE',
        success: function () {
            console.log('Data deleted successfully');
            fetchSyllabusData();
        },
        error: function (error) {
            console.error('Error deleting data:', error);
        }
    });
}

// ... (rest of your functions, like fetchSyllabusData, addEmptyRow, saveDataToServer)


function fetchSyllabusData() {
    $.ajax({
        url: '/api/modules', // Change this URL to match your Express route
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            const syllabusData = $('#syllabus-data');
            syllabusData.empty(); // Clear existing table data
            data.forEach(module => {
                const row = `
                    <tr data-module-id="${module._id}">
                        <td>${module.ModuleNo}</td>
                        <td>${module.ModuleTitle}</td>
                        <td>${module.Topics}</td>
                        <td>${module.NoOfLectures}</td>
                        <td class="action-buttons">
                            <button class="btn btn-info update-button">Edit</button>
                            <button class="btn btn-danger delete-button">Delete</button>
                            <button class="btn btn-primary save-button" style="display: none;">Save</button>
                        </td>
                    </tr>
                `;
                syllabusData.append(row);
            });
        
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}


function addEmptyRow() {
    const emptyRow = `
        <tr>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
        </tr>
    `;
    $('#syllabus-data').append(emptyRow);
}

function saveDataToServer() {
    const rows = $('#syllabus-data tr');
    const lastRow = rows.last(); // Get the last added row
    const cells = lastRow.find('td');

    const newData = {
        ModuleNo: parseInt(cells.eq(0).text()),
        ModuleTitle: cells.eq(1).text(),
        Topics: cells.eq(2).text(),
        NoOfLectures: parseInt(cells.eq(3).text())
    };

    $.ajax({
        url: '/api/modules', // Change this URL to match your Express route
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(newData),
        success: function (response) {
            console.log('Data saved successfully:', response);
            fetchSyllabusData(); // Refresh table with updated data
        },
        error: function (error) {
            console.error('Error saving data:', error);
        }
    });
}
