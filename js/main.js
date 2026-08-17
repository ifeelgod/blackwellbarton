document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.nav__mobile-toggle');
    const navLinks = document.querySelector('.nav__links');
    const nav = document.querySelector('.nav');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('nav__links--open');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav__links--open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (nav && !nav.contains(e.target) && navLinks.classList.contains('nav__links--open')) {
                navLinks.classList.remove('nav__links--open');
            }
        });
    }

    // 2. Scroll-based Navigation Background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            nav?.classList.add('nav--scrolled');
        } else {
            nav?.classList.remove('nav--scrolled');
        }
    }, { passive: true });

    // 3. Dropdown Menus (Desktop Hover & Mobile Click)
    const dropdowns = document.querySelectorAll('.nav__dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth > 1024) {
                dropdown.classList.add('nav__dropdown--open');
            }
        });
        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth > 1024) {
                dropdown.classList.remove('nav__dropdown--open');
            }
        });
        // Click support
        const toggleLink = dropdown.querySelector('a');
        if (toggleLink) {
            toggleLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    const content = dropdown.querySelector('.nav__dropdown-content');
                    if (content) {
                        e.preventDefault();
                        dropdown.classList.toggle('nav__dropdown--open');
                    }
                }
            });
        }
    });

    // 4. Progressive Animation Observer
    const animateElements = document.querySelectorAll('.animate-on-scroll, .fade-up, .fade-in, .slide-left, .slide-right');
    
    if ('IntersectionObserver' in window) {
        document.documentElement.classList.add('js-loaded');
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.getAttribute('data-delay');
                    if (delay) el.style.transitionDelay = `${delay}ms`;
                    
                    el.classList.add('animate-on-scroll--visible', 'fade-up--visible', 'fade-in--visible', 'is-visible');
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.05, rootMargin: '50px' });

        animateElements.forEach(el => scrollObserver.observe(el));

        // Fail-safe: Reveal everything after 400ms to guarantee zero blank elements
        setTimeout(() => {
            animateElements.forEach(el => {
                el.classList.add('animate-on-scroll--visible', 'fade-up--visible', 'fade-in--visible', 'is-visible');
            });
        }, 400);
    }

    // 5. Animated Number Counters
    const countElements = document.querySelectorAll('.count-up');
    if ('IntersectionObserver' in window) {
        const countObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseFloat(el.getAttribute('data-target') || 0);
                    const suffix = el.getAttribute('data-suffix') || '';
                    const prefix = el.getAttribute('data-prefix') || '';
                    const duration = 1500;
                    let start = null;

                    const step = (timestamp) => {
                        if (!start) start = timestamp;
                        const progress = Math.min((timestamp - start) / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(ease * target);
                        
                        el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
                        }
                    };

                    window.requestAnimationFrame(step);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        countElements.forEach(el => countObserver.observe(el));
    }

    // 6. Smooth Scroll for In-Page Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // 7. FAQ Accordions
    document.querySelectorAll('.faq__item').forEach(item => {
        item.addEventListener('click', () => {
            const wasOpen = item.classList.contains('faq__item--open');
            // Close other items
            document.querySelectorAll('.faq__item').forEach(other => other.classList.remove('faq__item--open'));
            if (!wasOpen) item.classList.add('faq__item--open');
        });
    });

    // 8. Auto-update Current Year
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = currentYear;
    });
});
