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

## Deploy to Vercel

Import this repository in Vercel and deploy with the default Next.js settings. Vercel Analytics is already connected in the root layout. If you attach a custom domain, set `NEXT_PUBLIC_SITE_URL` to its complete HTTPS URL; otherwise the sitemap uses Vercel's production URL automatically.

### Contact form email delivery

The contact endpoint uses a console-only provider during local development. For production, add these server-side environment variables in Vercel:

```bash
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key
CONTACT_FROM_EMAIL="Simson Portfolio <hello@your-domain.com>"
CONTACT_TO_EMAIL=simsonmoses.m@gmail.com
```

`RESEND_API_KEY` is read only by the server route and is never included in the browser bundle. The endpoint validates input with Zod, limits requests by client IP, checks same-origin browser submissions, caps payload size, and includes a honeypot field.

## Checks

```bash
npm run lint
npm run build
```
