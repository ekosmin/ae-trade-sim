import RoomBrowser from "./RoomBrowser";
import RoomDetail from "./RoomDetail";

export default function TradeRoomsPanel({ uid, player }) {
  if (player.currentRoom) {
    return <RoomDetail uid={uid} roomId={player.currentRoom} />;
  }

  return <RoomBrowser uid={uid} />;
}
