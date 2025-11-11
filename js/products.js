/**
 * Hami MiniMarket Product Catalog - JavaScript
 * Handles product display, search, filtering, and cart functionality
 */

// Product data
const products = [
    {
        id: 1,
        name: "Fresh Red Apples",
        category: "fruits",
        price: 2.99,
        description: "Crisp and sweet locally-grown apples, perfect for snacking or baking.",
        image: "images/products/apples.jpg",
        badge: "Popular"
    },
    {
        id: 2,
        name: "Organic Bananas",
        category: "fruits",
        price: 1.99,
        description: "Naturally ripened organic bananas, rich in potassium and perfect for smoothies.",
        image: "images/products/bananas.jpg",
        badge: "Organic"
    },
    {
        id: 3,
        name: "Fresh Carrots",
        category: "vegetables",
        price: 1.49,
        description: "Crunchy orange carrots packed with vitamins, great for cooking or raw snacking.",
        image: "images/products/carrots.jpg",
        badge: "Fresh"
    },
    {
        id: 4,
        name: "Vine Tomatoes",
        category: "vegetables",
        price: 3.49,
        description: "Juicy vine-ripened tomatoes with exceptional flavor for salads and cooking.",
        image: "images/products/tomatoes.jpg",
        badge: "Premium"
    },
    {
        id: 5,
        name: "Fresh Lettuce",
        category: "vegetables",
        price: 2.29,
        description: "Crisp green lettuce leaves, perfect for fresh salads and healthy meals.",
        image: "images/products/lettuce.jpg",
        badge: "Fresh"
    },
    {
        id: 6,
        name: "Sweet Oranges",
        category: "fruits",
        price: 2.79,
        description: "Juicy sweet oranges bursting with vitamin C and natural citrus flavor.",
        image: "images/products/oranges.jpg",
        badge: "Vitamin C"
    },
    {
        id: 7,
        name: "Fresh Broccoli",
        category: "vegetables",
        price: 2.99,
        description: "Nutritious green broccoli florets, excellent source of vitamins and minerals.",
        image: "images/products/broccoli.jpg",
        badge: "Healthy"
    },
    {
        id: 8,
        name: "Sweet Strawberries",
        category: "fruits",
        price: 4.99,
        description: "Fresh, sweet strawberries perfect for desserts, smoothies, or eating fresh.",
        image: "images/products/strawberries.jpg",
        badge: "Seasonal"
    },
    {
        id: 9,
        name: "Green Bell Peppers",
        category: "vegetables",
        price: 2.49,
        description: "Fresh green bell peppers, perfect for stir-fries, salads, and stuffing.",
        image: "images/products/lettuce.jpg", // Using lettuce as placeholder for green vegetables
        badge: "Versatile"
    },
    {
        id: 10,
        name: "Ripe Avocados",
        category: "fruits",
        price: 3.99,
        description: "Creamy ripe avocados, perfect for toast, salads, and healthy snacking.",
        image: "images/products/apples.jpg", // Using apples as placeholder for fruits
        badge: "Superfood"
    }
];

// Global variables
let filteredProducts = [...products];
let cart = JSON.parse(localStorage.getItem('hamiCart')) || [];
let currentSort = 'name';

// DOM elements
let searchInput, categoryFilter, priceFilter, sortSelect, productsGrid, resultsCount, noResults, cartCount, searchClear, resetFilters, cartReset, cartModal, cartModalClose, cartModalContent, cartEmpty, cartItems, cartTotal, cartContinueShopping, cartCheckout;

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    initializeElements();
    initializeEventListeners();
    updateCartDisplay();
    displayProducts();
    updateResultsCount();

    // Initialize responsive behavior after elements are ready
    handleResponsiveChanges();
    
    // Initialize cart reset button visibility
    if (cartReset && cart.length === 0) {
        cartReset.classList.add('hidden');
    }

    // Set active navigation link for products page
    const productNavLink = document.querySelector('a[href="products.html"]');
    if (productNavLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.header__nav-link').forEach(link => {
            link.classList.remove('active');
        });
        // Add active class to products link
        productNavLink.classList.add('active');
    }
});

/**
 * Initialize DOM elements
 */
