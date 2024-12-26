// sales.js
import { getData, saveData } from './storage-utils.js';

function loadSalesSection() {
    const salesContainer = document.getElementById('sales-container');
    if (!salesContainer) {
        console.error('Sales container not found');
        return;
    }

    salesContainer.innerHTML = `
        <h3>Sales Management</h3>
        
        <form id="add-sale-form">
            <div class="form-group">
                <label for="customer-name">Customer Name:</label>
                <input type="text" id="customer-name" required>
            </div>

            <div class="form-group">
                <label for="product-category">Product Category:</label>
                <select id="product-category" required>
                    <option value="" disabled selected>Select Category</option>
                    <option value="Small (100g)">Small (100g)</option>
                    <option value="Medium (250g)">Medium (250g)</option>
                    <option value="Large (500g)">Large (500g)</option>
                    <option value="Extra Large (1kg)">Extra Large (1kg)</option>
                    <option value="Family Pack (2kg)">Family Pack (2kg)</option>
                    <option value="Bulk Pack (5kg)">Bulk Pack (5kg)</option>
                    <option value="Premium (Custom)">Premium (Custom)</option>
                </select>
            </div>

            <div class="form-group">
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" min="1" required>
            </div>

            <div class="form-group">
                <label for="unit-price">Unit Price ($):</label>
                <input type="number" id="unit-price" step="0.01" min="0.01" required>
            </div>

            <div class="form-group">
                <label for="sale-date">Sale Date:</label>
                <input type="date" id="sale-date" required>
            </div>

            <button type="submit">Record Sale</button>
        </form>

        <div class="sales-summary">
            <h4>Sales Summary</h4>
            <div id="sales-metrics">
                <p>Total Revenue: $<span id="total-revenue">0.00</span></p>
                <p>Total Units Sold: <span id="total-units">0</span></p>
            </div>
        </div>

        <h4>Sales History</h4>
        <div class="filter-section">
            <select id="category-filter">
                <option value="">All Categories</option>
                <option value="Small (100g)">Small (100g)</option>
                <option value="Medium (250g)">Medium (250g)</option>
                <option value="Large (500g)">Large (500g)</option>
                <option value="Extra Large (1kg)">Extra Large (1kg)</option>
                <option value="Family Pack (2kg)">Family Pack (2kg)</option>
                <option value="Bulk Pack (5kg)">Bulk Pack (5kg)</option>
                <option value="Premium (Custom)">Premium (Custom)</option>
            </select>
            <input type="date" id="date-filter">
            <button id="apply-filter">Apply Filter</button>
        </div>

        <table id="sales-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody id="sales-list"></tbody>
        </table>
    `;

    const addSaleForm = document.getElementById('add-sale-form');
    const salesList = document.getElementById('sales-list');
    const categoryFilter = document.getElementById('category-filter');
    const dateFilter = document.getElementById('date-filter');
    const applyFilterButton = document.getElementById('apply-filter');

    // Sales metrics elements
    const totalRevenueSpan = document.getElementById('total-revenue');
    const totalUnitsSpan = document.getElementById('total-units');

    // Load existing sales
    let sales = getData('sales') || [];

    // Initial render and metrics calculation
    updateSalesList(sales);
    calculateSalesMetrics(sales);

    // Form submission handler
    addSaleForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get form values
        const customerName = document.getElementById('customer-name').value;
        const productCategory = document.getElementById('product-category').value;
        const quantity = parseInt(document.getElementById('quantity').value, 10);
        const unitPrice = parseFloat(document.getElementById('unit-price').value);
        const saleDate = document.getElementById('sale-date').value;

        // Check inventory for the requested quantity and type
        const inventory = getData('inventory') || [];
        const inventoryItem = inventory.find(item => item.category === productCategory);

        if (!inventoryItem || inventoryItem.quantityAvailable < quantity) {
            alert('Insufficient inventory for the selected category and quantity.');
            return;
        }

        // Generate unique order ID
        const orderId = generateOrderId();

        // Calculate total price
        const totalPrice = quantity * unitPrice;

        // Get or create customers array
        let customers = getData('customers') || [];
        let customerId;
        let existingCustomer = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
        
        if (existingCustomer) {
            customerId = existingCustomer.id;
        } else {
            customerId = Number(customers.length + 1);
            customers.push({
                id: customerId,
                name: customerName
            });
            saveData('customers', customers);
        }

        // Create sale object
        const newSale = {
            orderId,
            customerId: Number(customerId),
            customerName,
            category: productCategory,
            quantity,
            unitPrice,
            totalPrice,
            date: saleDate
        };

        // Add to sales array
        sales.push(newSale);

        // Update inventory
        inventoryItem.quantityAvailable -= quantity;
        saveData('inventory', inventory);

        // Save to local storage
        saveData('sales', sales);

        // Update sales list and metrics
        updateSalesList(sales);
        calculateSalesMetrics(sales);

        // Reset form
        addSaleForm.reset();
    });

    // Filter functionality
    applyFilterButton.addEventListener('click', () => {
        const selectedCategory = categoryFilter.value;
        const selectedDate = dateFilter.value;

        let filteredSales = sales;

        if (selectedCategory) {
            filteredSales = filteredSales.filter(sale => 
                sale.category === selectedCategory
            );
        }

        if (selectedDate) {
            filteredSales = filteredSales.filter(sale => 
                sale.date === selectedDate
            );
        }

        updateSalesList(filteredSales);
    });
}

// Generate unique order ID
function generateOrderId() {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Update sales list in the DOM
function updateSalesList(sales) {
    const salesList = document.getElementById('sales-list');
    salesList.innerHTML = ''; // Clear existing list

    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.orderId}</td>
            <td>${sale.customerName}</td>
            <td>${sale.category}</td>
            <td>${sale.quantity}</td>
            <td>$${(sale.unitPrice || 0).toFixed(2)}</td>
            <td>$${(sale.totalPrice || 0).toFixed(2)}</td>
            <td>${sale.date}</td>
        `;
        salesList.appendChild(row);
    });
}

// Calculate sales metrics
function calculateSalesMetrics(sales) {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalUnits = sales.reduce((sum, sale) => sum + sale.quantity, 0);

    document.getElementById('total-revenue').textContent = totalRevenue.toFixed(2);
    document.getElementById('total-units').textContent = totalUnits;

    // Category-wise sales breakdown
    const categorySales = sales.reduce((acc, sale) => {
        if (!acc[sale.category]) {
            acc[sale.category] = {
                quantity: 0,
                revenue: 0
            };
        }
        acc[sale.category].quantity += sale.quantity;
        acc[sale.category].revenue += sale.totalPrice;
        return acc;
    }, {});

    return {
        totalRevenue,
        totalUnits,
        categorySales
    };
}

// Generate sales report
function generateSalesReport(sales) {
    const metrics = calculateSalesMetrics(sales);

    return {
         totalRevenue: metrics.totalRevenue,
        totalUnits: metrics.totalUnits,
        categorySales: metrics.categorySales
    };
}

export { loadSalesSection, generateSalesReport };