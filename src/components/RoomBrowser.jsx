import { useState } from "react";
import { useTradeRooms } from "../useTradeRooms";
import { createRoom, joinRoom } from "../rooms";

export default function RoomBrowser({ uid }) {
  const { rooms: allRooms, loading } = useTradeRooms();
  const rooms = allRooms.filter((room) => !room.closed);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      await createRoom(uid, trimmed);
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin(roomId) {
    setBusy(true);
    try {
      await joinRoom(uid, roomId);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel">
      <h2>Trade rooms</h2>
      <p className="panel-note">Join a room to see who's trading and what they've got.</p>

      <form className="room-create" onSubmit={handleCreate}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New room name"
          disabled={busy}
        />
        <button className="pull-button" type="submit" disabled={busy}>
          Create room
        </button>
      </form>

      {loading ? (
        <p className="empty-note">Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p className="empty-note">No trade rooms yet — create one to get started.</p>
      ) : (
        <ul className="item-list">
          {rooms.map((room) => (
            <li key={room.id} className="item-row">
              <div className="item-main">
                <div className="item-name">{room.name}</div>
                <div className="item-sub">
                  {room.members.length} {room.members.length === 1 ? "member" : "members"}
                </div>
              </div>
              <button
                className="pull-button small"
                onClick={() => handleJoin(room.id)}
                disabled={busy}
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
