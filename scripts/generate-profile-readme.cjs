#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG_PATH = 'data/config.json';
const DEFAULT_PROFILE_README_PATH = 'profile-repo/profile/README.md';

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

function templateText(template, values) {
  return String(template || '').replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function badge(label, message, color, url, logo, style) {
  if (!url) return '';

  const safeLabel = encodeURIComponent(label).replace(/-/g, '--');
  const safeMessage = encodeURIComponent(message).replace(/-/g, '--');
  const logoQuery = logo ? `&logo=${encodeURIComponent(logo)}&logoColor=white` : '';

  return `[![${label}](https://img.shields.io/badge/${safeLabel}-${safeMessage}-${color}?style=${style}${logoQuery})](${url})`;
}

function list(items) {
  return (items || []).filter(Boolean).map((item) => `- ${item}`).join('\n');
}

function mdLink(label, url) {
  return url ? `[${escapeTableCell(label)}](${url})` : escapeTableCell(label);
}

function table(headers, rows) {
  if (!rows.length) return '';

  return [
    `| ${headers.map(escapeTableCell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(escapeTableCell).join(' | ')} |`)
  ].join('\n');
}

function replaceNamedLinks(text, linksByLabel) {
  return Object.entries(linksByLabel).reduce((body, [label, url]) => {
    if (!url) return body;
    return body.replace(label, mdLink(label, url));
  }, text);
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
  const people = config.people || {};
  const profile = config.profile || {};
  const headings = profile.headings || {};
  const tableConfig = profile.tables || {};
  const community = config.community || {};
  const cities = config.cities?.items || [];
  const pastEvents = events.past?.items || [];

  const websiteUrl = ensureTrailingSlash(site.url);
  const lumaUrl = events.calendarUrl;
  const sessionizeUrl = speakers.cta?.href || hero.secondaryCta?.href;
  const linkedinUrl = getLink(config, 'LinkedIn');
  const instagramUrl = getLink(config, 'Instagram');
  const githubUrl = getLink(config, 'GitHub') || 'https://github.com/DevRelJam';
  const founder = community.initiativeBy;
  const hrefs = {
    website: websiteUrl,
    luma: lumaUrl,
    sessionize: sessionizeUrl,
    linkedin: linkedinUrl,
    instagram: instagramUrl,
    github: githubUrl
  };

  const badges = (profile.badges || [])
    .map((item) => badge(item.label, item.message, item.color, item.href || hrefs[item.hrefKey], item.logo, profile.badgeStyle))
    .filter(Boolean)
    .join('\n');

  const aboutText = (about.paragraphs || [site.description]).filter(Boolean).join('\n\n');
  const highlights = list((about.highlights || []).map((item) => `**${item.title}:** ${item.body}`));
  const agenda = list(currentEvent.agenda || []);
  const cityTable = table(tableConfig.cityHeaders || [], cities.map((city) => [city.name, city.status, city.detail]));
  const pastTable = pastEvents.length
    ? table(
        tableConfig.pastHeaders || [],
        pastEvents.map((event) => {
          const repo = event.repo ? mdLink(tableConfig.repoLabel, event.repo) : '';
          const luma = event.url ? mdLink(tableConfig.lumaLabel, event.url) : '';
          return [mdLink(event.name, event.repo || event.url), event.date, event.location, repo, luma];
        })
      )
    : '';
  const speakerTable = people.speakers?.length
    ? table(
        tableConfig.peopleHeaders || [],
        people.speakers.map((person) => [mdLink(person.name, person.profile), person.designation, person.event])
      )
    : '';
  const eventDetailRows = (tableConfig.upcomingRows || []).map((row) => {
    const values = {
      date: currentEvent.date,
      timeWithTimezone: `${currentEvent.time}${currentEvent.timezone ? ` ${currentEvent.timezone}` : ''}`,
      location: currentEvent.location,
      status: currentEvent.status,
      url: currentEvent.url
    };
    const value = row.linkLabel ? mdLink(row.linkLabel, values[row.valueKey]) : values[row.valueKey];
    return [row.label, value];
  });
  const eventDetailTable = table(tableConfig.upcomingHeaders || [], eventDetailRows);
  const involvement = list((profile.involvement || []).map((item) => {
    const linkMap = {};
    if (item.hrefKey && item.hrefLabel) linkMap[item.hrefLabel] = hrefs[item.hrefKey];
    (item.links || []).forEach((link) => {
      linkMap[link.label] = hrefs[link.hrefKey] || link.href;
    });
    return `**${item.label}:** ${replaceNamedLinks(item.text, linkMap)}`;
  }));
  const codeOfConductBody = profile.codeOfConduct
    ? replaceNamedLinks(profile.codeOfConduct.body, { [profile.codeOfConduct.linkLabel]: profile.codeOfConduct.href })
    : '';
  const contactText = founder?.name && founder?.href
    ? templateText(profile.contact?.initiativeTemplate, { name: mdLink(founder.name, founder.href) })
    : profile.contact?.fallback;

  return `<!-- ${profile.generatedComment} -->

# ${site.name}

![${site.name} cover](${profile.coverImage})

${hero.subheadline || site.tagline || ''}

${hero.body || site.description}

<div align="left">

${badges}

</div>

## ${headings.about}

${aboutText}

${highlights ? `## ${headings.highlights}\n\n${highlights}\n\n` : ''}## ${headings.upcoming}

### ${currentEvent.name}

${eventDetailTable}

${currentEvent.description || ''}

${agenda ? `**${headings.agenda}**\n\n${agenda}\n\n` : ''}## ${headings.cities}

${config.cities?.description || ''}

${cityTable}

${pastTable ? `## ${headings.past}\n\n${events.past?.description || ''}\n\n${pastTable}\n\n` : ''}${speakerTable ? `## ${headings.people}\n\n${people.description || ''}\n\n${speakerTable}\n\n` : ''}## ${headings.involved}

${involvement}

${speakers.description ? `## ${headings.speak}\n\n${speakers.description}\n\n` : ''}## ${headings.codeOfConduct}

${codeOfConductBody}

## ${headings.contact}

${contactText}

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