function initializeElements() {
    searchInput = document.getElementById('searchInput');
    categoryFilter = document.getElementById('categoryFilter');
    priceFilter = document.getElementById('priceFilter');
    sortSelect = document.getElementById('sortSelect');
    productsGrid = document.getElementById('productsGrid');
    resultsCount = document.getElementById('resultsCount');
    noResults = document.getElementById('noResults');
    cartCount = document.getElementById('cartCount');
    searchClear = document.getElementById('searchClear');
    resetFilters = document.getElementById('resetFilters');
    cartReset = document.getElementById('cartReset');
    cartModal = document.getElementById('cartModal');
    cartModalClose = document.getElementById('cartModalClose');
    cartModalContent = document.getElementById('cartModalContent');
    cartEmpty = document.getElementById('cartEmpty');
    cartItems = document.getElementById('cartItems');
    cartTotal = document.getElementById('cartTotal');
    cartContinueShopping = document.getElementById('cartContinueShopping');
    cartCheckout = document.getElementById('cartCheckout');
}

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchClear.addEventListener('click', clearSearch);

    // Filter functionality
    categoryFilter.addEventListener('change', handleFilters);
    priceFilter.addEventListener('change', handleFilters);

    // Sort functionality
    sortSelect.addEventListener('change', handleSort);

    // Reset filters
    resetFilters.addEventListener('click', resetAllFilters);
    
    // Cart reset
    if (cartReset) {
        cartReset.addEventListener('click', resetCart);
    }
    
    // Cart modal
    if (document.getElementById('cartCounter')) {
        document.getElementById('cartCounter').addEventListener('click', toggleCartModal);
    }
    
    if (cartModalClose) {
        cartModalClose.addEventListener('click', closeCartModal);
    }
    
    if (cartContinueShopping) {
        cartContinueShopping.addEventListener('click', closeCartModal);
    }
    
    if (cartCheckout) {
        cartCheckout.addEventListener('click', handleCheckout);
    }
    
    // Close cart modal when clicking outside
    document.addEventListener('click', function(event) {
        if (cartModal && cartModal.classList.contains('show')) {
            if (!cartModal.contains(event.target) && !document.getElementById('cartCounter').contains(event.target)) {
                closeCartModal();
            }
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

/**
 * Handle search input
 */
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Show/hide clear button
    if (searchTerm) {
        searchClear.classList.add('show');
    } else {
        searchClear.classList.remove('show');
    }

    applyFilters();
}

/**
 * Clear search input
 */
function clearSearch() {
    searchInput.value = '';
    searchClear.classList.remove('show');
    searchInput.focus();
    applyFilters();
}

/**
 * Handle filter changes
 */
function handleFilters() {
    applyFilters();
}

/**
 * Handle sort changes
 */
function handleSort() {
    currentSort = sortSelect.value;
    sortProducts();
    displayProducts();
}

/**
 * Apply all filters
 */
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const maxPrice = priceFilter.value ? parseFloat(priceFilter.value) : null;

    filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        // Category filter
        const matchesCategory = !selectedCategory || product.category === selectedCategory;

        // Price filter
        const matchesPrice = !maxPrice || product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    sortProducts();
    displayProducts();
    updateResultsCount();
}

/**
 * Sort products based on current sort option
 */
function sortProducts() {
    filteredProducts.sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'price':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            default:
                return 0;
        }
    });
}

/**
 * Display products in the grid
 */
function displayProducts() {
    if (!productsGrid || !noResults) return;

    if (filteredProducts.length === 0) {
        productsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    productsGrid.style.display = 'grid';
    noResults.style.display = 'none';

    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');

    // Add event listeners to add-to-cart buttons
    const addToCartButtons = productsGrid.querySelectorAll('.product-card__add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // Initialize lazy loading for images
    initializeLazyLoadingForProducts();

    // Add animation to product cards
    animateProductCards();
}

/**
 * Create HTML for a product card
 */
function createProductCard(product) {
    const isInCart = cart.some(item => item.id === product.id);

    return `
        <article class="product-card" data-product-id="${product.id}" tabindex="0">
            <div class="product-card__image-container">
                <img src="${product.image}" 
                     alt="${product.name} - ${product.description}" 
                     class="product-card__image"
                     loading="lazy">
                <div class="product-card__badge">${product.badge}</div>
            </div>
            <div class="product-card__info">
                <div class="product-card__header">
                    <h3 class="product-card__name">${product.name}</h3>
                    <span class="product-card__category">${product.category}</span>
                </div>
                <p class="product-card__description">${product.description}</p>
                <div class="product-card__footer">
                    <span class="product-card__price">$${product.price.toFixed(2)}</span>
                    <button class="product-card__add-to-cart ${isInCart ? 'added' : ''}" 
                            data-product-id="${product.id}"
                            aria-label="Add ${product.name} to cart">
                        <span class="cart-icon">🛒</span>
                        ${isInCart ? 'Added' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </article>
    `;
}

/**
 * Handle add to cart button clicks
 */
function handleAddToCart(event) {
    const button = event.currentTarget;
    const productId = parseInt(button.dataset.productId);
    const product = products.find(p => p.id === productId);

    if (!product) return;

    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    // Update button state
    button.classList.add('added');
    button.innerHTML = '<span class="cart-icon">✓</span>Added';

    // Save cart to localStorage
    localStorage.setItem('hamiCart', JSON.stringify(cart));

    // Update cart display
    updateCartDisplay();

    // Add haptic feedback on mobile
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }

    // Show success animation
    button.style.transform = 'scale(1.1)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);

    // Reset button after 2 seconds
    setTimeout(() => {
        button.classList.remove('added');
        button.innerHTML = '<span class="cart-icon">🛒</span>Add to Cart';
    }, 2000);
}

/**
 * Update cart display
 */
function updateCartDisplay() {
    if (!cartCount) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Show/hide cart reset button based on cart contents
    if (cartReset) {
        if (totalItems > 0) {
            cartReset.classList.remove('hidden');
        } else {
            cartReset.classList.add('hidden');
        }
    }

    // Update cart modal if it's open
    if (cartModal && cartModal.classList.contains('show')) {
        updateCartModalContent();
    }

    // Add animation when cart count changes
    if (totalItems > 0) {
        cartCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCount.style.transform = '';
        }, 200);
    }
}

