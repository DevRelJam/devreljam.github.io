#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG_PATH = 'data/config.json';
const DEFAULT_PROFILE_README_PATH = 'profile-repo/profile/README.md';
const DEFAULT_PROFILE_COVER = '/assets/DevRelJam%20Cover.png';

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Config file not found: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureTrailingSlash(url) {
  if (!url) return '';
  return url.endsWith('/') ? url : `${url}/`;
}

function escapeTableCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

function getLink(config, label) {
  const normalizedLabel = label.toLowerCase();
  const links = [
    ...(config.hero?.links || []),
    ...(config.community?.socials || [])
  ];

  return links.find((link) => link.label?.toLowerCase() === normalizedLabel)?.href;
}

function badge(label, message, color, url, logo) {
  if (!url) return '';

  const safeLabel = encodeURIComponent(label).replace(/-/g, '--');
  const safeMessage = encodeURIComponent(message).replace(/-/g, '--');
  const logoQuery = logo ? `&logo=${encodeURIComponent(logo)}&logoColor=white` : '';

  return `[![${label}](https://img.shields.io/badge/${safeLabel}-${safeMessage}-${color}?style=for-the-badge${logoQuery})](${url})`;
}

function list(items) {
  return (items || []).filter(Boolean).map((item) => `- ${item}`).join('\n');
}

function table(rows) {
  if (!rows.length) return '';

  return [
    '| City | Status | Detail |',
    '| --- | --- | --- |',
    ...rows.map((city) => `| ${escapeTableCell(city.name)} | ${escapeTableCell(city.status)} | ${escapeTableCell(city.detail)} |`)
  ].join('\n');
}

function validateConfig(config) {
  const missing = [];

  if (!config.site?.name) missing.push('site.name');
  if (!config.site?.url) missing.push('site.url');
  if (!config.hero?.body) missing.push('hero.body');
  if (!config.events?.calendarUrl) missing.push('events.calendarUrl');
  if (!config.events?.current?.name) missing.push('events.current.name');

  if (missing.length > 0) {
    throw new Error(`Missing required config fields: ${missing.join(', ')}`);
  }
}

function generateProfileReadme(config) {
  validateConfig(config);

  const site = config.site;
  const hero = config.hero || {};
  const about = config.about || {};
  const events = config.events || {};
  const currentEvent = events.current || {};
  const speakers = config.speakers || {};
  const community = config.community || {};
  const cities = config.cities?.items || [];

  const websiteUrl = ensureTrailingSlash(site.url);
  const lumaUrl = events.calendarUrl;
  const sessionizeUrl = speakers.cta?.href || hero.secondaryCta?.href;
  const linkedinUrl = getLink(config, 'LinkedIn');
  const instagramUrl = getLink(config, 'Instagram');
  const githubUrl = getLink(config, 'GitHub') || 'https://github.com/DevRelJam';
  const founder = community.initiativeBy;

  const badges = [
    badge('Website', site.domain || site.name, '2563eb', websiteUrl),
    badge('Luma', 'Calendar', '111111', lumaUrl),
    badge('Speakers', 'Sessionize', '2563eb', sessionizeUrl),
    badge('LinkedIn', 'DevRelJam', '0A66C2', linkedinUrl, 'linkedin'),
    badge('Instagram', 'DevRelJam', 'E4405F', instagramUrl, 'instagram'),
    badge('GitHub', 'Organization', '181717', githubUrl, 'github')
  ].filter(Boolean).join('\n');

  const aboutText = (about.paragraphs || [site.description]).filter(Boolean).join('\n\n');
  const highlights = list((about.highlights || []).map((item) => `**${item.title}:** ${item.body}`));
  const agenda = list(currentEvent.agenda || []);
  const cityTable = table(cities);

  return `<!-- AUTO-GENERATED: Edit data/config.json in DevRelJam/devreljam.github.io, then run scripts/generate-profile-readme.cjs. -->

# ${site.name}

![${site.name} cover](${DEFAULT_PROFILE_COVER})

${hero.subheadline || site.tagline || ''}

${hero.body || site.description}

<div align="left">

${badges}

</div>

## What is DevRelJam?

${aboutText}

${highlights ? `## What Makes a Jam Different?\n\n${highlights}\n\n` : ''}## Upcoming Jam

### ${currentEvent.name}

| Detail | Information |
| --- | --- |
| Date | ${escapeTableCell(currentEvent.date)} |
| Time | ${escapeTableCell(`${currentEvent.time}${currentEvent.timezone ? ` ${currentEvent.timezone}` : ''}`)} |
| Location | ${escapeTableCell(currentEvent.location)} |
| Status | ${escapeTableCell(currentEvent.status)} |
| Register | [Luma event](${currentEvent.url}) |

${currentEvent.description || ''}

${agenda ? `**Agenda**\n\n${agenda}\n\n` : ''}## Where We Jam

${config.cities?.description || ''}

${cityTable}

## How to Get Involved

- **Attend:** Check the [DevRelJam Luma calendar](${lumaUrl}) for upcoming Jams and RSVP.
- **Speak:** Submit a practitioner talk or discussion idea through [Sessionize](${sessionizeUrl}).
- **Follow along:** Watch this GitHub organization and follow DevRelJam on [LinkedIn](${linkedinUrl})${instagramUrl ? ` and [Instagram](${instagramUrl})` : ''}.

${speakers.description ? `## Speak at a Future Jam\n\n${speakers.description}\n\n` : ''}## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all participants. Please review the [Code of Conduct](https://github.com/DevRelJam/.github/blob/main/CODE_OF_CONDUCT.md) before participating in DevRelJam events or community spaces.

## Contact

${founder?.name && founder?.href ? `DevRelJam is an initiative by [${founder.name}](${founder.href}).` : 'For DevRelJam inquiries, reach out through the community links above.'}

${config.footer?.note || ''}
`;
}

function writeProfileReadme(readmeContent, outputPath) {
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, readmeContent);
}

function main() {
  try {
    const configPath = process.env.CONFIG_PATH || DEFAULT_CONFIG_PATH;
    const outputPath = process.env.PROFILE_README_PATH || DEFAULT_PROFILE_README_PATH;
    const config = readJson(path.resolve(process.cwd(), configPath));
    const readmeContent = generateProfileReadme(config);

    writeProfileReadme(readmeContent, path.resolve(process.cwd(), outputPath));

    console.log(`Profile README generated: ${outputPath}`);
    console.log(`Characters written: ${readmeContent.length}`);
  } catch (error) {
    console.error(`Failed to generate profile README: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateProfileReadme,
  validateConfig
};
