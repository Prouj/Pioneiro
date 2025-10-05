// i18n.js — simples: 1 JSON por idioma, sem fallback
const I18N_BASE = '/Strings/'; 
const CACHE = new Map();

let CURRENT = 'pt';
let BUNDLE = {};

function norm(lang) {
  // usa os 2 primeiros chars: pt-PT, pt-BR => 'pt'; en-UK => 'en'
  return String(lang || 'pt').toLowerCase().slice(0, 2);
}

async function loadBundle(lang2) {
  const key = norm(lang2);
  if (CACHE.has(key)) return CACHE.get(key);
  const res = await fetch(`${I18N_BASE}${key}.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`i18n: erro ao carregar ${key}.json (${res.status})`);
  const json = await res.json();
  CACHE.set(key, json);
  return json;
}

function getPath(obj, path) {
  return path.split('.').reduce((acc, k) =>
    acc != null && Object.prototype.hasOwnProperty.call(acc, k) ? acc[k] : undefined, obj);
}

export async function initI18n() {
  // idioma inicial: store -> localStorage -> <html lang> -> navegador -> 'pt'
  const start =
    norm(localStorage.getItem('lang')) ||
    'pt';

  await setLang(start);

  // escuta seu store (ou qualquer lugar) emitindo 'langchange'
  window.addEventListener('langchange', (e) => {
    const lang = e.detail?.lang;
    if (lang && norm(lang) !== CURRENT) setLang(lang);
  });
}

async function setLang(lang) {
  CURRENT = norm(lang);
  BUNDLE = await loadBundle(CURRENT);

  apply(document); // traduz tudo que já está no DOM

  document.documentElement.lang = CURRENT;
}

// Função para buscar tradução por chave
export function setCustom(key) {
  return getPath(BUNDLE, key) ?? '';
}

// antes do loop [data-i18n], processe os que pedem HTML:
export function apply(root = document) {
  if (!BUNDLE) return;

  // 1) elementos que aceitam HTML da tradução
  root.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const val = getPath(BUNDLE, key);
    if (val != null) el.innerHTML = val; 
  });

  // 2) elementos de texto simples (sem HTML)
  root.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.hasAttribute('data-i18n-html')) return;
    if (el.closest('script,style')) return;
    const key = el.getAttribute('data-i18n');
    const val = getPath(BUNDLE, key);
    if (val != null) el.textContent = val;
    const attrs = (el.getAttribute('data-i18n-attr') || '')
      .split(/[\s:]+/).map(s=>s.trim()).filter(Boolean);
    attrs.forEach(attr => {
      const k = el.getAttribute(`data-i18n-${attr}`) || key;
      const v = getPath(BUNDLE, k);
      if (v != null) el.setAttribute(attr, v);
    });
  });
}

