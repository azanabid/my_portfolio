# Azan Portfolio MERN Website

A responsive graphic designer portfolio built from the supplied visual reference. The frontend is a Vite React app and the backend is an Express API with optional MongoDB persistence.

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

The contact API stores submissions in memory by default. To persist submissions in MongoDB and send them by email, copy `server/.env.example` to `server/.env`, fill in the values, and restart the app.

For Gmail delivery, use a Gmail App Password:

```powershell
Copy-Item server/.env.example server/.env
```

Then set:

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

## Main endpoints

- `GET /api/health`
- `GET /api/contact/status`
- `POST /api/contact`
