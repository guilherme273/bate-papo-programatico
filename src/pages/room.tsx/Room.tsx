import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlignJustify, ArrowLeft, SendHorizontal } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
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
interface FormData {
  msg: string;
}

function Room() {
  const navigate = useNavigate();
  const { socket, avatar, NickName, ArrayRooms } = useSocket();
  const { RoomName } = useParams();
  const [stateRoomName, setStateRoomName] = useState(RoomName);
  const [msgsRoom, setMsgsRoom] = useState<MSGS[]>([]);
  const [showMObileMenu, setShowMObileMenu] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();
  const valueInputRef = useRef<HTMLInputElement>(null);
  const [ArrayRoomsSearch, setArrayRoomsSearch] = useState(ArrayRooms);
  const [inputValue, setInputValue] = useState("");
  const Room = ArrayRooms.filter((room: ROOMS) => room.title === RoomName);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [msgsRoom]);
  const atualizarMSGS = (msgsRoom: MSGS[]) => {
    setMsgsRoom(msgsRoom);
  };

  const verificaOndeFoi = (e: React.MouseEvent) => {
    if (
      showMObileMenu && // Apenas fecha se o menu estiver aberto
      e.target instanceof HTMLElement &&
      !e.target.closest(".section-menu-rooms-mobile")
    ) {
      setShowMObileMenu(false);
    }
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

  const sendMsg: SubmitHandler<FormData> = (data) => {
    if (!socket) return; // Garante que o socket está definido antes de enviar a mensagem
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
      <section
        onClick={(e) => verificaOndeFoi(e)}
        className="section-page-room bg-slate-900 "
        id="foraDoContainer"
      >
        <button
          onClick={() => setShowMObileMenu(!showMObileMenu)}
          className="button-mobile-header"
        >
          <AlignJustify className="text-slate-50" size={30} />
        </button>
        <section
          className={
            !showMObileMenu
              ? "section-menu-rooms bg-slate-950"
              : "section-menu-rooms-mobile bg-slate-950"
          }
        >
          <ArrowLeft
            onClick={sair}
            className="cursor-pointer arrow-left text-slate-50"
          />
          <h5 className="text-slate-50">Trocar De Sala</h5>
          <div className="div-search-rooms">
            <input
              type="text"
              className="bg-gray-700 input-search-rooms text-slate-50 ring-1 ring-gray-600 focus:ring-1 focus:ring-blue-500"
              ref={valueInputRef}
              onChange={filtrarBusca}
              value={inputValue}
            />
          </div>
          <div className="div-rooms-list">
            {ArrayRoomsSearch.map((room: ROOMS, i: number) => (
              <button className="" onClick={(e) => navegar(e, room)} key={i}>
                <div className="div-room hover:cursor-pointer hover:bg-gray-900">
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
          <div
            ref={chatRef}
            className="overflow-y-scroll div-contenct-chat scrollbar"
          >
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
                rows={1}
                onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                  const target = e.target as HTMLTextAreaElement; // Garantir que é um <textarea>
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`; // Corrige a atribuição de string para número
                }}
                {...register("msg", { required: true })}
              />

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
  function filtrarBusca() {
    const valorInputMinusculo =
      valueInputRef.current?.value.toLowerCase() || "";
    setInputValue(valueInputRef.current?.value || "");
    const newArray = ArrayRooms.filter((room: ROOMS) => {
      const title = room.title.toLowerCase();
      return title.includes(valorInputMinusculo);
    });
    setArrayRoomsSearch(newArray);
  }
}

export default Room;
