import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Splash from "@/assets/splash-home.png";
import TextField from "@/components/textfield";
import { Separator } from "@/components/ui/separator";
import GoogleIcon from "@/assets/google.svg?react";
import { FormEvent, useState } from "react";
import { checkEmail } from "@/api/profileService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    if (email === "") {
      toast.error("Preencha o email");
      setLoading(false);
      return;
    }

    try {
      const emailExists = await queryClient.fetchQuery({
        queryKey: ["check-email-home", email],
        queryFn: () => checkEmail<boolean>({ email: email }),
        staleTime: 0,
      });
      if (emailExists) {
        navigate(`/profile/signin/${email}`);
        return;
      }

      navigate(`/profile/create/${email}`);
    } catch (err: unknown) {
      setLoading(false);
      console.error("error", err);
      toast.error("Tivemos um problema interno, tente novamente mais tarde.");
    }
  };

  return (
    <div className="h-dvh bg-splash-cover bg-surface">
      <img
        src={Splash}
        alt=""
        className="object-top object-cover w-full h-full absolute z-0"
      />
      <div className="flex flex-col gap-8 h-full justify-end pb-10 px-6 z-10 relative">
        <div>
          <h1 className="headline-small text-content-primary">
            Bem-vindo à Allie
          </h1>
          <span className="body-large text-content-secondary">
            Acesse ou crie sua conta. Leva menos de 1 minuto para começar.
          </span>
        </div>
        <div className="flex flex-col gap-6">
          <form className="flex flex-col gap-6" onSubmit={handleEmailSubmit}>
            <TextField
              label="Email"
              type="text"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@outlook.com"
            />
            <Button
              type="submit"
              size={"lg"}
              className={`${
                loading && "opacity-50 cursor-not-allowed pointer-events-none"
              }`}
            >
              {loading ? (
                <>
                  <Spinner />
                  Carregando
                </>
              ) : (
                "Continuar"
              )}
            </Button>
          </form>
          <div className="flex flex-1 gap-6 items-center">
            <Separator className="flex flex-1" />
            <span className="text-lg text-content-secondary">ou</span>
            <Separator className="flex flex-1" />
          </div>
          <Link to={"/profile/signin"} className="flex flex-col">
            <Button variant={"outline"} size={"lg"}>
              <GoogleIcon className="size-6 fill-content-primary" />
              Continuar com Google
            </Button>
          </Link>
        </div>
        <div className="flex mt-2 body-small text-center">
          <span className="text-content-secondary">
            Ao continuar, você concorda com os{" "}
            <Link className="text-primary underline">
              Termos e Política de Privacidade
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
