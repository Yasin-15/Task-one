/**
 * Hami MiniMarket Landing Page - Main JavaScript File
 * Handles core functionality including navigation, form validation, and interactive features
 * Enhanced with mobile and touch device optimizations, lazy loading, and animations
 */

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initializeNavigation();
    initializeFormValidation();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeTouchOptimizations();
    initializeResponsiveFeatures();
    initializeBackToTop();
    initializeLazyLoading();
    initializeScrollAnimations();
    initializeKeyboardNavigation();
    initializeEnhancedInteractions();
    initializeImageSlider();
});

/**
 * Navigation functionality
 * Handles smooth scrolling to sections and active link highlighting
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.header__nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // If it's an external link or different page, don't prevent default
            if (targetId.startsWith('http') || targetId.includes('.html')) {
                closeMobileMenu();
                return;
            }
            
            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Calculate offset for fixed header
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 70;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active link
                updateActiveNavLink(targetId);

                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });

    // Handle scroll-based active link highlighting (only if sections exist)
    const pageSections = document.querySelectorAll('section[id]');
    if (pageSections.length > 0) {
        window.addEventListener('scroll', debounce(updateActiveNavLinkOnScroll, 100));
        // Set initial active link
        updateActiveNavLinkOnScroll();
    }
}

/**
 * Update active navigation link based on current section
 */
function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');
    const header = document.querySelector('.header');
    
    if (!header || !sections.length || !navLinks.length) return;
    
    const headerHeight = header.offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = '#' + section.getAttribute('id');
        }
    });

    // If no section is active, default to home
    if (!currentSection && window.scrollY < 100) {
        currentSection = '#home';
    }

    updateActiveNavLink(currentSection);
}

/**
 * Update active navigation link
 * @param {string} activeId - The ID of the active section
 */
function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.header__nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeId) {
            link.classList.add('active');
        }
    });
}

/**
 * Mobile menu functionality
 * Handles hamburger menu toggle
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');
    const body = document.body;

    if (menuToggle && nav) {
        // Set initial aria-expanded state
        menuToggle.setAttribute('aria-expanded', 'false');

        menuToggle.addEventListener('click', function () {
            const isOpen = nav.classList.contains('header__nav--open');

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('header__nav--open')) {
                closeMobileMenu();
                menuToggle.focus(); // Return focus to menu button
            }
        });

        // Handle window resize
        window.addEventListener('resize', debounce(function () {
            if (window.innerWidth > 768 && nav.classList.contains('header__nav--open')) {
                closeMobileMenu();
            }
        }, 250));
    }
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
    const nav = document.querySelector('.header__nav');
    const menuToggle = document.querySelector('.header__menu-toggle');
    const body = document.body;

    if (nav && menuToggle) {
        nav.classList.add('header__nav--open');
        menuToggle.classList.add('header__menu-toggle--active');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('menu-open');

        // Focus first navigation link for accessibility
        const firstNavLink = nav.querySelector('.header__nav-link');
        if (firstNavLink) {
            setTimeout(() => firstNavLink.focus(), 100);
        }
    }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const nav = document.querySelector('.header__nav');
    const menuToggle = document.querySelector('.header__menu-toggle');
    const body = document.body;

    if (nav && menuToggle) {
        nav.classList.remove('header__nav--open');
        menuToggle.classList.remove('header__menu-toggle--active');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('menu-open');
    }
}

/**
 * Form validation functionality
 * Handles contact form validation and submission
 */
function initializeFormValidation() {
    const form = document.getElementById('contactForm');

    if (form) {
        // Add real-time validation
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });

            input.addEventListener('input', function () {
                clearFieldError(this);
            });
        });

        // Handle form submission
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }
}

/**
 * Validate individual form field
 * @param {HTMLElement} field - The form field to validate
 */
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const errorElement = document.getElementById(fieldName + 'Error');

    let isValid = true;
    let errorMessage = '';

    // Check if field is required and empty
    if (field.hasAttribute('required') && !fieldValue) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Validate email format
    else if (fieldName === 'email' && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    // Validate message length
    else if (fieldName === 'message' && fieldValue && fieldValue.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
    }
    // Validate name length
    else if (fieldName === 'name' && fieldValue && fieldValue.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long';
    }

    // Display error or clear it
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            field.classList.add('form-input--error');
        } else {
            errorElement.textContent = '';
            field.classList.remove('form-input--error');
        }
    }

    return isValid;
}

