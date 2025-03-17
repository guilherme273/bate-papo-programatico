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
export interface ChartsInterface {
  name: string;
  value: number;
}
export interface USERS_ON {
  id: string;
  nickname: string;
}

export interface ROOM {
  title: string;
  msg: { content: string; remetente: string; avatar: string; id: string }[];
  usersOnline: { id: string; nickname: string }[];
  urlIMG: string;
}

const WebSocketContext = createContext<any>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [NickName, setNickName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [logado, setLogado] = useState<boolean>(false);
  const [socket, setSocket] = useState<any>(null);
  const [UsersOnline, SetUsersOnline] = useState<USERS_ON[]>([]);
  const [ArrayRooms, setArrayRooms] = useState<ROOM[]>([]);
  const [array_utm_source, setarray_utm_source] = useState<ChartsInterface[]>(
    ArrayRooms.map((room) => ({
      name: room.title,
      value: room.usersOnline.length,
    }))
  );

  useEffect(() => {
    const AsyncForthis = async () => {
      const response = await fetch(
        "https://back-end-websocket-production.up.railway.app/rooms",
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArrayRooms(data);
      }
    };

    AsyncForthis();
  }, []);

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
    if (socket) {
      socket.emit("updateTotalUsersOn", NickName);
      socket.on("updateTotalUsersOn", (arrayUsersOn: USERS_ON[]) => {
        SetUsersOnline((prev: USERS_ON[]) => {
          const mergedUsers = [...prev, ...arrayUsersOn];

          // Removendo duplicatas pelo 'id'
          const uniqueUsers = mergedUsers.filter(
            (user, index, self) =>
              self.findIndex((u) => u.id === user.id) === index
          );

          return uniqueUsers;
        });
      });

      socket.on("Userdisconnecting", (allUsersOnline: USERS_ON[]) => {
        SetUsersOnline(allUsersOnline);
      });
    }
    return;
  }, [socket]);

  useEffect(() => {
    const utm_source: ChartsInterface[] = ArrayRooms.map((room) => ({
      name: room.title,
      value: room.usersOnline.length,
    }));
    setarray_utm_source(utm_source);
  }, [ArrayRooms]);

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
        SetUsersOnline,
        setArrayRooms,
        UsersOnline,
        array_utm_source,
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