/**
 * Reset the shopping cart
 */
function resetCart() {
    // Show confirmation dialog
    const confirmReset = confirm('Are you sure you want to clear your shopping cart? This action cannot be undone.');
    
    if (confirmReset) {
        // Clear the cart array
        cart = [];
        
        // Update localStorage
        localStorage.setItem('hamiCart', JSON.stringify(cart));
        
        // Update cart display
        updateCartDisplay();
        
        // Reset all "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.product-card__add-to-cart');
        addToCartButtons.forEach(button => {
            button.classList.remove('added');
            button.innerHTML = '<span class="cart-icon">🛒</span>Add to Cart';
        });
        
        // Add haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
        
        // Show success message
        showCartResetMessage();
    }
}

/**
 * Show cart reset success message
 */
function showCartResetMessage() {
    // Create temporary message element
    const message = document.createElement('div');
    message.className = 'cart-reset-message';
    message.textContent = 'Shopping cart cleared successfully!';
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--color-primary);
        color: var(--color-white);
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#cart-reset-animations')) {
        const style = document.createElement('style');
        style.id = 'cart-reset-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 3000);
}

/**
 * Toggle cart modal visibility
 */
function toggleCartModal() {
    if (!cartModal) return;
    
    if (cartModal.classList.contains('show')) {
        closeCartModal();
    } else {
        openCartModal();
    }
}

/**
 * Open cart modal
 */
function openCartModal() {
    if (!cartModal) return;
    
    updateCartModalContent();
    cartModal.classList.add('show');
    
    // Add backdrop for mobile
    if (window.innerWidth <= 768) {
        const backdrop = document.createElement('div');
        backdrop.className = 'cart-modal-backdrop show';
        backdrop.id = 'cartModalBackdrop';
        backdrop.addEventListener('click', closeCartModal);
        document.body.appendChild(backdrop);
        document.body.style.overflow = 'hidden';
    }
    
    // Focus the close button for accessibility
    if (cartModalClose) {
        setTimeout(() => cartModalClose.focus(), 100);
    }
}

/**
 * Close cart modal
 */
function closeCartModal() {
    if (!cartModal) return;
    
    cartModal.classList.remove('show');
    
    // Remove backdrop
    const backdrop = document.getElementById('cartModalBackdrop');
    if (backdrop) {
        backdrop.remove();
        document.body.style.overflow = '';
    }
}

/**
 * Update cart modal content
 */
function updateCartModalContent() {
    if (!cartItems || !cartEmpty || !cartTotal) return;
    
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.style.display = 'none';
        if (document.getElementById('cartModalFooter')) {
            document.getElementById('cartModalFooter').style.display = 'none';
        }
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'block';
    if (document.getElementById('cartModalFooter')) {
        document.getElementById('cartModalFooter').style.display = 'block';
    }
    
    // Clear existing items
    cartItems.innerHTML = '';
    
    // Add cart items
    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItems.appendChild(cartItemElement);
    });
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

