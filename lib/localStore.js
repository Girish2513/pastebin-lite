// Simple in-memory store for local development
const store = new Map();

export function setPaste(id, data) {
  store.set(id, data);
}

export function getPaste(id) {
  return store.get(id);
}
