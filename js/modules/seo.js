import { absoluteUrl } from './utils.js';

function setMeta(selector, value) {
  const node = document.head.querySelector(selector);
  if (node && value) node.setAttribute('content', value);
}

function setNamedMeta(name, value) {
  const node = document.head.querySelector(`meta[name="${name}"]`);
  if (node && value) node.setAttribute('content', value);
}

function setCanonical(url) {
  const node = document.head.querySelector('link[rel="canonical"]');
  if (node && url) node.setAttribute('href', url);
}

function setFavicon(href) {
  const node = document.head.querySelector('link[rel="icon"]');
  if (node && href) node.setAttribute('href', href);
}

function makeJsonLd(config) {
  const { site, community, events } = config;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: site.name,
        url: site.url,
        description: site.description,
        logo: absoluteUrl(site.brand.logo, site.url),
        founder: {
          '@type': 'Person',
          name: community.initiativeBy.name,
          sameAs: community.initiativeBy.href
        },
        sameAs: community.socials.map((item) => item.href)
      },
      {
        '@type': 'Event',
        name: events.current.name,
        url: events.current.url,
        image: absoluteUrl(events.current.image, site.url),
        description: events.current.description,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        startDate: '2026-09-29T18:00:00+08:00',
        endDate: '2026-09-29T21:00:00+08:00',
        location: {
          '@type': 'Place',
          name: events.current.location,
          address: events.current.location
        },
        organizer: {
          '@type': 'Organization',
          name: site.name,
          url: site.url
        },
        offers: {
          '@type': 'Offer',
          url: events.current.url,
          availability: 'https://schema.org/InStock',
          price: '0',
          priceCurrency: 'USD'
        }
      }
    ]
  };
}

export async function applySeo(config) {
  const { site } = config;
  const title = site.seo.defaultTitle;
  const description = site.seo.defaultDescription;
  const canonical = site.url;
  const keywords = Array.isArray(site.keywords) ? site.keywords.join(', ') : '';
  const author = site.seo.author;
  const ogImage = absoluteUrl(site.seo.ogImage, site.url);

  document.title = title;
  setNamedMeta('description', description);
  setNamedMeta('keywords', keywords);
  setNamedMeta('author', author);

  setCanonical(canonical);
  setFavicon(absoluteUrl(site.brand.favicon, site.url));

  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:url"]', canonical);
  setMeta('meta[property="og:image"]', ogImage);
  setMeta('meta[property="og:image:alt"]', site.seo.ogImageAlt);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:image"]', ogImage);

  const ldNode = document.createElement('script');
  ldNode.type = 'application/ld+json';
  ldNode.textContent = JSON.stringify(makeJsonLd(config));
  document.head.appendChild(ldNode);
}
