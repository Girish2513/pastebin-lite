# Pastebin Lite

A simple Pastebin-like application where users can create text pastes and share a link to view them.

## Features
- Create a text paste
- Shareable URL
- Optional expiry (TTL)
- Optional view count limit
- Safe rendering (no script execution)

## Tech Stack
- Next.js (App Router)
- JavaScript
- Vercel KV (Redis) for persistence

## API Endpoints

### Health Check
GET /api/healthz

### Create Paste
POST /api/pastes

Request body:
```json
{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 5
}
Fetch Paste (API)

GET /api/pastes/:id

View Paste (HTML)

GET /p/:id

Persistence

Uses Vercel KV (Redis) in production.
Local development uses an in-memory store for simplicity.
