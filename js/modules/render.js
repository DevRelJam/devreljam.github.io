import { createEl, qs, safeExternalLink } from './utils.js';

export function renderHeader(config) {
  const root = qs('#site-header');
  const brand = createEl('div', 'brand');

  const logo = createEl('img', 'brand__logo');
  logo.src = config.site.brand.logo;
  logo.alt = `${config.site.name} logo`;
  logo.loading = 'eager';

  const title = createEl('div', 'brand__title', config.site.brand.title);

  brand.append(logo, title);

  const nav = createEl('nav', 'nav');
  nav.setAttribute('aria-label', 'Primary navigation');

  config.navigation.forEach((item) => {
    const link = createEl('a', 'nav__link', item.label);
    link.href = item.href;
    nav.appendChild(link);
  });

  root.replaceChildren(brand, nav);
}

export function renderHero(config) {
  const root = qs('#hero');

  const eyebrow = createEl('p', 'hero__eyebrow', config.hero.eyebrow);
  const headline = createEl('h1', 'hero__headline', config.hero.headline);
  const subheadline = createEl('p', 'hero__subheadline', config.hero.subheadline);

  const actions = createEl('div', 'action-row');
  const primary = safeExternalLink(config.hero.primaryCta.href);
  primary.className = 'btn btn--solid';
  primary.textContent = config.hero.primaryCta.label;

  const secondary = safeExternalLink(config.hero.secondaryCta.href);
  secondary.className = 'btn btn--ghost';
  secondary.textContent = config.hero.secondaryCta.label;

  actions.append(primary, secondary);

  const statGrid = createEl('div', 'stat-grid');
  config.hero.statCards.forEach((item) => {
    const card = createEl('article', 'stat-card');
    const label = createEl('p', 'stat-card__label', item.label);
    const value = createEl('p', 'stat-card__value', item.value);
    card.append(label, value);
    statGrid.appendChild(card);
  });

  root.replaceChildren(eyebrow, headline, subheadline, actions, statGrid);
}

export function renderAbout(config) {
  const root = qs('#about');
  const title = createEl('h2', 'section-title', config.about.title);
  const copy = createEl('p', 'section-copy', config.about.body);

  const list = createEl('ul', 'highlight-list');
  config.about.highlights.forEach((item) => {
    const li = createEl('li', '', item);
    list.appendChild(li);
  });

  root.replaceChildren(title, copy, list);
}

export function renderEvents(config) {
  const root = qs('#events');
  const title = createEl('h2', 'section-title', config.events.title);
  const copy = createEl('p', 'section-copy', config.events.description);

  const frame = createEl('iframe', 'events__frame');
  frame.src = config.events.embed.src;
  frame.width = config.events.embed.width;
  frame.height = config.events.embed.height;
  frame.setAttribute('frameborder', '0');
  frame.style.border = config.events.embed.border;
  frame.style.borderRadius = config.events.embed.radius;
  frame.allowFullscreen = true;
  frame.setAttribute('aria-hidden', 'false');
  frame.tabIndex = 0;
  frame.loading = 'lazy';
  frame.referrerPolicy = 'no-referrer-when-downgrade';

  const quick = safeExternalLink(config.events.calendarUrl);
  quick.className = 'btn btn--ghost';
  quick.textContent = 'Open full calendar';

  root.replaceChildren(title, copy, frame, quick);
}

export function renderGallery(config) {
  const root = qs('#gallery');
  const title = createEl('h2', 'section-title', config.gallery.title);
  const copy = createEl('p', 'section-copy', config.gallery.description);
  const grid = createEl('div', 'gallery-grid');

  config.gallery.images.forEach((item) => {
    const card = createEl('figure', 'gallery-card');
    const image = createEl('img');
    image.src = item.src;
    image.alt = item.alt;
    image.loading = 'lazy';

    image.addEventListener('error', () => {
      card.classList.add('gallery-card--missing');
      card.replaceChildren(createEl('strong', '', 'Image missing'), createEl('p', '', item.caption));
    });

    const caption = createEl('figcaption', '', item.caption);
    card.append(image, caption);
    grid.appendChild(card);
  });

  root.replaceChildren(title, copy, grid);
}

export function renderSpeakers(config) {
  const root = qs('#speakers');
  const panel = createEl('div', 'speaker-panel');

  const left = createEl('div');
  left.append(
    createEl('h2', 'section-title', config.speakers.title),
    createEl('p', 'section-copy', config.speakers.description)
  );

  const apply = safeExternalLink(config.speakers.cta.href);
  apply.className = 'btn btn--solid';
  apply.textContent = config.speakers.cta.label;

  panel.append(left, apply);
  root.replaceChildren(panel);
}

export function renderFooter(config) {
  const root = qs('#site-footer');

  const note = createEl('p', 'footer-credit', config.footer.note);
  const initiative = createEl('p', 'footer-credit');
  const initiativeLink = safeExternalLink(config.community.initiativeBy.href);
  initiativeLink.textContent = config.community.initiativeBy.name;
  initiative.append('An initiative by ', initiativeLink);

  const socials = createEl('div', 'social-row');
  config.community.socials.forEach((item) => {
    const link = safeExternalLink(item.href);
    link.className = 'social-pill';
    link.textContent = item.label;
    socials.appendChild(link);
  });

  const now = new Date().getFullYear();
  const copyright = createEl(
    'p',
    'footer-credit',
    `© ${now} ${config.footer.copyright}. All rights reserved.`
  );

  root.replaceChildren(note, initiative, socials, copyright);
}
