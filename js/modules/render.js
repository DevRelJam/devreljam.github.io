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
  arrowLeft:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>',
  arrowRight:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>',
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
  link.className = `pill-link pill-link--${item.variant || variant}`;
  link.setAttribute('aria-label', item.label);
  appendIcon(link, item.icon, item.label);
  return link;
}

function makeIconButton(label, iconName, className) {
  const button = createEl('button', className);
  button.type = 'button';
  button.setAttribute('aria-label', label);
  const icon = createEl('span', 'icon');
  icon.innerHTML = icons[iconName];
  button.appendChild(icon);
  return button;
}

function templateText(template, values) {
  return String(template || '').replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function initials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function renderHeader(config) {
  const root = qs('#site-header');
  const brand = document.createElement('a');
  brand.className = 'brand';
  brand.href = '#hero';
  brand.setAttribute('aria-label', config.ui.header.homeLabel);

  const logo = createEl('img', 'brand__logo');
  logo.src = config.site.brand.logo;
  logo.alt = config.ui.header.logoAlt;
  logo.loading = 'eager';

  const title = createEl('span', 'brand__title', config.site.name);
  brand.append(logo, title);

  const nav = createEl('nav', 'nav');
  nav.setAttribute('aria-label', config.ui.header.navLabel);

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
  image.alt = config.ui.hero.logoAlt;
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
  (event.actions || []).forEach((item) => {
    eventActions.appendChild(makeActionLink(item, item.variant));
  });

  content.append(status, eventTitle, meta, eventCopy, agenda, eventActions);

  const visual = createEl('div', 'event-card__visual');
  const image = createEl('img');
  image.src = event.image;
  image.alt = event.imageAlt;
  image.loading = 'lazy';
  visual.appendChild(image);

  card.append(content, visual);
  root.replaceChildren(title, copy, card);
}

export function renderFormat(config) {
  const root = qs('#format');
  const format = config.format;
  if (!root || !format) return;

  const title = createEl('h2', 'section-title', format.title);
  const copy = createEl('p', 'section-copy section-copy--center', format.description);
  const shell = createEl('div', 'format-shell');

  const splitPanel = createEl('div', 'format-panel');
  splitPanel.appendChild(createEl('h3', '', format.splitTitle));

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
  principlesPanel.appendChild(createEl('h3', '', format.principlesTitle));

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

function makePastEventCard(event, past) {
  const card = createEl('article', 'past-card');
  card.dataset.city = event.city;

  const visual = createEl('a', 'past-card__visual');
  visual.href = event.url;
  visual.target = '_blank';
  visual.rel = 'noopener noreferrer';

  const image = createEl('img');
  image.src = event.image;
  image.alt = event.imageAlt;
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
  actions.appendChild(makeActionLink({ ...past.actions.luma, href: event.url }, past.actions.luma.variant));
  if (event.repo) {
    actions.appendChild(makeActionLink({ ...past.actions.repo, href: event.repo }, past.actions.repo.variant));
  }

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

  const filter = past.filter;
  const cities = [filter.allLabel, ...new Set(past.items.map((item) => item.city))];
  const filters = createEl('div', 'filter-bar');
  filters.setAttribute('aria-label', filter.ariaLabel);

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
      const shouldShow = city === filter.allLabel || card.dataset.city === city;
      card.hidden = !shouldShow;
      if (shouldShow) visible += 1;
    });
    const unit = visible === 1 ? filter.countSingular : filter.countPlural;
    count.textContent = templateText(filter.countTemplate, { count: visible, unit });
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
    cards.appendChild(makePastEventCard(event, past));
  });

  const highlightRow = createEl('div', 'past-actions');
  if (past.highlightCta) {
    highlightRow.appendChild(makeActionLink(past.highlightCta, past.highlightCta.variant));
  }

  root.replaceChildren(title, copy, filters, count, cards, highlightRow);
  updateFilter(filter.allLabel);
}

