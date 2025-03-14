import { useLocation, useNavigate } from "react-router-dom";
import { ROOM, useSocket } from "../../contexts/WebSocketContext.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import ButtonLogout from "../../components/buttonRetunrLastPage/ButtonLogout.js";
import { io } from "socket.io-client";

import Footer from "../../components/footer/Footer.js";
import "./ListRoomsStyle.css";

const ListRooms = () => {
  const { ArrayRooms, setSocket, socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const toastFy = location.state || {};
  const joinRomm = (e: React.MouseEvent<HTMLButtonElement>, room: ROOM) => {
    e.preventDefault();
    navigate(`/room/${room.title}`);
  };

  useEffect(() => {
    if (toastFy?.showToast) {
      toast.success(toastFy.msg, {
        autoClose: 5000,
        hideProgressBar: true,
        closeButton: true,
        pauseOnHover: true,
      });
    }

    if (!socket) {
      const Newsocket = io("http://localhost:3000", {
        transports: ["websocket"],
        reconnectionAttempts: 0,
      });
      setSocket(Newsocket);
    }
  }, []);
  return (
    <>
      <section className="w-[100%] h-[100%] bg-slate-500 flex justify-center items-center flex-col gap-5 relative">
        <ButtonLogout />
        <h5 className="m-10 text-3xl text-center text-slate-50">
          Salas Disponíveis
        </h5>
        <div className="bottom-0 flex flex-row flex-wrap justify-center gap-4 ">
          {ArrayRooms.map((room: ROOM, i: number) => {
            return (
              <div key={i} className="div-card bg-slate-950">
                <h5 className="text-2xl text-center text-slate-50">
                  {room.title}
                </h5>
                <div className="w-[95%] h-[80%] bottom-0 absolute rounded-2xl flex justify-around flex-col items-center">
                  <div
                    className="w-[100%] h-[80%] bg-cover bg-center rounded-2xl"
                    style={{ backgroundImage: `url(${room.urlIMG})` }}
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
        <Footer />
      </section>
      <ToastContainer />
    </>
  );
};

export default ListRooms;
