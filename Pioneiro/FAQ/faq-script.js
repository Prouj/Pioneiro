import { setCustom } from '../Components/Scripts/i18n.js';

// Accordion functionality
function initFaq(root = document) {
    root.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            // Collapse all
            root.querySelectorAll('.faq-question').forEach(b => b.setAttribute('aria-expanded', 'false'));
            root.querySelectorAll('.faq-answer').forEach(a => a.hidden = true);
            if (!expanded) {
                btn.setAttribute('aria-expanded', 'true');
                const id = btn.getAttribute('aria-controls');
                const region = root.querySelector('#' + id);
                if (region) { 
                    region.hidden = false;
                }
            }
        });

        btn.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') { 
                e.preventDefault(); 
                btn.parentElement.nextElementSibling?.querySelector('.faq-question')?.focus(); 
            }
            if (e.key === 'ArrowUp') { 
                e.preventDefault(); 
                btn.parentElement.previousElementSibling?.querySelector('.faq-question')?.focus(); 
            }
        });
    });
}

// Load and render FAQ items
function loadFAQ() {
    const faqList = document.querySelector('.faq-list');
    if (!faqList) return;

    // Get FAQ items from translations using setCustom
    const faqItemsData = setCustom('faq.items');
    
    if (!Array.isArray(faqItemsData) || faqItemsData.length === 0) {
        return;
    }

    // Clear existing content
    faqList.innerHTML = '';

    // Render each FAQ item
    faqItemsData.forEach((item, index) => {
        const faqNumber = index + 1;
        const faqId = `faq${faqNumber}`;
        const faqBtnId = `${faqId}-btn`;

        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        
        faqItem.innerHTML = `
            <button class="faq-question" aria-expanded="false" aria-controls="${faqId}" id="${faqBtnId}">
                <span class="faq-index">${faqNumber}</span>
                <span class="faq-question-text">${item.question}</span>
                <span class="faq-toggle" aria-hidden="true">▾</span>
            </button>
            <div id="${faqId}" class="faq-answer" role="region" aria-labelledby="${faqBtnId}" hidden>
                <p>${item.answer}</p>
            </div>
        `;

        faqList.appendChild(faqItem);
    });

    // Initialize accordion functionality
    initFaq();
}

// Listen for i18n loaded event
window.addEventListener('i18nLoaded', () => {
    loadFAQ();
});

// Export for manual initialization if needed
window.initFaq = initFaq;
