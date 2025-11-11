/**
 * Product Module - Hami MiniMarket
 * Handles product display, rendering, and "Add to Cart" functionality
 * Depends on: CartModule
 */

const ProductModule = (function() {
    'use strict';

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
            image: "images/products/lettuce.jpg",
            badge: "Versatile"
        },
        {
            id: 10,
            name: "Ripe Avocados",
            category: "fruits",
            price: 3.99,
            description: "Creamy ripe avocados, perfect for toast, salads, and healthy snacking.",
            image: "images/products/apples.jpg",
            badge: "Superfood"
        }
    ];

    // DOM elements
    let productsGrid = null;

    /**
     * Initialize the product module
     */
    function init() {
        productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            renderProducts(products);
            updateButtonStatesFromCart();
        }
    }

    /**
     * Get product by ID
     * @param {number} productId - Product ID
     * @returns {Object|null} Product object or null if not found
     */
    function getProduct(productId) {
        return products.find(p => p.id === productId) || null;
    }

    /**
     * Get all products
     * @returns {Array} Array of all products
     */
    function getAllProducts() {
        return [...products];
    }

    /**
     * Render all products to the grid
     * @param {Array} productsToRender - Array of products to render
     */
    function renderProducts(productsToRender) {
        if (!productsGrid) {
            productsGrid = document.getElementById('productsGrid');
            if (!productsGrid) return;
        }

        if (!productsToRender || productsToRender.length === 0) {
            productsGrid.style.display = 'none';
            const noResults = document.getElementById('noResults');
            if (noResults) {
                noResults.style.display = 'block';
            }
            return;
        }

        productsGrid.style.display = 'grid';
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = 'none';
        }

        productsGrid.innerHTML = '';

        productsToRender.forEach(product => {
            const productCard = renderProductCard(product);
            productsGrid.appendChild(productCard);
        });

        // Initialize lazy loading for images
        initializeLazyLoading();

        // Add animations
        animateProductCards();
    }

    /**
     * Render a single product card
     * @param {Object} product - Product object
     * @returns {HTMLElement} Product card element
     */
    function renderProductCard(product) {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);
        card.setAttribute('tabindex', '0');

        // Check if product is in cart
        const isInCart = typeof CartModule !== 'undefined' && CartModule.isInCart(product.id);

        card.innerHTML = `
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
                        <span class="cart-icon">${isInCart ? '✓' : '🛒'}</span>
                        ${isInCart ? 'Added' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;

        // Add event listener to the button
        const addToCartBtn = card.querySelector('.product-card__add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => handleAddToCart(e, product.id));
        }

        // Add keyboard support for the card
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const btn = this.querySelector('.product-card__add-to-cart');
                if (btn) btn.click();
            }
        });

        return card;
    }

    /**
     * Handle add to cart button click
     * @param {Event} event - Click event
     * @param {number} productId - Product ID
     */
    function handleAddToCart(event, productId) {
        event.stopPropagation();
        
        const button = event.currentTarget;
        const product = getProduct(productId);

        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        // Add to cart via CartModule
        if (typeof CartModule !== 'undefined') {
            CartModule.addToCart(product);
        } else {
            console.error('CartModule not available');
            return;
        }

        // Update button state to show "Added"
        updateButtonState(productId, true);

        // Add scale animation on button click
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);

        // Add haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }

        // Reset button state after 2 seconds
        setTimeout(() => {
            updateButtonState(productId, false);
        }, 2000);
    }

    /**
     * Update button state after adding to cart
     * @param {number} productId - Product ID
     * @param {boolean} isAdded - Whether product was just added (shows "Added" temporarily)
     */
    function updateButtonState(productId, isAdded) {
        const button = document.querySelector(`.product-card__add-to-cart[data-product-id="${productId}"]`);
        
        if (!button) return;

        if (isAdded) {
            button.classList.add('added');
            button.innerHTML = '<span class="cart-icon">✓</span>Added';
        } else {
            // Check if product is actually in cart
            const isInCart = typeof CartModule !== 'undefined' && CartModule.isInCart(productId);
            
            if (isInCart) {
                button.classList.add('added');
                button.innerHTML = '<span class="cart-icon">✓</span>Added';
            } else {
                button.classList.remove('added');
                button.innerHTML = '<span class="cart-icon">🛒</span>Add to Cart';
            }
        }
    }

    /**
     * Update all button states based on cart contents
     * Called on page load to sync button states with cart
     */
    function updateButtonStatesFromCart() {
        if (typeof CartModule === 'undefined') return;

        const buttons = document.querySelectorAll('.product-card__add-to-cart');
        buttons.forEach(button => {
            const productId = parseInt(button.dataset.productId);
            const isInCart = CartModule.isInCart(productId);
            
            if (isInCart) {
                button.classList.add('added');
                button.innerHTML = '<span class="cart-icon">✓</span>Added';
            } else {
                button.classList.remove('added');
                button.innerHTML = '<span class="cart-icon">🛒</span>Add to Cart';
            }
        });
    }

    /**
     * Initialize lazy loading for product images
     */
    function initializeLazyLoading() {
        if (!productsGrid) return;

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
        if (!productsGrid) return;

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

    // Public API
    return {
        init,
        renderProducts,
        renderProductCard,
        handleAddToCart,
        updateButtonState,
        updateButtonStatesFromCart,
        getProduct,
        getAllProducts
    };
})();

// Export for ES6 modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductModule;
}
