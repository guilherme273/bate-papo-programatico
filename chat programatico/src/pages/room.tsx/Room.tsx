import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Socket } from "../../io";
import { ArrowLeft, Mic, Search, SendHorizontal, X } from "lucide-react";
import { ArrayRooms } from "../../ArrayRooms";
import { useForm } from "react-hook-form";

interface MSGS {
  content: string;
  remetente: string | undefined;
  avatar: string | undefined;
  id: string;
}

function Room() {
  const navigate = useNavigate();
  const { RoomName, NikName, avatar } = useParams();
  const [stateRoomName, setStateRoomName] = useState(RoomName);
  const [msgsRoom, setMsgsRoom] = useState<MSGS[]>([]);
  const [socket] = useState(Socket);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const Room = ArrayRooms.filter((room) => room.title === RoomName);

  useEffect(() => {
    // Verificar se estamos saindo da sala anterior antes de entrar em uma nova
    if (stateRoomName !== RoomName) {
      socket.emit("leaveRoom", stateRoomName); // Sai da sala atual
      setMsgsRoom([]); // Limpa as mensagens ao trocar de sala
    }

    socket.emit("joinRoom", RoomName); // Entra na nova sala

    const messageListener = (msg: string, nikName: string, avatar: string) => {
      const newMsg: MSGS = {
        content: msg,
        remetente: nikName,
        avatar: avatar,
        id: Date.now().toString(), // ID único para cada mensagem
      };

      setMsgsRoom((prev) => [...prev, newMsg]);
    };

    socket.on("message", messageListener);

    // Função de limpeza para remover o listener ao trocar de sala ou desmontar
    return () => {
      socket.off("message", messageListener);
    };
  }, [RoomName, NikName, socket]);

  const navegar = (e, room) => {
    e.preventDefault();
    navigate(`/room/${room.title}/${NikName}/${avatar}`);
  };

  const sendMsg = (data) => {
    socket.emit("message", RoomName, data.msg, NikName, avatar);
    reset();
  };

  return (
    <>
      <section className="w-[100%] h-[100%] flex flex-row bg-gray-900">
        <section className="w-[30%] h-screen left-0 bg-gray-950 flex flex-col justify-center items-center gap-4">
          <ArrowLeft className="absolute top-2 left-2 text-slate-50 hover:cursor-pointer" />
          <h5 className="text-slate-50">Trocar De Sala</h5>
          <div className="flex flex-row justify-center items-center w-[100%]">
            <Search className="w-[14%] h-[32px] text-slate-50" />
            <input
              type="text"
              className="w-[80%] p-1 text-slate-50 bg-gray-700 rounded-sm outline-none ring-1 ring-gray-600 focus:ring-1 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <div className="w-[100%] h-[90%] flex flex-col pb-9">
            {ArrayRooms.map((room, i) => (
              <button className="" onClick={(e) => navegar(e, room)} key={i}>
                <div className="w-[100%] h-16 border-t-[0.5px] border-t-blue-400/10 flex flex-row items-center gap-20 hover:cursor-pointer hover:bg-gray-900">
                  <div
                    className={`w-12 h-12 ml-3.5 bg-cover bg-center rounded-4xl`}
                    style={{ backgroundImage: `url(${room.urlIMG})` }}
                  ></div>
                  <h5 className="text-slate-50">{room.title}</h5>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="w-[70%] h-screen flex justify-center items-center relative flex-wrap">
          <div className="w-[100%] h-[10%] absolute bg-gray-800 top-0 flex flex-row items-center gap-3">
            <div
              className={`w-14 h-14 ml-3.5 bg-cover bg-center rounded-4xl`}
              style={{ backgroundImage: `url(${Room[0].urlIMG})` }}
            ></div>
            <h5 className="text-slate-50">{Room[0].title}</h5>
          </div>
          <div className="w-[100%] h-[80%] flex flex-nowrap flex-col overflow-y-scroll scrollbar p-5">
            <ul className="flex flex-col gap-2">
              {msgsRoom.map((msg) => (
                <li
                  key={msg.id}
                  className={`flex flex-col flex-wrap gap-1 p-4 bg-gray-700/30 rounded-3xl ${
                    msg.remetente === NikName ? "items-end text-right" : ""
                  }`}
                >
                  <div className="flex flex-row items-center gap-1">
                    <div
                      className={`flex justify-center items-center w-[45px] h-[45px] rounded-full text-[35px] ${
                        msg.remetente === NikName
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {msg.avatar}
                    </div>
                    <strong>
                      {msg.remetente === NikName ? "Você" : msg.remetente} Diz:
                    </strong>
                  </div>
                  <p className="text-slate-50">{msg.content}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute bottom-0 flex flex-row items-center justify-around w-full min-h-[10%] h-auto p-2 bg-gray-800">
            <X className="rotate-45 text-slate-50" />
            <form
              className="w-[87%] flex flex-row justify-around"
              onSubmit={handleSubmit(sendMsg)}
            >
              <textarea
                className="w-[85%] min-h-[40px] max-h-[200px] p-2 text-slate-50 bg-gray-700 rounded-sm outline-none ring-1 ring-gray-600 focus:ring-1 focus:ring-blue-500 transition-shadow resize-none overflow-hidden"
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
            <Mic className=" text-slate-50" />
          </div>
        </section>
      </section>
    </>
  );
}

export default Room;
