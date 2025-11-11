/**
 * Storage Module - Handles localStorage persistence for shopping cart
 * Provides wrapper functions for cart data storage with error handling
 */

const StorageModule = (function() {
    'use strict';

    // Configuration
    const STORAGE_KEY = 'hamiCart';
    const STORAGE_VERSION = '1.0';

    // In-memory fallback storage
    let memoryStorage = null;
    let useMemoryFallback = false;

    /**
     * Check if localStorage is available
     * @returns {boolean} True if localStorage is available and working
     */
    function isStorageAvailable() {
        try {
            const testKey = '__storage_test__';
            window.localStorage.setItem(testKey, 'test');
            window.localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Save cart data to localStorage
     * @param {Array} cartItems - Array of cart items to save
     * @returns {boolean} True if save was successful
     */
    function saveCart(cartItems) {
        const cartData = {
            items: cartItems,
            version: STORAGE_VERSION,
            timestamp: new Date().toISOString()
        };

        try {
            if (useMemoryFallback) {
                // Use in-memory storage
                memoryStorage = cartData;
                return true;
            }

            if (!isStorageAvailable()) {
                // Switch to memory fallback
                useMemoryFallback = true;
                memoryStorage = cartData;
                console.warn('localStorage unavailable, using in-memory storage');
                return true;
            }

            const serializedData = JSON.stringify(cartData);
            window.localStorage.setItem(STORAGE_KEY, serializedData);
            return true;

        } catch (e) {
            return handleStorageError(e, cartData);
        }
    }

    /**
     * Load cart data from localStorage
     * @returns {Array|null} Array of cart items or null if no data exists
     */
    function loadCart() {
        try {
            if (useMemoryFallback) {
                // Load from in-memory storage
                return memoryStorage ? memoryStorage.items : null;
            }

            if (!isStorageAvailable()) {
                // Switch to memory fallback
                useMemoryFallback = true;
                console.warn('localStorage unavailable, using in-memory storage');
                return memoryStorage ? memoryStorage.items : null;
            }

            const serializedData = window.localStorage.getItem(STORAGE_KEY);
            
            if (!serializedData) {
                return null;
            }

            const cartData = JSON.parse(serializedData);
            
            // Validate data structure
            if (!cartData || !Array.isArray(cartData.items)) {
                console.error('Invalid cart data structure');
                clearCart();
                return null;
            }

            // Check version compatibility (for future migrations)
            if (cartData.version !== STORAGE_VERSION) {
                console.warn('Cart data version mismatch, clearing cart');
                clearCart();
                return null;
            }

            return cartData.items;

        } catch (e) {
            if (e instanceof SyntaxError) {
                // JSON parse error - corrupted data
                console.error('Corrupted cart data, clearing storage:', e);
                clearCart();
                return null;
            }
            
            console.error('Error loading cart:', e);
            return null;
        }
    }

    /**
     * Clear cart data from localStorage
     * @returns {boolean} True if clear was successful
     */
    function clearCart() {
        try {
            if (useMemoryFallback) {
                memoryStorage = null;
                return true;
            }

            if (!isStorageAvailable()) {
                useMemoryFallback = true;
                memoryStorage = null;
                return true;
            }

            window.localStorage.removeItem(STORAGE_KEY);
            return true;

        } catch (e) {
            console.error('Error clearing cart:', e);
            return false;
        }
    }

    /**
     * Get the size of stored cart data in bytes
     * @returns {number} Size in bytes, or 0 if unavailable
     */
    function getStorageSize() {
        try {
            if (useMemoryFallback && memoryStorage) {
                return JSON.stringify(memoryStorage).length;
            }

            if (!isStorageAvailable()) {
                return 0;
            }

            const data = window.localStorage.getItem(STORAGE_KEY);
            return data ? data.length : 0;

        } catch (e) {
            console.error('Error getting storage size:', e);
            return 0;
        }
    }

    /**
     * Handle storage errors with appropriate fallback strategies
     * @param {Error} error - The error that occurred
     * @param {Object} cartData - The cart data that failed to save
     * @returns {boolean} True if fallback was successful
     */
    function handleStorageError(error, cartData) {
        console.error('Storage error:', error);

        // Check for quota exceeded error
        if (error.name === 'QuotaExceededError' || 
            error.code === 22 || 
            error.code === 1014) {
            
            console.warn('localStorage quota exceeded, switching to in-memory storage');
            
            // Try to clear old data and retry once
            try {
                window.localStorage.clear();
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartData));
                return true;
            } catch (retryError) {
                // If retry fails, use memory fallback
                useMemoryFallback = true;
                memoryStorage = cartData;
                return true;
            }
        }

        // For other errors, switch to memory fallback
        useMemoryFallback = true;
        memoryStorage = cartData;
        console.warn('Switched to in-memory storage due to error');
        return true;
    }

    /**
     * Check if currently using memory fallback
     * @returns {boolean} True if using in-memory storage
     */
    function isUsingMemoryFallback() {
        return useMemoryFallback;
    }

    /**
     * Reset the storage module (useful for testing)
     */
    function reset() {
        memoryStorage = null;
        useMemoryFallback = false;
    }

    // Public API
    return {
        saveCart,
        loadCart,
        clearCart,
        isStorageAvailable,
        getStorageSize,
        handleStorageError,
        isUsingMemoryFallback,
        reset
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageModule;
}
