import store from './nav-store.js';

export function initLangDrop(drop){
  if (!drop) return;
  const btn   = drop.querySelector('.hd-langdrop-btn');
  const menu  = drop.querySelector('.hd-langmenu');
  const opts  = drop.querySelectorAll('.hd-langopt');
  const flagEl= drop.querySelector('[data-current-flag]');
  const codeEl= drop.querySelector('[data-current-code]');

  reflect(store.lang);

  btn?.addEventListener('click', (e)=>{
    e.stopPropagation();
    const open = btn.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  document.addEventListener('click', (e)=>{
    if (!drop.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') setOpen(false);
  });

  opts.forEach(o=>{
    o.addEventListener('click', ()=>{
      const lang = o.dataset.lang;
      store.setLang(lang);
      setOpen(false);
      opts.forEach(x=>x.classList.toggle('is-active', x===o));
      reflect(lang);
    });
  });

  window.addEventListener('langchange', (e)=> reflect(e.detail.lang));

  function setOpen(open){
    btn?.setAttribute('aria-expanded', String(open));
    if (menu) menu.hidden = !open;
    if (open) menu?.focus();
  }

  function reflect(lang){
    const opt  = drop.querySelector(`.hd-langopt[data-lang="${lang}"]`) || drop.querySelector('.hd-langopt');
    const flag = opt?.dataset.flag || '../Images/pt.svg';
    const code = opt?.dataset.label || (lang?.slice(0,2)||'??').toUpperCase();
    if (flagEl) {
      if (flagEl.tagName === 'IMG') {
        flagEl.src = flag;
        flagEl.alt = code;
      } else {
        flagEl.innerHTML = `<img src="${flag}" alt="${code}" width="20" height="15">`;
      }
    }
    if (codeEl) codeEl.textContent = code;
    drop.querySelectorAll('.hd-langopt').forEach(x=>x.classList.toggle('is-active', x===opt));
  }
}

