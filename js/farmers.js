// farmers.js

import { getData, saveData, deleteItem, filterData, exportToCSV } from './storage-utils.js';

let editingFarmerId = null; // Track farmer being edited

function loadFarmersSection() {
    const farmersContainer = document.getElementById('farmers-container');

    farmersContainer.innerHTML = `
        <h3>Manage Farmers</h3>
        <form id="add-farmer-form">
            <label for="farmer-id">Farmer ID:</label>
            <input type="text" id="farmer-id" required>

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

    const farmersList = document.getElementById('farmers-list');
    const farmers = getData('farmers');
    updateFarmersList(farmersList, farmers);

    const addFarmerForm = document.getElementById('add-farmer-form');
    const addUpdateButton = document.getElementById('add-update-button');

    addFarmerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = parseInt(document.getElementById('farmer-id').value);
        const name = document.getElementById('farmer-name').value;
        const contact = document.getElementById('farmer-contact').value;
        const location = document.getElementById('farmer-location').value;

        if (editingFarmerId) {
            // Update existing farmer
            const farmerIndex = farmers.findIndex((farmer) => farmer.id === editingFarmerId);
            if (farmerIndex !== -1) {
                farmers[farmerIndex] = { id, name, contact, location };

                // Save the updated data
                saveData('farmers', farmers);
                updateFarmersList(farmersList, farmers);

                // Reset the form and editing state
                addFarmerForm.reset();
                editingFarmerId = null;
                addUpdateButton.textContent = 'Add Farmer';
            }
        } else {
            // Add new farmer
            const newFarmer = { id, name, contact, location };
            farmers.push(newFarmer);

            // Save to local storage
            saveData('farmers', farmers);
            updateFarmersList(farmersList, farmers);

            // Reset the form
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
}

function updateFarmersList(container, farmers) {
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

    // Attach event listeners to "Edit" buttons
    container.querySelectorAll('.edit-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const farmer = farmers.find((farmer) => farmer.id === id);

            if (farmer) {
                // Populate the form with farmer's details
                document.getElementById('farmer-id').value = farmer.id;
                document.getElementById('farmer-name').value = farmer.name;
                document.getElementById('farmer-contact').value = farmer.contact;
                document.getElementById('farmer-location').value = farmer.location;

                // Set editing state
                editingFarmerId = farmer.id; // Track the farmer being edited
                document.getElementById('add-update-button').textContent = 'Update Farmer';
            }
        });
    });

    // Attach event listeners to "Delete" buttons
    container.querySelectorAll('.delete-button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const updatedFarmers = farmers.filter((farmer) => farmer.id !== id);

            // Save the updated list and refresh the UI
            saveData('farmers', updatedFarmers);
            updateFarmersList(container, updatedFarmers);
        });
    });
}

export { loadFarmersSection };
