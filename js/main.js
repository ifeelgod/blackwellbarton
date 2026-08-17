document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
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
            if (!nav.contains(e.target) && navLinks.classList.contains('nav__links--open')) {
                navLinks.classList.remove('nav__links--open');
            }
        });
    }

    // Scroll-based Navigation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav?.classList.add('nav--scrolled');
        } else {
            nav?.classList.remove('nav--scrolled');
        }
    }, { passive: true });

    // Scroll Animations (Intersection Observer)
    const animateElements = document.querySelectorAll('.animate-on-scroll, .fade-up, .fade-in, .slide-left, .slide-right');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay');
                if (delay) {
                    el.style.transitionDelay = `${delay}ms`;
                }
                
                if (el.classList.contains('animate-on-scroll')) el.classList.add('animate-on-scroll--visible');
                if (el.classList.contains('fade-up')) el.classList.add('fade-up--visible');
                if (el.classList.contains('fade-in')) el.classList.add('fade-in--visible');
                if (el.classList.contains('slide-left')) el.classList.add('slide-left--visible');
                if (el.classList.contains('slide-right')) el.classList.add('slide-right--visible');
                
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => scrollObserver.observe(el));

    // Animated Number Counters
    const countElements = document.querySelectorAll('.count-up');
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.getAttribute('data-target') || 0);
                const suffix = el.getAttribute('data-suffix') || '';
                const prefix = el.getAttribute('data-prefix') || '';
                const duration = 2000;
                let startTimestamp = null;

                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    // ease-out cubic
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    
                    let current = easeProgress * target;
                    
                    // Format with commas if > 999
                    let formatted = current > 999 ? Math.floor(current).toLocaleString() : Math.floor(current);
                    
                    el.textContent = `${prefix}${formatted}${suffix}`;

                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        // Ensure final value is exact
                        let finalFormatted = target > 999 ? Math.floor(target).toLocaleString() : Math.floor(target);
                        el.textContent = `${prefix}${finalFormatted}${suffix}`;
                    }
                };

                window.requestAnimationFrame(step);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    countElements.forEach(el => countObserver.observe(el));

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dropdown Navigation
    const dropdowns = document.querySelectorAll('.nav__dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = () => dropdown.classList.toggle('nav__dropdown--open');
        
        // For mobile click
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                toggle();
            }
        });
        
        // For desktop hover
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) dropdown.classList.add('nav__dropdown--open');
        });
        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) dropdown.classList.remove('nav__dropdown--open');
        });
    });

    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('nav__dropdown--open');
            }
        });
    });

    // Year in footer
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
});