/**
 * Clear field error styling
 * @param {HTMLElement} field - The form field to clear error from
 */
function clearFieldError(field) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement && errorElement.textContent) {
        errorElement.textContent = '';
        field.classList.remove('form-input--error');
    }
}

/**
 * Handle form submission
 * @param {HTMLFormElement} form - The form element
 */
function handleFormSubmission(form) {
    const inputs = form.querySelectorAll('.form-input');
    let isFormValid = true;

    // Validate all fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (isFormValid) {
        // Simulate form submission
        showFormSuccess('Thank you for your message! We will get back to you soon.');
        form.reset();
    } else {
        // Focus on first invalid field
        const firstError = form.querySelector('.form-input--error');
        if (firstError) {
            firstError.focus();
        }
    }
}

/**
 * Show form success message
 * @param {string} message - Success message to display
 */
function showFormSuccess(message) {
    const successElement = document.getElementById('formSuccess');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';

        // Hide success message after 5 seconds
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    }
}

/**
 * Initialize scroll effects
 * Handles header background on scroll and other scroll-based animations
 */
function initializeScrollEffects() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        });
    }
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
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
 * Utility function to check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Initialize touch optimizations for mobile devices
 */
function initializeTouchOptimizations() {
    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        document.body.classList.add('touch-device');

        // Add touch-friendly hover effects
        const interactiveElements = document.querySelectorAll('.product-card, .about__value-item, .btn, .hero__cta');

        interactiveElements.forEach(element => {
            // Add touch start and end events for better feedback
            element.addEventListener('touchstart', function () {
                this.classList.add('touch-active');
            }, { passive: true });

            element.addEventListener('touchend', function () {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            }, { passive: true });

            element.addEventListener('touchcancel', function () {
                this.classList.remove('touch-active');
            }, { passive: true });
        });

        // Optimize scroll performance on touch devices
        let ticking = false;

        function updateScrollEffects() {
            initializeScrollEffects();
            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }, { passive: true });
    }
}

/**
 * Initialize responsive features based on screen size
 */
function initializeResponsiveFeatures() {
    // Check initial screen size and set up responsive behaviors
    checkScreenSize();

    // Listen for orientation changes
    window.addEventListener('orientationchange', function () {
        setTimeout(checkScreenSize, 100); // Delay to ensure orientation change is complete
    });

    // Listen for resize events (debounced)
    window.addEventListener('resize', debounce(checkScreenSize, 250));
}

/**
 * Check screen size and apply appropriate optimizations
 */
function checkScreenSize() {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;
    const isTablet = screenWidth > 768 && screenWidth <= 1024;

    // Update body classes for CSS targeting
    document.body.classList.toggle('mobile-screen', isMobile);
    document.body.classList.toggle('tablet-screen', isTablet);
    document.body.classList.toggle('desktop-screen', screenWidth > 1024);

    // Optimize form validation for mobile
    if (isMobile) {
        optimizeFormForMobile();
    }

    // Adjust product grid behavior
    adjustProductGridBehavior(screenWidth);
}

/**
 * Optimize form behavior for mobile devices
 */
function optimizeFormForMobile() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('.form-input');

    inputs.forEach(input => {
        // Prevent zoom on focus for iOS devices
        if (input.type === 'email' || input.type === 'text') {
            input.addEventListener('focus', function () {
                // Temporarily increase font size to prevent zoom
                this.style.fontSize = '16px';
            });

            input.addEventListener('blur', function () {
                // Reset font size
                this.style.fontSize = '';
            });
        }

        // Add better mobile keyboard support
        if (input.type === 'email') {
            input.setAttribute('inputmode', 'email');
        }

        if (input.name === 'name') {
            input.setAttribute('inputmode', 'text');
            input.setAttribute('autocomplete', 'name');
        }
    });
}

/**
 * Adjust product grid behavior based on screen size
 */
function adjustProductGridBehavior(screenWidth) {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        if (screenWidth <= 768) {
            // On mobile, make cards more touch-friendly
            card.style.cursor = 'default';

            // Add touch feedback
            card.addEventListener('touchstart', function () {
                this.style.transform = 'translateY(-2px)';
            }, { passive: true });

            card.addEventListener('touchend', function () {
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }, { passive: true });
        } else {
            // On desktop, restore hover cursor
            card.style.cursor = 'pointer';
        }
    });
}

