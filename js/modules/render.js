import { createEl, qs, safeExternalLink } from './utils.js';

const icons = {
  calendar:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="3"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>',
  github:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.44 5.44 0 0 0 3.5 8.55c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
  mic:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"></path></svg>',
  pin:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  spark:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"></path></svg>',
  users:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
};

function appendIcon(link, iconName, label) {
  if (icons[iconName]) {
    const icon = createEl('span', 'icon');
    icon.innerHTML = icons[iconName];
    link.appendChild(icon);
  }
  link.appendChild(document.createTextNode(label));
}

function makeActionLink(item, variant = 'ghost') {
  const link = safeExternalLink(item.href);
  link.className = `pill-link pill-link--${variant}`;
  link.setAttribute('aria-label', item.label);
  appendIcon(link, item.icon, item.label);
  return link;
}

export function renderHeader(config) {
  const root = qs('#site-header');
  const brand = document.createElement('a');
  brand.className = 'brand';
  brand.href = '#hero';
  brand.setAttribute('aria-label', `${config.site.name} home`);

  const logo = createEl('img', 'brand__logo');
  logo.src = config.site.brand.logo;
  logo.alt = `${config.site.name} logo`;
  logo.loading = 'eager';

  const title = createEl('span', 'brand__title', config.site.name);
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
  const imageWrapper = createEl('div', 'hero__logo-wrap');
  const image = createEl('img', 'hero__logo');
  image.src = config.site.brand.logo;
  image.alt = `${config.site.name} mark`;
  image.loading = 'eager';
  imageWrapper.appendChild(image);

  const headline = createEl('h1', 'hero__headline', config.hero.headline);
  const subheadline = createEl('p', 'hero__subheadline', config.hero.subheadline);
  const body = createEl('p', 'hero__body', config.hero.body);

  const actions = createEl('div', 'social-links');
  actions.append(
    makeActionLink(config.hero.primaryCta, 'solid'),
    makeActionLink(config.hero.secondaryCta, 'ghost')
  );

  const stats = createEl('div', 'hero-stats');
  (config.hero.stats || []).forEach((item) => {
    const stat = createEl('div', 'hero-stat');
    stat.append(createEl('span', 'hero-stat__value', item.value), createEl('span', 'hero-stat__label', item.label));
    stats.appendChild(stat);
  });

  root.replaceChildren(imageWrapper, headline, subheadline, actions, body, stats);
}

export function renderAbout(config) {
  const root = qs('#about');
  const title = createEl('h2', 'section-title', config.about.title);
  const copy = createEl('div', 'section-copy');

  config.about.paragraphs.forEach((paragraph) => {
    copy.appendChild(createEl('p', '', paragraph));
  });

  const grid = createEl('div', 'feature-grid');
  config.about.highlights.forEach((item) => {
    const card = createEl('article', 'feature-card');
    card.append(createEl('h3', '', item.title), createEl('p', '', item.body));
    grid.appendChild(card);
  });

  root.replaceChildren(title, copy, grid);
}

export function renderEvents(config) {
  const root = qs('#events');
  const title = createEl('h2', 'section-title', config.events.title);
  const copy = createEl('p', 'section-copy section-copy--center', config.events.description);
  const event = config.events.current;

  const card = createEl('article', 'event-card');
  const content = createEl('div', 'event-card__content');
  const status = createEl('p', 'event-card__status', event.status);
  const eventTitle = createEl('h3', '', event.name);
  const eventCopy = createEl('p', '', event.description);
  const meta = createEl('div', 'event-meta');

  [
    `${event.date}`,
    `${event.time} ${event.timezone}`,
    `${event.location}`
  ].forEach((item) => meta.appendChild(createEl('span', '', item)));

  const agenda = createEl('ul', 'event-agenda');
  event.agenda.forEach((item) => {
    agenda.appendChild(createEl('li', '', item));
  });

  const eventActions = createEl('div', 'action-row');
  eventActions.appendChild(makeActionLink({ label: 'Register on Luma', href: event.url, icon: 'calendar' }, 'solid'));
  eventActions.appendChild(makeActionLink({ label: 'Full calendar', href: config.events.calendarUrl, icon: 'users' }, 'ghost'));

  content.append(status, eventTitle, meta, eventCopy, agenda, eventActions);

  const visual = createEl('div', 'event-card__visual');
  const image = createEl('img');
  image.src = event.image;
  image.alt = `${event.name} cover`;
  image.loading = 'lazy';
  visual.appendChild(image);

  card.append(content, visual);

  const embedPanel = createEl('div', 'embed-panel');
  const embedTitle = createEl('h3', '', 'Live Luma Feed');
  const frame = createEl('iframe', 'events__frame');
  frame.src = config.events.embed.src;
  frame.width = config.events.embed.width;
  frame.height = config.events.embed.height;
  frame.title = 'DevRelJam Luma event calendar';
  frame.setAttribute('frameborder', '0');
  frame.style.border = config.events.embed.border;
  frame.style.borderRadius = config.events.embed.radius;
  frame.allowFullscreen = true;
  frame.loading = 'lazy';
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  embedPanel.append(embedTitle, frame);

  root.replaceChildren(title, copy, card, embedPanel);
}

