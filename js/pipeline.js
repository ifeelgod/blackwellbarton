document.addEventListener('DOMContentLoaded', () => {
    const pipelineSteps = [
        {
            number: '01',
            title: 'Diagnostic Gap Analysis',
            shortDesc: 'Identify regulatory risks before they become clinical holds.',
            details: 'Comprehensive audit of your existing regulatory dossier, clinical data package, and CMC documentation against current FDA/EMA expectations. We identify gaps in Module 2 summaries, missing non-clinical studies, and potential Information Requests before they arise.',
            deliverables: ['Regulatory Gap Assessment Report', 'Risk-Prioritized Action Matrix', 'Recommended Submission Timeline']
        },
        {
            number: '02',
            title: 'Strategic Positioning & TPP Lock',
            shortDesc: 'Define your regulatory narrative before writing a single page.',
            details: 'Develop a Target Product Profile that aligns clinical evidence with label aspirations. Lock the regulatory strategy across all health authorities to ensure a consistent, defensible narrative from the Investigator\'s Brochure through the Clinical Overview.',
            deliverables: ['Target Product Profile (TPP)', 'Regulatory Strategy Document', 'Health Authority Meeting Briefing Package']
        },
        {
            number: '03',
            title: 'Modular Dossier Architecture',
            shortDesc: 'Parallel construction for maximum velocity.',
            details: 'Deploy our proprietary modular writing framework where Module 2.5 Clinical Overviews, Module 2.7 Clinical Summaries, and CSRs are constructed in parallel rather than sequentially. Each module follows a locked clinical narrative thread ensuring zero discrepancies.',
            deliverables: ['Module 2.5 Clinical Overview', 'Module 2.7 Clinical Summaries', 'ICH E3 Clinical Study Reports']
        },
        {
            number: '04',
            title: 'Defense & HA Engagement',
            shortDesc: 'Anticipate every question. Own every answer.',
            details: 'Prepare comprehensive briefing books, Day 120 response packages, and AdCom simulation materials. Our team of former FDA reviewers stress-tests every claim, every data point, and every label aspiration before it reaches an assessor\'s desk.',
            deliverables: ['Briefing Book Package', 'Day 120 Response Documents', 'Mock AdCom Preparation Materials']
        }
    ];

    const container = document.querySelector('.pipeline');
    if (!container) return;

    let activeIndex = 0;
    let autoplayInterval;
    let isUserInteracted = false;

    function render() {
        const html = `
            <div class="pipeline__steps">
                ${pipelineSteps.map((step, i) => `
                    <div class="pipeline__step ${i === activeIndex ? 'pipeline__step--active' : ''}" data-index="${i}">
                        <div class="pipeline__node-wrapper">
                            <div class="pipeline__node">${step.number}</div>
                            ${i < pipelineSteps.length - 1 ? `<div class="pipeline__connector"></div>` : ''}
                        </div>
                        <div class="pipeline__step-content">
                            <div class="pipeline__step-header">
                                <h3 class="pipeline__step-title">${step.title}</h3>
                                <p class="pipeline__step-desc">${step.shortDesc}</p>
                            </div>
                            <div class="pipeline__step-detail" ${i === activeIndex ? 'style="display:block;"' : 'style="display:none;"'}>
                                <p class="pipeline__step-details-text">${step.details}</p>
                                <div class="pipeline__deliverables">
                                    <h4>Key Deliverables:</h4>
                                    <ul>
                                        ${step.deliverables.map(del => `<li><span class="check">✓</span> ${del}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = html;
        bindEvents();
    }

    function setActive(index) {
        activeIndex = index;
        const steps = container.querySelectorAll('.pipeline__step');
        steps.forEach((step, i) => {
            const detail = step.querySelector('.pipeline__step-detail');
            if (i === activeIndex) {
                step.classList.add('pipeline__step--active');
                detail.style.display = 'block';
            } else {
                step.classList.remove('pipeline__step--active');
                detail.style.display = 'none';
            }
        });
    }

    function bindEvents() {
        const steps = container.querySelectorAll('.pipeline__step');
        steps.forEach(step => {
            step.addEventListener('click', () => {
                isUserInteracted = true;
                clearInterval(autoplayInterval);
                const idx = parseInt(step.dataset.index);
                setActive(idx);
            });
        });
    }

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (!isUserInteracted) {
                activeIndex = (activeIndex + 1) % pipelineSteps.length;
                setActive(activeIndex);
            }
        }, 5000);
    }

    render();
    startAutoplay();
});
