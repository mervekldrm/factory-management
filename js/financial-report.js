import { getData } from './storage-utils.js';

// Function to calculate financial reports
function generateFinancialReport(startDate, endDate) {
    const purchases = getData('purchases') || [];
    const sales = getData('sales') || [];
    const inventory = getData('inventory') || [];
    const farmers = getData('farmers') || [];
    const customers = getData('customers') || [];

    let totalExpenses = 0;
    let totalIncome = 0;
    let totalPurchaseQuantity = 0;
    let totalSaleQuantity = 0;

    // Filter purchases and sales by the selected period
    const filteredPurchases = purchases.filter(purchase => 
        new Date(purchase.purchaseDate) >= new Date(startDate) && new Date(purchase.purchaseDate) <= new Date(endDate)
    );

    const filteredSales = sales.filter(sale => 
        new Date(sale.date) >= new Date(startDate) && new Date(sale.date) <= new Date(endDate)
    );

    // Calculate total expenses from purchases
    filteredPurchases.forEach((purchase) => {
        totalExpenses += purchase.totalCost;
        totalPurchaseQuantity += purchase.quantity;
    });

    // Calculate total income from sales
    filteredSales.forEach((sale) => {
        totalIncome += sale.totalPrice;
        totalSaleQuantity += sale.quantity;
    });

    // Calculate tax (e.g., 10% of total income)
    const taxRate = 0.1;
    const totalTax = totalIncome * taxRate;

    // Calculate net profit
    const netProfit = totalIncome - totalExpenses - totalTax;

    // Calculate number of products sold per category
    const productsSoldPerCategory = filteredSales.reduce((acc, sale) => {
        if (!acc[sale.category]) {
            acc[sale.category] = 0;
        }
        acc[sale.category] += sale.quantity;
        return acc;
    }, {});

    // Calculate average purchase cost and average sale price
    const averagePurchaseCost = totalPurchaseQuantity ? (totalExpenses / totalPurchaseQuantity) : 0;
    const averageSalePrice = totalSaleQuantity ? (totalIncome / totalSaleQuantity) : 0;

    // Generate report content with tables
    const reportContent = `
        <h3>Financial Report (${startDate} to ${endDate})</h3>
        
        <table class="report-table">
            <thead>
                <tr>
                    <th colspan="2">Financial Summary</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Total Income</td>
                    <td>$${totalIncome.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Total Expenses</td>
                    <td>$${totalExpenses.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Total Tax</td>
                    <td>$${totalTax.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Net Profit</td>
                    <td>$${netProfit.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Average Purchase Cost</td>
                    <td>$${averagePurchaseCost.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Average Sale Price</td>
                    <td>$${averageSalePrice.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Total Number of Purchases</td>
                    <td>${filteredPurchases.length}</td>
                </tr>
                <tr>
                    <td>Total Number of Sales</td>
                    <td>${filteredSales.length}</td>
                </tr>
            </tbody>
        </table>

        <h4>Products Sold Per Category</h4>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Quantity Sold</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(productsSoldPerCategory)
                    .map(([category, quantity]) => `
                        <tr>
                            <td>${category}</td>
                            <td>${quantity} units</td>
                        </tr>
                    `).join('')}
            </tbody>
        </table>

        <h4>Current Stock</h4>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Available Quantity</th>
                </tr>
            </thead>
            <tbody>
                ${inventory.map(item => `
                    <tr>
                        <td>${item.category}</td>
                        <td>${item.quantityAvailable.toFixed(2)} kg</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <h4>Farmers Involved in Purchases</h4>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Farmer Name</th>
                    <th>Quantity</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${filteredPurchases.map(purchase => {
                    const farmer = farmers.find(f => Number(f.id) === Number(purchase.farmerId));
                    return `
                        <tr>
                            <td>${farmer ? farmer.name : 'Unknown Farmer'}</td>
                            <td>${purchase.quantity} kg</td>
                            <td>${purchase.purchaseDate}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>

        <h4>Customers Involved in Sales</h4>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Quantity</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${filteredSales.map(sale => {
                    const customer = customers.find(c => Number(c.id) === Number(sale.customerId));
                    return `
                        <tr>
                            <td>${customer ? customer.name : 'Unknown Customer'}</td>
                            <td>${sale.quantity} units</td>
                            <td>${sale.date}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    // Display the report
    const reportContainer = document.getElementById('reports-container');
    reportContainer.innerHTML = reportContent;

    // Provide download option
    const downloadCSVButton = document.createElement('button');
    downloadCSVButton.textContent = 'Download CSV';
    downloadCSVButton.addEventListener('click', () => downloadReportAsCSV(filteredPurchases, filteredSales, totalIncome, totalExpenses, totalTax, netProfit, productsSoldPerCategory, inventory, averagePurchaseCost, averageSalePrice, farmers, customers));

    reportContainer.appendChild(downloadCSVButton);
}

// Function to download report as CSV
function downloadReportAsCSV(purchases, sales, totalIncome, totalExpenses, totalTax, netProfit, productsSoldPerCategory, inventory, averagePurchaseCost, averageSalePrice, farmers, customers) {
    const headers = ['Category', 'Quantity Sold', 'Current Stock'];
    const rows = Object.entries(productsSoldPerCategory).map(([category, quantity]) => {
        const stock = inventory.find(item => item.category === category)?.quantityAvailable || 0;
        return [category, quantity, stock.toFixed(2)];
    });

    const csvContent = [
        ['Total Income', totalIncome.toFixed(2)],
        ['Total Expenses', totalExpenses.toFixed(2)],
        ['Total Tax', totalTax.toFixed(2)],
        ['Net Profit', netProfit.toFixed(2)],
        ['Average Purchase Cost', averagePurchaseCost.toFixed(2)],
        ['Average Sale Price', averageSalePrice.toFixed(2)],
        ['Total Number of Purchases', purchases.length],
        ['Total Number of Sales', sales.length],
        headers,
        ...rows,
        ['Farmers Involved in Purchases'],
        ...purchases.map(purchase => {
            const farmer = farmers.find(f => Number(f.id) === Number(purchase.farmerId));
            return [farmer ? farmer.name : 'Unknown Farmer', purchase.quantity, purchase.purchaseDate];
        }),
        ['Customers Involved in Sales'],
        ...sales.map(sale => {
            const customer = customers.find(c => Number(c.id) === Number(sale.customerId));
            return [customer ? customer.name : 'Unknown Customer', sale.quantity, sale.date];
        })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'financial_report.csv';
    link.click();
}

// Function to load the reports section
function loadReportsSection() {
    const reportsContainer = document.getElementById('reports-container');

    reportsContainer.innerHTML = `
        <h3>Financial Reports</h3>
        <p>Select the reporting period to generate the report.</p>
        <form id="report-form">
            <label for="report-type">Report Type:</label>
            <select id="report-type" required>
                <option value="custom">Custom</option>
                <option value="monthly">Monthly</option>
            </select>
            <div id="custom-date-range">
                <label for="start-date">Start Date:</label>
                <input type="date" id="start-date" name="start-date" required>
                <label for="end-date">End Date:</label>
                <input type="date" id="end-date" name="end-date" required>
            </div>
            <div id="monthly-date-range" style="display: none;">
                <label for="month">Month:</label>
                <input type="month" id="month" name="month">
            </div>
            <button type="submit">Generate Report</button>
        </form>
    `;

    const reportForm = document.getElementById('report-form');
    const reportTypeSelect = document.getElementById('report-type');
    const customDateRange = document.getElementById('custom-date-range');
    const monthlyDateRange = document.getElementById('monthly-date-range');

    reportTypeSelect.addEventListener('change', () => {
        if (reportTypeSelect.value === 'monthly') {
            customDateRange.style.display = 'none';
            monthlyDateRange.style.display = 'block';
            document.getElementById('start-date').removeAttribute('required');
            document.getElementById('end-date').removeAttribute('required');
        } else {
            customDateRange.style.display = 'block';
            monthlyDateRange.style.display = 'none';
            document.getElementById('start-date').setAttribute('required', 'required');
            document.getElementById('end-date').setAttribute('required', 'required');
        }
    });

    reportForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let startDate, endDate;

        if (reportTypeSelect.value === 'monthly') {
            const month = document.getElementById('month').value;
            if (!month) {
                alert('Please select a month.');
                return;
            }
            startDate = new Date(month);
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        } else {
            startDate = document.getElementById('start-date').value;
            endDate = document.getElementById('end-date').value;
        }

        generateFinancialReport(startDate, endDate);
    });
}

export { loadReportsSection, generateFinancialReport };
