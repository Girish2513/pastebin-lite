import kv from "@/lib/kv";

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    // 1. Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return new Response(JSON.stringify({ error: "Content is required" }), { status: 400 });
    }
    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return new Response(JSON.stringify({ error: "Invalid TTL" }), { status: 400 });
    }
    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return new Response(JSON.stringify({ error: "Invalid max_views" }), { status: 400 });
    }

    // 2. Prepare Data
    const id = Math.random().toString(36).substring(2, 10); // Simple random ID
    const now = Date.now();
    const expires_at = ttl_seconds ? now + (ttl_seconds * 1000) : null;

    const pasteData = {
      content,
      views: 0,
      max_views: max_views || null,
      expires_at,
      created_at: now,
    };

    // 3. Persistence
    if (process.env.NODE_ENV === "production") {
      await kv.set(`paste:${id}`, pasteData);
      if (ttl_seconds) await kv.expire(`paste:${id}`, ttl_seconds);
    } else {
      const { setPaste } = await import("@/lib/localStore");
      setPaste(id, pasteData);
    }

    // 4. Response
    const host = request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const url = `${protocol}://${host}/p/${id}`;

    return new Response(JSON.stringify({ id, url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Create paste failed:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}