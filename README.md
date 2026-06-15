# Azan Portfolio MERN Website

A responsive graphic designer portfolio built from the supplied visual reference. The frontend is a Vite React app and the backend is an Express API with optional MongoDB persistence.

## Environment files

This project now supports explicit environment modes.

Client:

- `client/.env.development` for local Vite development
- `client/.env.production` for production frontend builds
- committed templates:
  - `client/.env.example`
  - `client/.env.production.example`

Server:

- `server/.env` or `server/.env.development` for local development
- `server/.env.production` for production
- committed templates:
  - `server/.env.example`
  - `server/.env.production.example`

The server loads env files in this order:

1. `server/.env`
2. `server/.env.local`
3. `server/.env.{NODE_ENV}`
4. `server/.env.{NODE_ENV}.local`

Host-provided environment variables still win over local files.

## Run locally

```powershell
npm run install:all
npm run dev
```

Open `http://localhost:5173`.

For backend watch mode specifically:

```powershell
npm run dev:watch --prefix server
```

The contact API stores submissions in memory by default. To persist submissions in MongoDB and send them by email, copy `server/.env.example` to `server/.env` or `server/.env.development`, fill in the values, and restart the app.

For Gmail delivery, use a Gmail App Password:

```powershell
Copy-Item server/.env.example server/.env
```

Then set:

- `NODE_ENV=development`
- `MAIL_TO_EMAIL=azanabidkhawaja@gmail.com`
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER=azanabidkhawaja@gmail.com`
- `SMTP_PASS=your-16-character-gmail-app-password`
- `SMTP_FROM=Azan Abid <azanabidkhawaja@gmail.com>`
- `SMTP_FROM_EMAIL=azanabidkhawaja@gmail.com`

## Production build

```powershell
npm run build
$env:NODE_ENV="production"
npm start
```

Open `http://localhost:5000`.

Production notes:

- build the frontend with `client/.env.production` or the values from `client/.env.production.example`
- run the server with `NODE_ENV=production`
- set `ALLOWED_ORIGINS` to your Netlify domain and any custom domain
- if the frontend and backend are on different hosts, set `VITE_API_BASE_URL` to the backend origin

## GitHub Pages production deploy

This repo now includes:

- [deploy workflow](C:/Users/HP/Documents/Playground/AZAN-PORTFOLIO/.github/workflows/deploy.yml)

Pushes to `main` will build the Vite frontend and deploy it to GitHub Pages.

Expected production URL:

- `https://khawaja-a.github.io/AZAN-PORTFOLIO/`

GitHub Pages limitation:

- GitHub Pages can host the React frontend only
- it cannot run the Express server in `server/`
- for the GitHub Pages deployment, the contact form is intentionally configured to open the user’s email app instead of calling `/api/contact`

If you want full backend email delivery in production, host `server/` separately on a real Node host and set `VITE_API_BASE_URL` to that backend URL.

## Main endpoints

- `GET /api/health`
- `GET /api/contact/status`
- `POST /api/contact`
