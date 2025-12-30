# Pastebin-Lite

A simple, secure pastebin application built with Next.js. Users can create text pastes with optional expiration (TTL) and view limits.

## How to Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file (optional for local memory mode, but required for full emulation):
   ```bash
   # Optional: Set to 1 to enable deterministic time testing
   TEST_MODE=0
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the app:**
   Open http://localhost:3000 in your browser.

## Persistence Layer

This application uses a dual-strategy persistence layer:

- **Production (Vercel):** Uses **Vercel KV (Redis)**. This ensures data survives across serverless function invocations and provides atomic operations (like `INCR`) to handle concurrent view counting robustly.
- **Development:** Uses an **in-memory global store** (`globalThis.pasteStore`). This allows the app to work locally without needing a running Redis instance, while preserving data across Next.js module reloads.

## Design Decisions

- **Atomic View Counting:** To prevent race conditions where multiple requests might bypass the `max_views` limit, the application uses Redis atomic increment operations (`incr`) in production.
- **Shared Logic:** The core logic for fetching, checking TTL, and incrementing views is centralized in `lib/pasteService.js` to ensure consistency between the API and the HTML views.
- **Deterministic Testing:** The app respects the `x-test-now-ms` header when `TEST_MODE=1` is set, allowing automated graders to simulate time travel for TTL verification.