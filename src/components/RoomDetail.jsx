import { useRoom } from "../useRoom";
import { usePlayersLive } from "../usePlayersLive";
import { useToys } from "../useToys";
import { rarityClass } from "../rarity";
import { leaveRoom } from "../rooms";

export default function RoomDetail({ uid, roomId }) {
  const { room, loading } = useRoom(roomId);
  const memberIds = room?.members ?? [];
  const members = usePlayersLive(memberIds);
  const allToyIds = Array.from(new Set(memberIds.flatMap((id) => members[id]?.collection ?? [])));
  const { toys } = useToys(allToyIds);

  if (loading || !room) {
    return (
      <div className="panel">
        <p className="empty-note">Loading room...</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="room-header">
        <h2>{room.name}</h2>
        <button className="pull-button small" onClick={() => leaveRoom(uid, roomId)}>
          Leave room
        </button>
      </div>
      <p className="panel-note">
        {memberIds.length} {memberIds.length === 1 ? "member" : "members"} in this room
      </p>

      {memberIds.map((memberId) => {
        const member = members[memberId];
        const memberToys = (member?.collection ?? []).map((id) => toys[id]).filter(Boolean);

        return (
          <div key={memberId} className="room-member">
            <h3>
              {member ? member.name : "..."}
              {memberId === uid ? " (you)" : ""}
            </h3>
            {memberToys.length === 0 ? (
              <p className="empty-note">No physical toys.</p>
            ) : (
              <ul className="item-list">
                {memberToys.map((toy) => (
                  <li key={toy.id} className="item-row">
                    <span className={`tier-dot ${rarityClass(toy.rarity)}`} />
                    <div className="item-main">
                      <div className="item-name">{toy.species}</div>
                    </div>
                    <span className={`tier-badge ${rarityClass(toy.rarity)}`}>{toy.rarity}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
