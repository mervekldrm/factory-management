// js/farmers.js

import { saveToLocalStorage, loadFromLocalStorage } from './storage-utils.js';

let farmers = [];
// Function to load farmers from LocalStorage
function loadFarmersFromLocalStorage() {
    farmers = loadFromLocalStorage("farmers") || [];
    updateFarmerTable();
    populateFarmersDropdown();
}

function saveFarmersToLocalStorage() {
    localStorage.setItem("farmers", JSON.stringify(farmers));
}
function addFarmer(name, contact, location) {
    const farmer = {
        id: farmers.length + 1,
        name,
        contact,
        location
    };
    farmers.push(farmer);
    updateFarmerTable();
    populateFarmersDropdown();
    saveFarmersToLocalStorage(); // Save to LocalStorage
}


function updateFarmerTable(searchTerm = '', filterLocation = '') {
    const tableBody = document.getElementById('farmerTableBody');
    let filteredFarmers = farmers;

    // Apply search filter
    if (searchTerm !== '') {
        filteredFarmers = farmers.filter(farmer =>
            farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            farmer.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Apply location filter
    if (filterLocation !== '') {
        filteredFarmers = filteredFarmers.filter(farmer =>
            farmer.location.toLowerCase().includes(filterLocation.toLowerCase())
        );
    }

    tableBody.innerHTML = filteredFarmers.map(farmer => `
        <tr>
            <td>${farmer.id}</td>
            <td>${farmer.name}</td>
            <td>${farmer.contact}</td>
            <td>${farmer.location}</td>
            <td>
                <button onclick="editFarmer(${farmer.id})">Edit</button>
                <button onclick="deleteFarmer(${farmer.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openAddFarmerModal() {
    const modalContent = `
        <h2>Add New Farmer</h2>
        <form id="addFarmerForm">
            <input type="text" id="farmerName" placeholder="Farmer Name" required>
            <input type="text" id="farmerContact" placeholder="Contact Details" required>
            <input type="text" id="farmerLocation" placeholder="Location" required>
            <button type="submit">Add Farmer</button>
        </form>
    `;
    
    openModal(modalContent);
    
    document.getElementById('addFarmerForm').onsubmit = function(e) {
        e.preventDefault();
        const name = document.getElementById('farmerName').value;
        const contact = document.getElementById('farmerContact').value;
        const location = document.getElementById('farmerLocation').value;
        
        addFarmer(name, contact, location);
        closeModal();
    };
}
function editFarmer(id) {
    const farmer = farmers.find(f => f.id === id);
    if (farmer) {
        const modalContent = `
            <h2>Edit Farmer</h2>
            <form id="editFarmerForm">
                <input type="text" id="editFarmerName" value="${farmer.name}" required>
                <input type="text" id="editFarmerContact" value="${farmer.contact}" required>
                <input type="text" id="editFarmerLocation" value="${farmer.location}" required>
                <button type="submit">Update Farmer</button>
            </form>
        `;

        openModal(modalContent);

        document.getElementById('editFarmerForm').onsubmit = function(e) {
            e.preventDefault();
            farmer.name = document.getElementById('editFarmerName').value;
            farmer.contact = document.getElementById('editFarmerContact').value;
            farmer.location = document.getElementById('editFarmerLocation').value;

            updateFarmerTable();
            populateFarmersDropdown();
            saveFarmersToLocalStorage(); // Save to LocalStorage
            closeModal();
        };
    }
}


function deleteFarmer(id) {
    farmers = farmers.filter(farmer => farmer.id !== id);
    updateFarmerTable();
    populateFarmersDropdown();
    saveFarmersToLocalStorage(); // Save to LocalStorage
}


// Add search and filter functionality
function searchAndFilterFarmers() {
    const searchInput = document.getElementById('farmerSearchInput');
    const locationInput = document.getElementById('farmerLocationFilter');

    const searchTerm = searchInput.value;
    const filterLocation = locationInput.value;

    updateFarmerTable(searchTerm, filterLocation);
}
function exportFarmersToCSV() {
    const csvContent = "data:text/csv;charset=utf-8," + 
        "ID,Name,Contact,Location\n" +
        farmers.map(f => `${f.id},${f.name},${f.contact},${f.location}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "farmers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
window.onload = () => {
    loadFarmersFromLocalStorage(); // Load data from LocalStorage when the page loads
};
