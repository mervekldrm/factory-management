// financial-report.js

// Function to calculate financial reports
function generateFinancialReport() {
    const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
    const sales = JSON.parse(localStorage.getItem('sales')) || [];

    let totalExpenses = 0;
    let totalIncome = 0;

    // Calculate total expenses from purchases
    purchases.forEach((purchase) => {
        totalExpenses += purchase.totalCost;
    });

    // Calculate total income from sales
    sales.forEach((sale) => {
        totalIncome += sale.totalPrice;
    });

    // Calculate tax (e.g., 10% of total income)
    const taxRate = 0.1;
    const totalTax = totalIncome * taxRate;

    // Calculate net profit
    const netProfit = totalIncome - totalExpenses - totalTax;

    // Display the report
    const reportContainer = document.getElementById('reports-container');
    reportContainer.innerHTML = `
        <h3>Financial Report</h3>
        <p>Total Income: $${totalIncome.toFixed(2)}</p>
        <p>Total Expenses: $${totalExpenses.toFixed(2)}</p>
        <p>Total Tax: $${totalTax.toFixed(2)}</p>
        <p>Net Profit: $${netProfit.toFixed(2)}</p>
    `;
}
// financial-report.js

function loadReportsSection() {
    const reportsContainer = document.getElementById('reports-container');

    reportsContainer.innerHTML = `
        <h3>Financial Reports</h3>
        <p>Here you can view and generate financial reports.</p>
    `;
}

export { loadReportsSection };

// Export the function to be used elsewhere
export { generateFinancialReport };
