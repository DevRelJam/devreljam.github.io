import { loadConfig } from './modules/config.js';
import {
  renderAbout,
  renderCities,
  renderEvents,
  renderFooter,
  renderFormat,
  renderGallery,
  renderHeader,
  renderHero,
  renderPastEvents,
  renderPeople,
  renderSpeakers
} from './modules/render.js';
import { applySeo } from './modules/seo.js';

function initTheme(labels) {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-switch');
  const savedTheme = localStorage.getItem('devreljam-theme');
  const initialTheme = savedTheme || 'light';

  function setTheme(theme) {
    root.dataset.theme = theme;
    if (!toggle) return;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', nextTheme === 'dark' ? labels.switchToDark : labels.switchToLight);
  }

  setTheme(initialTheme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('devreljam-theme', nextTheme);
      setTheme(nextTheme);
    });
  }
}

function renderDocumentChrome(config) {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) skipLink.textContent = config.ui.skipLink;
}

async function boot() {
  try {
    const config = await loadConfig();

    document.documentElement.lang = config.site.language || 'en';
    renderDocumentChrome(config);
    initTheme(config.ui.theme);

    renderHeader(config);
    renderHero(config);
    renderAbout(config);
    renderEvents(config);
    renderFormat(config);
    renderPastEvents(config);
    renderGallery(config);
    renderPeople(config);
    renderCities(config);
    renderSpeakers(config);
    renderFooter(config);

    await applySeo(config);

    if (window.location.hash) {
      const restoreHashScroll = () => {
        document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: 'start' });
      };
      requestAnimationFrame(restoreHashScroll);
      window.setTimeout(restoreHashScroll, 350);
      window.setTimeout(restoreHashScroll, 900);
    }
  } catch (error) {
    const fallback = document.createElement('div');
    fallback.style.margin = '2rem auto';
    fallback.style.maxWidth = '720px';
    fallback.style.padding = '1rem';
    fallback.style.border = '1px solid #dacdbc';
    fallback.style.background = '#fffaf2';
    fallback.textContent = `Unable to load website configuration. ${error.message}`;
    document.body.prepend(fallback);
  }
}

boot();
