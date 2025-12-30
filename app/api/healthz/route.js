import kv from "@/lib/kv";

export async function GET() {
  // FORCE LOCAL MODE
  if (process.env.NODE_ENV !== "production") {
    return new Response(
      JSON.stringify({ ok: true, mode: "local" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await kv.ping();
    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
