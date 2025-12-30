// Simple in-memory store for local development

// Use globalThis to ensure the store persists across module reloads in Next.js dev
if (!globalThis.pasteStore) {
  globalThis.pasteStore = new Map();
}

export function setPaste(id, data) {
  globalThis.pasteStore.set(id, data);
}

export function getPaste(id) {
  return globalThis.pasteStore.get(id);
}
