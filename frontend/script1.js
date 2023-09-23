window.onload = function() {
    alert('Welcome to the next page!');
};

$(document).ready(() => {
    fetchT1attainmentData();
    fetchcdData();

    $(document).on('input', '.q-input', function () {
        const row = $(this).closest('tr');
        calculateAttainment1ForRow(row);
    });

    $('.add-row-buttonat').click(() => {
        addEmptyRow3();
    });

    $('.save-buttonat').click(() => {
        saveDataToServer3();
    });

    $(document).on('click', '.update-buttonat', function() {
        const row = $(this).closest('tr');
        const cells = row.find('td');
        cells.attr('contenteditable', 'true'); // Make cells editable
        row.find('.update-buttonat').hide();
        row.find('.delete-buttonat').hide();
        row.find('.save-buttonatu').show();
    });

    $(document).on('click', '.save-buttonatu', function() {
        const row = $(this).closest('tr');
        const moduleId = row.data('recordId');
        updateRowat(moduleId, row);
    });

    $(document).on('click', '.delete-buttonat', function() {
        const row = $(this).closest('tr');
        const moduleId = row.data('recordId');
        deleteRowat(moduleId);
    });
});

// ... (rest of your functions, like updateRow, deleteRow, fetchSyllabusData, addEmptyRow, saveDataToServer)

function updateRowat(recordId, row) {
    const cells = row.find('td');
    const updatedData = {
        ModuleNo: parseInt(cells.eq(0).text()),
        RollNo: parseInt(cells.eq(1).text()),
        Name: cells.eq(2).text(),
        Batch: cells.eq(3).text(),
        Q1: parseFloat(cells.eq(4).text()), // Assuming Q1 is a floating-point number
        Q2: parseFloat(cells.eq(5).text()), // Assuming Q2 is a floating-point number
        Q3: parseFloat(cells.eq(6).text()), // Assuming Q3 is a floating-point number
        Q4: parseFloat(cells.eq(7).text()), // Assuming Q4 is a floating-point number
        Q5: parseFloat(cells.eq(8).text()), // Assuming Q5 is a floating-point number
        Q6: parseFloat(cells.eq(9).text()), // Assuming Q6 is a floating-point number
        Total: parseFloat(cells.eq(10).text()),
        Attainment1: parseFloat(cells.eq(11).text()),
        Attainment2:parseFloat(cells.eq(11).text())
    };

    $.ajax({
        url: `/api/t1attainment/${recordId}`, // Update the URL to match your Express route for T1attainment data
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(updatedData),
        success: function(response) {
            console.log('Data updated successfully:', response);
            fetchT1attainmentData();
            row.find('.q-input').trigger('input');
        },
        error: function(error) {
            console.error('Error updating data:', error);
        }
    });

    // Restore UI state
    cells.attr('contenteditable', 'false');
    row.find('.save-buttonuat').hide();
    row.find('.update-buttonat').show();
    row.find('.delete-buttonat').show();
}


function calculateAttainment1ForRow(row) {
    const cells = row.find('td');
    const q1 = parseFloat(cells.eq(4).text()) || 0;
    const q2 = parseFloat(cells.eq(5).text()) || 0;
    const q3 = parseFloat(cells.eq(6).text()) || 0;
    const q4 = parseFloat(cells.eq(7).text()) || 0;
    const q5 = parseFloat(cells.eq(8).text()) || 0;
    const q6 = parseFloat(cells.eq(9).text()) || 0;
    
    const total = q1 + q2 + q3 + q4 + q5 + q6;
    
    cells.eq(10).text(total.toFixed(2));
    const at1=q1 + q2 + q3;
    const at2=q4 + q5 + q6;
    const attainment1 = (at1 / 11 * 100).toFixed(1); 
    const attainment2 = (at2 / 9 * 100).toFixed(1); 

    cells.eq(11).text(attainment1);
    cells.eq(12).text(attainment2);

}
function deleteRowat(moduleId) {
    $.ajax({
        url: `/api/t1attainment/${moduleId}`, // Change this URL to match your Express route
        type: 'DELETE',
        success: function() {
            console.log('Data deleted successfully');
            fetchT1attainmentData();
        },
        error: function(error) {
            console.error('Error deleting data:', error);
        }
    });
}


