import { notFound } from "next/navigation";

export default async function PastePage(props) {
  const params = await props.params;
  const id = params.id;

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_URL
      : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/pastes/${id}`, {
    cache: "no-store",
  });

  // If paste is unavailable → 404 page
  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  return (
    <main style={{ padding: "40px" }}>
      <h1>Paste</h1>

      <pre
        style={{
            background: "#1e1e1e",   // dark background
            color: "#f5f5f5",        // light text
            padding: "20px",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "monospace",
        }}
      >
        {data.content}
      </pre>

      {data.expires_at && (
        <p style={{ marginTop: "10px", color: "#666" }}>
          Expires at: {new Date(data.expires_at).toLocaleString()}
        </p>
      )}

      {data.remaining_views !== null && (
        <p style={{ marginTop: "5px", color: "#666" }}>
          Remaining views: {data.remaining_views}
        </p>
      )}
    </main>
  );
}
