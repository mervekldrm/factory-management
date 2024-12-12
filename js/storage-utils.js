// storage-utils.js

// Utility function to get data from local storage
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Utility function to save data to local storage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Utility function to reset data in local storage
function resetData(key) {
    localStorage.removeItem(key);
}

// Utility function to clear all local storage data
function clearAllData() {
    localStorage.clear();
}

// Utility function to delete an item from local storage by key and ID
function deleteItem(key, id) {
    const data = JSON.parse(localStorage.getItem(key)) || [];
    const filteredData = data.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filteredData));
}

// Utility function to export data to a CSV file
function exportToCSV(key, fileName = 'data.csv') {
    const data = JSON.parse(localStorage.getItem(key)) || [];
    if (data.length === 0) {
        alert("No data available to export.");
        return;
    }

    const headers = Object.keys(data[0]); // Get the keys from the first object
    const rows = data.map(item => headers.map(header => JSON.stringify(item[header] || '')).join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}
// Utility function to filter data from local storage by a specific field and value
function filterData(key, field, value) {
    const data = JSON.parse(localStorage.getItem(key)) || [];
    return data.filter(item => item[field].toLowerCase().includes(value.toLowerCase()));
}

// Export utility functions
export { getData, saveData, resetData, clearAllData, deleteItem, exportToCSV, filterData };