/**
 * Enhanced scroll effects with performance optimization
 */
function initializeScrollEffects() {
    const header = document.querySelector('.header');

    if (header) {
        const scrollThreshold = 100;
        let lastScrollY = window.scrollY;

        // Throttled scroll handler for better performance
        const handleScroll = throttle(function () {
            const currentScrollY = window.scrollY;

            // Add/remove scrolled class
            if (currentScrollY > scrollThreshold) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }

            // Optional: Hide header on scroll down, show on scroll up (mobile)
            if (window.innerWidth <= 768) {
                if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Enhanced form validation with mobile optimizations
 */
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const errorElement = document.getElementById(fieldName + 'Error');

    let isValid = true;
    let errorMessage = '';

    // Check if field is required and empty
    if (field.hasAttribute('required') && !fieldValue) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Validate email format with more comprehensive regex
    else if (fieldName === 'email' && fieldValue) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(fieldValue)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    // Validate message length
    else if (fieldName === 'message' && fieldValue && fieldValue.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
    }
    // Validate name length and format
    else if (fieldName === 'name' && fieldValue) {
        if (fieldValue.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long';
        } else if (!/^[a-zA-Z\s'-]+$/.test(fieldValue)) {
            isValid = false;
            errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }
    }

    // Display error or clear it with enhanced mobile feedback
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            field.classList.add('form-input--error');
            field.setAttribute('aria-invalid', 'true');

            // Add haptic feedback on mobile devices (if supported)
            if ('vibrate' in navigator && window.innerWidth <= 768) {
                navigator.vibrate(100);
            }
        } else {
            errorElement.textContent = '';
            field.classList.remove('form-input--error');
            field.setAttribute('aria-invalid', 'false');
        }
    }

    return isValid;
}

/**
 * Enhanced form success display with mobile optimizations
 */
function showFormSuccess(message) {
    const successElement = document.getElementById('formSuccess');
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.add('show');
        successElement.style.display = 'block';

        // Announce to screen readers
        successElement.setAttribute('aria-live', 'polite');
        successElement.setAttribute('role', 'status');

        // Add haptic feedback on mobile devices (if supported)
        if ('vibrate' in navigator && window.innerWidth <= 768) {
            navigator.vibrate([100, 50, 100]);
        }

        // Scroll to success message on mobile
        if (window.innerWidth <= 768) {
            successElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }

        // Focus the success message for screen readers
        successElement.setAttribute('tabindex', '-1');
        successElement.focus();

        // Hide success message after 5 seconds
        setTimeout(() => {
            successElement.style.display = 'none';
            successElement.classList.remove('show');
        }, 5000);
    }
}

/**
 * Initialize back-to-top button functionality
 */
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        // Show/hide button based on scroll position
        const toggleBackToTop = throttle(function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        }, 100);

        // Listen for scroll events
        window.addEventListener('scroll', toggleBackToTop, { passive: true });

        // Handle button click
        backToTopButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Add haptic feedback on mobile
            if ('vibrate' in navigator && window.innerWidth <= 768) {
                navigator.vibrate(50);
            }
        });

        // Handle keyboard navigation
        backToTopButton.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Add touch feedback for mobile
        if ('ontouchstart' in window) {
            backToTopButton.addEventListener('touchstart', function () {
                this.classList.add('touch-active');
            }, { passive: true });

            backToTopButton.addEventListener('touchend', function () {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
        }
    }
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');

    if (lazyImages.length === 0) return;

    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        lazyImages.forEach(function (img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        const loadImagesOnScroll = throttle(function () {
            lazyImages.forEach(function (img) {
                if (isInViewport(img)) {
                    loadImage(img);
                }
            });
        }, 100);

        window.addEventListener('scroll', loadImagesOnScroll, { passive: true });
        loadImagesOnScroll(); // Load images that are already in viewport
    }
}

/**
 * Load individual image with smooth transition
 * @param {HTMLImageElement} img - Image element to load
 */
function loadImage(img) {
    if (img.classList.contains('lazy-loaded')) return;

    const src = img.getAttribute('data-src');
    if (!src) return;

    img.classList.add('lazy-loading');

    // Create a new image to preload
    const imageLoader = new Image();

    imageLoader.onload = function () {
        img.src = src;
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-loaded');
        img.removeAttribute('data-src');
    };

    imageLoader.onerror = function () {
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-error');

        // Set a placeholder or default image with proper alt text
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNDAgODBMMTcwIDEzMEgxMTBMMTQwIDgwWiIgZmlsbD0iIzlFOUU5RSIvPgo8Y2lyY2xlIGN4PSIxNjUiIGN5PSI5NSIgcj0iOCIgZmlsbD0iIzlFOUU5RSIvPgo8dGV4dCB4PSIxNDAiIHk9IjE2MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5RTlFOUUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=';

        // Update alt text to indicate image loading failure
        const originalAlt = img.getAttribute('alt');
        img.setAttribute('alt', `${originalAlt} (Image currently unavailable)`);
    };

    imageLoader.src = src;
}

/**
 * Initialize scroll-based animations
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length === 0) return;

    // Use Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    // Add staggered animation delay for product cards
                    if (element.classList.contains('product-card')) {
                        const cards = Array.from(document.querySelectorAll('.product-card'));
                        const index = cards.indexOf(element);
                        element.style.animationDelay = `${index * 0.1}s`;
                    }

                    // Determine animation type based on element position
                    const rect = element.getBoundingClientRect();
                    const windowWidth = window.innerWidth;

                    if (rect.left < windowWidth / 2) {
                        element.classList.add('animate-slide-left');
                    } else {
                        element.classList.add('animate-slide-right');
                    }

                    element.classList.add('animate');
                }
            });
        }, {
            rootMargin: '-50px 0px',
            threshold: 0.2
        });

        animatedElements.forEach(function (element) {
            animationObserver.observe(element);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        const animateOnScroll = throttle(function () {
            animatedElements.forEach(function (element) {
                if (isInViewport(element) && !element.classList.contains('animate')) {
                    element.classList.add('animate', 'animate-fade-up');
                }
            });
        }, 100);

        window.addEventListener('scroll', animateOnScroll, { passive: true });
        animateOnScroll(); // Animate elements already in viewport
    }
}

/**
 * Initialize keyboard navigation for interactive elements
 */
function initializeKeyboardNavigation() {
    // Add keyboard support for product cards
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(function (card) {
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Simulate click behavior
                this.click();

                // Add visual feedback
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });

    // Add keyboard support for slider controls
    const sliderButtons = document.querySelectorAll('.slider-btn');
    sliderButtons.forEach(function (btn) {
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add keyboard support for slider indicators
    const sliderIndicators = document.querySelectorAll('.slider-indicator');
    sliderIndicators.forEach(function (indicator) {
        indicator.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Improve focus management for mobile menu
    const menuToggle = document.querySelector('.header__menu-toggle');
    const navLinks = document.querySelectorAll('.header__nav-link');

    if (menuToggle && navLinks.length > 0) {
        // Trap focus within mobile menu when open
        const firstNavLink = navLinks[0];
        const lastNavLink = navLinks[navLinks.length - 1];

        document.addEventListener('keydown', function (e) {
            const nav = document.querySelector('.header__nav');
            if (!nav.classList.contains('header__nav--open')) return;

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstNavLink) {
                        e.preventDefault();
                        menuToggle.focus();
                    } else if (document.activeElement === menuToggle) {
                        e.preventDefault();
                        lastNavLink.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastNavLink) {
                        e.preventDefault();
                        menuToggle.focus();
                    } else if (document.activeElement === menuToggle) {
                        e.preventDefault();
                        firstNavLink.focus();
                    }
                }
            }
        });
    }
}

/**
 * Initialize enhanced interactions and micro-animations
 */
function initializeEnhancedInteractions() {
    // Enhanced product card interactions
    const productCards = document.querySelectorAll('.product-card');

    if (productCards.length > 0) {
        productCards.forEach(function (card) {
            // Add subtle tilt effect on mouse move (desktop only)
            if (window.innerWidth > 768) {
                card.addEventListener('mousemove', function (e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;

                    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                });

                card.addEventListener('mouseleave', function () {
                    this.style.transform = '';
                });
            }

            // Add click animation
            card.addEventListener('click', function () {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    // Enhanced form interactions
    const formInputs = document.querySelectorAll('.form-input');

    if (formInputs.length > 0) {
        formInputs.forEach(function (input) {
            // Add floating label effect
            const label = input.previousElementSibling;

            if (label && label.classList.contains('form-label')) {
                // Check if input has value on load
                if (input.value.trim() !== '') {
                    label.classList.add('floating');
                }

                input.addEventListener('focus', function () {
                    label.classList.add('floating');
                });

                input.addEventListener('blur', function () {
                    if (this.value.trim() === '') {
                        label.classList.remove('floating');
                    }
                });
            }

            // Add typing animation feedback
            let typingTimer;
            input.addEventListener('input', function () {
                this.classList.add('typing');
                clearTimeout(typingTimer);

                typingTimer = setTimeout(() => {
                    this.classList.remove('typing');
                }, 500);
            });
        });
    }

    // Enhanced navigation highlighting with smooth indicator
    const navLinks = document.querySelectorAll('.header__nav-link');
    
    if (navLinks.length > 0) {
        const navList = navLinks[0].closest('.header__nav-list');
        if (navList) {
            const navIndicator = document.createElement('div');
            navIndicator.className = 'nav-indicator';
            navList.appendChild(navIndicator);
            updateNavIndicator();
        }
    }

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const parallaxEffect = throttle(function () {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }, 16);

        window.addEventListener('scroll', parallaxEffect, { passive: true });
    }

    // Add smooth reveal animation for footer
    const footer = document.querySelector('.footer');
    if (footer) {
        const footerObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    footer.classList.add('animate-fade-up');
                }
            });
        }, { threshold: 0.1 });

        footerObserver.observe(footer);
    }
}

/**
 * Update navigation indicator position
 */
function updateNavIndicator() {
    const activeLink = document.querySelector('.header__nav-link.active');
    const indicator = document.querySelector('.nav-indicator');

    if (activeLink && indicator) {
        const navList = activeLink.closest('.header__nav-list');
        if (navList) {
            const linkRect = activeLink.getBoundingClientRect();
            const navRect = navList.getBoundingClientRect();

            indicator.style.left = `${linkRect.left - navRect.left}px`;
            indicator.style.width = `${linkRect.width}px`;
        }
    }
}

/**
 * Enhanced scroll effects with performance optimization and new features
 */
function initializeScrollEffects() {
    const header = document.querySelector('.header');

    if (header) {
        const scrollThreshold = 100;
        let lastScrollY = window.scrollY;

        // Throttled scroll handler for better performance
        const handleScroll = throttle(function () {
            const currentScrollY = window.scrollY;

            // Add/remove scrolled class
            if (currentScrollY > scrollThreshold) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }

            // Optional: Hide header on scroll down, show on scroll up (mobile)
            if (window.innerWidth <= 768) {
                if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;

            // Update navigation indicator (only if it exists)
            if (document.querySelector('.nav-indicator')) {
                updateNavIndicator();
            }
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

/**
 * Initialize image slider functionality
 */
function initializeImageSlider() {
    const slider = document.getElementById('aboutSlider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.about__slide');
    const indicators = slider.querySelectorAll('.slider-indicator');
    const prevBtn = slider.querySelector('.slider-btn--prev');
    const nextBtn = slider.querySelector('.slider-btn--next');

    // Return early if no slides found
    if (!slides.length || !indicators.length) return;

    let currentSlide = 0;
    let slideInterval;

    // Function to show specific slide
    function showSlide(index) {
        // Safety check for valid index
        if (index < 0 || index >= slides.length) return;
        
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        if (slides[index]) slides[index].classList.add('active');
        if (indicators[index]) indicators[index].classList.add('active');

        currentSlide = index;
    }

    // Function to go to next slide
    function nextSlide() {
        if (slides.length === 0) return;
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // Function to go to previous slide
    function prevSlide() {
        if (slides.length === 0) return;
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    // Function to start auto-play
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }

    // Function to stop auto-play
    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // Event listeners for navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 8000); // Restart auto-play after 8 seconds
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 8000); // Restart auto-play after 8 seconds
        });
    }

    // Event listeners for indicators
    indicators.forEach(function (indicator, index) {
        indicator.addEventListener('click', function () {
            showSlide(index);
            stopAutoPlay();
            setTimeout(startAutoPlay, 8000); // Restart auto-play after 8 seconds
        });
    });

    // Keyboard navigation
    slider.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 8000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 8000);
        }
    });

    // Pause auto-play on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    // Pause auto-play when page is not visible
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        setTimeout(startAutoPlay, 8000);
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
        }
    }

    // Start auto-play
    startAutoPlay();
}

