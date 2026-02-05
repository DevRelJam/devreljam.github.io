import { loadConfig } from './modules/config.js';
import {
  renderAbout,
  renderEvents,
  renderFooter,
  renderGallery,
  renderHeader,
  renderHero,
  renderSpeakers
} from './modules/render.js';
import { applySeo } from './modules/seo.js';

async function boot() {
  try {
    const config = await loadConfig();

    document.documentElement.lang = config.site.language || 'en';

    renderHeader(config);
    renderHero(config);
    renderAbout(config);
    renderEvents(config);
    renderGallery(config);
    renderSpeakers(config);
    renderFooter(config);

    await applySeo(config);
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
