# Clarix (MERN)

Clarix is a full-stack AI agency website built with a React frontend and an Express + MongoDB backend. It includes a modern marketing site, dedicated Cases/Blog pages, hidden admin unlock flow, contact capture, newsletter support, and rich animated UI sections.

## Tech Stack

- Frontend: React (CRA), Framer Motion, Tailwind CSS utilities
- Backend: Node.js, Express, MongoDB (Mongoose)
- Security/Middleware: Helmet, CORS, Rate Limiting
- Email: Nodemailer routes (contact/welcome/drip)

## Project Structure

- `client/`: Frontend app
- `server/`: Backend API server
- `FEATURES_IMPLEMENTED.md`: Feature notes

## Key Frontend Notes

- Main app flow is implemented in `client/src/App.jsx`.
- React bootstrap now lives in `client/src/index.jsx`.
- `client/src/index.js` is a compatibility entry that imports `index.jsx`.

## Main Features

- Multi-section animated homepage
- Dedicated pages:
  - `/about`
  - `/contact`
  - `/cases`
  - `/blog`
- Hidden admin unlock:
  - Click the logo 5 times quickly to unlock `/admin`
- Contact-first CTA routing:
  - “Get Started / Book a Call” CTAs route users to contact form
- Process timeline with scroll-driven line animation
- Services section with themed colors and motion

## Backend API Overview

Mounted in `server/server.js`:

- `/api/auth`
- `/api/tools`
- `/api/cases`
- `/api/insights`
- `/api/stats`
- `/api/settings`
- `/api/contact`
- `/api/newsletter`
- `/api/email`
- `/api/health`

## Environment Variables

Create a `.env` inside `server/` with:

- `PORT=5000`
- `MONGODB_URI=mongodb://localhost:27017/clarix`
- `JWT_SECRET=use_a_long_random_secret_at_least_16_chars`
- `EMAIL_USER=your_email_address`
- `EMAIL_PASS=your_email_app_password`
- `CORS_ORIGIN=http://localhost:3000` (or your deployed frontend URL)

You can copy from:

- `server/.env.example`

For frontend deployment, optionally create `client/.env`:

- `REACT_APP_API_BASE_URL=https://your-backend-domain.com`

Use empty value in local development so CRA proxy handles `/api/*` requests.

## Install

From repository root:

```bash
npm --prefix server install
npm --prefix client install
```

## Run (Development)

Backend:

```bash
npm run dev:server
```

If port `5000` is already in use, stop the existing process or set a different `PORT` value in `server/.env`.

Frontend:

```bash
npm run start:client
```

App URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Build (Frontend)

```bash
npm --prefix client run build
```

## API-backed Content

The Cases and Blog pages are now backend-driven with frontend fallback defaults.

- Cases API: `GET /api/cases`
- Insights API: `GET /api/insights`
- Health check: `GET /api/health`

If API data is unavailable, UI continues to render using local fallback content.

## Seed Initial Content

Run these from repository root:

```bash
npm --prefix server run seed:content
```

Reset and reseed all starter Cases/Insights:

```bash
npm --prefix server run seed:content:reset
```

## Deployment Checklist (Public Launch)

1. Deploy backend (Render/Railway/Fly) and set all `server/.env` variables.
2. Deploy frontend (Vercel/Netlify) and configure API proxy/base URL.
3. Verify:
  - `/api/health` returns `status: ok`
  - Contact form submit works end-to-end
  - Cases and Blog pages load API content
4. Add your live URLs in this README.
5. Run Lighthouse and keep Performance/Accessibility best-practice scores high.

## Vercel Deployment Requirements (Frontend)

Use these settings when deploying to Vercel:

1. Import this repository in Vercel.
2. Set **Root Directory** to `client`.
3. Build settings:
  - Build Command: `npm run build`
  - Output Directory: `build`
4. Add environment variable in Vercel Project Settings:
  - `REACT_APP_API_BASE_URL=https://your-backend-domain.com`
5. Redeploy after saving env variables.

This repo now includes `client/vercel.json` so React SPA routes (`/about`, `/cases`, `/blog`, etc.) resolve correctly on refresh/direct URL.

Important backend requirement:

- Set `CORS_ORIGIN` in `server/.env` to your Vercel frontend URL.
- Example: `CORS_ORIGIN=https://your-project.vercel.app`

## Resume-ready Highlights

- Built and shipped a full-stack React + Express + MongoDB web app.
- Implemented API-backed content architecture for cases and blog posts with fallback resilience.
- Added security middleware (Helmet, rate limiting) and authentication protections.
- Designed and optimized advanced motion UI interactions across multiple routes.

## Common Scripts (Root)

- `npm run start` -> starts client
- `npm run start:client` -> starts client
- `npm run start:server` -> starts server
- `npm run dev:server` -> starts server with nodemon

## Contact Form Behavior

- CTA buttons route to `/contact` and scroll to `#contact-form`
- Contact form captures:
  - Name
  - Email
  - Service Needed
  - WhatsApp Number (optional)
  - Project Details

## Notes for Maintenance

- If the app says port already in use, existing terminal processes are already running.
- Keep animations balanced with readability; avoid reducing contrast for form inputs and actions.
- If adding new pages, keep navigation state handling in `App.jsx` consistent.

## Troubleshooting

- MongoDB connection errors:
  - Verify `MONGODB_URI`
  - Ensure MongoDB service is running
- Email sending errors:
  - Check `EMAIL_USER` and `EMAIL_PASS`
  - Use app password for Gmail
- Frontend not updating:
  - Hard refresh browser (`Ctrl+F5`)

## License

Internal project for Clarix website development.
