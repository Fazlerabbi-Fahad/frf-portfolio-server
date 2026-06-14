# FRF Portfolio — Backend API

Production-ready Express + MongoDB API for the portfolio. JWT auth with refresh-token
rotation, validation, rate limiting, security middleware, structured logging.

## Stack

Express · Mongoose · JWT (access + rotating refresh) · express-validator · helmet ·
express-rate-limit · pino.

## Structure

```
src/
  config/       env.js (validated), db.js
  models/       User Blog Category Tag Album Photo
  controllers/  auth, blog, album, photo, meta
  routes/       auth, blog, album, meta
  middleware/   auth (JWT), validate, error, rateLimit
  services/     token.service.js
  utils/        logger, ApiError, asyncHandler, seed
  app.js        express app assembly
  server.js     entry — connect DB then listen
```

## Data model

```
User  1──*  Blog              Blog  *──1  Category
                              Blog  *──*  Tag
Album 1──*  Photo
```

`Blog` and `Album` auto-generate slugs; `Blog` auto-computes reading time from word count.
`Blog` has a text index on title/excerpt/content for search.

## Setup

```bash
cd server
cp .env.example .env        # fill in secrets + Mongo URI
npm install
npm run seed                # creates admin user + sample blog/album
npm run dev                 # http://localhost:5000
```

Generate strong secrets: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## Auth flow

- `POST /api/auth/login` → returns `accessToken` (15m) in the body, sets an httpOnly
  `refresh_token` cookie (7d, path `/api/auth`).
- `POST /api/auth/refresh` → verifies the cookie, **rotates** it (old token invalidated,
  new pair issued). Reuse of a consumed refresh token is rejected — basic theft detection.
- `POST /api/auth/logout` → revokes the refresh token and clears the cookie.
- Send the access token as `Authorization: Bearer <token>` on protected routes.

## API reference

Public:
```
GET  /api/health
GET  /api/blogs?page=&limit=&q=&category=&tag=     list published, search + filter + paginate
GET  /api/blogs/:slug
GET  /api/albums                                   albums with photo counts
GET  /api/albums/:slug                             album + its photos
GET  /api/categories      GET /api/tags
POST /api/contact         { name, email, message, website? }   (website = honeypot)
```

Protected (Bearer token):
```
POST   /api/blogs                  PUT /api/blogs/:id    DELETE /api/blogs/:id
PATCH  /api/blogs/:id/publish      toggle published
POST   /api/albums                 PUT /api/albums/:id   DELETE /api/albums/:id
POST   /api/albums/photos          DELETE /api/albums/photos/:id
POST   /api/categories             POST /api/tags
GET    /api/stats                  dashboard counts + recent activity
GET    /api/auth/me
```

## Security

helmet headers, CORS locked to `CLIENT_ORIGIN` with credentials, JSON body cap 1 MB,
global 300 req / 15 min limiter (20 / 15 min on login), passwords bcrypt-hashed (cost 12),
refresh tokens stored per-user and rotated, central error handler that never leaks stack traces.

## Deploy (Render / Railway)

1. New Web Service from the repo, root `server/`.
2. Build `npm install`, start `npm start`.
3. Set env vars from `.env.example` — `MONGO_URI` points at MongoDB Atlas,
   `CLIENT_ORIGIN` at your Vercel domain, both JWT secrets to long random strings.
4. Run the seed once (Render shell): `npm run seed`.

CORS + cookie settings already switch to secure/SameSite=None in production.

## Verified

App wiring is boot-tested: health, 404 handling, login validation, anonymous-access
blocking on protected routes, empty-payload validation, rate-limit + helmet headers — all
passing. The Mongoose data operations run against a live MongoDB (Atlas or local);
a sandboxed in-memory mongod couldn't be downloaded in the build environment.
```
