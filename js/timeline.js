document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.timeline-comparison');
    if (!container) return;

    // Milestone Data per week
    const milestoneData = {
        0: {
            bbPct: 0,
            indPct: 0,
            bbStatus: "Program Initiation & Dossier Gap Audit kickoff.",
            indStatus: "Sequential vendor onboarding and scoping meetings.",
            advantage: "Kickoff with pre-aligned ICH E3 templates on Day 1."
        },
        4: {
            bbPct: 50,
            indPct: 20,
            bbStatus: "Parallel construction of Module 2.7 Summaries + CSR core narrative.",
            indStatus: "Initial statistical tables (TFLs) received; CSR writing has not started.",
            advantage: "4 Weeks Ahead — Parallel modular authoring avoids sequential bottlenecks."
        },
        8: {
            bbPct: 100,
            indPct: 40,
            bbStatus: "🎉 100% SUBMISSION-READY DOSSIER (Module 2.5/2.7 + CSR + Briefing Book locked).",
            indStatus: "First draft CSR under sponsor internal review; Module 2 drafting pending.",
            advantage: "🚀 SUBMISSION READY: 8–10 Weeks Saved (~$1.5M Clinical Burn Reduced)."
        },
        12: {
            bbPct: 100,
            indPct: 60,
            bbStatus: "Cleared for Health Authority submission & Mock AdCom preparation.",
            indStatus: "CSR finalization; Module 2 authoring begins sequentially.",
            advantage: "Already under FDA/EMA review while traditional paths are still drafting."
        },
        16: {
            bbPct: 100,
            indPct: 80,
            bbStatus: "Day 60 Review underway; briefing book defense active.",
            indStatus: "Module 2.5 Clinical Overview in second sponsor review cycle.",
            advantage: "Full regulatory head start on label negotiations and approval."
        },
        20: {
            bbPct: 100,
            indPct: 100,
            bbStatus: "Approaching early PDUFA / approval milestones.",
            indStatus: "Traditional dossier finally submission-ready.",
            advantage: "Blackwell Barton clients gain 2.5 to 3 months commercial lead time."
        }
    };

    const render = () => {
        container.innerHTML = `
            <div class="timeline-calculator">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 2rem;">
                    <span class="section__tag" style="color:var(--cobalt); font-size:0.75rem;">VELOCITY COMPARISON CALCULATOR</span>
                    <h3 style="color:var(--navy); font-size:1.75rem; margin: 0.25rem 0 0.5rem;">Interactive Timeline Comparison</h3>
                    <p style="color:#475569; font-size:0.95rem; max-width:650px; margin:0 auto;">
                        Slide the milestone scrubber to observe how parallel modular architecture cuts delivery timelines by <strong>40% to 50%</strong>.
                    </p>
                </div>

                <!-- Preset Quick Buttons -->
                <div style="display:flex; justify-content:center; gap:0.5rem; flex-wrap:wrap; margin-bottom: 2rem;">
                    <button type="button" class="timeline-preset-btn" data-week="4">Week 4: Mid-Synthesis</button>
                    <button type="button" class="timeline-preset-btn timeline-preset-btn--active" data-week="8">Week 8: Blackwell Barton Complete ✨</button>
                    <button type="button" class="timeline-preset-btn" data-week="12">Week 12: Traditional CSR Draft</button>
                    <button type="button" class="timeline-preset-btn" data-week="20">Week 20: Traditional Final</button>
                </div>

                <!-- Interactive Range Slider -->
                <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:16px; padding:2rem; margin-bottom:2rem; box-shadow:0 4px 20px rgba(0,0,0,0.03);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                        <span style="font-family:var(--font-mono); font-size:0.85rem; font-weight:700; color:#1E293B; text-transform:uppercase;">
                            Milestone Timeline Position:
                        </span>
                        <span id="current-week-display" style="font-family:var(--font-mono); font-size:1.25rem; font-weight:700; color:var(--cobalt); background:rgba(0,102,255,0.08); padding:0.25rem 0.85rem; border-radius:30px; border:1px solid rgba(0,102,255,0.2);">
                            Week 8 of 20
                        </span>
                    </div>

                    <input type="range" id="timeline-slider" min="0" max="20" value="8" step="1" style="width:100%; height:10px; border-radius:5px; background:#E2E8F0; outline:none; cursor:pointer; accent-color:var(--cobalt);">
                    
                    <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.75rem; color:#64748B; margin-top:0.75rem;">
                        <span>Week 0 (Kickoff)</span>
                        <span>Week 4</span>
                        <span style="color:var(--cobalt); font-weight:bold;">Week 8 (BB Target)</span>
                        <span>Week 12</span>
                        <span>Week 16</span>
                        <span>Week 20 (Industry End)</span>
                    </div>
                </div>

                <!-- Progress Comparison Bars -->
                <div style="display:flex; flex-direction:column; gap:1.25rem; margin-bottom:2.5rem;">
                    
                    <!-- Blackwell Barton Bar -->
                    <div style="background:#FFFFFF; border:1.5px solid rgba(0,102,255,0.25); border-radius:14px; padding:1.25rem 1.5rem; box-shadow:0 8px 25px rgba(0,102,255,0.08);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                            <div style="display:flex; align-items:center; gap:0.5rem;">
                                <span style="font-size:1.1rem;">⚡</span>
                                <strong style="color:var(--navy); font-size:1rem;">Blackwell Barton Modular Framework</strong>
                                <span style="font-family:var(--font-mono); font-size:0.7rem; background:rgba(0,196,140,0.15); color:var(--success); padding:0.2rem 0.6rem; border-radius:30px; font-weight:600;">8–10 WEEKS</span>
                            </div>
                            <span id="bb-pct-label" style="font-family:var(--font-mono); font-weight:700; color:var(--cobalt); font-size:1.1rem;">100% Complete</span>
                        </div>
                        <div style="height:14px; background:#F1F5F9; border-radius:7px; overflow:hidden;">
                            <div id="bb-progress-bar" style="height:100%; width:100%; background:linear-gradient(90deg, var(--cobalt) 0%, var(--cyan) 100%); transition:width 0.3s ease; border-radius:7px;"></div>
                        </div>
                    </div>

                    <!-- Traditional Industry Bar -->
                    <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:1.25rem 1.5rem;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                            <div style="display:flex; align-items:center; gap:0.5rem;">
                                <span style="font-size:1.1rem;">⏳</span>
                                <strong style="color:#475569; font-size:1rem;">Traditional Linear Agency Model</strong>
                                <span style="font-family:var(--font-mono); font-size:0.7rem; background:#EDF2F7; color:#64748B; padding:0.2rem 0.6rem; border-radius:30px;">16–20 WEEKS</span>
                            </div>
                            <span id="ind-pct-label" style="font-family:var(--font-mono); font-weight:700; color:#64748B; font-size:1.1rem;">40% Complete</span>
                        </div>
                        <div style="height:14px; background:#F1F5F9; border-radius:7px; overflow:hidden;">
                            <div id="ind-progress-bar" style="height:100%; width:40%; background:#94A3B8; transition:width 0.3s ease; border-radius:7px;"></div>
                        </div>
                    </div>

                </div>

                <!-- Dynamic Real-Time Milestone Status Card -->
                <div id="dynamic-milestone-card" style="background:linear-gradient(145deg, #0A1128 0%, #141E3C 100%); border:1.5px solid rgba(0,210,255,0.3); border-radius:18px; padding:2rem; color:var(--white); box-shadow:0 15px 40px rgba(10,17,40,0.25);">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.75rem; margin-bottom:1.5rem;">
                        <div>
                            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--cyan); text-transform:uppercase; letter-spacing:0.08em; display:block; margin-bottom:0.4rem;">
                                Blackwell Barton Deliverable State
                            </span>
                            <div id="bb-status-text" style="font-size:0.95rem; line-height:1.5; color:#F8FAFC;">
                                🎉 100% SUBMISSION-READY DOSSIER (Module 2.5/2.7 + CSR + Briefing Book locked).
                            </div>
                        </div>
                        <div>
                            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--silver); text-transform:uppercase; letter-spacing:0.08em; display:block; margin-bottom:0.4rem;">
                                Traditional Vendor Deliverable State
                            </span>
                            <div id="ind-status-text" style="font-size:0.95rem; line-height:1.5; color:#CBD5E1;">
                                First draft CSR under sponsor internal review; Module 2 drafting pending.
                            </div>
                        </div>
                    </div>

                    <div style="padding-top:1.25rem; border-top:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                        <span id="advantage-text" style="font-family:var(--font-mono); font-size:0.85rem; color:var(--gold-light); font-weight:600;">
                            🚀 SUBMISSION READY: 8–10 Weeks Saved (~$1.5M Clinical Burn Reduced).
                        </span>
                        <a href="contact.html" class="btn btn--primary btn--sm" style="background:var(--cobalt); color:white; padding:0.5rem 1.25rem; border-radius:30px; text-decoration:none; font-weight:600;">
                            Request Timeline Assessment &rarr;
                        </a>
                    </div>
                </div>
            </div>
        `;

        const slider = container.querySelector('#timeline-slider');
        const weekDisplay = container.querySelector('#current-week-display');
        const bbBar = container.querySelector('#bb-progress-bar');
        const indBar = container.querySelector('#ind-progress-bar');
        const bbLabel = container.querySelector('#bb-pct-label');
        const indLabel = container.querySelector('#ind-pct-label');
        const bbStatus = container.querySelector('#bb-status-text');
        const indStatus = container.querySelector('#ind-status-text');
        const advText = container.querySelector('#advantage-text');
        const presetBtns = container.querySelectorAll('.timeline-preset-btn');

        const updateToWeek = (week) => {
            slider.value = week;
            weekDisplay.textContent = `Week ${week} of 20`;

            // Calculate percentages
            const bbPct = Math.min(Math.round((week / 8) * 100), 100);
            const indPct = Math.min(Math.round((week / 20) * 100), 100);

            bbBar.style.width = `${bbPct}%`;
            indBar.style.width = `${indPct}%`;
            bbLabel.textContent = `${bbPct}% Complete`;
            indLabel.textContent = `${indPct}% Complete`;

            // Find closest milestone key
            const keys = [0, 4, 8, 12, 16, 20];
            const closest = keys.reduce((prev, curr) => Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev);
            const data = milestoneData[closest];

            if (data) {
                bbStatus.textContent = data.bbStatus;
                indStatus.textContent = data.indStatus;
                advText.textContent = data.advantage;
            }

            // Update preset active button state
            presetBtns.forEach(btn => {
                const btnWeek = parseInt(btn.getAttribute('data-week'), 10);
                if (btnWeek === parseInt(week, 10)) {
                    btn.classList.add('timeline-preset-btn--active');
                } else {
                    btn.classList.remove('timeline-preset-btn--active');
                }
            });
        };

        slider.addEventListener('input', (e) => {
            updateToWeek(e.target.value);
        });

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const w = btn.getAttribute('data-week');
                updateToWeek(w);
            });
        });
    };

    render();
});
