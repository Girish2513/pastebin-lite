import kv from "@/lib/kv";

function getNow(request) {
  if (
    process.env.TEST_MODE === "1" &&
    request.headers.get("x-test-now-ms")
  ) {
    return Number(request.headers.get("x-test-now-ms"));
  }
  return Date.now();
}

export async function GET(request, context) {
  const params = await context.params; // 👈 unwrap Promise
  const id = params.id;

  let paste;

  // 1️⃣ Load paste
  if (process.env.NODE_ENV === "production") {
    paste = await kv.get(`paste:${id}`);
  } else {
    const { getPaste } = await import("@/lib/localStore");
    paste = getPaste(id);
  }

  // 2️⃣ Missing paste
  if (!paste) {
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const now = getNow(request);

  // 3️⃣ TTL check
  if (paste.expires_at && now >= paste.expires_at) {
    return new Response(
      JSON.stringify({ error: "Expired" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // 4️⃣ View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return new Response(
      JSON.stringify({ error: "View limit exceeded" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // 5️⃣ Increment views
  paste.views += 1;

  // 6️⃣ Save updated paste
  if (process.env.NODE_ENV === "production") {
    await kv.set(`paste:${id}`, paste);
  }

  // 7️⃣ Prepare response
  const remainingViews =
    paste.max_views === null
      ? null
      : Math.max(paste.max_views - paste.views, 0);

  return new Response(
    JSON.stringify({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expires_at
        ? new Date(paste.expires_at).toISOString()
        : null,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
