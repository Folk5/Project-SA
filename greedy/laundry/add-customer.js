function getCustomersFromLocalStorage() {
    var existingData = localStorage.getItem('customers');
    return existingData ? JSON.parse(existingData) : [];
}

// Fungsi untuk menyimpan data pelanggan ke localStorage
function setCustomersToLocalStorage(customers) {
    localStorage.setItem('customers', JSON.stringify(customers));
}

// Fungsi untuk menambahkan detail item ke dalam array details
function addItemDetails(category, quantity, weight, time, profit, details) {
    // Algoritma Greedy: Setiap kali menambahkan detail item, jumlah profit dari item tersebut dikalikan dengan kuantitas untuk mendapatkan total profit dari item tersebut.
    if (category && quantity && weight) {
        details.push({
            category: category,
            quantity: quantity,
            weight: weight * quantity, 
            time: time * quantity,     
            profit: profit * quantity  
        });
    }
}

// Fungsi untuk menangani penyerahan formulir untuk menambahkan data pelanggan baru
function handleFormSubmission(event) {
    event.preventDefault();
    var name = $('input[placeholder="Name"]').val();
    var address = $('input[placeholder="Address"]').val();
    var phone = $('input[placeholder="Phone Number"]').val();
    var details = [];

    var items = [
        { category: "Sprei", weight: 1.5, time: 30, profit: 15 },
        { category: "Kemeja", weight: 0.35, time: 5, profit: 7 },
        { category: "Kaos", weight: 0.25, time: 4, profit: 5 },
        { category: "Celana Panjang", weight: 0.3, time: 5, profit: 6 },
        { category: "Celana Pendek", weight: 0.3, time: 5, profit: 3 },
        { category: "Jogger", weight: 0.3, time: 5, profit: 4 },
        { category: "Sweater", weight: 0.5, time: 5, profit: 8 },
    ];

    $('.item').each(function(index) {
        var category = $(this).val(); 
        var quantity = $(this).siblings('.quantity').val();
        var item = items.find(i => i.category === category);
        if (item && category.trim() !== '' && quantity.trim() !== '') {
            addItemDetails(category, parseInt(quantity), item.weight, item.time, item.profit, details);
        }
    });

    var customer = {
        name: name,
        address: address,
        phone: phone,
        details: details,
        id: new Date().toISOString(),
    };

    var customers = getCustomersFromLocalStorage();
    customers.push(customer);
    setCustomersToLocalStorage(customers);
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Customer data added successfully.'
    });

    $('form')[0].reset();
}

$(document).ready(function () {
    var form = $('form');
    form.submit(handleFormSubmission);
});