/**
 * Enhanced utility function to check if element is in viewport with margin
 * @param {HTMLElement} element - Element to check
 * @param {number} margin - Margin in pixels (default: 0)
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element, margin = 0) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= -margin &&
        rect.left >= -margin &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + margin &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + margin
    );
}

// Export functions for potential testing or external use
window.HamiMiniMarket = {
    validateField,
    showFormSuccess,
    isInViewport,
    debounce,
    throttle,
    checkScreenSize,
    initializeTouchOptimizations,
    initializeBackToTop,
    initializeLazyLoading,
    initializeScrollAnimations,
    initializeImageSlider,
    loadImage,
    updateNavIndicator
};

/**
 * Enhanced Social Media and Logo Interactions
 * Adds hover effects, click tracking, and accessibility improvements
 */
function initializeSocialMediaEnhancements() {
    // Enhanced logo interactions
    const logo = document.querySelector('.header__logo-img');
    if (logo) {
        // Add loading state handling for SVG logo
        logo.addEventListener('load', function () {
            this.classList.add('logo-loaded');
        });

        // Add click interaction for logo
        logo.addEventListener('click', function (e) {
            e.preventDefault();
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Add keyboard support for logo
        logo.parentElement.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });

        // Make logo focusable
        logo.parentElement.setAttribute('tabindex', '0');
        logo.parentElement.setAttribute('role', 'button');
        logo.parentElement.setAttribute('aria-label', 'Go to top of page');
    }

    // Enhanced social media link interactions
    const socialLinks = document.querySelectorAll('.footer__social-link');

    socialLinks.forEach((link, index) => {
        // Add ripple effect on click
        link.addEventListener('click', function (e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);

            // Track social media clicks (for analytics)
            // You can add analytics tracking here
            // const platform = this.getAttribute('aria-label').split(' ')[3];
            // gtag('event', 'social_click', { platform: platform });
        });

        // Add hover sound effect (optional)
        link.addEventListener('mouseenter', function () {
            // Add subtle hover feedback
            this.style.setProperty('--hover-scale', '1.05');
        });

        link.addEventListener('mouseleave', function () {
            this.style.removeProperty('--hover-scale');
        });

        // Enhanced keyboard navigation
        link.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                // Trigger click event
                this.click();
            }
        });

        // Add staggered animation on scroll into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 100); // Stagger animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(link);
    });

    // Add CSS for ripple effect
    if (!document.querySelector('#social-ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'social-ripple-styles';
        style.textContent = `
            .footer__social-link {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .footer__social-link.animate-in {
                animation: socialSlideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            
            @keyframes socialSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(30px) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .logo-loaded {
                animation: logoFadeIn 0.8s ease-out;
            }
            
            @keyframes logoFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            /* Enhanced hover effects */
            .footer__social-link:hover {
                transform: translateY(-2px) scale(var(--hover-scale, 1));
            }
            
            /* Accessibility improvements */
            @media (prefers-reduced-motion: reduce) {
                .ripple,
                .footer__social-link.animate-in,
                .logo-loaded {
                    animation: none !important;
                }
                
                .footer__social-link:hover {
                    transform: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Social Media Share Functionality
 * Adds share buttons and functionality (optional enhancement)
 */
function initializeSocialSharing() {
    // Create share data
    const shareData = {
        title: 'Hami MiniMarket - Fresh. Local. Trusted.',
        text: 'Discover the finest fruits and vegetables from our community market',
        url: window.location.href
    };

    // Add share functionality to social links (if needed)
    const socialLinks = document.querySelectorAll('.footer__social-link');

    socialLinks.forEach(link => {
        const platform = link.getAttribute('aria-label').toLowerCase();

        // Add native sharing for supported platforms
        if (platform.includes('facebook')) {
            link.addEventListener('click', function (e) {
                if (e.ctrlKey || e.metaKey) return; // Allow normal link behavior with modifier keys

                e.preventDefault();
                const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
                window.open(shareUrl, 'facebook-share', 'width=580,height=296');
            });
        } else if (platform.includes('twitter')) {
            link.addEventListener('click', function (e) {
                if (e.ctrlKey || e.metaKey) return; // Allow normal link behavior with modifier keys

                e.preventDefault();
                const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title)}`;
                window.open(shareUrl, 'twitter-share', 'width=580,height=296');
            });
        }
    });
}
