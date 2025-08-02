"use client"
import { useState } from "react";
import { api } from "./libs/eden";
export default function ChatPage() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOutput("");
    setLoading(true);
    const {data, error} =await api.chat.post(({ prompt }));

    if (!data || error) {
      setOutput("❌ Error connecting to chat stream");
      setLoading(false);
      return;
    }
    for await (const chunk of data){
        const line = chunk.trim();
        if (line.startsWith("data:")) {
           const json = line.replace("data:", "").trim();
           try {
             const parsed = JSON.parse(json);
             setOutput((prev) => prev + (typeof parsed === "string" ? parsed : parsed.msg ?? "") + "\n");
           } catch (err) {
             console.error("Failed to parse SSE chunk:", err);
           }
        }
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>มิช่าจัง Chat Stream 🌸</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          required
          style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          {loading ? "Streaming..." : "Send"}
        </button>
      </form>

      <h2>🔮 Output:</h2>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#000",
          padding: "1rem",
          borderRadius: "0.5rem",
          minHeight: "200px",
        }}
      >
        {output || "No output yet."}
      </pre>
    </main>
  );
}
