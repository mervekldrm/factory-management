import { loadFarmersSection } from './farmers.js'; // Import dynamic section loaders
import { loadPurchasesSection } from './purchases.js';
import { loadInventorySection } from './inventory.js';
import { loadSalesSection } from './sales.js';
import { loadReportsSection } from './financial-report.js';

// Initialization
window.addEventListener('DOMContentLoaded', () => {
    console.log('Blueberry Factory Management System Initialized');

    // Load initial section (Farmers by default)
    showSection('farmers');

    // Add event listeners to navigation links
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
});

// Function to display the specified section and hide others
function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach((section) => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });

    switch (sectionId) {
        case 'farmers':
            loadFarmersSection();
            break;
        case 'purchases':
            loadPurchasesSection();
            break;
        case 'inventory':
            loadInventorySection();
            break;
        case 'sales':
            loadSalesSection();
            break;
        case 'reports':
            loadReportsSection();
            break;
        default:
            console.error(`Unknown section: ${sectionId}`);
    }
}

