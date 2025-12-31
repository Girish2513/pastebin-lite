import kv from "@/lib/kv";

export async function GET() {
  try {
    // In production, verify we can talk to Redis
    if (process.env.NODE_ENV === "production") {
      await kv.get("health_check_ping");
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}