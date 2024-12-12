function saveToLocalStorage(key, value) {
    console.log(`Saving ${key}:`, value); // Debugging
    localStorage.setItem(key, JSON.stringify(value));
}

function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    console.log(`Loading ${key}:`, data); // Debugging
    return data ? JSON.parse(data) : null;
}
