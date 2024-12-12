// js/sales.js
import { saveToLocalStorage, loadFromLocalStorage } from './storage-utils.js';

let sales = [];

function saveSalesToLocalStorage() {
    saveToLocalStorage("sales", sales);
}

function loadSalesFromLocalStorage() {
    sales = loadFromLocalStorage("sales");
    updateSalesTable();
}


function addSale(customerId, category, quantity, totalPrice, status) {
    const sale = {
        id: sales.length + 1,
        customerId,
        category,
        quantity,
        totalPrice,
        status
    };
    sales.push(sale);
    updateSalesTable();
    updateInventory(category, -quantity);
    updateRevenue(totalPrice);
    saveSalesToLocalStorage(); // Save to LocalStorage
}

function updateSalesTable() {
    const tableBody = document.getElementById('salesTableBody');
    tableBody.innerHTML = sales.map(sale => `
        <tr>
            <td>${sale.id}</td>
            <td>Customer ${sale.customerId}</td>
            <td>${sale.category}</td>
            <td>${sale.quantity}</td>
            <td>$${sale.totalPrice.toFixed(2)}</td>
            <td>${sale.status}</td>
        </tr>
    `).join('');
}

function openNewSaleModal() {
    const modalContent = `
        <h2>Create New Sale</h2>
        <form id="newSaleForm">
            <input type="number" id="saleCustomerId" placeholder="Customer ID" required>
            <select id="saleCategory" required>
                <option value="">Select Category</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extraLarge">Extra Large</option>
                <option value="familyPack">Family Pack</option>
                <option value="bulkPack">Bulk Pack</option>
                <option value="premium">Premium</option>
            </select>
            <input type="number" id="saleQuantity" placeholder="Quantity" required>
            <input type="number" id="saleTotalPrice" placeholder="Total Price" required>
            <select id="saleStatus" required>
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="processed">Processed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
            </select>
            <button type="submit">Create Sale</button>
        </form>
    `;
    
    openModal(modalContent);
    
    document.getElementById('newSaleForm').onsubmit = function(e) {
        e.preventDefault();
        const customerId = parseInt(document.getElementById('saleCustomerId').value);
        const category = document.getElementById('saleCategory').value;
        const quantity = parseInt(document.getElementById('saleQuantity').value);
        const totalPrice = parseFloat(document.getElementById('saleTotalPrice').value);
        const status = document.getElementById('saleStatus').value;
        
        addSale(customerId, category, quantity, totalPrice, status);
        closeModal();
    };
}