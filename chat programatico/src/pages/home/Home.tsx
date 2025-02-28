import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface DATA {
  nickName: string;
}

const Home = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DATA>();

  const submit = (data: DATA) => {
    if (data.nickName !== "") {
      navigate(`/list-rooms/${data.nickName}`);
    }

    reset();
  };

  return (
    <>
      <section className=" w-1/1 h-screen bg-slate-500 flex flex-col justify-center items-center bg-[url('/img/pngtree-computer-of-a-programmer-with-lines-code-of-software-image_15746001.jpg')] bg-cover bg-center">
        <div className="relative flex flex-col items-center w-1/2 gap-5 h-2/3">
          <h5 className="text-5xl text-zinc-50">Bate Papo Programático</h5>
          <div className="absolute bottom-0 flex items-center justify-center w-1/1 h-2/3">
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
                  className=" p-[5px] bg-slate-950 w-[100%] border border-slate-500 rounded-2xl text-slate-50"
                  {...register("nickName", { required: true })}
                />
                {errors?.nickName?.type === "required" && (
                  <p className="text-[11px] text-red-600/90">
                    Apelido Obrigatório
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
    </>
  );
};

export default Home;
