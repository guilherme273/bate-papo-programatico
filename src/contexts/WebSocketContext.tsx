import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface SocketProviderProps {
  children: ReactNode;
}

export interface ROOMS {
  title: string;
  urlIMG: string;
}

const WebSocketContext = createContext<any>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [NickName, setNickName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [logado, setLogado] = useState<boolean>(false);
  const [socket, setSocket] = useState<any>(null);

  const logar = (data: { nickName: string; avatar: string }) => {
    if (data.nickName && data.avatar) {
      setNickName(data.nickName);
      setAvatar(data.avatar);
      localStorage.setItem("@nickName:", data.nickName);
      localStorage.setItem("@avatar:", data.avatar);
      setLogado(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("@nickName:");
    localStorage.removeItem("@avatar:");
    setLogado(false);
    setNickName(null);
    setAvatar(null);
    window.location.reload();
  };

  const isLogaded = () => {
    const nickName = localStorage.getItem("@nickName:");
    const avatar = localStorage.getItem("@avatar:");
    if (!nickName || !avatar) {
      localStorage.removeItem("@nickName:");
      localStorage.removeItem("@avatar:");
      setLogado(false);
      setNickName(null);
      setAvatar(null);
      return;
    }
    setLogado(true);
    setNickName(nickName);
    setAvatar(avatar);
  };

  useEffect(() => {
    console.log(NickName, avatar, logado);
  }, [logado]);

  const ArrayRooms: ROOMS[] = [
    { title: "Falando de Java", urlIMG: "/img/java.jpg" },
    { title: "Discução Sobre IA", urlIMG: "/img/java.jpg" },
    { title: "Procuro Por Um Freela", urlIMG: "/img/java.jpg" },
    { title: "NodeJS", urlIMG: "/img/java.jpg" },
    { title: "TypeScript", urlIMG: "/img/java.jpg" },
    { title: "Compartilhando Bugs", urlIMG: "/img/java.jpg" },
  ];

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        logar,
        NickName,
        avatar,
        logado,
        isLogaded,
        ArrayRooms,
        setSocket,
        logout,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useSocket deve ser usado dentro do SocketProvider!");
  }
  return context;
};
