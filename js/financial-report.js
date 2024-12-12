// js/financial-report.js
import { saveToLocalStorage, loadFromLocalStorage } from './storage-utils.js';

let totalRevenue = loadFromLocalStorage("totalRevenue") || 0;
let totalExpenses = loadFromLocalStorage("totalExpenses") || 0;
let taxRate = loadFromLocalStorage("taxRate") || 0.2; // 20% tax rate

// Save and load helpers
function saveFinancialMetricsToLocalStorage() {
    saveToLocalStorage("financialMetrics", { totalRevenue, totalExpenses, taxRate });
}

function loadFinancialMetricsFromLocalStorage() {
    const metrics = loadFromLocalStorage("financialMetrics") || {};
    totalRevenue = metrics.totalRevenue || 0;
    totalExpenses = metrics.totalExpenses || 0;
    taxRate = metrics.taxRate || 0.2;
}


// Update revenue and save to LocalStorage
function updateRevenue(amount) {
    totalRevenue += amount;
    saveToLocalStorage("totalRevenue", totalRevenue);
    updateFinancialReport();
}

// Update expenses and save to LocalStorage
function updateExpenses(amount) {
    totalExpenses += amount;
    saveToLocalStorage("totalExpenses", totalExpenses);
    updateFinancialReport();
}

// Generate Financial Report
function generateFinancialReport() {
    const period = document.getElementById("reportPeriod").value;
    const startDateInput = document.getElementById("reportStartDate");
    const endDateInput = document.getElementById("reportEndDate");

    let startDate = null;
    let endDate = null;

    // Handle custom range input
    if (period === "custom") {
        startDate = new Date(startDateInput.value);
        endDate = new Date(endDateInput.value);
        if (!startDate || !endDate || startDate > endDate) {
            alert("Please select a valid date range.");
            return;
        }
    } else {
        const today = new Date();
        endDate = today;
        if (period === "daily") {
            startDate = today;
        } else if (period === "weekly") {
            startDate = new Date(today.setDate(today.getDate() - 7));
        } else if (period === "monthly") {
            startDate = new Date(today.setMonth(today.getMonth() - 1));
        }
    }

    // Filter purchases to calculate total expenses
    const filteredPurchases = purchases.filter(purchase => {
        const purchaseDate = new Date(purchase.date);
        return purchaseDate >= startDate && purchaseDate <= endDate;
    });

    const filteredExpenses = filteredPurchases.reduce((total, purchase) => total + purchase.totalCost, 0);

    const taxLiability = totalRevenue * taxRate;
    const netProfit = totalRevenue - filteredExpenses - taxLiability;

    // Update the UI
    document.getElementById("totalIncome").textContent = totalRevenue.toFixed(2);
    document.getElementById("totalExpenses").textContent = filteredExpenses.toFixed(2);
    document.getElementById("taxLiability").textContent = taxLiability.toFixed(2);
    document.getElementById("netProfit").textContent = netProfit.toFixed(2);
    document.getElementById("selectedPeriod").textContent = `${startDate.toDateString()} - ${endDate.toDateString()}`;
}

// Handle report period selection changes
document.getElementById("reportPeriod").addEventListener("change", function () {
    const period = this.value;
    const startDateInput = document.getElementById("reportStartDate");
    const endDateInput = document.getElementById("reportEndDate");

    if (period === "custom") {
        startDateInput.style.display = "inline-block";
        endDateInput.style.display = "inline-block";
    } else {
        startDateInput.style.display = "none";
        endDateInput.style.display = "none";
    }
});

// Update Financial Report (refresh the calculations)
function updateFinancialReport() {
    saveToLocalStorage("totalRevenue", totalRevenue);
    saveToLocalStorage("totalExpenses", totalExpenses);
    saveToLocalStorage("taxRate", taxRate);
    generateFinancialReport();
}

// Generate Expense Report (used for specific date ranges)
function generateExpenseReport(startDate, endDate) {
    const filteredPurchases = purchases.filter(purchase => {
        const purchaseDate = new Date(purchase.date);
        return purchaseDate >= new Date(startDate) && purchaseDate <= new Date(endDate);
    });

    const totalExpenses = filteredPurchases.reduce((total, purchase) => total + purchase.totalCost, 0);

    return {
        totalExpenses
    };
}

// Load financial metrics on page load
window.onload = () => {
    totalRevenue = loadFromLocalStorage("totalRevenue") || 0;
    totalExpenses = loadFromLocalStorage("totalExpenses") || 0;
    taxRate = loadFromLocalStorage("taxRate") || 0.2;
    updateFinancialReport();
};
