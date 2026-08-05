import { useState } from "react";

export default function NameEntry({ onSubmit }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <div style={{ maxWidth: 320, margin: "80px auto", textAlign: "center" }}>
      <h2>Welcome to the trade sim</h2>
      <p>Pick a name for this session:</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
          style={{ padding: 8, fontSize: 16, width: "100%", boxSizing: "border-box" }}
        />
        <button
          type="submit"
          style={{ marginTop: 12, padding: "8px 16px", fontSize: 16, width: "100%" }}
        >
          Start
        </button>
      </form>
    </div>
  );
}

