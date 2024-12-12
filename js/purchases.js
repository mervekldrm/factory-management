// purchases.js

// Function to manage purchase records
function loadPurchasesSection() {
    const purchasesContainer = document.getElementById('purchases-container');

    purchasesContainer.innerHTML = `
        <h3>Log New Purchase</h3>
        <form id="add-purchase-form">
            <label for="purchase-id">Purchase ID:</label>
            <input type="text" id="purchase-id" required>
            <label for="farmer-id">Farmer ID:</label>
            <input type="text" id="farmer-id" required>
            <label for="quantity">Quantity (kg):</label>
            <input type="number" id="quantity" required>
            <label for="price">Price per kg:</label>
            <input type="number" id="price" step="0.01" required>
            <button type="submit">Add Purchase</button>
        </form>
        <h3>Purchases List</h3>
        <ul id="purchases-list"></ul>
    `;

    const addPurchaseForm = document.getElementById('add-purchase-form');
    const purchasesList = document.getElementById('purchases-list');

    // Load existing purchases from local storage
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    updatePurchasesList(purchasesList, purchases);

    // Add purchase form submission handler
    addPurchaseForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const purchaseId = document.getElementById('purchase-id').value;
        const farmerId = document.getElementById('farmer-id').value;
        const quantity = parseFloat(document.getElementById('quantity').value);
        const price = parseFloat(document.getElementById('price').value);

        const totalCost = quantity * price;
        const newPurchase = { purchaseId, farmerId, quantity, price, totalCost };
        purchases.push(newPurchase);

        // Save purchases to local storage
        localStorage.setItem('purchases', JSON.stringify(purchases));

        // Update the list
        updatePurchasesList(purchasesList, purchases);

        // Reset the form
        addPurchaseForm.reset();
    });
}

// Function to update the purchases list in the DOM
function updatePurchasesList(container, purchases) {
    container.innerHTML = '';
    purchases.forEach((purchase) => {
        const listItem = document.createElement('li');
        listItem.textContent = `ID: ${purchase.purchaseId}, Farmer ID: ${purchase.farmerId}, Quantity: ${purchase.quantity}kg, Price: $${purchase.price.toFixed(2)}, Total: $${purchase.totalCost.toFixed(2)}`;
        container.appendChild(listItem);
    });
}

export { loadPurchasesSection };