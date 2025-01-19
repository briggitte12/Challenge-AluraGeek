const API_URL = "http://localhost:3301/productos";

async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error al obtener productos. Código: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            const productList = document.getElementById("product-list");
            productList.innerHTML = '';
            data.forEach(product => {
                addProductToList(product);
            });
        } else {
            console.error("La respuesta de la API no contiene productos válidos.");
        }
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

function addProductToList(product) {
    const productList = document.getElementById("product-list");

    const productItem = document.createElement("div");
    productItem.classList.add("product-card");

    productItem.innerHTML = `
        <img src="${product.imagen}" alt="${product.nombre}">
        <h3>${product.nombre}</h3>
        <p>S/. ${product.precio}</p>
        <button class="delete-btn" onclick="deleteProduct('${product.id}')">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    productList.appendChild(productItem);
}

async function addProductToAPI(product) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            throw new Error(`Error al agregar producto. Código: ${response.status}`);
        }

        const data = await response.json();
        console.log("Producto agregado:", data);

        loadProducts();
    } catch (error) {
        console.error("Error al agregar producto:", error);
    }
}

async function updateProduct(productId, updatedProductData) {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProductData),
        });

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Error al actualizar producto:", error);
    }
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar producto. Código: ${response.status}`);
        }

        console.log(`Producto con ID ${productId} eliminado.`);
        loadProducts(); 
    } catch (error) {
        console.error("Error al eliminar producto:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});