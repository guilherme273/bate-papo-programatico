import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlignJustify, ArrowLeft, Search, SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { ROOMS, useSocket } from "../../contexts/WebSocketContext.js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./RoomStyle.css";
interface MSGS {
  content: string;
  remetente: string | undefined;
  avatar: string | undefined;
  id: string;
}

function Room() {
  const navigate = useNavigate();
  const { socket, avatar, NickName, ArrayRooms } = useSocket();
  const { RoomName } = useParams();
  const [stateRoomName, setStateRoomName] = useState(RoomName);
  const [msgsRoom, setMsgsRoom] = useState<MSGS[]>([]);
  const [showMObiMenu, setShowMObileMenu] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const Room = ArrayRooms.filter((room: ROOMS) => room.title === RoomName);
  const atualizarMSGS = (msgsRoom: MSGS[]) => {
    setMsgsRoom(msgsRoom);
  };

  const messageListener = (
    msg: string,
    NickName: string,
    avatar: string,
    id: string
  ) => {
    const newMsg: MSGS = {
      content: msg,
      remetente: NickName,
      avatar: avatar,
      id: id, // ID único para cada mensagem
    };

    setMsgsRoom((prev) => [...prev, newMsg]);
  };
  useEffect(() => {
    if (!RoomName) return;

    // Se a sala mudou, sair da sala anterior
    if (stateRoomName && stateRoomName !== RoomName) {
      socket.emit("leaveRoom", stateRoomName, NickName);
      setMsgsRoom([]);
      setStateRoomName(RoomName);
    }

    socket.emit("joinRoom", RoomName, NickName);
    socket.on("joinRoom", atualizarMSGS);
    socket.on("leaveRoom", atualizarMSGS);

    // Adicionar ouvintes para eventos
    socket.on("message", messageListener);

    return () => {
      // Limpar ouvintes ao desmontar o componente ou trocar de sala
      socket.off("message", messageListener);
      socket.off("joinRoom", atualizarMSGS);
      socket.off("leaveRoom", atualizarMSGS);
    };
  }, [RoomName]);

  const navegar = (e: React.MouseEvent<HTMLButtonElement>, room: ROOMS) => {
    e.preventDefault();
    navigate(`/room/${room.title}`);
  };

  const sendMsg = (data: { msg: string }) => {
    const id = Date.now().toString();
    socket.emit("message", RoomName, data.msg, NickName, avatar, id);
    reset();
  };

  const sair = () => {
    socket.emit("leaveRoom", stateRoomName, NickName);
    navigate("/list-rooms");
  };

  return (
    <>
      <section className="section-page-room bg-slate-900">
        <button
          onClick={() => setShowMObileMenu(!showMObiMenu)}
          className="button-mobile-header"
        >
          <AlignJustify className="text-slate-50" size={30} />
        </button>
        <section
          className={
            showMObiMenu
              ? "section-menu-rooms bg-slate-950"
              : "section-menu-rooms-mobile bg-slate-950"
          }
        >
          <ArrowLeft onClick={sair} className="arrow-left text-slate-50" />
          <h5 className="text-slate-50">Trocar De Sala</h5>
          <div className="div-search-rooms">
            <Search className="text-slate-50" />
            <input
              type="text"
              className="bg-gray-700 input-search-rooms text-slate-50 ring-1 ring-gray-600 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="div-rooms-list">
            {ArrayRooms.map((room, i) => (
              <button className="" onClick={(e) => navegar(e, room)} key={i}>
                <div className="flex flex-row items-center gap-20 div-room justify-arround hover:cursor-pointer hover:bg-gray-900">
                  <div
                    className="room-image"
                    style={{ backgroundImage: `url(${room.urlIMG})` }}
                  ></div>
                  <h5 className="text-sm text-slate-50">{room.title}</h5>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="section-chat">
          <div className="bg-gray-800 div-header-chat">
            <div
              className="room-image"
              style={{ backgroundImage: `url(${Room[0].urlIMG})` }}
            ></div>
            <h5 className="text-slate-50">{Room[0].title}</h5>
          </div>
          <div className="overflow-y-scroll div-contenct-chat scrollbar">
            <ul className="flex flex-col gap-2">
              {msgsRoom.map((msg) => (
                <>
                  {msg.remetente === "SYSTEM" ? (
                    <div
                      className="flex items-center justify-center"
                      key={msg.id}
                    >
                      <p className="p-1 text-xs text-slate-50 bg-blue-400/10 rounded-4xl">
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    <li
                      key={msg.id}
                      className={`flex flex-col flex-wrap gap-1 p-4 bg-gray-700/30 rounded-3xl ${
                        msg.remetente === NickName ? "items-end text-right" : ""
                      }`}
                    >
                      <div className="flex flex-row items-center gap-1">
                        <div
                          className={`flex justify-center items-center w-[45px] h-[45px] rounded-full text-[35px] ${
                            msg.remetente === NickName
                              ? "bg-blue-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {msg.avatar}
                        </div>
                        <strong
                          className={
                            msg.remetente === NickName ? "text-blue-500" : ""
                          }
                        >
                          {msg.remetente === NickName ? "Você" : msg.remetente}:
                        </strong>
                      </div>
                      <p className="text-slate-50">{msg.content}</p>
                    </li>
                  )}
                </>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800 div-send-msg">
            <form className="form" onSubmit={handleSubmit(sendMsg)}>
              <textarea
                className="w-[85%] min-h-[30px] max-h-[200px] p-2 text-slate-50 bg-gray-700 rounded-sm outline-none ring-1 ring-gray-600 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none overflow-hidden"
                rows="1"
                onInput={(e) => {
                  e.target.style.height = "auto"; // Resetar altura antes de calcular
                  e.target.style.height = e.target.scrollHeight + "px"; // Ajustar para altura do conteúdo
                }}
                {...register("msg", { required: true })}
              ></textarea>
              <button type="submit" className="hover:cursor-pointer">
                <SendHorizontal className=" text-slate-50" />
              </button>
            </form>
          </div>
        </section>
      </section>
      <ToastContainer />
    </>
  );
}

export default Room;
