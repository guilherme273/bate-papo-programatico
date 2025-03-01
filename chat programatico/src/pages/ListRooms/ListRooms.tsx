import { useNavigate, useParams } from "react-router-dom";
import { Socket } from "../../io";
import { useState } from "react";
import { ArrayRooms } from "../../ArrayRooms";

const ListRooms = () => {
  const { nickName } = useParams();
  const [socket] = useState(Socket);
  const navigate = useNavigate();

  const joinRomm = (e, room) => {
    e.preventDefault();
    const RoomName = room.title;
    console.log(RoomName);
    navigate(`/room/${RoomName}/${nickName}`);
  };

  return (
    <>
      <section className="w-[100%] h-[100%] bg-slate-500 flex justify-start items-center flex-col">
        <h5 className="m-10 text-3xl text-slate-50">Salas Disponíveis</h5>
        <div className="w-[95%] h-[80%] bottom-0 flex flex-row gap-4 flex-wrap justify-center">
          {ArrayRooms.map((room, i) => {
            return (
              <div
                key={i}
                className="w-[300px] h-[350px] bg-slate-950 rounded-2xl p-[10px] flex relative justify-center items-start shadow-[0_6px_12px_#0d6dfd] transition-transform duration-300 hover:scale-102"
              >
                <h5 className="text-2xl text-slate-50">{room.title}</h5>
                <div className="w-[95%] h-[80%] bottom-0 absolute rounded-2xl flex justify-around flex-col items-center">
                  <div
                    className={`w-[100%] h-[80%] bg-[url(${room.urlIMG})] bg-cover bg-center rounded-2xl`}
                  ></div>
                  <button
                    onClick={(e) => joinRomm(e, room)}
                    className="w-[95%] bg-slate-600 rounded-lg hover:cursor-pointer hover:bg-slate-700 text-slate-50"
                  >
                    entrar na sala
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ListRooms;
