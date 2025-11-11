/**
 * Cart Module - Hami MiniMarket
 * Manages shopping cart state, operations, and UI rendering
 * Depends on: StorageModule
 */

const CartModule = (function() {
    'use strict';

    // Cart state
    let cartItems = [];

    // Configuration
    const TAX_RATE = 0.05;           // 5% tax
    const DISCOUNT_THRESHOLD = 50;   // $50 minimum for discount
    const DISCOUNT_RATE = 0.10;      // 10% discount

    // DOM elements (will be initialized)
    let elements = {
        cartCount: null,
        cartModal: null,
        cartModalClose: null,
        cartEmpty: null,
        cartItems: null,
        cartSubtotal: null,
        cartDiscount: null,
        cartTax: null,
        cartTotal: null,
        cartContinueShopping: null,
        cartCheckout: null,
        cartBackdrop: null
    };

    /**
     * Initialize the cart module
     */
    function init() {
        initializeElements();
        loadCartFromStorage();
        initializeEventListeners();
        updateCartCounter();
    }

    /**
     * Initialize DOM element references
     */
    function initializeElements() {
        elements.cartCount = document.getElementById('cartCount');
        elements.cartModal = document.getElementById('cartModal');
        elements.cartModalClose = document.getElementById('cartModalClose');
        elements.cartEmpty = document.getElementById('cartEmpty');
        elements.cartItems = document.getElementById('cartItems');
        elements.cartSubtotal = document.getElementById('cartSubtotal');
        elements.cartDiscount = document.getElementById('cartDiscount');
        elements.cartTax = document.getElementById('cartTax');
        elements.cartTotal = document.getElementById('cartTotal');
        elements.cartContinueShopping = document.getElementById('cartContinueShopping');
        elements.cartCheckout = document.getElementById('cartCheckout');
        
        // Create backdrop element if it doesn't exist
        elements.cartBackdrop = document.getElementById('cartModalBackdrop');
        if (!elements.cartBackdrop) {
            elements.cartBackdrop = document.createElement('div');
            elements.cartBackdrop.id = 'cartModalBackdrop';
            elements.cartBackdrop.className = 'cart-modal-backdrop';
            document.body.appendChild(elements.cartBackdrop);
        }
    }

    /**
     * Initialize event listeners
     */
    function initializeEventListeners() {
        // Cart counter click
        const cartCounter = document.getElementById('cartCounter');
        if (cartCounter) {
            cartCounter.addEventListener('click', toggleCartModal);
        }

        // Close button
        if (elements.cartModalClose) {
            elements.cartModalClose.addEventListener('click', closeCartModal);
        }

        // Continue shopping button
        if (elements.cartContinueShopping) {
            elements.cartContinueShopping.addEventListener('click', closeCartModal);
        }

        // Checkout button
        if (elements.cartCheckout) {
            elements.cartCheckout.addEventListener('click', handleCheckout);
        }

        // Backdrop click to close
        if (elements.cartBackdrop) {
            elements.cartBackdrop.addEventListener('click', closeCartModal);
        }

        // Close on escape key
        document.addEventListener('keydown', handleEscapeKey);

        // Close when clicking outside (for desktop dropdown)
        document.addEventListener('click', handleClickOutside);
    }

    /**
     * Load cart from storage
     */
    function loadCartFromStorage() {
        if (typeof StorageModule !== 'undefined') {
            const savedCart = StorageModule.loadCart();
            if (savedCart && Array.isArray(savedCart)) {
                cartItems = savedCart;
            }
        }
    }

    /**
     * Save cart to storage
     */
    function saveCartToStorage() {
        if (typeof StorageModule !== 'undefined') {
            StorageModule.saveCart(cartItems);
        }
    }

    /**
     * Add product to cart
     * @param {Object} product - Product object with id, name, price, image
     */
    function addToCart(product) {
        if (!product || !product.id) {
            console.error('Invalid product');
            return;
        }

        const existingItem = cartItems.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        saveCartToStorage();
        updateCartCounter();
        
        // Show toast notification
        if (typeof ToastModule !== 'undefined') {
            ToastModule.success(`${product.name} added to cart`);
        }
        
        // Trigger haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    /**
     * Remove item from cart
     * @param {number} productId - Product ID to remove
     */
    function removeFromCart(productId) {
        const removedItem = cartItems.find(item => item.id === productId);
        
        // Find the cart item element and animate it out
        const cartItemElements = document.querySelectorAll('.cart-item');
        cartItemElements.forEach(element => {
            const removeBtn = element.querySelector(`[data-id="${productId}"]`);
            if (removeBtn && removeBtn.dataset.action === 'remove') {
                // Add removing class to trigger fade-out animation
                element.classList.add('removing');
                
                // Wait for animation to complete before removing from DOM
                setTimeout(() => {
                    cartItems = cartItems.filter(item => item.id !== productId);
                    saveCartToStorage();
                    updateCartCounter();
                    renderCart();
                }, 300); // Match animation duration
                
                return;
            }
        });
        
        // Fallback if element not found
        if (!document.querySelector('.cart-item.removing')) {
            cartItems = cartItems.filter(item => item.id !== productId);
            saveCartToStorage();
            updateCartCounter();
            renderCart();
        }

        // Show toast notification
        if (typeof ToastModule !== 'undefined' && removedItem) {
            ToastModule.info(`${removedItem.name} removed from cart`);
        }

        // Trigger haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    /**
     * Update item quantity
     * @param {number} productId - Product ID
     * @param {number} quantity - New quantity
     */
    function updateQuantity(productId, quantity) {
        const item = cartItems.find(item => item.id === productId);
        
        if (!item) return;

        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        // Animate quantity change
        const cartItemElements = document.querySelectorAll('.cart-item');
        cartItemElements.forEach(element => {
            const qtyBtn = element.querySelector(`[data-id="${productId}"]`);
            if (qtyBtn) {
                const qtyNumber = element.querySelector('.cart-item__qty-number');
                const lineTotal = element.querySelector('.cart-item__line-total');
                
                if (qtyNumber) {
                    qtyNumber.classList.add('updating');
                    setTimeout(() => qtyNumber.classList.remove('updating'), 300);
                }
                
                if (lineTotal) {
                    lineTotal.classList.add('updating');
                    setTimeout(() => lineTotal.classList.remove('updating'), 300);
                }
            }
        });

        item.quantity = quantity;
        saveCartToStorage();
        updateCartCounter();
        
        // Delay render slightly to show animation
        setTimeout(() => {
            renderCart();
        }, 50);

        // Trigger haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }

    /**
     * Get all cart items
     * @returns {Array} Array of cart items
     */
    function getCartItems() {
        return [...cartItems];
    }

    /**
     * Calculate cart summary
     * @returns {Object} Cart summary with subtotal, tax, discount, total, itemCount
     */
    function calculateSummary() {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = subtotal >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
        const taxableAmount = subtotal - discount;
        const tax = taxableAmount * TAX_RATE;
        const total = taxableAmount + tax;
        const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            discount: parseFloat(discount.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            itemCount
        };
    }

    /**
     * Clear entire cart
     */
    function clearCart() {
        cartItems = [];
        saveCartToStorage();
        updateCartCounter();
        renderCart();
        
        // Show toast notification
        if (typeof ToastModule !== 'undefined') {
            ToastModule.info('Cart cleared');
        }
    }

    /**
     * Check if product is in cart
     * @param {number} productId - Product ID to check
     * @returns {boolean} True if product is in cart
     */
    function isInCart(productId) {
        return cartItems.some(item => item.id === productId);
    }

    /**
     * Get total item count
     * @returns {number} Total number of items in cart
     */
    function getItemCount() {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }

    /**
     * Update cart counter badge
     */
    function updateCartCounter() {
        if (!elements.cartCount) return;

        const itemCount = getItemCount();
        const cartCounter = document.getElementById('cartCounter');
        
        // Update counter text
        elements.cartCount.textContent = itemCount;

        // Show/hide counter based on item count
        if (itemCount > 0) {
            if (cartCounter) {
                cartCounter.style.opacity = '1';
                cartCounter.style.visibility = 'visible';
            }
            
            // Add scale pulse animation
            elements.cartCount.classList.remove('pulse-animation');
            // Force reflow to restart animation
            void elements.cartCount.offsetWidth;
            elements.cartCount.classList.add('pulse-animation');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                elements.cartCount.classList.remove('pulse-animation');
            }, 400);
        } else {
            // Hide counter when cart is empty
            if (cartCounter) {
                cartCounter.style.opacity = '0.5';
            }
        }
    }

    /**
     * Handle escape key press
     * @param {KeyboardEvent} e - Keyboard event
     */
    function handleEscapeKey(e) {
        if (e.key === 'Escape' && elements.cartModal && elements.cartModal.classList.contains('show')) {
            closeCartModal();
        }
    }

    /**
     * Handle click outside modal
     * @param {MouseEvent} e - Mouse event
     */
    function handleClickOutside(e) {
        if (elements.cartModal && elements.cartModal.classList.contains('show')) {
            const cartCounter = document.getElementById('cartCounter');
            // Only close on desktop (when backdrop is not visible)
            if (window.innerWidth > 768) {
                if (!elements.cartModal.contains(e.target) && 
                    cartCounter && !cartCounter.contains(e.target)) {
                    closeCartModal();
                }
            }
        }
    }

    /**
     * Toggle cart modal visibility
     */
    function toggleCartModal() {
        if (!elements.cartModal) return;

        if (elements.cartModal.classList.contains('show')) {
            closeCartModal();
        } else {
            openCartModal();
        }
    }

    /**
     * Open cart modal with animations
     */
    function openCartModal() {
        if (!elements.cartModal) return;

        // Render cart content
        renderCart();
        
        // Show backdrop on mobile
        if (elements.cartBackdrop && window.innerWidth <= 768) {
            elements.cartBackdrop.classList.add('show');
        }
        
        // Show modal with slight delay for smooth animation
        requestAnimationFrame(() => {
            elements.cartModal.classList.add('show');
        });

        // Prevent body scroll on mobile when modal is open
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }

        // Focus close button for accessibility
        if (elements.cartModalClose) {
            setTimeout(() => elements.cartModalClose.focus(), 150);
        }
    }

    /**
     * Close cart modal with animations
     */
    function closeCartModal() {
        if (!elements.cartModal) return;
        
        // Add hiding class for exit animation
        elements.cartModal.classList.add('hiding');
        
        // Add hiding class to backdrop
        if (elements.cartBackdrop) {
            elements.cartBackdrop.classList.add('hiding');
        }
        
        // Wait for animation to complete before removing classes
        setTimeout(() => {
            elements.cartModal.classList.remove('show', 'hiding');
            
            if (elements.cartBackdrop) {
                elements.cartBackdrop.classList.remove('show', 'hiding');
            }
            
            // Restore body scroll
            document.body.style.overflow = '';
        }, 300); // Match animation duration
    }

    /**
     * Render cart UI
     */
    function renderCart() {
        if (!elements.cartItems || !elements.cartEmpty) return;

        if (cartItems.length === 0) {
            elements.cartEmpty.style.display = 'block';
            elements.cartItems.style.display = 'none';
            
            const cartFooter = document.getElementById('cartModalFooter');
            if (cartFooter) {
                cartFooter.style.display = 'none';
            }
            return;
        }

        elements.cartEmpty.style.display = 'none';
        elements.cartItems.style.display = 'block';
        
        const cartFooter = document.getElementById('cartModalFooter');
        if (cartFooter) {
            cartFooter.style.display = 'block';
        }

        // Clear existing items
        elements.cartItems.innerHTML = '';

        // Render each cart item
        cartItems.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            elements.cartItems.appendChild(cartItemElement);
        });

        // Update summary
        updateCartSummary();
    }

    /**
     * Create cart item element
     * @param {Object} item - Cart item
     * @returns {HTMLElement} Cart item element
     */
    function createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const lineTotal = (item.price * item.quantity).toFixed(2);
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item__image">
            <div class="cart-item__details">
                <div class="cart-item__name">${item.name}</div>
                <div class="cart-item__price">$${item.price.toFixed(2)} each</div>
                <div class="cart-item__line-total">Line total: $${lineTotal}</div>
            </div>
            <div class="cart-item__controls">
                <div class="cart-item__quantity">
                    <button class="cart-item__qty-btn" data-action="decrease" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                    <span class="cart-item__qty-number">${item.quantity}</span>
                    <button class="cart-item__qty-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>
                <button class="cart-item__remove" data-action="remove" data-id="${item.id}" title="Remove item">🗑️</button>
            </div>
        `;

        // Add event listeners
        const decreaseBtn = cartItem.querySelector('[data-action="decrease"]');
        const increaseBtn = cartItem.querySelector('[data-action="increase"]');
        const removeBtn = cartItem.querySelector('[data-action="remove"]');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => updateQuantity(item.id, item.quantity - 1));
        }
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => updateQuantity(item.id, item.quantity + 1));
        }
        if (removeBtn) {
            removeBtn.addEventListener('click', () => removeFromCart(item.id));
        }

        return cartItem;
    }

    /**
     * Update cart summary display
     */
    function updateCartSummary() {
        const summary = calculateSummary();

        // Animate summary value updates
        const animateValue = (element) => {
            if (element) {
                element.classList.add('updating');
                setTimeout(() => element.classList.remove('updating'), 200);
            }
        };

        if (elements.cartSubtotal) {
            animateValue(elements.cartSubtotal);
            elements.cartSubtotal.textContent = `$${summary.subtotal.toFixed(2)}`;
        }

        if (elements.cartDiscount) {
            const discountRow = elements.cartDiscount.closest('.cart-summary__row');
            if (summary.discount > 0) {
                animateValue(elements.cartDiscount);
                elements.cartDiscount.textContent = `-$${summary.discount.toFixed(2)}`;
                if (discountRow) discountRow.style.display = 'flex';
            } else {
                if (discountRow) discountRow.style.display = 'none';
            }
        }

        if (elements.cartTax) {
            animateValue(elements.cartTax);
            elements.cartTax.textContent = `$${summary.tax.toFixed(2)}`;
        }

        if (elements.cartTotal) {
            animateValue(elements.cartTotal);
            elements.cartTotal.textContent = `$${summary.total.toFixed(2)}`;
        }

        // Update discount message and eligibility
        updateDiscountMessages(summary);
    }

    /**
     * Update discount messages and eligibility information
     * @param {Object} summary - Cart summary object
     */
    function updateDiscountMessages(summary) {
        const discountMessage = document.getElementById('cartDiscountMessage');
        const discountEligibility = document.getElementById('cartDiscountEligibility');
        const discountAmount = document.getElementById('cartDiscountAmount');
        const amountToDiscount = document.getElementById('cartAmountToDiscount');

        if (!discountMessage || !discountEligibility) return;

        if (summary.discount > 0) {
            // Show discount applied message
            if (discountAmount) {
                discountAmount.textContent = `$${summary.discount.toFixed(2)}`;
            }
            discountMessage.style.display = 'flex';
            discountEligibility.style.display = 'none';
        } else if (summary.subtotal > 0 && summary.subtotal < DISCOUNT_THRESHOLD) {
            // Show how much more needed for discount
            const amountNeeded = DISCOUNT_THRESHOLD - summary.subtotal;
            if (amountToDiscount) {
                amountToDiscount.textContent = `$${amountNeeded.toFixed(2)}`;
            }
            discountMessage.style.display = 'none';
            discountEligibility.style.display = 'flex';
        } else {
            // Hide both messages
            discountMessage.style.display = 'none';
            discountEligibility.style.display = 'none';
        }
    }

    /**
     * Handle checkout button click
     */
    function handleCheckout() {
        if (cartItems.length === 0) return;

        // Redirect to order summary page
        window.location.href = 'order-summary.html';
    }

    // Public API
    return {
        init,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartItems,
        calculateSummary,
        clearCart,
        isInCart,
        getItemCount,
        renderCart,
        updateCartCounter,
        toggleCartModal,
        openCartModal,
        closeCartModal
    };
})();

// Export for ES6 modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartModule;
}
