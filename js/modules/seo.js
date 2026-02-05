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
  const site = config.site;
  const community = config.community;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    description: site.description,
    founder: {
      '@type': 'Person',
      name: community.initiativeBy.name,
      sameAs: community.initiativeBy.href
    },
    sameAs: community.socials.map((item) => item.href)
  };
}

export async function generateOgImage(config) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fdf4e9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#f5e7d5';
  ctx.beginPath();
  ctx.ellipse(1060, -120, 500, 340, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1f8f50';
  ctx.font = '700 30px "Avenir Next", "Trebuchet MS", sans-serif';
  ctx.fillText('DevRelJam', 88, 106);

  ctx.fillStyle = '#1f241f';
  ctx.font = '700 66px "Iowan Old Style", "Palatino Linotype", serif';
  const headline = config.hero.headline.slice(0, 54);
  wrapText(ctx, headline, 88, 190, 980, 78);

  ctx.fillStyle = '#4c574d';
  ctx.font = '500 30px "Avenir Next", "Trebuchet MS", sans-serif';
  wrapText(ctx, config.site.tagline.slice(0, 120), 88, 420, 980, 44);

  ctx.fillStyle = '#d1753f';
  ctx.fillRect(88, 520, 520, 58);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 30px "Avenir Next", "Trebuchet MS", sans-serif';
  ctx.fillText('luma.com/devreljam', 114, 558);

  const logoPath = config.site.brand.logo;
  if (logoPath) {
    try {
      const logo = await loadImage(absoluteUrl(logoPath, config.site.url));
      ctx.save();
      ctx.beginPath();
      ctx.arc(1035, 505, 95, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logo, 940, 410, 190, 190);
      ctx.restore();
    } catch (_) {
      // Keep OG generation resilient even if logo file is missing.
    }
  }

  return canvas.toDataURL('image/png');
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let row = y;

  words.forEach((word) => {
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, row);
      line = `${word} `;
      row += lineHeight;
      return;
    }
    line = test;
  });

  if (line.trim()) ctx.fillText(line.trim(), x, row);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image failed to load'));
    img.src = src;
  });
}

export async function applySeo(config) {
  const { site } = config;
  const title = site.seo.defaultTitle;
  const description = site.seo.defaultDescription;
  const canonical = site.url;
  const keywords = Array.isArray(site.keywords) ? site.keywords.join(', ') : '';
  const author = site.seo.author;

  document.title = title;
  setNamedMeta('description', description);
  setNamedMeta('keywords', keywords);
  setNamedMeta('author', author);

  setCanonical(canonical);
  setFavicon(absoluteUrl(site.brand.favicon, site.url));

  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:url"]', canonical);
  setMeta('meta[property="og:image:alt"]', site.seo.ogImageAlt);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);

  const ogImage = await generateOgImage(config);
  setMeta('meta[property="og:image"]', ogImage);
  setMeta('meta[name="twitter:image"]', ogImage);

  const ldNode = document.createElement('script');
  ldNode.type = 'application/ld+json';
  ldNode.textContent = JSON.stringify(makeJsonLd(config));
  document.head.appendChild(ldNode);
}
