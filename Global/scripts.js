import { initHeader, initHeaderScrollEffect } from '../Components/Scripts/header.js';
import { initDrawer } from '../Components/Scripts/draw.js';
import { initI18n, apply } from '/Components/Scripts/i18n.js';

const COMPONENTS_BASE = new URL('../Components/', import.meta.url);
const headerCSS = new URL('ComponentsCss/header.css', COMPONENTS_BASE);
const drawerCSS = new URL('ComponentsCss/drawer.css', COMPONENTS_BASE);
const footerCSS = new URL('ComponentsCss/footer.css', COMPONENTS_BASE);
const bannerCSS = new URL('ComponentsCss/imageBanner.css', COMPONENTS_BASE);
const normalizeCSS = new URL('./normalize.css', import.meta.url);
const globalCSS = new URL('./styles.css', import.meta.url);
ensureCssOnce(normalizeCSS.href, 'normalize-css');
ensureCssOnce(globalCSS.href, 'global-css');
ensureCssOnce(headerCSS.href, 'header-css');
ensureCssOnce(drawerCSS.href, 'drawer-css');
ensureCssOnce(footerCSS.href, 'footer-css');
ensureCssOnce(bannerCSS.href, 'banner-css');

document.addEventListener("DOMContentLoaded", async () => {
  await initI18n();

  setupHeader().catch(console.error);
  setupFooter().catch(console.error);
  setupBanner()
});

async function setupHeader() {
  const headerHost = document.getElementById('site-header');
  const drawerHost = document.getElementById('site-drawer');

  const [h, d] = await Promise.all([
    fetch('../Components/header.html').then(r => r.text()),
    fetch('../Components/drawer.html').then(r => r.text())
  ]);

  headerHost.innerHTML = h;
  drawerHost.innerHTML = d;

  initHeader(headerHost);
  initDrawer(drawerHost);
  initHeaderScrollEffect(); // Adiciona efeito de scroll no header

  apply(headerHost)
  apply(drawerHost)
}

function sendFormByMailto(form) {
  // procura por campos comuns
  const name = form.querySelector('[name="name"]')?.value || '';
  const email = form.querySelector('[name="email"]')?.value || '';
  const phone = form.querySelector('[name="phone"]')?.value || '';
  const message = form.querySelector('[name="message"]')?.value || '';

  const to = 'rubem.uchoa27@gmail.com';
  const subject = encodeURIComponent(`Contacto via site: ${name}`);
  const bodyLines = [];
  if (name) bodyLines.push(`Nome: ${name}`);
  if (email) bodyLines.push(`Email: ${email}`);
  if (phone) bodyLines.push(`Telefone: ${phone}`);
  if (message) bodyLines.push(`Mensagem: ${message}`);
  const body = encodeURIComponent(bodyLines.join('\n'));

  // Abre o cliente de email com os dados (não envia automaticamente)
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
}

async function sendFormViaFetch(form, endpoint, method = 'POST') {
  const fd = new FormData(form);
  const opts = {
    method,
    body: fd,
  };
  const res = await fetch(endpoint, opts);
  if (!res.ok) throw new Error(`Envio falhou: ${res.status}`);
  return res;
}

async function setupFooter() {
  const footerHost = document.getElementById('site-footer');

  const footerElement = await fetch('../Components/footer.html').then(r => r.text())

  footerHost.innerHTML = footerElement;

  apply(footerHost)
  // formValidation(footerHost); // Aplica validação ao novo footer
}

function setupBanner() {
  const banner = document.getElementById('image-banner');
  apply(banner)
}

function formValidation(context = document) {
  context.querySelectorAll('form').forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Sempre previne envio e scroll
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('cf-error');
          valid = false;
        } else {
          input.classList.remove('cf-error');
        }
      });
      if (!valid) {
        return;
      }
      // Envio direto se houver endpoint (data-endpoint ou action), senão fallback para mailto
      const endpoint = form.getAttribute('data-endpoint') || form.getAttribute('action');
      const method = (form.getAttribute('method') || 'POST').toUpperCase();
      if (submitBtn) submitBtn.disabled = true;
      (async () => {
        try {
          if (endpoint) {
            await sendFormViaFetch(form, endpoint, method);
          } else {
            sendFormByMailto(form);
          }
          if (submitBtn) {
            submitBtn.classList.add('cf-success');
            setTimeout(() => submitBtn.classList.remove('cf-success'), 1200);
          }
          form.querySelectorAll('input, textarea').forEach(field => field.value = '');
        } catch (err) {
          console.error('Erro ao enviar formulário', err);
          if (submitBtn) {
            submitBtn.classList.add('cf-fail');
            setTimeout(() => submitBtn.classList.remove('cf-fail'), 1600);
          }
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      })();
      // Aqui você pode chamar o serviço de envio do formulário
      // Exemplo:
      // enviarFormulario(new FormData(form)).then(() => { ... });
    });
    form.querySelectorAll('[required]').forEach(input => {
      input.addEventListener('input', function () {
        if (input.value.trim()) {
          input.classList.remove('cf-error');
        }
      });
    });
  });
}

function ensureCssOnce(href, id) {
  if (id && document.getElementById(id)) return;
  if ([...document.styleSheets].some(s => s.href && s.href.includes(href))) return;
  const l = document.createElement('link');
  if (id) l.id = id;
  l.rel = 'stylesheet';
  l.href = href;
  document.head.appendChild(l);
}

class ImageBanner extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src') || '';
    const alt = this.getAttribute('alt') || '';
    const title = this.getAttribute('title') || '';

    this.innerHTML = `
        <div class="image-banner-container">
          <div>
            <img src="${src}" alt="${alt}" class="image-banner-img">
            <div class="image-banner-text">
              <h3 class="image-banner-title" data-i18n-html="${title}"></h3>
            </div>
          </div>
        </div>
      `;
  }
}
customElements.define('image-banner', ImageBanner);

class ImageCard extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src') || '';
    const alt = this.getAttribute('alt') || '';
    const title = this.getAttribute('title') || '';
    const subtitle = this.getAttribute('subtitle') || '';
    const href = this.getAttribute('href');

    const openTag = href ? `<a class="image-card-wrapper" href="${href}">` : ``;
    const closeTag = href ? `</a>` : ``;

    this.innerHTML = `
     ${openTag}
        <div class="image-card-container">
            <img src="${src}" alt="${alt}" class="image-card-img">
            <div class="image-card-text">
              <h3 class="image-card-title" data-i18n-html="${title}"></h3>
              <p class="image-card-subtitle" data-i18n-html="${subtitle}"></p>
            </div>
        </div>
      ${closeTag}
      `;
  }
}
customElements.define('image-card', ImageCard);

