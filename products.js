const products = [
    {
        id: 1,
        name: "Бездротові навушники",
        price: 999,
        category: "electronics",
        rating: 4.5,
        image: "images/OIP.jpg"
    },
    {
        id: 2,
        name: "Розумний годинник",
        price: 2999,
        category: "electronics",
        rating: 4.2,
        image: "images/Smart-wach.jpg"
    },
    {
        id: 3,
        name: "Бавовняна футболка",
        price: 499,
        category: "clothing",
        rating: 4.0,
        image: "images/Shirt.jpg"
    },
    {
        id: 4,
        name: "Дизайнерські джинси",
        price: 1299,
        category: "clothing",
        rating: 4.3,
        image: "images/Jeans.jpg"
    },
    {
        id: 5,
        name: "Бестселер книга",
        price: 299,
        category: "books",
        rating: 4.7,
        image: "images/book.jpg"
    },
    {
        id: 6,
        name: "Книга для кавового столика",
        price: 399,
        category: "books",
        rating: 4.1,
        image: "images/book.jpg"
    },
    {
        id: 7,
        name: "Розумна колонка",
        price: 1499,
        category: "electronics",
        rating: 4.4,
        image: "images/kolonka.jpg"
    },
    {
        id: 8,
        name: "Набір садових інструментів",
        price: 799,
        category: "home",
        rating: 4.6,
        image: "images/nabir.jpg"
    },
    {
        id: 9,
        name: "Кавоварка",
        price: 1899,
        category: "home",
        rating: 4.8,
        image: "images/Kavovarka.jpg"
    },
    {
        id: 10,
        name: "Пральна машина",
        price: 8999,
        category: "home",
        rating: 4.9,
        image: "images/pralna mashina.jpg"
    },
    {
        id: 11,
        name: "Дитяча іграшка",
        price: 299,
        category: "home",
        rating: 4.3,
        image: "images/igarska.jpg"
    },
    {
        id: 12,
        name: "Сорочка чоловіча",
        price: 699,
        category: "clothing",
        rating: 4.2,
        image: "images/shirt.jpg"
    }
];

const productsList = document.querySelector('.products-list');
const productsCount = document.querySelector('.products-count');
const sortSelect = document.querySelector('.sort-select');
const applyFiltersBtn = document.querySelector('.apply-filters');
const categoryCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
const priceSlider = document.querySelector('.price-slider');
const minPriceInput = document.querySelector('.min-price');
const maxPriceInput = document.querySelector('.max-price');
const ratingCheckboxes = document.querySelectorAll('.filter-options input[value^="4"], .filter-options input[value^="3"], .filter-options input[value^="2"]');
const pagination = document.querySelector('.pagination');
const pageNumbers = document.querySelector('.page-numbers');


let currentPage = 1;
const productsPerPage = products.length;
let filteredProducts = [...products];


function init() {
    renderProducts();
    setupEventListeners();
    updateProductsCount();
}


function renderProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    productsList.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price.toFixed(2)} грн</p>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''} (${product.rating})
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Додати до кошика</button>
            </div>
        </div>
    `).join('');

    updatePagination();
}


function setupEventListeners() {
    sortSelect.addEventListener('change', handleSort);
    applyFiltersBtn.addEventListener('click', applyFilters);
    priceSlider.addEventListener('input', updatePriceInputs);
    minPriceInput.addEventListener('change', updatePriceSlider);
    maxPriceInput.addEventListener('change', updatePriceSlider);
}


function handleSort() {
    const sortValue = sortSelect.value;
    
    switch(sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    currentPage = 1;
    renderProducts();
}


function applyFilters() {
    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    const minRating = Math.max(...Array.from(ratingCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.value)));

    filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;
        const ratingMatch = product.rating >= minRating;

        return categoryMatch && priceMatch && ratingMatch;
    });

    currentPage = 1;
    renderProducts();
    updateProductsCount();
}


function updatePriceInputs() {
    const value = priceSlider.value;
    maxPriceInput.value = value;
}


function updatePriceSlider() {
    const min = parseFloat(minPriceInput.value) || 0;
    const max = parseFloat(maxPriceInput.value) || 1000;
    
    if (min > max) {
        minPriceInput.value = max;
    }
    
    priceSlider.value = max;
}


function updateProductsCount() {
    productsCount.textContent = `Показано ${filteredProducts.length} товарів`;
}


function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    pageNumbers.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1)
        .map(pageNum => `
            <span class="${pageNum === currentPage ? 'active' : ''}" 
                  onclick="goToPage(${pageNum})">${pageNum}</span>
        `).join('');

    pagination.querySelector('.prev-page').disabled = currentPage === 1;
    pagination.querySelector('.next-page').disabled = currentPage === totalPages;
}


function goToPage(page) {
    currentPage = page;
    renderProducts();
}


function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEls = document.querySelectorAll('.cart-count, #cart-count');
    cartCountEls.forEach(el => el.textContent = count);
}

function addToCart(productId) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    setCart(cart);
    updateCartCount();
}


window.addEventListener('DOMContentLoaded', updateCartCount);

const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', function() {
    const scrollY = window.scrollY || window.pageYOffset;
    const showAt = window.innerHeight * 2 / 3;
    if (scrollY > showAt) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});
scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

init(); 