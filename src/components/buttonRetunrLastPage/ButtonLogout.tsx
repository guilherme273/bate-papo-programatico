import { LogOut } from "lucide-react";
import { useSocket } from "../../contexts/WebSocketContext.js";
const ButtonLogout = () => {
  const { logout } = useSocket();
  return (
    <>
      <button
        onClick={logout}
        className="fixed z-50 flex flex-row items-center justify-center gap-1 cursor-pointer top-3 left-3"
      >
        <LogOut className="rotate-180 text-slate-50" />
        <p className="text-slate-50">Sair</p>
      </button>
    </>
  );
};

export default ButtonLogout;
