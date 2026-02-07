/**
 * Handles all visual updates:
 * - Gauge Animation
 * - Fade-in reveals
 * - Accordion rendering
 */

const visuals = {
    elements: {
        scoreCircle: document.getElementById('score-circle'),
        overallScoreCtx: document.getElementById('overall-score'),
        resultsArea: document.getElementById('results-area'),
        feedbackList: document.getElementById('feedback-list')
    },

    setOverallScore(score) {
        // Circumference of the circle (r=56) -> 2 * PI * 56 ≈ 351.8
        const circumference = 351;
        const offset = circumference - (score / 100) * circumference;

        this.elements.scoreCircle.style.strokeDashoffset = offset;

        // Counter animation
        let current = 0;
        const interval = setInterval(() => {
            if (current >= score) {
                current = score;
                clearInterval(interval);
            }
            this.elements.overallScoreCtx.innerText = current;
            current++;
        }, 15);
    },

    revealResults() {
        this.elements.resultsArea.classList.remove('opacity-50', 'pointer-events-none', 'filter', 'blur-sm');
        this.elements.resultsArea.classList.add('animate-fade-in');
    },

    createAccordionItem(id, title, score, tips) {
        // Determine color based on score
        let colorClass = score > 69 ? "text-green-600 bg-green-50" : (score > 49 ? "text-yellow-600 bg-yellow-50" : "text-red-600 bg-red-50");
        let borderClass = score > 69 ? "border-green-200" : (score > 49 ? "border-yellow-200" : "border-red-200");

        // Generate Tips HTML
        const tipsHtml = tips.map(t => `
            <div class="mt-3 p-3 rounded-lg border ${borderClass} ${colorClass} text-sm">
                <div class="flex items-center gap-2 font-semibold">
                    <span>${t.type === 'good' ? '✅' : '⚠️'}</span>
                    <span>${t.tip}</span>
                </div>
                <p class="mt-1 text-gray-600">${t.explanation || ''}</p>
            </div>
        `).join('');

        return `
            <div class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
                <button onclick="document.getElementById('content-${id}').classList.toggle('hidden')" class="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left">
                    <div class="flex items-center gap-4">
                        <span class="text-lg font-semibold text-gray-700">${title}</span>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm font-bold ${colorClass}">${score}/100</span>
                </button>
                <div id="content-${id}" class="hidden p-4 border-t border-gray-100 bg-white">
                     ${tipsHtml}
                </div>
            </div>
        `;
    },

    renderFeedback(feedback) {
        if (!feedback) return;

        // Clear loading state
        this.elements.feedbackList.innerHTML = '';

        // Order of sections
        const sections = [
            { id: 'ats', title: 'ATS Compatibility', data: feedback.ATS },
            { id: 'content', title: 'Content Quality', data: feedback.content },
            { id: 'style', title: 'Tone & Style', data: feedback.toneAndStyle },
            { id: 'structure', title: 'Structure & Formatting', data: feedback.structure },
            { id: 'skills', title: 'Skills Match', data: feedback.skills }
        ];

        // Generate HTML
        sections.forEach(sec => {
            if (sec.data) {
                this.elements.feedbackList.innerHTML += this.createAccordionItem(sec.id, sec.title, sec.data.score, sec.data.tips);
            }
        });

        // Update overall score visual
        this.setOverallScore(feedback.overallScore);

        // Show the results area
        this.revealResults();
    }
};

export default visuals;
