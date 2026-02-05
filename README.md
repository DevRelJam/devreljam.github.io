# DevRelJam Website

Minimal, modern, responsive community website for DevRelJam, built using only HTML, CSS, and vanilla JavaScript.

The website is fully data-driven. Every editable piece of content is fetched from a single file: `data/config.json`.

## What This Redesign Solves

- Removes hardcoded community text/links from markup and JS.
- Uses one JSON config source for all site content.
- Keeps deployment simple for GitHub Pages (no framework, no build tooling required).
- Improves SEO with dynamic title/description/Open Graph/Twitter tags and JSON-LD.
- Generates OG image dynamically in-browser from config values.
- Preserves your requested visual identity:
  - Main background color `#fdf4e9`
  - DEVRELJAM title rendered with `Rahong` font (local file)
  - Luma events embed and speaker CTA integrated

## Live Domain

- Production URL: `https://devreljam.github.io`
- Repository: `https://github.com/devreljam/devreljam.github.io`

## Project Structure

```text
.
├── index.html
├── css/
│   ├── style.css
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── main.js
│   └── modules/
│       ├── config.js
│       ├── render.js
│       ├── seo.js
│       └── utils.js
├── data/
│   └── config.json
└── assets/
    ├── fonts/
    │   └── Rahong.ttf          (you add this)
    └── images/
        ├── favicon.png         (you add this)
        ├── devreljam-logo.png  (you add this)
        └── gallery/
            ├── jam-01.jpg      (you add this)
            ├── jam-02.jpg      (you add this)
            ├── jam-03.jpg      (you add this)
            └── jam-04.jpg      (you add this)
```

## Setup

### 1. Clone

```bash
git clone https://github.com/devreljam/devreljam.github.io.git
cd devreljam.github.io
```

### 2. Run Locally

Use a local server so `fetch('data/config.json')` works.

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Content Management

Only edit `data/config.json`.

### Sections you can update safely

- `site`: domain, SEO defaults, brand assets, keywords
- `navigation`: top nav links
- `hero`: homepage intro and CTA buttons
- `about`: DevRelJam summary and highlights
- `events`: Luma calendar + embed config
- `gallery`: photo cards and captions
- `speakers`: call-for-speakers copy and Sessionize link
- `community`: initiative owner and social links
- `footer`: closing message

## Asset Requirements

### Rahong font

Place the font file at:

- `assets/fonts/Rahong.ttf`

`DEVRELJAM` logo text falls back to a generic cursive family if the file is missing.

### Logo and photos

Place your uploaded logo and past-event photos at the paths already referenced in `data/config.json`.

If any gallery image is missing, the card stays visible with a graceful placeholder state instead of breaking layout.

## Luma + Sessionize Integration

Configured from JSON:

- Luma calendar page: `https://luma.com/devreljam`
- Luma embed iframe: `https://luma.com/embed/calendar/cal-XxuFr8KES5quRte/events?lt=light`
- Call for speakers: `https://sessionize.com/devreljam/`

## SEO and OG Image

SEO behavior is handled in `js/modules/seo.js`:

- Sets page title and description from config
- Updates Open Graph and Twitter metadata
- Injects Organization JSON-LD schema dynamically
- Generates a share image (1200x630) at runtime using Canvas and config content

Note: Social crawlers usually read static HTML and may not execute JavaScript. Runtime-generated OG images are useful in-browser and for previews, but for guaranteed crawler support you should also keep a static fallback image in `assets/images/` and point `og:image` to it in `index.html`.

## Personalization Included

- Community framing and copy tailored to DevRelJam
- Founder attribution to Yashraj Nayak
- Social links for LinkedIn, Instagram, X, and GitHub
- Event flow centered on practitioners already attending large conferences

## Deployment (GitHub Pages)

This repo works as a static site deployment:

1. Push changes to default branch.
2. Confirm Pages source points to that branch.
3. Verify config-driven updates on `https://devreljam.github.io`.

## Maintenance Checklist

Before each new DevRelJam cycle:

1. Update gallery image paths/captions in `data/config.json`.
2. Confirm Luma embed URL and calendar link are still correct.
3. Confirm Sessionize CFP link is active.
4. Update hero/about copy for upcoming location/context.
5. Verify logo/font files are present in `assets/`.

## Credits

DevRelJam is an initiative by [Yashraj Nayak](https://www.linkedin.com/in/yashrajnayak).
