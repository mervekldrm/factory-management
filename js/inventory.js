// inventory.js

// Function to manage inventory
function loadInventorySection() {
    const inventoryContainer = document.getElementById('inventory-container');

    inventoryContainer.innerHTML = `
        <h3>Inventory Management</h3>
        <ul id="inventory-list"></ul>
    `;

    const inventoryList = document.getElementById('inventory-list');

    // Load inventory data from local storage
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    updateInventoryList(inventoryList, inventory);
}

// Function to update inventory based on purchases or sales
function updateInventory(item, quantityChange) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    const existingItem = inventory.find((i) => i.item === item);
    if (existingItem) {
        existingItem.quantity += quantityChange;
    } else {
        inventory.push({ item, quantity: quantityChange });
    }

    // Save updated inventory to local storage
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Function to update the inventory list in the DOM
function updateInventoryList(container, inventory) {
    container.innerHTML = '';
    inventory.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.item}: ${item.quantity}kg`;
        container.appendChild(listItem);
    });
}

export { loadInventorySection, updateInventory };