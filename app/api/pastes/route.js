import kv from "@/lib/kv";

export async function POST(request) {
  let body;

  try {
    const text = await request.text();   // 👈 read raw body
    body = JSON.parse(text);             // 👈 parse JSON manually
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { content, ttl_seconds, max_views } = body;

  // 1️⃣ Validate content
  if (!content || typeof content !== "string" || content.trim() === "") {
    return new Response(
      JSON.stringify({ error: "content is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 2️⃣ Validate ttl_seconds
  if (ttl_seconds !== undefined) {
    if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
      return new Response(
        JSON.stringify({ error: "ttl_seconds must be >= 1" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // 3️⃣ Validate max_views
  if (max_views !== undefined) {
    if (!Number.isInteger(max_views) || max_views < 1) {
      return new Response(
        JSON.stringify({ error: "max_views must be >= 1" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // 4️⃣ Generate ID
  const id = crypto.randomUUID();

  // 5️⃣ Calculate expiry
  const createdAt = Date.now();
  const expiresAt = ttl_seconds
    ? createdAt + ttl_seconds * 1000
    : null;

  // 6️⃣ Store paste
  const paste = {
    content,
    created_at: createdAt,
    expires_at: expiresAt,
    max_views: max_views ?? null,
    views: 0,
  };

  if (process.env.NODE_ENV === "production") {
  await kv.set(`paste:${id}`, paste);
} else {
  const { setPaste } = await import("@/lib/localStore");
  setPaste(id, paste);
}


  // 7️⃣ Build URL
  const baseUrl =  request.headers.get("origin") || "http://localhost:3000";

  const url = `${baseUrl}/p/${id}`;

  return new Response(
    JSON.stringify({ id, url }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
