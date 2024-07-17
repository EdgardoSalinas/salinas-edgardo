// Function to send POST request
async function createItem(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

// Function to fetch items
async function getItems(url) {
    const response = await fetch(url);
    return response.json();
}

// Function to update item
async function updateItem(url, id, data) {
    const response = await fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

// Function to delete item
async function deleteItem(url, id) {
    const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
    });
    return response.json();
}

// Event listeners for form submissions
document.getElementById('ordenForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        usuario: document.getElementById('usuario').value,
        idDelServicio: document.getElementById('idDelServicio').value,
        usuarioDelProveedor: document.getElementById('usuarioDelProveedor').value,
        cantidad: document.getElementById('cantidad').value,
        precio: document.getElementById('precio').value,
        descripcion: document.getElementById('descripcion').value,
    };
    await createItem('/api/ordenes', data);
    // Refresh the list of orders
});

// Similar event listeners for servicioForm and userForm

// Function to display items
function displayItems(items, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = items.map(item => `
        <div class="item">
            <p>${JSON.stringify(item)}</p>
            <button onclick="updateItem('${elementId}', '${item._id}')">Update</button>
            <button onclick="deleteItem('${elementId}', '${item._id}')">Delete</button>
        </div>
    `).join('');
}

// Initial load of items
getItems('/api/ordenes').then(items => displayItems(items, 'ordenList'));
getItems('/api/servicios').then(items => displayItems(items, 'servicioList'));
getItems('/api/users').then(items => displayItems(items, 'userList'));
