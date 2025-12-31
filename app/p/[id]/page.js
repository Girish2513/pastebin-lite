import { getPasteAndIncrement } from "@/lib/pasteService";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function PastePage({ params }) {
  const { id } = await params;
  const headersList = await headers();

  // Wrap headers to match the Map-like interface expected by our service
  const reqHeaders = {
    get: (name) => headersList.get(name),
  };

  const { paste, error } = await getPasteAndIncrement(id, reqHeaders);

  if (error) {
    notFound();
  }

  return (
    <main style={{ padding: "40px", maxWidth: "800px", color: "#f5f5f5" }}>
      <h1 style={{ marginBottom: "20px" }}>Paste Content</h1>
      <pre
        style={{
          background: "#1e1e1e",
          padding: "20px",
          border: "1px solid #444",
          borderRadius: "4px",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "monospace",
        }}
      >
        {paste.content}
      </pre>
      <div style={{ marginTop: "20px", fontSize: "0.9em", color: "#888" }}>
        {paste.expires_at && <p>Expires: {new Date(paste.expires_at).toUTCString()}</p>}
        {paste.max_views && <p>Views: {paste.views} / {paste.max_views}</p>}
      </div>
    </main>
  );
}
