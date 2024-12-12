
import { saveToLocalStorage, loadFromLocalStorage } from './storage-utils.js';

let purchases = [];
function savePurchasesToLocalStorage() {
    saveToLocalStorage("purchases", purchases);
}
function loadPurchasesFromLocalStorage() {
    purchases = loadFromLocalStorage("purchases") || [];
    updatePurchaseTable();
}

// Add a new purchase
function addPurchase(farmerId, date, quantity, pricePerKg) {
    const purchaseDate = new Date(date);
    if (purchaseDate > new Date()) {
        alert("Purchase date cannot be in the future.");
        return;
    }

    const totalCost = quantity * pricePerKg;
    const purchase = {
        id: purchases.length + 1,
        farmerId: parseInt(farmerId), // Ensure farmerId is stored as a number
        date,
        quantity,
        pricePerKg,
        totalCost
    };
    purchases.push(purchase);
    updatePurchaseTable();
    updateExpenses(totalCost);
    savePurchasesToLocalStorage(); // Save to LocalStorage

}

// Update the Purchase Table
function updatePurchaseTable(sortBy = 'date', sortDirection = 'asc') {
    const tableBody = document.getElementById('purchaseTableBody');
    let sortedPurchases = [...purchases];

    // Sort purchases based on criteria
    sortedPurchases.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === 'farmer') {
            return a.farmerId - b.farmerId;
        } else if (sortBy === 'amount') {
            return a.totalCost - b.totalCost;
        }
        return 0;
    });

    // Reverse the order if descending
    if (sortDirection === 'desc') {
        sortedPurchases.reverse();
    }

    // Render the updated table
    tableBody.innerHTML = sortedPurchases.map(purchase => {
        const farmer = farmers.find(f => f.id === purchase.farmerId);
        return `
            <tr>
                <td>${purchase.id}</td>
                <td>${farmer ? `${farmer.id} - ${farmer.name}` : 'Unknown'}</td>
                <td>${purchase.date}</td>
                <td>${purchase.quantity}</td>
                <td>$${purchase.pricePerKg.toFixed(2)}</td>
                <td>$${purchase.totalCost.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
}

// Open the "Add Purchase" Modal
function openAddPurchaseModal() {
    const modalContent = `
        <h2>Log New Purchase</h2>
        <form id="addPurchaseForm">
            <select id="purchaseFarmer" required>
                <option value="">Select Farmer</option>
                ${farmers.map(farmer => `<option value="${farmer.id}">${farmer.id} - ${farmer.name}</option>`).join('')}
            </select>
            <input type="date" id="purchaseDate" required>
            <input type="number" id="purchaseQuantity" placeholder="Quantity (kg)" required>
            <input type="number" id="purchasePricePerKg" placeholder="Price per kg" required>
            <button type="submit">Log Purchase</button>
        </form>
    `;
    
    openModal(modalContent);
    
    document.getElementById('addPurchaseForm').onsubmit = function(e) {
        e.preventDefault();
        const farmerId = document.getElementById('purchaseFarmer').value; // Get the farmer's ID
        const date = document.getElementById('purchaseDate').value;
        const quantity = parseFloat(document.getElementById('purchaseQuantity').value);
        const pricePerKg = parseFloat(document.getElementById('purchasePricePerKg').value);
        
        addPurchase(farmerId, date, quantity, pricePerKg);
        closeModal();
    };
}


// Add functionality to view and sort purchase records
const purchaseSortBy = document.getElementById('purchaseSortBy');
const purchaseSortDirection = document.getElementById('purchaseSortDirection');

purchaseSortBy.addEventListener('change', () => {
    updatePurchaseTable(purchaseSortBy.value, purchaseSortDirection.value);
});

purchaseSortDirection.addEventListener('change', () => {
    updatePurchaseTable(purchaseSortBy.value, purchaseSortDirection.value);
});

// Add functionality to generate purchase summaries
function generatePurchaseSummary(farmerId = null, startDate = null, endDate = null) {
    let filteredPurchases = purchases;

    // Filter by Farmer ID if provided
    if (farmerId !== null) {
        filteredPurchases = filteredPurchases.filter(purchase => purchase.farmerId === farmerId);
    }

    // Filter by Date Range if provided
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filteredPurchases = filteredPurchases.filter(purchase => {
            const purchaseDate = new Date(purchase.date);
            return purchaseDate >= start && purchaseDate <= end;
        });
    }


    // Calculate totals
    const totalQuantity = filteredPurchases.reduce((total, purchase) => total + purchase.quantity, 0);
    const totalCost = filteredPurchases.reduce((total, purchase) => total + purchase.totalCost, 0);

    return {
        totalQuantity,
        totalCost
    };
}

function showPurchaseSummary() {
    const farmerId = document.getElementById('summaryFarmer').value || null;
    const startDate = document.getElementById('summaryStartDate').value || null;
    const endDate = document.getElementById('summaryEndDate').value || null;

    // Convert farmerId to number if selected
    const parsedFarmerId = farmerId ? parseInt(farmerId) : null;

    const summary = generatePurchaseSummary(parsedFarmerId, startDate, endDate);

    // Update the UI with the summary results
    document.getElementById('summaryTotalQuantity').textContent = summary.totalQuantity || 0;
    document.getElementById('summaryTotalCost').textContent = summary.totalCost.toFixed(2) || '0.00';
}

function populateFarmersDropdown() {
    const farmerSelect = document.getElementById('summaryFarmer');
    farmerSelect.innerHTML = '<option value="">All Farmers</option>';
    farmers.forEach(farmer => {
        const option = document.createElement('option');
        option.value = farmer.id;
        option.textContent = `${farmer.id} - ${farmer.name}`;
        farmerSelect.appendChild(option);
    });
}
populateFarmersDropdown();
