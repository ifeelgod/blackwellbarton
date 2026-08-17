document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.timeline-comparison');
    if (!container) return;

    const html = `
        <div class="timeline__wrapper">
            <div class="timeline__tracks">
                <div class="timeline__track timeline__track--industry">
                    <span class="timeline__track-label">Industry Average</span>
                    <div class="timeline__bar timeline__bar--industry" data-target="80">
                        <span class="timeline__bar-text">16-20 Weeks</span>
                    </div>
                </div>
                <div class="timeline__track timeline__track--framework">
                    <span class="timeline__track-label">Our Framework</span>
                    <div class="timeline__bar timeline__bar--framework" data-target="40">
                        <span class="timeline__bar-text">8-10 Weeks</span>
                    </div>
                </div>
                
                <div class="timeline__slider-handle">
                    <div class="timeline__slider-line"></div>
                    <div class="timeline__slider-knob"></div>
                </div>
            </div>
            
            <div class="timeline__scale">
                <span>0</span>
                <span>4</span>
                <span>8</span>
                <span>12</span>
                <span>16</span>
                <span>20 Weeks</span>
            </div>
            
            <div class="timeline__dynamic-text">
                <p>Drag the slider to compare progress.</p>
            </div>
        </div>
    `;

    container.innerHTML = html;

    const industryBar = container.querySelector('.timeline__bar--industry');
    const frameworkBar = container.querySelector('.timeline__bar--framework');
    const handle = container.querySelector('.timeline__slider-handle');
    const tracksContainer = container.querySelector('.timeline__tracks');
    const dynamicText = container.querySelector('.timeline__dynamic-text p');

    // Intersection observer for initial animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    industryBar.style.width = '80%';
                }, 300);
                setTimeout(() => {
                    frameworkBar.style.width = '40%';
                }, 600);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(container);

    // Draggable handle logic
    let isDragging = false;

    const updateSlider = (clientX) => {
        const rect = tracksContainer.getBoundingClientRect();
        let x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        handle.style.left = `${percentage}%`;

        // Calculate weeks (0 to 20)
        const currentWeek = Math.round((percentage / 100) * 20);
        
        // Calculate progress %
        let indProgress = Math.min(currentWeek * 5, 100);
        let fraProgress = Math.min(currentWeek * 10, 100);

        dynamicText.innerHTML = `At <strong>Week ${currentWeek}</strong>, Industry Average is <strong>${indProgress}%</strong> complete. Our framework is already <strong>${fraProgress}%</strong> complete.`;
    };

    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        handle.classList.add('timeline__slider-handle--active');
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        handle.classList.remove('timeline__slider-handle--active');
    });

    // Touch events
    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
        handle.classList.add('timeline__slider-handle--active');
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSlider(e.touches[0].clientX);
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
        handle.classList.remove('timeline__slider-handle--active');
    });

    // Initial setting of handle position to 0
    handle.style.left = '0%';
});