function fetchT1attainmentData() {
    $.ajax({
        url: '/api/t1attainment', // Update the URL to match your Express route for T1attainment data
        type: 'GET',
        dataType: 'json',

        success: function(data) {
            const attainmentData = $('#attainment-data');
            attainmentData.empty();
            let totalQ1 = 0;
            let totalQ2 = 0;
            let totalQ3 = 0;
            let totalQ4 = 0;
            let totalQ5 = 0;
            let totalQ6 = 0;

            data.forEach(record => {
                const row = `
                    <tr data-record-id="${record._id}">
                        <td>${record.ModuleNo}</td>
                        <td>${record.RollNo}</td>
                        <td>${record.Name}</td>
                        <td>${record.Batch}</td>
                        <td>${record.Q1}</td>
                        <td>${record.Q2}</td>+
                        <td>${record.Q3}</td>
                        <td>${record.Q4}</td>
                        <td>${record.Q5}</td>
                        <td>${record.Q6}</td>
                        <td>${record.Total}</td>
                        <td>${record.Attainment1}</td>
                        <td>${record.Attainment2}</td>
                        <td class="action-buttons">
                            <button class="btn btn-info update-buttonat">Edit</button>
                            <button class="btn btn-danger delete-buttonat">Delete</button>
                            <button class="btn btn-primary save-buttonatu" style="display: none;">Save</button>
                        </td>
                    </tr>
                `;
                attainmentData.append(row);

                // Calculate totals for Q1 to Q6
                totalQ1 += record.Q1;
                totalQ2 += record.Q2;
                totalQ3 += record.Q3;
                totalQ4 += record.Q4;
                totalQ5 += record.Q5;
                totalQ6 += record.Q6;
            });
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
    });
}


function fetchcdData() {
    $.ajax({
        url: '/api/cd', // Change this URL to match your Express route
        type: 'GET',
        dataType: 'json',
        
        success: function (data) {
            data.forEach(module => {
                $('#co_code').text(module.co_code);
                $('#sem').text(module.sem);
                $('#co_name').text(module.co_name);
                $('#credits').text(module.credits);
                $('#contact_hours').text(module.contact_hours);
                $('#coordinators').text(module.coordinators);
                $('#teacher').text(module.teachers);
            });
        },
        error: function (error) {
            console.error('Error fetching data:', error);
        }
    });
}

let newModuleNo1 = 0;

function addEmptyRow3() {

    const rows = $('#attainment-data tr');
    const lastRow = rows.last(); // Get the last row
    const cells = lastRow.find('td');
    const lastModuleNo = parseInt(rows.eq(rows.length - 2).find('td').eq(0).text()) || 0;
    newModuleNo1 = lastModuleNo;
    const newModuleNo = lastModuleNo + 1;

    console.log('Last Module No:', lastModuleNo);
    console.log('New Module No:', newModuleNo);

    cells.eq(0).text(newModuleNo);

    const emptyRow = `
        <tr>
            <td contenteditable="false">${newModuleNo}</td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
            <td contenteditable="true" class="q-input"></td>
            <td contenteditable="true" class="q-input"></td>
            <td contenteditable="true" class="q-input"></td>
            <td contenteditable="true" class="q-input"></td>
            <td contenteditable="true" class="q-input"></td>
            <td contenteditable="true" class="q-input"></td>
            <td class="total"></td>
            <td  class="attainment1"></td>
            <td class="attainment2"></td>
           
        </tr>
    `;
    $('#attainment-data').append(emptyRow);

}

function saveDataToServer3() {

        const rows = $('#attainment-data tr');
        const lastRow = rows.last(); // Get the last added row
        const cells = lastRow.find('td');
        const lastModuleNo = parseInt(rows.eq(rows.length - 2).find('td').eq(0).text()) || 0; // Get the last Module No. or 0 if none exists
        const newModuleNo = lastModuleNo + 1;

        cells.eq(0).text(newModuleNo);
        var newdata;

        if(cells.eq(1).text()!=="A"){

            newData = {
            ModuleNo: newModuleNo,
            RollNo: cells.eq(1).text(),
            Name: cells.eq(2).text(),
            Batch: cells.eq(3).text(),
            Q1: parseFloat(cells.eq(4).text()), // Assuming Q1 is a floating-point number
            Q2: parseFloat(cells.eq(5).text()), // Assuming Q2 is a floating-point number
            Q3: parseFloat(cells.eq(6).text()), // Assuming Q3 is a floating-point number
            Q4: parseFloat(cells.eq(7).text()), // Assuming Q4 is a floating-point number
            Q5: parseFloat(cells.eq(8).text()), // Assuming Q5 is a floating-point number
            Q6: parseFloat(cells.eq(9).text()),
            Total:parseFloat(cells.eq(10).text()),
            Attainment1:parseFloat(cells.eq(11).text()),
            Attainment2:parseFloat(cells.eq(12).text())


         };}
         else{
            newData = {
            ModuleNo: newModuleNo,
            RollNo: cells.eq(1).text(),
            Name: cells.eq(2).text(),
            Batch: cells.eq(3).text(),
            Q1: cells.eq(4).text(), // Assuming Q1 is a floating-point number
            Q2: cells.eq(5).text(), // Assuming Q2 is a floating-point number
            Q3: cells.eq(6).text(), // Assuming Q3 is a floating-point number
            Q4: cells.eq(7).text(), // Assuming Q4 is a floating-point number
            Q5: cells.eq(8).text(), // Assuming Q5 is a floating-point number
            Q6: cells.eq(9).text(),
            Total:cells.eq(10).text(),
            Attainment1:parseFloat(cells.eq(11).text()),
            Attainment2:parseFloat(cells.eq(12).text())


         };

         }

        $.ajax({
            url: '/api/t1attainment', // Update the URL to match your Express route for T1attainment data
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(newData),
            success: function(response) {
                console.log('Data saved successfully:', response);
                fetchT1attainmentData(); // Refresh table with updated data
            },
            error: function(xhr, status, error) {
                console.error('Error saving data:', error);
                console.log('Status:', status);
                console.log('Response:', xhr.responseText);
            }
        });
}