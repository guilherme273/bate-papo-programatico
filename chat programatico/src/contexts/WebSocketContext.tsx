import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const WebSocketContext = createContext(null);

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  reconnectionAttempts: 0,
});

export const SocketProvider = ({ children }) => {
  const [NickName, setNickName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [logado, setLogado] = useState(false);

  const logar = (data) => {
    if (data.nickName && data.avatar) {
      setNickName(data.nickName);
      setAvatar(data.avatar);
      setLogado(true);
    }
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

        ArrayRooms,
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
