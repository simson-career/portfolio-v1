# Simson M. — Portfolio

A modern, minimal portfolio built from the experience and projects in Simson's résumé.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customize

- Profile details, projects, experience, and skills: `data/portfolio.ts`
- Theme tokens and layout: `app/globals.css`
- Main page composition: `components/portfolio-page.tsx`
- Résumé download: `public/Simson-M-Resume.pdf`

## Deploy to GitHub Pages

The app is configured as a static Next.js export and is deployed entirely by GitHub Actions. A push to `main` runs linting, creates the `out/` directory, uploads it as a Pages artifact, and deploys it to:

<https://simson-career.github.io/portfolio-v1/>

One repository setting is required once: open **Settings → Pages → Build and deployment**, then select **GitHub Actions** as the source. You can also rerun the workflow manually from the **Actions** tab.

The workflow derives the repository base path automatically, so Next.js assets, internal links, the résumé, sitemap, and robots file work under `/portfolio-v1/` without hard-coded deployment paths in components.

### Contact form on static hosting

GitHub Pages cannot run Next.js API routes or hold server-side email credentials. The contact form therefore validates with Zod in the browser and opens a prefilled draft in the visitor's default email app. Form contents are not uploaded to GitHub or any third-party form provider. If server-side delivery, rate limiting, or spam filtering is needed later, the form must use an external backend or a host with a server runtime.

## Checks

```bash
npm run lint
npm run build
```
