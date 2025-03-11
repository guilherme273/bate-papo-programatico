import { Navigate, Outlet } from "react-router-dom";
import { useSocket } from "../contexts/WebSocketContext";

export const IsLogaded = () => {
  const { logado } = useSocket();
  return logado ? <Outlet /> : <Navigate to="/" />;
};
