// js/app.js
// Global application logic and utility functions

// Module display function
function showModule(moduleId) {
    // Hide all modules
    const modules = ['supplierModule', 'purchaseModule', 'inventoryModule', 'salesModule', 'financialReportModule'];
    modules.forEach(module => document.getElementById(module).style.display = 'none');

    // Remove active class from buttons
    document.querySelectorAll('nav button').forEach(button => button.classList.remove('active'));

    // Show selected module and highlight button
    document.getElementById(moduleId).style.display = 'block';
    document.querySelector(`button[onclick="showModule('${moduleId}')"]`).classList.add('active');
}


// Modal management
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.getElementsByClassName('close')[0];

function openModal(content) {
    modalBody.innerHTML = content;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

// Close modal when clicking on close button
closeBtn.onclick = closeModal;

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}
window.onload = () => {
    loadFarmersFromLocalStorage();
    loadPurchasesFromLocalStorage();
    loadSalesFromLocalStorage();
    loadFinancialMetricsFromLocalStorage();
};