/**
 * Create cart item element
 */
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item__image">
        <div class="cart-item__details">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__price">$${item.price.toFixed(2)} each</div>
        </div>
        <div class="cart-item__controls">
            <div class="cart-item__quantity">
                <button class="cart-item__qty-btn" onclick="updateCartItemQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                <span class="cart-item__qty-number">${item.quantity}</span>
                <button class="cart-item__qty-btn" onclick="updateCartItemQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="cart-item__remove" onclick="removeCartItem(${item.id})" title="Remove item">🗑️</button>
        </div>
    `;
    return cartItem;
}

/**
 * Update cart item quantity
 */
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeCartItem(productId);
        return;
    }
    
    // Update localStorage
    localStorage.setItem('hamiCart', JSON.stringify(cart));
    
    // Update displays
    updateCartDisplay();
    updateCartModalContent();
    
    // Add haptic feedback
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

/**
 * Remove item from cart
 */
function removeCartItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Update localStorage
    localStorage.setItem('hamiCart', JSON.stringify(cart));
    
    // Update displays
    updateCartDisplay();
    updateCartModalContent();
    
    // Reset the corresponding "Add to Cart" button
    const addToCartButton = document.querySelector(`[data-product-id="${productId}"]`);
    if (addToCartButton) {
        addToCartButton.classList.remove('added');
        addToCartButton.innerHTML = '<span class="cart-icon">🛒</span>Add to Cart';
    }
    
    // Add haptic feedback
    if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
    }
    
    // Close modal if cart is empty
    if (cart.length === 0) {
        setTimeout(() => {
            closeCartModal();
        }, 500);
    }
}

/**
 * Handle checkout button click
 */
function handleCheckout() {
    if (cart.length === 0) return;
    
    // For now, just show an alert (in a real app, this would redirect to checkout)
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    alert(`Checkout functionality would be implemented here!\n\nOrder Summary:\n${itemCount} items\nTotal: $${total.toFixed(2)}`);
    
    closeCartModal();
}

/**
 * Update results count display
 */
function updateResultsCount() {
    if (!resultsCount) return;

    const count = filteredProducts.length;
    const total = products.length;

    if (count === total) {
        resultsCount.textContent = `Showing all ${total} products`;
    } else {
        resultsCount.textContent = `Showing ${count} of ${total} products`;
    }
}

/**
 * Reset all filters
 */
function resetAllFilters() {
    if (!searchInput || !categoryFilter || !priceFilter || !sortSelect || !searchClear) return;

    searchInput.value = '';
    categoryFilter.value = '';
    priceFilter.value = '';
    sortSelect.value = 'name';
    searchClear.classList.remove('show');

    currentSort = 'name';
    applyFilters();

    // Focus search input for better UX
    searchInput.focus();
}

/**
 * Initialize lazy loading for product images
 */
function initializeLazyLoadingForProducts() {
    const images = productsGrid.querySelectorAll('.product-card__image');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('lazy-loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Animate product cards on display
 */
function animateProductCards() {
    const cards = productsGrid.querySelectorAll('.product-card');

    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.4s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation(event) {
    // Close cart modal with Escape key
    if (event.key === 'Escape') {
        if (cartModal && cartModal.classList.contains('show')) {
            closeCartModal();
            return;
        }
        if (document.activeElement === searchInput) {
            clearSearch();
        }
    }

    // Quick filter shortcuts
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case 'f':
                event.preventDefault();
                searchInput.focus();
                break;
            case 'r':
                event.preventDefault();
                resetAllFilters();
                break;
            case 'd':
                event.preventDefault();
                if (cart.length > 0) {
                    resetCart();
                }
                break;
            case 'c':
                event.preventDefault();
                toggleCartModal();
                break;
        }
    }
}

/**
 * Debounce function for search input
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle product card keyboard interaction
 */
document.addEventListener('keydown', function (event) {
    if (event.target.classList.contains('product-card')) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const addToCartButton = event.target.querySelector('.product-card__add-to-cart');
            if (addToCartButton) {
                addToCartButton.click();
            }
        }
    }
});

/**
 * Handle responsive behavior
 */
function handleResponsiveChanges() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Optimize for mobile
        if (searchInput) {
            searchInput.setAttribute('inputmode', 'search');
        }

        // Adjust grid for mobile
        if (productsGrid) {
            productsGrid.style.gridTemplateColumns = '1fr';
        }
    } else {
        // Desktop optimizations
        if (productsGrid) {
            productsGrid.style.gridTemplateColumns = '';
        }
    }
}

// Listen for window resize
window.addEventListener('resize', debounce(handleResponsiveChanges, 250));

/**
 * Export functions for potential testing or external use
 */
window.ProductCatalog = {
    products,
    filteredProducts,
    cart,
    applyFilters,
    resetAllFilters,
    resetCart,
    handleAddToCart,
    updateCartDisplay,
    displayProducts
};

// Make functions available globally for HTML onclick
window.resetAllFilters = resetAllFilters;
window.resetCart = resetCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeCartItem = removeCartItem;

/**
 * Performance monitoring
 * Tracks page load time for optimization purposes
 */
if ('performance' in window) {
    window.addEventListener('load', function () {
        const loadTime = performance.now();
        // Performance metrics can be sent to analytics service here
    });
}

/**
 * Service Worker registration for offline functionality (optional)
 * Uncomment when service worker is implemented
 */
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function () {
//         navigator.serviceWorker.register('/sw.js')
//             .then(registration => {
//                 // Service worker registered successfully
//             })
//             .catch(registrationError => {
//                 // Service worker registration failed
//             });
//     });
// }