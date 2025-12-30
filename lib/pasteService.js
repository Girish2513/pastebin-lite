import kv from "@/lib/kv";

function getNow(headers) {
  if (process.env.TEST_MODE === "1" && headers.get("x-test-now-ms")) {
    return Number(headers.get("x-test-now-ms"));
  }
  return Date.now();
}

export async function getPasteAndIncrement(id, headers) {
  let paste;
  const isProd = process.env.NODE_ENV === "production";

  // 1. Load Paste
  if (isProd) {
    paste = await kv.get(`paste:${id}`);
  } else {
    const { getPaste } = await import("@/lib/localStore");
    paste = getPaste(id);
  }

  if (!paste) {
    return { error: "Not found" };
  }

  // 2. TTL Check
  const now = getNow(headers);
  if (paste.expires_at && now >= paste.expires_at) {
    return { error: "Expired" };
  }

  // 3. View Limit Check & Atomic Increment
  let currentViews = paste.views;

  if (isProd) {
    // Use a separate key for atomic counting in Redis
    const viewsKey = `paste:${id}:views`;
    currentViews = await kv.incr(viewsKey);
  } else {
    paste.views += 1;
    currentViews = paste.views;
  }

  if (paste.max_views !== null && currentViews > paste.max_views) {
    return { error: "View limit exceeded" };
  }

  paste.views = currentViews;
  return { paste };
}