export function renderGallery(config) {
  const root = qs('#gallery');
  const gallery = config.gallery;
  if (!root || !gallery) return;

  const title = createEl('h2', 'section-title', gallery.title);
  const copy = createEl('p', 'section-copy section-copy--center', gallery.description);
  const carouselConfig = gallery.carousel;
  const carousel = createEl('div', 'gallery-carousel');
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', carouselConfig.ariaLabel);

  const viewport = createEl('div', 'gallery-carousel__viewport');
  const track = createEl('div', 'gallery-carousel__track');

  gallery.items.forEach((item, index) => {
    const card = createEl('article', 'gallery-card');
    card.setAttribute('aria-label', templateText(carouselConfig.slideLabelTemplate, {
      title: item.title,
      index: index + 1,
      total: gallery.items.length
    }));
    const visual = createEl('div', 'gallery-card__visual');
    const image = createEl('img');
    image.src = item.image;
    image.alt = item.imageAlt || item.caption;
    image.loading = index < 2 ? 'eager' : 'lazy';
    visual.appendChild(image);

    const content = createEl('div', 'gallery-card__content');
    content.append(
      createEl('p', 'gallery-card__event', item.event),
      createEl('h3', '', item.title),
      createEl('p', '', item.caption)
    );

    card.append(visual, content);
    track.appendChild(card);
  });
  viewport.appendChild(track);

  const controls = createEl('div', 'gallery-carousel__controls');
  const previous = makeIconButton(carouselConfig.previousLabel, 'arrowLeft', 'gallery-carousel__button');
  const next = makeIconButton(carouselConfig.nextLabel, 'arrowRight', 'gallery-carousel__button');
  const counter = createEl('p', 'gallery-carousel__counter');
  controls.append(previous, counter, next);

  const dots = createEl('div', 'gallery-carousel__dots');
  const dotButtons = gallery.items.map((_, index) => {
    const dot = createEl('button', 'gallery-carousel__dot');
    dot.type = 'button';
    dot.setAttribute('aria-label', templateText(carouselConfig.dotLabelTemplate, { index: index + 1 }));
    dot.addEventListener('click', () => goTo(index));
    dots.appendChild(dot);
    return dot;
  });

  let currentIndex = 0;
  function goTo(nextIndex) {
    currentIndex = (nextIndex + gallery.items.length) % gallery.items.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    counter.textContent = templateText(carouselConfig.counterTemplate, {
      index: currentIndex + 1,
      total: gallery.items.length
    });

    track.querySelectorAll('.gallery-card').forEach((card, index) => {
      card.setAttribute('aria-hidden', String(index !== currentIndex));
    });
    dotButtons.forEach((dot, index) => {
      const active = index === currentIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
  }

  previous.addEventListener('click', () => goTo(currentIndex - 1));
  next.addEventListener('click', () => goTo(currentIndex + 1));

  carousel.append(viewport, controls, dots);
  root.replaceChildren(title, copy, carousel);
  goTo(0);
}

export function renderPeople(config) {
  const root = qs('#people');
  const people = config.people;
  if (!root || !people) return;

  const title = createEl('h2', 'section-title', people.title);
  const copy = createEl('p', 'section-copy section-copy--center', people.description);

  const speakerHeading = createEl('h3', 'subsection-title', people.speakersTitle);
  const speakerGrid = createEl('div', 'person-grid');
  (people.speakers || []).forEach((person) => {
    const card = createEl('article', 'person-card');
    const avatar = createEl('div', 'person-card__avatar');

    if (person.image) {
      const image = createEl('img');
      image.src = person.image;
      image.alt = `${person.name} ${config.ui.images.headshotSuffix}`;
      image.loading = 'lazy';
      avatar.appendChild(image);
    } else {
      avatar.appendChild(createEl('span', '', initials(person.name)));
    }

    const content = createEl('div', 'person-card__content');
    const name = createEl('h4', '', '');
    if (person.profile) {
      const profileLink = safeExternalLink(person.profile);
      profileLink.textContent = person.name;
      name.appendChild(profileLink);
    } else {
      name.textContent = person.name;
    }

    content.append(
      name,
      createEl('p', 'person-card__role', person.designation),
      createEl('p', 'person-card__event', person.event)
    );

    card.append(avatar, content);
    speakerGrid.appendChild(card);
  });

  root.replaceChildren(title, copy, speakerHeading, speakerGrid);
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
  initiative.append(`${config.footer.initiativePrefix} `, initiativeLink);

  const socials = createEl('div', 'footer-social');
  config.community.socials.forEach((item) => {
    socials.appendChild(makeActionLink(item, 'icon'));
  });

  const now = new Date().getFullYear();
  const builtWith = createEl('p', 'footer-credit', config.footer.builtWith);
  const copyright = createEl(
    'p',
    'footer-credit',
    templateText(config.footer.copyrightTemplate, { year: now, copyright: config.footer.copyright })
  );

  root.replaceChildren(note, socials, initiative, builtWith, copyright);
}
