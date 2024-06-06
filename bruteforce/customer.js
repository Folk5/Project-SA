$(document).ready(function () {
    var existingData = localStorage.getItem('customers');
    var customers = existingData ? JSON.parse(existingData) : [];
    var tbody = $('#customerBody');
    var activeRow = null;
    let valueGreedy = 0;
    let isGreedy = false;
    const inputGreedy = document.getElementById("maxBerat");
    const resetGreedy = document.getElementById("resetGreedy");
    const formGreedy = document.getElementById("formGreedy");

    const setTableToLocalStorage = (value) => {
        localStorage.setItem('customers', JSON.stringify(value));
    }

    inputGreedy.addEventListener("input", function () {
        valueGreedy = this.value;
    });

    resetGreedy.addEventListener("click", function () {
        isGreedy = false;
        valueGreedy = 0;
        inputGreedy.value = 0;
        customers = JSON.parse(localStorage.getItem('customers'));
        renderTable(customers);
    });

    formGreedy.addEventListener("submit", function (event) {
        event.preventDefault();
        isGreedy = true;

        // Start time
        const startTime = performance.now();

        const filter = filterBruteforce(JSON.parse(localStorage.getItem('customers'))).map(cust => ({
            ...cust,
            isDone: true
        }));
        const filteredCustomers = JSON.parse(localStorage.getItem('customers')).map((val) => {
            if (filter.some(({ id }) => id === val.id)) {
                return {
                    ...val,
                    isDone: true
                }
            } else {
                return val;
            }
        });

        // End time
        const endTime = performance.now();

        // Calculate execution time
        const executionTime = endTime - startTime;
        console.log(`Execution time: ${executionTime} milliseconds`);

        // Display execution time
        alert(`Execution time: ${executionTime.toFixed(2)} milliseconds`);

        setTableToLocalStorage(filteredCustomers);
        renderTable(filteredCustomers);
    });

    function filterBruteforce(customers) {
        function totalProfit(customer) {
            return customer.details.reduce(function (sum, detail) {
                return sum + parseFloat(detail.profit);
            }, 0);
        }

        function totalWeight(customer) {
            return customer.details.reduce(function (sum, detail) {
                return sum + parseFloat(detail.weight);
            }, 0);
        }

        function getAllSubsets(array) {
            return array.reduce((subsets, value) => subsets.concat(subsets.map(set => [value, ...set])), [[]]);
        }

        const allSubsets = getAllSubsets(customers);
        let maxProfit = 0;
        let bestSubset = [];

        for (const subset of allSubsets) {
            const totalBerat = subset.reduce((sum, customer) => sum + totalWeight(customer), 0);
            const totalProfitSubset = subset.reduce((sum, customer) => sum + totalProfit(customer), 0);

            if (totalBerat <= valueGreedy && totalProfitSubset > maxProfit) {
                maxProfit = totalProfitSubset;
                bestSubset = subset;
            }
        }

        return bestSubset;
    }

    function hideAllDetailsExcept(clickedRow) {
        $('.customer-details').each(function () {
            if ($(this).prev().get(0) !== clickedRow.get(0)) {
                $(this).remove();
            }
        });
    }

    function calculateAndSortCustomers(customers) {
        customers.forEach(function (customer) {
            customer.totalProfit = customer.details.reduce(function (sum, detail) {
                return sum + parseFloat(detail.profit);
            }, 0);
        });

        customers.sort(function (a, b) {
            return b.totalProfit - a.totalProfit;
        });

        return customers;
    }
    customers = calculateAndSortCustomers(customers);
    renderTable(customers);

    function renderTable(customers) {
        tbody.html('');
        $.each(customers, function (index, customer) {
            var row = $('<tr class="text-center"></tr>');
            var totalQuantity = 0;
            var totalWeight = 0;
            var totalTime = 0;
            var totalProfit = 0;

            for (var i = 0; i < customer.details.length; i++) {
                totalQuantity += parseInt(customer.details[i].quantity);
                totalWeight += parseFloat(customer.details[i].weight);
                totalTime += parseFloat(customer.details[i].time);
                totalProfit += parseFloat(customer.details[i].profit);
            }

            row.append('<td class="py-2 px-4">' + customer.name + '</td>');
            row.append('<td class="py-2 px-4">' + customer.phone + '</td>');
            row.append('<td class="py-2 px-4">' + totalQuantity + '</td>');
            row.append('<td class="py-2 px-4">' + totalWeight.toFixed(2) + ' Kg' + '</td>');
            row.append('<td class="py-2 px-4">' + totalTime + ' Min' + '</td>');
            row.append('<td class="py-2 px-4">' + totalProfit + '</td>');
            row.append('<td class="py-2 px-4">' + (customer.isDone ? "<i class='fas fa-check text-green-500'>" : "") + '</td>');
            row.append('<td class="py-2 px-4">' + `<div class="flex justify-center gap-4"><button class="delete-btn bg-transparent border-none"><i class="fas fa-trash text-red-500"></i></button> ${customer.isDone ? '' : '<button class="complete-btn bg-transparent border-none"><i class="fas fa-check text-green-500"></i></button>'}</div>` + '</td>');

            row.click(function () {
                var clickedRow = $(this);
                if (activeRow && activeRow.get(0) !== clickedRow.get(0)) {
                    activeRow.removeClass('bg-[#F87024]');
                }
                clickedRow.toggleClass('bg-[#F87024]');
                hideAllDetailsExcept(clickedRow);

                if (clickedRow.next().hasClass('customer-details')) {
                    clickedRow.next().remove();
                } else {
                    var detailsDiv = $('<div class="bg-[#FCAB96] w-full text-center p-4"></div>');
                    detailsDiv.append('<p class="col-span-6"><strong>Name:</strong> ' + customer.name + '</p>');
                    detailsDiv.append('<p><strong>Address:</strong> ' + customer.address + '</p>');
                    detailsDiv.append('<p><strong>Phone:</strong> ' + customer.phone + '</p>');
                    var table = $('<table class="w-full border-collapse"></table>');
                    var thead = $('<thead></thead>');
                    var tr = $('<tr class="w-full"></tr>');
                    tr.append('<th class="py-2 px-4 rounded-l-[20px]">Category</th>');
                    tr.append('<th class="py-2 px-4">Quantity</th>');
                    tr.append('<th class="py-2 px-4">Weight</th>');
                    tr.append('<th class="py-2 px-4">Time (min)</th>');
                    tr.append('<th class="py-2 px-4 rounded-r-[20px]">Profit</th>');
                    thead.append(tr);
                    var tbody = $('<tbody class="w-full"></tbody>');
                    $.each(customer.details, function (index, detail) {
                        var tr = $('<tr></tr>');
                        tr.append('<td class="py-2 px-4">' + detail.category + '</td>');
                        tr.append('<td class="py-2 px-4">' + detail.quantity + '</td>');
                        tr.append('<td class="py-2 px-4">' + detail.weight.toFixed(2) + ' Kg' + '</td>');
                        tr.append('<td class="py-2 px-4">' + detail.time + '</td>');
                        tr.append('<td class="py-2 px-4">' + detail.profit + '</td>');
                        tbody.append(tr);
                    });
                    table.append(thead);
                    table.append(tbody);
                    detailsDiv.append(table);
                    clickedRow.after('<tr class="customer-details"><td colspan="7"></td></tr>').next().find('td').append(detailsDiv);
                }
                activeRow = clickedRow.hasClass('bg-[#F87024]') ? clickedRow : null;
            });

            row.find('.delete-btn').click(function () {
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'You will not be able to recover this customer data!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        customers.splice(index, 1);
                        localStorage.setItem('customers', JSON.stringify(customers));
                        $(this).closest('tr').remove();
                        Swal.fire(
                            'Deleted!',
                            'Customer data has been deleted.',
                            'success'
                        );
                    }
                });
            });

            row.find('.complete-btn').click(function () {
                customers[index].isDone = true;
                localStorage.setItem('customers', JSON.stringify(customers));
                $(this).closest('tr').html(
                    `<td class="py-2 px-4">${customers[index].name}</td>
                        <td class="py-2 px-4">${customers[index].phone}</td>
                        <td class="py-2 px-4">${totalQuantity}</td>
                        <td class="py-2 px-4">${totalWeight.toFixed(2)} Kg</td>
                        <td class="py-2 px-4">${totalTime} Min</td>
                        <td class="py-2 px-4">${totalProfit}</td>
                        <td class="py-2 px-4">${customers[index].isDone ? "<i class='fas fa-check text-green-500'>" : ""}</td>
                        <td class="py-2 px-4">
                            <div class="flex justify-center gap-4">
                                <button class="delete-btn bg-transparent border-none"><i class="fas fa-trash text-red-500"></i></button>
                                ${customers[index].isDone ? '' : '<button class="complete-btn bg-transparent border-none"><i class="fas fa-check text-green-500"></i></button>'}
                            </div>
                        </td>`
                );
                Swal.fire(
                    'Completed!',
                    'Customer data has been completed.',
                    'success'
                );
            });

            tbody.append(row);
        });
    }
});

function searchByName() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("customerTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