export function renderFormat(config) {
  const root = qs('#format');
  const format = config.format;
  if (!root || !format) return;

  const title = createEl('h2', 'section-title', format.title);
  const copy = createEl('p', 'section-copy section-copy--center', format.description);
  const shell = createEl('div', 'format-shell');

  const splitPanel = createEl('div', 'format-panel');
  splitPanel.appendChild(createEl('h3', '', 'What to expect'));

  const splitList = createEl('div', 'format-split');
  format.split.forEach((item) => {
    const row = createEl('article', 'format-split__row');
    row.append(createEl('span', 'format-split__value', item.value));

    const rowCopy = createEl('div');
    rowCopy.append(createEl('h4', '', item.label), createEl('p', '', item.body));
    row.appendChild(rowCopy);
    splitList.appendChild(row);
  });
  splitPanel.appendChild(splitList);

  const principlesPanel = createEl('div', 'format-panel format-panel--principles');
  principlesPanel.appendChild(createEl('h3', '', 'Principles'));

  const principles = createEl('div', 'principle-list');
  format.principles.forEach((item) => {
    const principle = createEl('article', 'principle-item');
    const icon = createEl('span', 'principle-item__icon');
    icon.innerHTML = icons.spark;
    principle.append(icon, createEl('h4', '', item.title), createEl('p', '', item.body));
    principles.appendChild(principle);
  });
  principlesPanel.appendChild(principles);

  shell.append(splitPanel, principlesPanel);
  root.replaceChildren(title, copy, shell);
}

function makePastEventCard(event) {
  const card = createEl('article', 'past-card');
  card.dataset.city = event.city;

  const visual = createEl('a', 'past-card__visual');
  visual.href = event.url;
  visual.target = '_blank';
  visual.rel = 'noopener noreferrer';

  const image = createEl('img');
  image.src = event.image;
  image.alt = `${event.name} cover`;
  image.loading = 'lazy';
  visual.appendChild(image);

  const content = createEl('div', 'past-card__content');
  const status = createEl('p', 'event-card__status', event.status);
  const title = createEl('h3', '', event.name);
  const meta = createEl('div', 'event-meta');
  [event.date, event.location].forEach((item) => {
    meta.appendChild(createEl('span', '', item));
  });

  const summary = createEl('p', '', event.summary);
  const highlights = createEl('ul', 'event-agenda event-agenda--compact');
  event.highlights.forEach((item) => {
    highlights.appendChild(createEl('li', '', item));
  });

  const actions = createEl('div', 'action-row action-row--left');
  actions.appendChild(makeActionLink({ label: 'View Luma page', href: event.url, icon: 'calendar' }, 'quiet'));

  content.append(status, title, meta, summary, highlights, actions);
  card.append(visual, content);
  return card;
}

export function renderPastEvents(config) {
  const root = qs('#past');
  const past = config.events.past;
  if (!root || !past) return;

  const title = createEl('h2', 'section-title', past.title);
  const copy = createEl('p', 'section-copy section-copy--center', past.description);

  const cities = ['All', ...new Set(past.items.map((item) => item.city))];
  const filters = createEl('div', 'filter-bar');
  filters.setAttribute('aria-label', 'Filter past DevRelJam events by city');

  const count = createEl('p', 'filter-count');
  const cards = createEl('div', 'past-grid');

  function updateFilter(city) {
    filters.querySelectorAll('button').forEach((button) => {
      const active = button.dataset.city === city;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    let visible = 0;
    cards.querySelectorAll('.past-card').forEach((card) => {
      const shouldShow = city === 'All' || card.dataset.city === city;
      card.hidden = !shouldShow;
      if (shouldShow) visible += 1;
    });
    count.textContent = `${visible} ${visible === 1 ? 'Jam' : 'Jams'} shown`;
  }

  cities.forEach((city) => {
    const button = createEl('button', 'filter-button', city);
    button.type = 'button';
    button.dataset.city = city;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => updateFilter(city));
    filters.appendChild(button);
  });

  past.items.forEach((event) => {
    cards.appendChild(makePastEventCard(event));
  });

  const highlightRow = createEl('div', 'past-actions');
  highlightRow.appendChild(makeActionLink({ label: 'View community highlights', href: past.highlightUrl, icon: 'users' }, 'ghost'));

  root.replaceChildren(title, copy, filters, count, cards, highlightRow);
  updateFilter('All');
}

export function renderCities(config) {
  const root = qs('#cities');
  const title = createEl('h2', 'section-title', config.cities.title);
  const copy = createEl('p', 'section-copy section-copy--center', config.cities.description);
  const grid = createEl('div', 'city-grid');

  config.cities.items.forEach((item) => {
    const card = createEl('article', 'city-card');
    const icon = createEl('span', 'city-card__icon');
    icon.innerHTML = icons.pin;
    card.append(icon, createEl('h3', '', item.name), createEl('p', 'city-card__status', item.status), createEl('p', '', item.detail));
    grid.appendChild(card);
  });

  root.replaceChildren(title, copy, grid);
}

export function renderSpeakers(config) {
  const root = qs('#speakers');
  const panel = createEl('article', 'speaker-panel');
  const content = createEl('div');
  content.append(
    createEl('h2', 'section-title', config.speakers.title),
    createEl('p', 'section-copy', config.speakers.description)
  );

  const apply = makeActionLink(config.speakers.cta, 'solid');
  panel.append(content, apply);
  root.replaceChildren(panel);
}

export function renderFooter(config) {
  const root = qs('#site-footer');

  const note = createEl('p', 'footer-tagline', config.footer.note);
  const initiative = createEl('p', 'footer-credit');
  const initiativeLink = safeExternalLink(config.community.initiativeBy.href);
  initiativeLink.textContent = config.community.initiativeBy.name;
  initiative.append('An initiative by ', initiativeLink);

  const socials = createEl('div', 'footer-social');
  config.community.socials.forEach((item) => {
    socials.appendChild(makeActionLink(item, 'icon'));
  });

  const now = new Date().getFullYear();
  const builtWith = createEl('p', 'footer-credit', config.footer.builtWith);
  const copyright = createEl(
    'p',
    'footer-credit',
    `© ${now} ${config.footer.copyright}. All rights reserved.`
  );

  root.replaceChildren(note, socials, initiative, builtWith, copyright);
}
