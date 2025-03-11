import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const WebSocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [NickName, setNickName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [logado, setLogado] = useState(false);
  const [socket, setSocket] = useState();

  const logar = (data) => {
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
    return;
  };

  useEffect(() => {
    console.log(NickName, avatar, logado);
  }, [logado]);

  const ArrayRooms = [
    {
      title: "Falando de Java",
      urlIMG: "/img/java.jpg",
    },
    {
      title: "Discução Sobre Ia",
      urlIMG: "/img/java.jpg",
    },
    {
      title: "Procuro Por Um Freela",
      urlIMG: "/img/java.jpg",
    },
    {
      title: "NodeJS",
      urlIMG: "/img/java.jpg",
    },
    {
      title: "Type Script",
      urlIMG: "/img/java.jpg",
    },
    {
      title: "Compartilhando Bugs",
      urlIMG: "/img/java.jpg",
    },
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
