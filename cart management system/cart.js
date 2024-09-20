const addedDataJSON = ['http://localhost:3000/addedDataJSON'];

async function addProducts(apiEndpoint) {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json(); 

        data.forEach(product => {
            addedDataJSON.push({
                id: product.id,
                imageUrl: product.imageUrl,
                title: product.title,
                price: product.price,
                date: product.date,
                location: product.location,
                company: product.company
            });
        });

        displayProducts();

    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function displayProducts() {
    const container = document.getElementById('product-list');
    container.innerHTML = ''; 

    addedDataJSON.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Price: $${product.price}</p>
            <p>Date: ${product.date}</p>
            <p>Location: ${product.location}</p>
            <p>Company: ${product.company}</p>
        `;

        container.appendChild(productCard);
    });
}

const apiEndpoint = 'http://localhost:3000/addedDataJSON';

addProducts(apiEndpoint);

let cart = [];

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1; 
        cart.push(product); 
    }

    updateCartUI();
}

function deleteProductFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function increaseProductQuantity(productId) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += 1; 
    }

    updateCartUI();
}

function reduceProductQuantity(productId) {
    const product = cart.find(item => item.id === productId);
    if (product && product.quantity > 1) {
        product.quantity -= 1; 
    } else if (product && product.quantity === 1) {
        deleteProductFromCart(productId);
    }

    updateCartUI();
}

function editProductInCart(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    if (product && newQuantity > 0) {
        product.quantity = newQuantity; 
    } else if (product && newQuantity === 0) {
        deleteProductFromCart(productId);
    }

    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; 

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" width="50">
            <div>
                <h4>${item.title}</h4>
                <p>Price: $${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                <button onclick="increaseProductQuantity(${item.id})">+</button>
                <button onclick="reduceProductQuantity(${item.id})">-</button>
                <button onclick="deleteProductFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.getElementById('cart-total').innerText = `Total: $${cartTotal.toFixed(2)}`;
}

