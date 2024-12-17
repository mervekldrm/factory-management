// inventory.js
import { getData, saveData } from './storage-utils.js';

function loadInventorySection() {
    const inventoryContainer = document.getElementById('inventory-container');

    inventoryContainer.innerHTML = `
        <h3>Inventory Management</h3>
        
        <form id="add-inventory-form">
            <label for="item-category">Category:</label>
            <select id="item-category" required>
                <option value="" disabled selected>Select Category</option>
                <option value="Small (100g)">Small (100g)</option>
                <option value="Medium (250g)">Medium (250g)</option>
                <option value="Large (500g)">Large (500g)</option>
                <option value="Extra Large (1kg)">Extra Large (1kg)</option>
                <option value="Family Pack (2kg)">Family Pack (2kg)</option>
                <option value="Bulk Pack (5kg)">Bulk Pack (5kg)</option>
                <option value="Premium (Custom)">Premium (Custom)</option>
            </select>

            <label for="quantity-available">Quantity Available (kg):</label>
            <input type="number" id="quantity-available" step="0.1" required>

            <label for="reorder-level">Reorder Level (kg):</label>
            <input type="number" id="reorder-level" step="0.1" required>

            <label for="storage-location">Storage Location:</label>
            <input type="text" id="storage-location" required>

            <button type="submit">Add/Update Inventory</button>
        </form>

        <div id="inventory-alerts" class="alerts"></div>

        <h4>Current Inventory</h4>
        <table id="inventory-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Quantity Available</th>
                    <th>Reorder Level</th>
                    <th>Storage Location</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="inventory-list"></tbody>
        </table>
    `;

    const addInventoryForm = document.getElementById('add-inventory-form');
    const inventoryList = document.getElementById('inventory-list');
    const inventoryAlerts = document.getElementById('inventory-alerts');

    // Load existing inventory
    let inventory = getData('inventory') || [];

    // Render initial inventory
    updateInventoryList(inventoryList, inventoryAlerts, inventory);

    // Form submission handler
    addInventoryForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const category = document.getElementById('item-category').value;
        const quantityAvailable = parseFloat(document.getElementById('quantity-available').value);
        const reorderLevel = parseFloat(document.getElementById('reorder-level').value);
        const storageLocation = document.getElementById('storage-location').value;

        // Check if category already exists
        const existingItemIndex = inventory.findIndex(item => item.category === category);

        if (existingItemIndex !== -1) {
            // Update existing inventory item
            inventory[existingItemIndex] = {
                category,
                quantityAvailable,
                reorderLevel,
                storageLocation
            };
        } else {
            // Add new inventory item
            inventory.push({
                category,
                quantityAvailable,
                reorderLevel,
                storageLocation
            });
        }

        // Save to local storage
        saveData('inventory', inventory);

        // Update inventory list
        updateInventoryList(inventoryList, inventoryAlerts, inventory);

        // Reset form
        addInventoryForm.reset();
    });

    // Add click event listener to inventory list for editing
    inventoryList.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        if (!row) return;

        const category = row.cells[0].textContent;
        const inventoryItem = inventory.find(item => item.category === category);

        if (inventoryItem) {
            document.getElementById('item-category').value = inventoryItem.category;
            document.getElementById('quantity-available').value = inventoryItem.quantityAvailable;
            document.getElementById('reorder-level').value = inventoryItem.reorderLevel;
            document.getElementById('storage-location').value = inventoryItem.storageLocation;
        }
    });
}

function updateInventoryList(listContainer, alertsContainer, inventory) {
    // Clear existing list and alerts
    listContainer.innerHTML = '';
    alertsContainer.innerHTML = '';

    // Render inventory items
    inventory.forEach(item => {
        const row = document.createElement('tr');
        
        // Determine status
        const status = item.quantityAvailable <= item.reorderLevel ? 'Low Stock' : 'Sufficient';
        const statusClass = status === 'Low Stock' ? 'low-stock' : 'sufficient-stock';

        row.innerHTML = `
            <td>${item.category}</td>
            <td>${(item.quantityAvailable || 0).toFixed(2)} kg</td>
            <td>${(item.reorderLevel || 0).toFixed(2)} kg</td>
            <td>${item.storageLocation}</td>
            <td class="${statusClass}">${status}</td>
        `;

        listContainer.appendChild(row);

        // Generate alerts for low stock
        if (status === 'Low Stock') {
            const alert = document.createElement('div');
            alert.classList.add('alert', 'alert-warning');
            alert.textContent = `Low Stock Alert: ${item.category} is below reorder level!`;
            alertsContainer.appendChild(alert);
        }
    });
}

// Demand Forecasting (Basic Implementation)
function forecastDemand(inventory, salesHistory) {
    const demandForecasts = {};

    inventory.forEach(item => {
        // Simple average calculation based on recent sales
        const categorySales = salesHistory.filter(sale => sale.category === item.category);
        const averageSales = categorySales.length > 0 
            ? categorySales.reduce((sum, sale) => sum + sale.quantity, 0) / categorySales.length
            : 0;

        demandForecasts[item.category] = {
            averageSales,
            recommendedRestock: averageSales * 1.2 // 20% buffer
        };
    });

    return demandForecasts;
}

export { loadInventorySection, forecastDemand };