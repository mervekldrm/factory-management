import { getData, saveData } from './storage-utils.js';

// Function to manage purchase records
function loadPurchasesSection() {
    const purchasesContainer = document.getElementById('purchases-container');

    purchasesContainer.innerHTML = `
        <h3>Log New Purchase</h3>
        <form id="add-purchase-form">
            <label for="farmer-id">Farmer ID:</label>
            <select id="farmer-id" required>
                <option value="" disabled selected>Select a Farmer</option>
            </select>
            
            <label for="purchase-date">Date of Purchase:</label>
            <input type="date" id="purchase-date" required>
            
            <label for="quantity">Quantity (kg):</label>
            <input type="number" id="quantity" min="1" required>
            
            <label for="price">Price per kg:</label>
            <input type="number" id="price" step="0.01" min="1" required>
            
            <button type="submit">Add Purchase</button>
        </form>
        
        <div>
            <label for="filter-farmer-id">Filter by Farmer ID:</label>
            <select id="filter-farmer-id">
                <option value="" selected>All Farmers</option>
            </select>
            
            <label for="filter-date">Filter by Date:</label>
            <input type="date" id="filter-date">
            
            <button id="filter-button">Filter</button>
        </div>
        
        <h3>Purchases List</h3>
        <ul id="purchases-list"></ul>
    `;

    const addPurchaseForm = document.getElementById('add-purchase-form');
    const filterButton = document.getElementById('filter-button');
    const purchasesList = document.getElementById('purchases-list');

    // Load existing purchases and farmers from local storage
    let purchases = getData('purchases') || [];
    if (!Array.isArray(purchases)) {
        purchases = [];
        saveData('purchases', purchases);
    }
    let farmers = getData('farmers') || [];
    
    populateFarmerDropdowns(farmers); // Populate farmer dropdowns

    updatePurchasesList(purchasesList, purchases);

    // Add purchase form submission handler
    addPurchaseForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log('Form submitted');

        const farmerId = document.getElementById('farmer-id').value;
        const farmerName = document.getElementById('farmer-id').options[document.getElementById('farmer-id').selectedIndex].text.split(' - ')[1];
        const purchaseDate = new Date(document.getElementById('purchase-date').value);
        const formattedDate = `${purchaseDate.getMonth() + 1}/${purchaseDate.getDate()}/${purchaseDate.getFullYear()}`;
        const quantity = parseFloat(document.getElementById('quantity').value);
        const price = parseFloat(document.getElementById('price').value);

        if (purchaseDate > new Date()) {
            alert('Purchase date cannot be in the future.');
            return;
        }

        if (!farmerId || !purchaseDate || !quantity || !price) {
            alert('Please fill out all fields.');
            return;
        }

        if (quantity <= 0 || price <= 0) {
            alert('Quantity and price must be greater than zero.');
            return;
        }

        const totalCost = quantity * price;

        // Generate auto-incremented Purchase ID
        let purchaseIdCounter = getData('purchaseIdCounter');
        console.log('qweqweqwe',purchaseIdCounter);
        
        if (!purchaseIdCounter|| purchaseIdCounter.length === 0) {
            console.log('if içi',purchaseIdCounter);
            purchaseIdCounter = 1;
            saveData('purchaseIdCounter', purchaseIdCounter);
        } 
        const purchaseId = Number(purchaseIdCounter);
        console.log(typeof(purchaseId));
        console.log(purchaseId);
        
        saveData('purchaseIdCounter', purchaseId + 1); // Increment counter

        const newPurchase = { 
            purchaseId, 
            farmerId, 
            farmerName,
            purchaseDate: formattedDate, 
            quantity, 
            price, 
            totalCost 
        };
        purchases.push(newPurchase);

        // Save purchases to local storage
        saveData('purchases', purchases);

        // Update the list
        updatePurchasesList(purchasesList, purchases);

        // Reset the form
        addPurchaseForm.reset();
    });

    // Filter button handler
    filterButton.addEventListener('click', () => {
        const filterFarmerId = document.getElementById('filter-farmer-id').value;
        const filterDate = document.getElementById('filter-date').value;

        let filteredPurchases = purchases;

        if (filterFarmerId) {
            filteredPurchases = filteredPurchases.filter(purchase => purchase.farmerId === filterFarmerId);
        }

        if (filterDate) {
            filteredPurchases = filteredPurchases.filter(purchase => {
                const purchaseDate = new Date(purchase.purchaseDate).toISOString().split('T')[0];
                const formattedFilterDate = new Date(filterDate).toISOString().split('T')[0];
                return purchaseDate === formattedFilterDate;
            });
        }

        updatePurchasesList(purchasesList, filteredPurchases);
    });
}

// Function to populate farmer dropdowns
function populateFarmerDropdowns(farmers) {
    const farmerDropdown = document.getElementById('farmer-id');
    const filterFarmerDropdown = document.getElementById('filter-farmer-id');

    // Clear existing options
    farmerDropdown.innerHTML = `<option value="" disabled selected>Select a Farmer</option>`;
    filterFarmerDropdown.innerHTML = `<option value="" selected>All Farmers</option>`;

    // Add farmers to dropdown
    farmers.forEach((farmer) => {
        const option = document.createElement('option');
        option.value = farmer.id;
        option.textContent = `${farmer.id} - ${farmer.name}`;
        farmerDropdown.appendChild(option);

        const filterOption = option.cloneNode(true);
        filterFarmerDropdown.appendChild(filterOption);
    });
}

// Function to update the purchases list in the DOM
function updatePurchasesList(container, purchases) {
    container.innerHTML = ''; // Clear existing list

    // Check if purchases is undefined or not an array
    if (!purchases || !Array.isArray(purchases)) {
        console.error('Invalid purchases data', purchases);
        return;
    }

    purchases.forEach((purchase) => {
        // Add additional checks to prevent errors
        if (!purchase) {
            console.warn('Skipping undefined purchase');
            return;
        }

        const listItem = document.createElement('li');
        
        // Use optional chaining and provide default values
        listItem.textContent = `
            ID: ${purchase.purchaseId || 'N/A'}, 
            Farmer ID: ${purchase.farmerId || 'N/A'}, 
            Date: ${purchase.purchaseDate || 'N/A'}, 
            Quantity: ${purchase.quantity || 0}kg, 
            Price: $${(purchase.price ?? 0).toFixed(2)}, 
            Total: $${(purchase.totalCost ?? 0).toFixed(2)}
        `;
        
        container.appendChild(listItem);
    });
}


export { loadPurchasesSection };
