import store, { normalize } from './nav-store.js';
import { initLangDrop } from './langdrop.js';

export function initHeader(root = document) {
    //   dropdown desktop
    initLangDrop(root.querySelector('[data-role="langdrop"]'));

    //   marca link ativo no desktop
    const links = root.querySelectorAll('.hd-nav .hd-link');
    const mark = (href) => links.forEach(a => {
        const on = normalize(a.getAttribute('href')) === normalize(href);
        a.toggleAttribute('aria-current', on);
    });
    mark(store.page);
    links.forEach(a => a.addEventListener('click', () => store.setPage(a.getAttribute('href'))));
    window.addEventListener('pagechange', (e) => mark(e.detail.href));

    //   abre drawer (evento global)
    root.querySelector('.hd-toggle')?.addEventListener('click', () => {
        window.dispatchEvent(new Event('drawer:open'));
    });

    // Marca 'Início' como ativo ao clicar na logo
    const logo = root.querySelector('.hd-logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            // Atualiza o store para a home
            store.setPage(links[0]?.getAttribute('href'));
        });
    }

    // Global listener: qualquer elemento com classe .book deve ativar a página de reservas
    document.addEventListener('click', (e) => {
        const el = e.target.closest('.book');
        if (!el) return;
        // links[1] normalmente é o link de booking (consistência com header.html)
        const bookingLink = links[1];
        if (bookingLink) {
            store.setPage(bookingLink.getAttribute('href'));
        }
    });
}
