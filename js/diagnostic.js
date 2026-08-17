document.addEventListener('DOMContentLoaded', () => {
    const diagnosticData = {
        steps: [
            {
                title: 'Program Phase',
                question: 'What phase is your program currently in?',
                options: [
                    { id: 'preclinical', label: 'Pre-Clinical / IND-Enabling', icon: '🔬' },
                    { id: 'phase1-2', label: 'Phase 1 / Phase 2', icon: '📋' },
                    { id: 'phase3', label: 'Phase 3 / Pivotal', icon: '📊' },
                    { id: 'registration', label: 'Registration / NDA / BLA', icon: '🏛️' }
                ]
            },
            {
                title: 'Target Health Authority',
                question: 'Which health authority are you targeting?',
                options: [
                    { id: 'fda', label: 'FDA (United States)', icon: '🇺🇸' },
                    { id: 'ema', label: 'EMA (European Union)', icon: '🇪🇺' },
                    { id: 'pmda', label: 'PMDA (Japan)', icon: '🇯🇵' },
                    { id: 'multi', label: 'Multi-Regional Strategy', icon: '🌐' }
                ]
            },
            {
                title: 'Primary Roadblock',
                question: 'What is your primary regulatory challenge?',
                options: [
                    { id: 'briefing', label: 'Agency Briefing Package', icon: '📑' },
                    { id: 'cmc', label: 'CMC Comparability', icon: '⚗️' },
                    { id: 'csr', label: 'CSR Timelines', icon: '⏱️' },
                    { id: 'pediatric', label: 'Pediatric Plan (PSP/PIP)', icon: '👶' }
                ]
            }
        ]
    };

    const container = document.querySelector('.diagnostic');
    if (!container) return;

    let currentStepIndex = 0;
    const selections = {};

    function render() {
        container.innerHTML = '';
        
        if (currentStepIndex < diagnosticData.steps.length) {
            renderStep();
        } else {
            renderOutput();
        }
    }

    function renderStep() {
        const stepData = diagnosticData.steps[currentStepIndex];
        
        // Progress bar
        const progressHtml = `
            <div class="diagnostic__progress">
                ${diagnosticData.steps.map((s, i) => `
                    <div class="diagnostic__step ${i <= currentStepIndex ? 'diagnostic__step--active' : ''}">
                        <div class="diagnostic__step-dot"></div>
                        <span class="diagnostic__step-label">${s.title}</span>
                    </div>
                `).join('')}
            </div>
        `;

        const optionsHtml = `
            <div class="diagnostic__options">
                ${stepData.options.map(opt => `
                    <button class="diagnostic__option" data-id="${opt.id}">
                        <span class="diagnostic__option-icon">${opt.icon}</span>
                        <span class="diagnostic__option-label">${opt.label}</span>
                    </button>
                `).join('')}
            </div>
        `;

        const content = `
            <div class="diagnostic__content fade-in">
                ${progressHtml}
                <h3 class="diagnostic__question">${stepData.question}</h3>
                ${optionsHtml}
            </div>
        `;

        container.innerHTML = content;
        
        // Trigger fade in
        requestAnimationFrame(() => {
            const el = container.querySelector('.diagnostic__content');
            if (el) el.classList.add('fade-in--visible');
        });

        // Add listeners
        const options = container.querySelectorAll('.diagnostic__option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                // Remove selected from others
                options.forEach(o => o.classList.remove('diagnostic__option--selected'));
                opt.classList.add('diagnostic__option--selected');
                
                selections[currentStepIndex] = opt.dataset.id;
                
                setTimeout(() => {
                    currentStepIndex++;
                    render();
                }, 400);
            });
        });
    }

    function generateRoadmap() {
        const phase = selections[0];
        const authority = selections[1];
        const roadblock = selections[2];

        const roadmap = [];
        
        if (phase === 'preclinical') {
            roadmap.push('IND-Enabling Gap Analysis & Pre-IND Meeting Strategy');
        } else if (phase === 'phase1-2') {
            roadmap.push('End-of-Phase 2 Briefing Document & Regulatory Alignment');
        } else {
            roadmap.push('Late-Stage Dossier Architecture & Pre-NDA/BLA Synchronization');
        }

        if (authority === 'fda') {
            roadmap.push('FDA-Aligned Template Architecture & US Agent Representation');
        } else if (authority === 'ema') {
            roadmap.push('EMA Scientific Advice Briefing & Centralized Procedure Strategy');
        } else {
            roadmap.push('Global Multi-Regional Submission Sequencing Plan');
        }

        if (roadblock === 'cmc') {
            roadmap.push('Module 3 Risk Mitigation Assessment & Comparability Protocols');
        } else if (roadblock === 'csr') {
            roadmap.push('Accelerated Module 2/5 Parallel Writing Plan');
        } else if (roadblock === 'pediatric') {
            roadmap.push('Initial Pediatric Study Plan (iPSP) / PIP Development & Negotiation');
        } else {
            roadmap.push('30-Day Risk Mitigation Assessment & Narrative Lock');
        }

        return roadmap;
    }

    function renderOutput() {
        const roadmap = generateRoadmap();
        
        const content = `
            <div class="diagnostic__output fade-in">
                <div class="diagnostic__results-card">
                    <h3 class="diagnostic__results-title">Your Regulatory Readiness Snapshot</h3>
                    <ul class="diagnostic__roadmap">
                        ${roadmap.map(item => `<li><span class="check">✓</span> ${item}</li>`).join('')}
                    </ul>
                </div>
                <div class="diagnostic__actions">
                    <a href="contact.html" class="btn btn--primary diagnostic__cta">Schedule Your Strategic Scoping Call</a>
                    <p class="diagnostic__secondary-text">Receive a comprehensive gap assessment during a complimentary 30-minute consultation.</p>
                    <button class="diagnostic__reset btn btn--ghost">Start Over</button>
                </div>
            </div>
        `;

        container.innerHTML = content;

        requestAnimationFrame(() => {
            const el = container.querySelector('.diagnostic__output');
            if (el) el.classList.add('fade-in--visible');
        });

        container.querySelector('.diagnostic__reset').addEventListener('click', () => {
            currentStepIndex = 0;
            Object.keys(selections).forEach(k => delete selections[k]);
            render();
        });
    }

    // Init
    render();
});
