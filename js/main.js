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
    document.querySelectorAll('.faq__item, .faq-item').forEach(item => {
        const toggle = item.querySelector('.faq__question, .faq-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const wasOpen = item.classList.contains('faq__item--open');
                document.querySelectorAll('.faq__item, .faq-item').forEach(other => other.classList.remove('faq__item--open'));
                if (!wasOpen) item.classList.add('faq__item--open');
            });
        }
    });

    // 8. Drag & Drop File Upload Handler
    const dropzone = document.getElementById('dossier-dropzone');
    const fileInput = document.getElementById('dossier-file-input');
    const previewList = document.getElementById('file-preview-list');
    let attachedFiles = [];

    if (dropzone && fileInput && previewList) {
        const updateFileList = () => {
            previewList.innerHTML = '';
            attachedFiles.forEach((file, index) => {
                const item = document.createElement('div');
                item.className = 'file-preview-item';
                const sizeStr = file.size > 1024 * 1024 
                    ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
                    : (file.size / 1024).toFixed(0) + ' KB';
                
                item.innerHTML = `
                    <span class="file-preview-item__name">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--cobalt);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                        ${file.name} <span style="color:#64748B; font-size:0.75rem; font-family:var(--font-mono);">(${sizeStr})</span>
                    </span>
                    <button type="button" class="file-preview-item__remove" data-index="${index}" title="Remove file">&times;</button>
                `;
                previewList.appendChild(item);
            });

            // Handle remove buttons
            previewList.querySelectorAll('.file-preview-item__remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute('data-index'), 10);
                    attachedFiles.splice(idx, 1);
                    updateFileList();
                });
            });
        };

        const addFiles = (files) => {
            Array.from(files).forEach(file => {
                if (!attachedFiles.some(f => f.name === file.name && f.size === file.size)) {
                    attachedFiles.push(file);
                }
            });
            updateFileList();
        };

        dropzone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                addFiles(e.target.files);
            }
        });

        // Drag & drop events
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('drag-active');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('drag-active');
            }, false);
        });

        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files && dt.files.length > 0) {
                addFiles(dt.files);
            }
        });
    }

    // 9. Scoping Form Submission Feedback
    const scopingForm = document.getElementById('scoping-form');
    if (scopingForm) {
        scopingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = scopingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '🔒 Encrypting & Generating MNDA Package...';
            
            setTimeout(() => {
                scopingForm.innerHTML = `
                    <div style="text-align: center; padding: 2.5rem 1rem;">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(0, 196, 140, 0.15); color: var(--success); font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;">✓</div>
                        <h3 style="color: var(--navy); margin-bottom: 0.5rem;">Strategic Scoping Request Received</h3>
                        <p style="color: #475569; max-width: 480px; margin: 0 auto 1.5rem; line-height: 1.6;">Your inquiry and attached briefing package have been encrypted. A senior regulatory lead will execute our mutual NDA and confirm your session within <strong>24 business hours</strong>.</p>
                        <span class="badge badge--phd text-mono">TRACKING ID: BB-${Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                `;
            }, 1200);
        });
    }

    // 10. Pre-fill Scoping Request from URL Parameters (e.g. ?tier=surge)
    const urlParams = new URLSearchParams(window.location.search);
    const tierParam = urlParams.get('tier');
    const descField = document.getElementById('desc');
    const phaseField = document.getElementById('phase');

    if (tierParam && descField) {
        if (tierParam === 'surge') {
            descField.value = "[Urgent Surge Inquiry] We require rapid regulatory writing support for a fast-approaching health authority deadline / briefing book sprint.";
            if (phaseField) phaseField.value = 'registration';
        } else if (tierParam === 'turnkey') {
            descField.value = "[Turnkey Dossier Synthesis] Seeking full-spectrum ICH E3 CSR and Module 2.5/2.7 authoring under the Zero-Discrepancy Guarantee.";
            if (phaseField) phaseField.value = 'phase3';
        } else if (tierParam === 'fractional') {
            descField.value = "[Fractional Advisory Request] Exploring dedicated regulatory leadership and strategic advisory to guide our upcoming regulatory milestone.";
            if (phaseField) phaseField.value = 'preclinical';
        }
    }

    // 11. Auto-update Current Year
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = currentYear;
    });
});

