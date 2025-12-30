"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const body = { content };
    if (ttl) body.ttl_seconds = Number(ttl);
    if (maxViews) body.max_views = Number(maxViews);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setError("Failed to create paste");
      return;
    }

    const data = await res.json();
    setResultUrl(data.url);
  }

  return (
    <main style={{ padding: "40px", maxWidth: "600px", color: "#f5f5f5" }}>
      <h1>Create Paste</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          style={{
            width: "100%",
            marginBottom: "10px",
            background: "#1e1e1e",
            color: "#f5f5f5",
            border: "1px solid #444",
            padding: "10px",
          }}
          placeholder="Paste content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="TTL (seconds, optional)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            background: "#1e1e1e",
            color: "#f5f5f5",
            border: "1px solid #444",
            padding: "8px",
          }}
        />

        <input
          type="number"
          placeholder="Max views (optional)"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
          style={{
            width: "100%",
            marginBottom: "10px",
            background: "#1e1e1e",
            color: "#f5f5f5",
            border: "1px solid #444",
            padding: "8px",
          }}
        />

        <button
          type="submit"
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: "10px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Paste
        </button>
      </form>

      {resultUrl && (
        <p style={{ marginTop: "20px" }}>
          Share URL: <a href={resultUrl}>{resultUrl}</a>
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}
