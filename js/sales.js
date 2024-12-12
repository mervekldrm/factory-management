// sales.js

import { getData, saveData } from './storage-utils.js';

// Function to manage sales
function loadSalesSection() {
    const salesContainer = document.getElementById('sales-container');

    salesContainer.innerHTML = `
        <h3>Log New Sale</h3>
        <form id="add-sale-form">
            <label for="sale-id">Sale ID:</label>
            <input type="text" id="sale-id" required>
            <label for="category">Product Category:</label>
            <input type="text" id="category" required>
            <label for="quantity">Quantity (kg):</label>
            <input type="number" id="quantity" required>
            <label for="price">Unit Price:</label>
            <input type="number" id="price" step="0.01" required>
            <button type="submit">Add Sale</button>
        </form>
        <h3>Sales List</h3>
        <ul id="sales-list"></ul>
    `;

    const addSaleForm = document.getElementById('add-sale-form');
    const salesList = document.getElementById('sales-list');

    // Load existing sales from local storage
    const sales = getData('sales');
    updateSalesList(salesList, sales);

    // Add sale form submission handler
    addSaleForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const saleId = document.getElementById('sale-id').value;
        const category = document.getElementById('category').value;
        const quantity = parseFloat(document.getElementById('quantity').value);
        const price = parseFloat(document.getElementById('price').value);

        const totalPrice = quantity * price;
        const newSale = { saleId, category, quantity, price, totalPrice };
        sales.push(newSale);

        // Save sales to local storage
        saveData('sales', sales);

        // Update the list
        updateSalesList(salesList, sales);

        // Reset the form
        addSaleForm.reset();
    });
}

// Function to update the sales list in the DOM
function updateSalesList(container, sales) {
    container.innerHTML = '';
    sales.forEach((sale) => {
        const listItem = document.createElement('li');
        listItem.textContent = `ID: ${sale.saleId}, Category: ${sale.category}, Quantity: ${sale.quantity}kg, Price: $${sale.price.toFixed(2)}, Total: $${sale.totalPrice.toFixed(2)}`;
        container.appendChild(listItem);
    });
}

export { loadSalesSection };