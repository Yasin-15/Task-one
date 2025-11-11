/**
 * Toast Notification Module - Hami MiniMarket
 * Provides toast notification functionality for user feedback
 */

const ToastModule = (function() {
    'use strict';

    // Configuration
    const DEFAULT_DURATION = 3000; // 3 seconds
    const MAX_TOASTS = 5; // Maximum number of toasts to show at once
    
    // Toast container element
    let toastContainer = null;
    
    // Active toasts tracking
    let activeToasts = [];
    let toastIdCounter = 0;

    /**
     * Initialize the toast module
     */
    function init() {
        createToastContainer();
    }

    /**
     * Create the toast container element
     */
    function createToastContainer() {
        if (toastContainer) return;
        
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.setAttribute('role', 'region');
        toastContainer.setAttribute('aria-label', 'Notifications');
        toastContainer.setAttribute('aria-live', 'polite');
        document.body.appendChild(toastContainer);
    }

    /**
     * Show a toast notification
     * @param {Object} options - Toast options
     * @param {string} options.message - Toast message
     * @param {string} [options.type='success'] - Toast type: 'success', 'error', 'info'
     * @param {number} [options.duration=3000] - Duration in milliseconds (0 for no auto-dismiss)
     * @returns {number} Toast ID
     */
    function showToast(options) {
        if (!options || !options.message) {
            return null;
        }

        // Ensure container exists
        if (!toastContainer) {
            init();
        }

        // Remove oldest toast if we've reached the maximum
        if (activeToasts.length >= MAX_TOASTS) {
            const oldestToast = activeToasts[0];
            dismissToast(oldestToast.id, true);
        }

        const toastId = ++toastIdCounter;
        const type = options.type || 'success';
        const duration = options.duration !== undefined ? options.duration : DEFAULT_DURATION;

        // Create toast element
        const toastElement = createToastElement(toastId, options.message, type);
        
        // Add to container
        toastContainer.appendChild(toastElement);

        // Track active toast
        const toastData = {
            id: toastId,
            element: toastElement,
            timeoutId: null
        };
        activeToasts.push(toastData);

        // Trigger show animation
        requestAnimationFrame(() => {
            toastElement.classList.add('show');
        });

        // Auto-dismiss after duration
        if (duration > 0) {
            toastData.timeoutId = setTimeout(() => {
                dismissToast(toastId);
            }, duration);
        }

        return toastId;
    }

    /**
     * Create toast element
     * @param {number} id - Toast ID
     * @param {string} message - Toast message
     * @param {string} type - Toast type
     * @returns {HTMLElement} Toast element
     */
    function createToastElement(id, message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('data-toast-id', id);

        // Get icon based on type
        const icon = getIconForType(type);

        toast.innerHTML = `
            <div class="toast__icon">${icon}</div>
            <div class="toast__content">
                <div class="toast__message">${escapeHtml(message)}</div>
            </div>
            <button class="toast__close" aria-label="Close notification">×</button>
        `;

        // Add click handlers
        const closeBtn = toast.querySelector('.toast__close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dismissToast(id);
        });

        // Dismiss on toast click
        toast.addEventListener('click', () => {
            dismissToast(id);
        });

        return toast;
    }

    /**
     * Get icon for toast type
     * @param {string} type - Toast type
     * @returns {string} Icon HTML
     */
    function getIconForType(type) {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'info':
                return 'ℹ';
            default:
                return '✓';
        }
    }

    /**
     * Dismiss a toast notification
     * @param {number} toastId - Toast ID to dismiss
     * @param {boolean} [immediate=false] - Skip animation if true
     */
    function dismissToast(toastId, immediate = false) {
        const toastIndex = activeToasts.findIndex(t => t.id === toastId);
        if (toastIndex === -1) return;

        const toastData = activeToasts[toastIndex];
        const toastElement = toastData.element;

        // Clear timeout if exists
        if (toastData.timeoutId) {
            clearTimeout(toastData.timeoutId);
        }

        if (immediate) {
            // Remove immediately
            removeToastElement(toastElement);
            activeToasts.splice(toastIndex, 1);
        } else {
            // Animate out
            toastElement.classList.remove('show');
            toastElement.classList.add('hiding');

            // Remove after animation
            setTimeout(() => {
                removeToastElement(toastElement);
                const index = activeToasts.findIndex(t => t.id === toastId);
                if (index !== -1) {
                    activeToasts.splice(index, 1);
                }
            }, 300); // Match CSS transition duration
        }
    }

    /**
     * Remove toast element from DOM
     * @param {HTMLElement} element - Toast element to remove
     */
    function removeToastElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    /**
     * Dismiss all active toasts
     */
    function dismissAll() {
        // Create a copy of the array since we'll be modifying it
        const toastsCopy = [...activeToasts];
        toastsCopy.forEach(toast => {
            dismissToast(toast.id);
        });
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show success toast
     * @param {string} message - Toast message
     * @param {number} [duration] - Duration in milliseconds
     * @returns {number} Toast ID
     */
    function success(message, duration) {
        return showToast({ message, type: 'success', duration });
    }

    /**
     * Show error toast
     * @param {string} message - Toast message
     * @param {number} [duration] - Duration in milliseconds
     * @returns {number} Toast ID
     */
    function error(message, duration) {
        return showToast({ message, type: 'error', duration });
    }

    /**
     * Show info toast
     * @param {string} message - Toast message
     * @param {number} [duration] - Duration in milliseconds
     * @returns {number} Toast ID
     */
    function info(message, duration) {
        return showToast({ message, type: 'info', duration });
    }

    // Public API
    return {
        init,
        showToast,
        success,
        error,
        info,
        dismissToast,
        dismissAll
    };
})();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ToastModule.init();
    });
} else {
    ToastModule.init();
}

// Export for ES6 modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToastModule;
}
