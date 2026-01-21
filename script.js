/* ===================================
   CAMINITO DE FE - LANDING PAGE JS
   Part 1: Interactions & Animations
   =================================== */

// ===================================
// 1. STICKY HEADER ON SCROLL
// ===================================

const header = document.getElementById('header');
let lastScrollY = window.scrollY;

function handleHeaderScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
}

// Throttle scroll event for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            handleHeaderScroll();
            scrollTimeout = null;
        }, 10);
    }
});

// ===================================
// 2. MOBILE MENU TOGGLE
// ===================================

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-wrapper')) {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        }
    });
}

// ===================================
// 3. SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default for # only links
        if (href === '#' || href === '#cta') {
            return;
        }

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();

            // Get header height for offset
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// 4. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ===================================

// Options for Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Callback function for Intersection Observer
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Optional: Unobserve after animation (for performance)
            // observer.unobserve(entry.target);
        }
    });
};

// Create observer instance
const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe all elements with 'reveal' class
const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach(element => {
    observer.observe(element);
});

// ===================================
// 5. ADD REVEAL CLASS TO SECTIONS
// ===================================

function addRevealAnimations() {
    // Add reveal class to sections that should animate on scroll
    const sectionsToAnimate = [
        '.problem-section',
        '.product-section',
        '.benefits-section'
    ];

    sectionsToAnimate.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            section.classList.add('reveal');
        }
    });

    // Add reveal to individual cards and elements
    const elementsToAnimate = [
        '.problem-card',
        '.feature-item',
        '.benefits-column'
    ];

    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add('reveal');
            // Add staggered delay
            element.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// Call on page load
addRevealAnimations();

// ===================================
// 6. BUTTON PULSE ANIMATION
// ===================================

// Add subtle pulse effect to primary CTA buttons
function addButtonPulse() {
    const primaryButtons = document.querySelectorAll('.btn-primary');

    primaryButtons.forEach(button => {
        // Add pulse animation on page load
        setTimeout(() => {
            button.style.animation = 'pulse 2s ease-in-out 3';
        }, 1000);
    });
}

addButtonPulse();

// ===================================
// 7. FLOATING ELEMENTS ENHANCED ANIMATION
// ===================================

// Add random movement to floating elements for more dynamic effect
function enhanceFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');

    floatingElements.forEach((element, index) => {
        // Random animation duration between 2.5s and 4s
        const duration = 2.5 + Math.random() * 1.5;
        element.style.animationDuration = `${duration}s`;

        // Random animation delay
        const delay = Math.random() * 2;
        element.style.animationDelay = `${delay}s`;
    });
}

enhanceFloatingElements();

// ===================================
// 8. LAZY LOADING FOR IMAGES
// ===================================

// Native lazy loading is already set in HTML with loading="lazy"
// This is a fallback for older browsers
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===================================
// 9. PERFORMANCE OPTIMIZATION
// ===================================

// Debounce function for resize events
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

// Handle window resize
const handleResize = debounce(() => {
    // Reset mobile menu on desktop
    if (window.innerWidth >= 768) {
        mobileMenuToggle.classList.remove('active');
        mainNav.classList.remove('active');
    }
}, 250);

window.addEventListener('resize', handleResize);

// ===================================
// 10. ACCESSIBILITY ENHANCEMENTS
// ===================================

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
        if (mainNav.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        }
    }
});

// Trap focus in mobile menu when open
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

// Apply focus trap to mobile menu
if (mainNav) {
    trapFocus(mainNav);
}

// ===================================
// 11. PREFERS REDUCED MOTION
// ===================================

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-base', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

// ===================================
// 12. PAGE LOAD OPTIMIZATION
// ===================================

// Run after page load
window.addEventListener('load', () => {
    // Remove any loading classes
    document.body.classList.add('loaded');

    // Initialize all animations
    handleHeaderScroll();

    // Log page load for debugging
    console.log('Caminito de Fe - Page loaded successfully');
});

// ===================================
// 13. FEATURE BADGE ANIMATIONS
// ===================================

// Add interaction to feature badges in product section
const featureBadges = document.querySelectorAll('.feature-badge');

featureBadges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.1)';
    });

    badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'scale(1)';
    });
});

// ===================================
// 14. CTA BUTTON TRACKING (Optional)
// ===================================

// Track CTA button clicks for analytics (placeholder)
const ctaButtons = document.querySelectorAll('.btn-primary');

ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Add analytics tracking here if needed
        console.log('CTA Button clicked:', button.textContent.trim());

        // Example: Google Analytics event
        // gtag('event', 'cta_click', {
        //     'button_text': button.textContent.trim(),
        //     'button_location': button.closest('section')?.id || 'unknown'
        // });
    });
});

// ===================================
// 15. SCROLL PROGRESS INDICATOR (Optional)
// ===================================

// Add a subtle scroll progress indicator
function updateScrollProgress() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;

    // You can use this value to update a progress bar if you add one to the HTML
    // For now, we'll just store it as a CSS custom property
    document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateScrollProgress);
});

// ===================================
// 16. FORM VALIDATION (For future use)
// ===================================

// Placeholder for form validation when forms are added in Part 2
function validateForm(form) {
    // Form validation logic will go here
    return true;
}

// ===================================
// 17. ERROR HANDLING
// ===================================

// Global error handler
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.message);
    // You can add error reporting here
});

// ===================================
// END OF JAVASCRIPT
// ===================================

console.log('Caminito de Fe JavaScript loaded successfully');
