import { getPasteAndIncrement } from "@/lib/pasteService";

export async function GET(request, context) {
  const params = await context.params; // 👈 unwrap Promise
  const id = params.id;

  const { paste, error } = await getPasteAndIncrement(id, request.headers);

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

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
