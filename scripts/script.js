// ============================================
// Cloud Solution Architect Portfolio - JavaScript
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // NAVIGATION
    // ============================================

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = mobileMenu?.querySelectorAll('a');
    if (mobileMenuLinks) {
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveNavLink() {
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);

    // ============================================
    // PARALLAX EFFECT
    // ============================================

    const parallaxBg = document.querySelector('.parallax-bg');
    const parallaxLayer = document.querySelector('.parallax-layer');

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroHeight = document.getElementById('accueil')?.offsetHeight || 0;

        if (scrolled <= heroHeight) {
            if (parallaxBg) {
                parallaxBg.style.transform = `translateY(${scrolled * 0.8}px)`;
            }
            if (parallaxLayer) {
                parallaxLayer.style.transform = `translateY(${scrolled * 0.6}px)`;
            }
        }
    });

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .expertise-card, .realisation-card');
    animatedElements.forEach(el => observer.observe(el));

    // ============================================
    // SMOOTH SCROLL
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#' || targetId === '') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = navbar?.offsetHeight || 64;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // MODAL MANAGEMENT
    // ============================================

    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.querySelector('.modal-title');
    const modalText = document.querySelector('.modal-text');
    const modalImage = document.querySelector('.modal-image');
    const modalImageContainer = document.querySelector('.modal-image-container');
    const modalCloseBtns = document.querySelectorAll('.modal-close');

    // Modal data
    const modalData = {};

    // Load modal data from hidden div
    const modalDataElements = document.querySelectorAll('#modal-data > div');
    modalDataElements.forEach(element => {
        const modalId = element.getAttribute('data-modal-id');
        const titleContent = element.querySelector('.modal-title-content')?.innerHTML || '';
        const textContent = element.querySelector('.modal-text-content')?.innerHTML || '';
        const imageUrl = element.querySelector('.modal-image-url')?.textContent.trim() || '';

        modalData[modalId] = {
            title: titleContent,
            text: textContent,
            image: imageUrl
        };
    });

    // Open modal function
    function openModal(modalId) {
        const data = modalData[modalId];

        if (!data) return;

        // Set modal content
        if (modalTitle) modalTitle.innerHTML = data.title;
        if (modalText) modalText.innerHTML = data.text;

        // Handle image
        if (data.image && modalImage && modalImageContainer) {
            modalImage.src = data.image;
            modalImage.alt = data.title;
            modalImageContainer.classList.remove('hidden');
        } else if (modalImageContainer) {
            modalImageContainer.classList.add('hidden');
        }

        // Show modal
        if (modalOverlay) {
            modalOverlay.classList.remove('hidden');
            setTimeout(() => {
                modalOverlay.classList.add('show');
            }, 10);

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    // Close modal function
    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('show');
            setTimeout(() => {
                modalOverlay.classList.add('hidden');
            }, 300);

            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    // Modal trigger buttons
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // Close modal buttons
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close modal on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay || e.target.classList.contains('modal-container')) {
                closeModal();
            }
        });
    }

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay && !modalOverlay.classList.contains('hidden')) {
            closeModal();
        }
    });

    // ============================================
    // FORM HANDLING
    // ============================================

    const contactForm = document.querySelector('#contact form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Basic validation
            if (!name || !email || !message) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }

            // Get submit button and update its state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.classList.add('loading');
            submitButton.textContent = 'Vérification anti-bot...';

            // Execute reCAPTCHA v3
            grecaptcha.ready(function() {
                grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', {action: 'contact_form'}).then(function(token) {
                    // Add reCAPTCHA token to form data
                    formData.append('recaptcha_token', token);

                    // Update button text
                    submitButton.textContent = 'Envoi en cours...';

                    // Send data to PHP backend
                    fetch('./backend/send-email.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(data => {
                                throw new Error(data.message || 'Erreur lors de l\'envoi du message');
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Handle success
                        submitButton.disabled = false;
                        submitButton.classList.remove('loading');
                        submitButton.textContent = originalText;

                        if (data.success) {
                            // Show success message
                            alert(`Merci ${name} ! ${data.message}`);

                            // Reset form
                            contactForm.reset();
                        } else {
                            // Show error message
                            const errorMsg = data.errors ? data.errors.join('\n') : data.message;
                            alert('Erreur : ' + errorMsg);
                        }
                    })
                    .catch(error => {
                        // Handle error
                        console.error('Erreur lors de l\'envoi du formulaire:', error);

                        submitButton.disabled = false;
                        submitButton.classList.remove('loading');
                        submitButton.textContent = originalText;

                        alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard ou me contacter directement par email.');
                    });
                }).catch(function(error) {
                    // Handle reCAPTCHA error
                    console.error('Erreur reCAPTCHA:', error);

                    submitButton.disabled = false;
                    submitButton.classList.remove('loading');
                    submitButton.textContent = originalText;

                    alert('Erreur de vérification anti-bot. Veuillez réessayer.');
                });
            });
        });
    }

    // ============================================
    // PERFORMANCE OPTIMIZATIONS
    // ============================================

    // Debounce function for scroll events
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

    // Throttle function for parallax
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Optimize parallax with throttle
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        const heroHeight = document.getElementById('accueil')?.offsetHeight || 0;

        if (scrolled <= heroHeight) {
            if (parallaxBg) {
                parallaxBg.style.transform = `translateY(${scrolled * 0.8}px)`;
            }
            if (parallaxLayer) {
                parallaxLayer.style.transform = `translateY(${scrolled * 0.6}px)`;
            }
        }
    }, 10));

    // ============================================
    // LAZY LOADING IMAGES (if needed)
    // ============================================

    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // ACCESSIBILITY IMPROVEMENTS
    // ============================================

    // Trap focus in modal when open
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });

        firstFocusable?.focus();
    }

    // Apply focus trap when modal opens
    if (modalOverlay) {
        const modalContent = modalOverlay.querySelector('.modal-content');
        if (modalContent) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class' && !modalOverlay.classList.contains('hidden')) {
                        trapFocus(modalContent);
                    }
                });
            });

            observer.observe(modalOverlay, { attributes: true });
        }
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    // Get scroll position
    function getScrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    console.log('Portfolio initialized successfully');

    // Set initial active nav link
    setActiveNavLink();

    // Add loaded class to body for CSS transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

});

// ============================================
// PAGE VISIBILITY API
// ============================================

// Pause animations when page is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations
        document.body.classList.remove('page-hidden');
    }
});

// ============================================
// RESIZE HANDLER
// ============================================

let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Handle resize end
        console.log('Resize ended');
    }, 250);
});

// ============================================
// PREVENT SCROLL RESTORATION ON RELOAD
// ============================================

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Scroll to top on page load
window.addEventListener('load', function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 0);
});
