// farmers.js

import { getData, saveData, deleteItem, filterData, exportToCSV } from './storage-utils.js';

let editingFarmerId = null; // Track farmer being edited
let lastFarmerId = 0;

function loadFarmersSection() {
    let farmers = getData('farmers') || [];

    const farmersContainer = document.getElementById('farmers-container');

    farmersContainer.innerHTML = `
        <h3>Manage Farmers</h3>
        <form id="add-farmer-form">
            <label for="farmer-name">Name:</label>
            <input type="text" id="farmer-name" required>

            <label for="farmer-contact">Contact:</label>
            <input type="text" id="farmer-contact" required>

            <label for="farmer-location">Location:</label>
            <input type="text" id="farmer-location" required>

            <button type="submit" id="add-update-button">Add Farmer</button>
        </form>

        <div>
            <input type="text" id="search-query" placeholder="Search by name or location">
            <button id="search-button">Search</button>
            <button id="export-button">Export to CSV</button>
        </div>

        <ul id="farmers-list"></ul>
    `;

    const addFarmerForm = document.getElementById('add-farmer-form');
    const addUpdateButton = document.getElementById('add-update-button');
    const farmersList = document.getElementById('farmers-list');

    addFarmerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('farmer-name').value;
        const contact = document.getElementById('farmer-contact').value;
        const location = document.getElementById('farmer-location').value;

        if (editingFarmerId) {
            // Update existing farmer
            const farmer = farmers.find(farmer => farmer.id === editingFarmerId);
            if (farmer) {
                farmer.name = name;
                farmer.contact = contact;
                farmer.location = location;
                saveData('farmers', farmers);
                updateFarmersList(farmersList, farmers);
                addFarmerForm.reset();
                editingFarmerId = null;
                addUpdateButton.textContent = 'Add Farmer';
            }
        } else {
            // Add new farmer
            const newFarmer = { id: ++lastFarmerId, name, contact, location };
            farmers.push(newFarmer);
            saveData('farmers', farmers);
            updateFarmersList(farmersList, farmers);
            addFarmerForm.reset();
        }
    });

    document.getElementById('search-button').addEventListener('click', () => {
        const query = document.getElementById('search-query').value;
        const filteredFarmers = filterData('farmers', 'name', query).concat(
            filterData('farmers', 'location', query)
        );
        updateFarmersList(farmersList, filteredFarmers);
    });

    document.getElementById('export-button').addEventListener('click', () => {
        exportToCSV('farmers', 'farmers.csv');
    });

    updateFarmersList(farmersList, farmers);
}

function updateFarmersList(container, farmers) {
    // Fetch the most recent farmers data from local storage
    farmers = getData('farmers') || [];

    container.innerHTML = ''; // Clear the list

    farmers.forEach((farmer) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ID: ${farmer.id}, Name: ${farmer.name}, Contact: ${farmer.contact}, Location: ${farmer.location}
            <button class="edit-button" data-id="${farmer.id}">Edit</button>
            <button class="delete-button" data-id="${farmer.id}">Delete</button>
        `;
        container.appendChild(listItem);
    });

    container.querySelectorAll('.edit-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const farmer = farmers.find(farmer => farmer.id === id);
            if (farmer) {
                document.getElementById('farmer-name').value = farmer.name;
                document.getElementById('farmer-contact').value = farmer.contact;
                document.getElementById('farmer-location').value = farmer.location;

                editingFarmerId = farmer.id;
                document.getElementById('add-update-button').textContent = "Update Farmer";
            }
        });
    });

    container.querySelectorAll('.delete-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            farmers = farmers.filter(farmer => farmer.id !== id);
            saveData('farmers', farmers);
            updateFarmersList(container, farmers);
        });
    });
}

// Load the farmers section when the page loads
document.addEventListener('DOMContentLoaded', loadFarmersSection);

export { loadFarmersSection };
