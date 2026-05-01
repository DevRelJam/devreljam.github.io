# DevRelJam Website

Static, data-driven community website for DevRelJam, built with vanilla HTML, CSS, and JavaScript for GitHub Pages.

The site keeps the visual language close to [yashrajnayak.com](https://yashrajnayak.com): Inter/Outfit typography, light and dark theme tokens, pill actions, centered identity-led hero, white cards on a slate background, and simple GitHub Pages-friendly assets.

## Content Source

Most editable site content lives in:

- `data/config.json`

Update this file for event copy, Luma links, city status, speaker CTA copy, social links, and SEO metadata.

## Run Locally

Use a local server so `fetch('data/config.json')` works.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Important Links

- Luma calendar: `https://luma.com/devreljam`
- Current event: `https://luma.com/wnygmi8l`
- Call for speakers: `https://sessionize.com/devreljam/`
- Website: `https://devreljam.space/`
- GitHub org: `https://github.com/DevRelJam`

## Deployment

This repository is ready for GitHub Pages:

1. Keep `index.html`, `css/`, `js/`, `data/`, and `assets/` on the default branch.
2. Enable GitHub Pages for the repository with the custom domain `devreljam.space`.
3. Add GitHub Pages DNS records at the domain registrar for `devreljam.space`.
4. Verify the published site at `https://devreljam.space/`.

The `.nojekyll` file is included so GitHub Pages serves static assets directly without Jekyll processing.

## Maintenance Checklist

Before each DevRelJam cycle:

1. Update the current event block in `data/config.json`.
2. Confirm the Luma calendar and Sessionize links are active.
3. Refresh `assets/images/event-singapore-2026.png` or add a new event image.
4. Keep the GitHub org profile README in sync with the current Luma calendar.
5. Check the deployed URL and social preview image after publishing.
