// Estado compartilhado: idioma e página ativa
const KEY_LANG = 'lang';
const KEY_PAGE = 'nav.current';

const store = {
  lang: localStorage.getItem(KEY_LANG) || document.documentElement.lang || (navigator.language?.startsWith('pt') ? 'pt-PT' : 'en-UK'),
  page: localStorage.getItem(KEY_PAGE) || new URL(location.href).pathname,

  setLang(lang){
    this.lang = lang;
    localStorage.setItem(KEY_LANG, lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  },

  setPage(href){
    const path = normalize(href);
    this.page = path;
    localStorage.setItem(KEY_PAGE, path);
    window.dispatchEvent(new CustomEvent('pagechange', { detail: { href: path } }));
  }
};

function normalize(href){
  try { return new URL(href, location.href).pathname; }
  catch { return href; }
}

export default store;
export { normalize };
