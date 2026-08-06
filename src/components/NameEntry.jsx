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
    <div className="name-entry">
      <h2>Welcome to the trade sim</h2>
      <p className="sub">Pick a name for this session:</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
        />
        <button type="submit" className="pull-button">
          Start
        </button>
      </form>
    </div>
  );
}

