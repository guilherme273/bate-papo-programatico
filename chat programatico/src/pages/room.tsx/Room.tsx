import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "../../io";

function Room() {
  const navigate = useNavigate();
  const [socket] = useState(Socket);
  socket.emit("joinRoom", "room1");
  return <>dasda</>;
}

export default Room;
