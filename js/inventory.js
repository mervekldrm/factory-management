// js/inventory.js

let inventory = {
    small: 0,
    medium: 0,
    large: 0,
    extraLarge: 0,
    familyPack: 0,
    bulkPack: 0,
    premium: 0
};

function updateInventory(category, quantity) {
    inventory[category] += quantity;
    updateInventoryTable();
}

function updateInventoryTable() {
    document.getElementById('smallStock').textContent = inventory.small;
    document.getElementById('mediumStock').textContent = inventory.medium;
    document.getElementById('largeStock').textContent = inventory.large;
    document.getElementById('extraLargeStock').textContent = inventory.extraLarge;
    document.getElementById('familyPackStock').textContent = inventory.familyPack;
    document.getElementById('bulkPackStock').textContent = inventory.bulkPack;
    document.getElementById('premiumStock').textContent = inventory.premium;
}

// js/sales.js
let sales = [];

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
function checkInventoryLevels() {
    Object.keys(inventory).forEach(category => {
        if (inventory[category] < 10) { // Example threshold
            alert(`${category} stock is running low. Please restock.`);
        }
    });
}

