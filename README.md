# DevRelJam Website

Static, data-driven community website for DevRelJam, built with vanilla HTML, CSS, and JavaScript for GitHub Pages.

The site keeps the visual language close to [yashrajnayak.com](https://yashrajnayak.com): Inter/Outfit typography, light and dark theme tokens, pill actions, centered identity-led hero, white cards on a slate background, and simple GitHub Pages-friendly assets.

## Content Source

Most editable site content lives in:

- `data/config.json`

Update this file for event copy, Luma links, Jam format copy, past event cards, gallery images, featured people, city status, speaker CTA copy, social links, and SEO metadata.

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

## Organization Profile Sync

The GitHub organization profile README is generated from this website's source of truth:

- Source config: `data/config.json`
- Generator: `scripts/generate-profile-readme.cjs`
- Workflow repo: `DevRelJam/.github`
- Workflow path: `.github/workflows/sync-profile-readme.yml`
- Target file: `DevRelJam/.github/profile/README.md`

The workflow lives in `DevRelJam/.github` so it can update `profile/README.md` with that repository's default `GITHUB_TOKEN`. It clones this public website repository as read-only input, validates `data/config.json`, generates the profile README, and commits only when the generated output differs.

Because GitHub's default `GITHUB_TOKEN` is scoped to the repository where a workflow runs, the sync runs every 15 minutes and can also be started manually from `DevRelJam/.github`. No profile sync secret is required.

Run the generator locally with:

```bash
PROFILE_README_PATH=/tmp/devreljam-profile-readme.md node scripts/generate-profile-readme.cjs
```

## Maintenance Checklist

Before each DevRelJam cycle:

1. Update the current event block in `data/config.json`.
2. Confirm the Luma calendar and Sessionize links are active.
3. Refresh current and past event images in `assets/images/` when a new Jam is added.
4. Add only approved public photos to `assets/images/gallery/` and public profile headshots to `assets/images/speakers/`.
5. Confirm the profile README sync workflow in `DevRelJam/.github` succeeds after the scheduled or manual sync run.
6. Check the deployed URL and social preview image after publishing.
