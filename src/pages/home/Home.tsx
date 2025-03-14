import { useForm } from "react-hook-form";
import { emojiList } from "../../ArrayRooms";
import { useSocket } from "../../contexts/WebSocketContext.js";
import { Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import "./HomeStyle.css";
interface DATA {
  nickName: string;
  avatar: string;
}

const Home = () => {
  const { logar, logado, NickName, isLogaded } = useSocket();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DATA>();

  const submit = (data: DATA) => {
    if (data.nickName !== "") {
      logar(data);
    }

    reset();
  };

  useEffect(() => {
    isLogaded();
  });

  if (logado) {
    return (
      <Navigate
        state={{
          showToast: true,
          msg: `Seja Bem Vindo: ${NickName}`,
          type: "success",
        }}
        to="/list-rooms"
      />
    );
  } else {
    return (
      <>
        <section className=" w-1/1 h-screen bg-slate-500 flex flex-col justify-center items-center bg-[url('/img/pngtree-computer-of-a-programmer-with-lines-code-of-software-image_15746001.jpg')] bg-cover bg-center">
          <div className="div-container-home">
            <h5 className="text-5xl text-center text-zinc-50">
              Bate Papo Programático
            </h5>
            <div className="div-form-login">
              <form
                onSubmit={handleSubmit(submit)}
                className="bottom-0 flex flex-col items-center justify-around w-2/3 h-1/1 bg-slate-700/90 rounded-2xl"
              >
                <div className="flex flex-col justify-center items-baseline w-[70%] gap-1">
                  <label className=" text-slate-50" htmlFor="">
                    Entre Com Um Apelido
                  </label>
                  <input
                    id="nickName"
                    type="text"
                    className=" p-[5px] bg-gray-800 border border-gray-600 w-[100%] border  rounded-2xl text-slate-50"
                    {...register("nickName", { required: true })}
                  />

                  {errors?.nickName?.type === "required" && (
                    <p className="text-[11px] text-red-600/90">
                      Apelido Obrigatório
                    </p>
                  )}
                  <label className=" text-slate-50" htmlFor="">
                    Escolha um Avatar
                  </label>
                  <select
                    className="w-full p-1 text-sm text-white bg-gray-800 border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                    id="emoji-select"
                    {...register("avatar", { required: true })}
                    defaultValue="" // Isso define o valor inicial selecionado
                  >
                    <option value="" disabled></option>
                    {emojiList.map((emoji, index) => {
                      return (
                        <option key={index} value={emoji}>
                          {emoji}
                        </option>
                      );
                    })}
                  </select>

                  {errors?.avatar?.type === "required" && (
                    <p className="text-[11px] text-red-600/90">
                      Avatar Obrigatório
                    </p>
                  )}
                </div>
                <button
                  className=" bg-slate-950 w-[70%] border border-slate-500 rounded-2xl text-slate-50 hover:cursor-pointer hover:bg-slate-900"
                  type="submit"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </section>
        <ToastContainer />
      </>
    );
  }
};

export default Home;
