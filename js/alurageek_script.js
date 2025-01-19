const productForm = document.getElementById("product-form");
const productList = document.getElementById("product-list");

function saveProductsToLocalStorage(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

function loadProductsFromLocalStorage() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.forEach((product) => addProductToList(product));
}

function addProductToList(productData) {
    const product = document.createElement("div");
    product.classList.add("product-card");

    product.innerHTML = `
        <img src="${productData.image}" alt="${productData.name}">
        <h3>${productData.name}</h3>
        <p>S/. ${productData.price}</p>
        <button class="delete-btn" onclick="deleteProductLocal('${productData.id}')">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    productList.appendChild(product);
}

function isDuplicate(productData) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    return products.some(product => product.name === productData.name || product.image === productData.image);
}

productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const image = document.getElementById("product-image").files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
        const productData = {
            id: Date.now().toString(),
            name,
            price,
            image: reader.result,
        };

        if (isDuplicate(productData)) {
            alert("El producto ya existe (por nombre o imagen).");
            return;
        }

        addProductToList(productData);

        const products = JSON.parse(localStorage.getItem("products")) || [];
        products.push(productData);
        saveProductsToLocalStorage(products);

        productForm.reset();
    };

    if (image) {
        reader.readAsDataURL(image);
    }
});

function deleteProductLocal(productId) {
    const product = document.querySelector(`.product-card [onclick*='${productId}']`).closest(".product-card");
    product.remove();

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const updatedProducts = products.filter((p) => p.id !== productId);
    saveProductsToLocalStorage(updatedProducts);
}

document.addEventListener("DOMContentLoaded", loadProductsFromLocalStorage);
