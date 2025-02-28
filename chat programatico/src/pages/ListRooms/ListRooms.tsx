import { useNavigate, useParams } from "react-router-dom";
import { Socket } from "../../io";
import { useState } from "react";

const ListRooms = () => {
  const { nickName } = useParams();
  const [socket] = useState(Socket);
  const navigate = useNavigate();
  const joinRomm = (e) => {
    e.preventDefault();
    const RoomName = "nome da sala";
    navigate(`/room/${RoomName}`);
  };

  return (
    <>
      <section className="w-[100%] h-screen bg-slate-500 flex justify-start items-center flex-col">
        <h5 className="m-10 text-3xl text-slate-50">Salas Disponíveis</h5>
        <div className="w-[95%] h-[80%] bottom-0">
          <div className="w-[300px] h-[350px] bg-slate-950 rounded-2xl p-[10px] flex relative justify-center items-start shadow-[0_6px_12px_#0d6dfd]">
            <h5 className="text-2xl text-slate-50">room title</h5>
            <div className="w-[95%] h-[80%] bottom-0 absolute rounded-2xl flex justify-around flex-col items-center">
              <div className="w-[100%] h-[80%] bg-[url('/img/java.jpg')] bg-cover bg-center rounded-2xl"></div>
              <button
                onClick={(e) => joinRomm(e)}
                className="w-[95%] bg-slate-600 rounded-lg hover:cursor-pointer hover:bg-slate-700 text-slate-50"
              >
                entrar na sala
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListRooms;
