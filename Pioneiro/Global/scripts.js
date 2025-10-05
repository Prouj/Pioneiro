import { initHeader } from '../Components/Scripts/header.js';
import { initDrawer } from '../Components/Scripts/draw.js';
import { initI18n, apply } from '/Components/Scripts/i18n.js';

const COMPONENTS_BASE = new URL('../Components/', import.meta.url);
const headerCSS = new URL('ComponentsCss/header.css', COMPONENTS_BASE);
const drawerCSS = new URL('ComponentsCss/drawer.css', COMPONENTS_BASE);
const footerCSS = new URL('ComponentsCss/footer.css', COMPONENTS_BASE);
const bannerCSS = new URL('ComponentsCss/imageBanner.css', COMPONENTS_BASE);
const globalCSS = new URL('./styles.css', import.meta.url);
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

  apply(headerHost)
  apply(drawerHost)
}

async function setupFooter() {
  const footerHost = document.getElementById('site-footer');

  const footerElement = await fetch('../Components/footer.html').then(r => r.text())

  footerHost.innerHTML = footerElement;

  apply(footerHost)
  formValidation(footerHost); // Aplica validação ao novo footer
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
      // Efeito de sucesso no botão
      if (submitBtn) {
        submitBtn.classList.add('cf-success');
        setTimeout(() => {
          submitBtn.classList.remove('cf-success');
          // Limpa todos os campos do formulário após sucesso
          form.querySelectorAll('input, textarea').forEach(field => {
            field.value = '';
          });
        }, 1200);
      }
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

    const openTag = href ? `<a class="image-card-wrapper" href="${href}">` : `<div class="image-card-wrapper">`;
    const closeTag = href ? `</a>` : `</div>`;

    this.innerHTML = `
        <div class="image-card-container">
          ${openTag}
            <img src="${src}" alt="${alt}" class="image-card-img">
            <div class="image-card-text">
              <h3 class="image-card-title">${title}</h3>
              <p class="image-card-subtitle">${subtitle}</p>
            </div>
          ${closeTag}
        </div>
      `;
  }
}
customElements.define('image-card', ImageCard);

