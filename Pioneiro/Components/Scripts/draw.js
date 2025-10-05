import store, { normalize } from './nav-store.js';
import { initLangDrop } from './langdrop.js';

export function initDrawer(root = document) {
  const layer = root.querySelector('.hd-layer') || root; // pode ser o próprio root
  const drawer = root.querySelector('.hd-drawer');
  const overlay = root.querySelector('.hd-overlay');
  const closeBt = root.querySelector('.hd-close');

  function open() {
    drawer?.classList.add('open');
    drawer?.setAttribute('aria-hidden', 'false');
    overlay && (overlay.hidden = false);
    document.addEventListener('keydown', onKey);
  }
  function close() {
    drawer?.classList.remove('open');
    drawer?.setAttribute('aria-hidden', 'true');
    overlay && (overlay.hidden = true);
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  window.addEventListener('drawer:open', open);
  overlay?.addEventListener('click', close);
  closeBt?.addEventListener('click', close);

  // dropdown do drawer
  initLangDrop(root.querySelector('.hd-langdrop.is-drawer'));

  // links do drawer + estado compartilhado
  const links = root.querySelectorAll('.hd-drawer-nav .hd-link');
  const mark = (href) => links.forEach(a => {
    const on = normalize(a.getAttribute('href')) === normalize(href);
    a.toggleAttribute('aria-current', on);
  });
  mark(store.page);
  links.forEach(a => a.addEventListener('click', () => {
    store.setPage(a.getAttribute('href'));
    close();
  }));
  window.addEventListener('pagechange', (e) => mark(e.detail.href));
}
