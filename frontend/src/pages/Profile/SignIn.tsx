import AppBar from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import TextField from "@/components/ui/textfield";
import { useToast } from "@/components/ui/use-toast";
import { ChangeEvent, FormEvent, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { CircleX, LoaderCircle } from "lucide-react";
import { signIn } from "@/api/profileService";

export default function SignIn() {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData((previousData) => ({
      ...previousData,
      [e.target.id]: e.target.value,
    }));
  };

  const queryClient = new QueryClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData.username || userData.username === undefined) {
      toast({
        title: "Preencha um nome de usuário ou email",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (!userData.password || userData.password === undefined) {
      toast({
        title: "Preencha sua senha",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    try {
      setLoading(true);
      const userAuthenticated: { message: string; token: string } =
        await queryClient.fetchQuery({
          queryKey: ["signIn"],
          queryFn: () => signIn(userData),
        });

      if (userAuthenticated.token) {
        Cookies.set("token", userAuthenticated.token);
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage = (err as Error).message || "Erro desconhecido. Tente novamente.";

      toast({
        title: (
          <div className="flex gap-3 items-center">
            <CircleX />
            {errorMessage}
          </div>
        ),
        variant: "destructive",
        duration: 2000,
      });
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh bg-surface flex flex-col">
      <AppBar title="Entrar" />
      <div className="container flex flex-1 flex-col justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <TextField
              label="Nome de Usuário ou Email"
              id="username"
              placeholder="Nome de Usuário ou Email"
              onChange={handleChange}
            />
            <TextField
              label="Senha"
              type="password"
              id="password"
              placeholder="Digite sua senha"
              onChange={handleChange}
            />
          </div>
          <Button type="submit" size={"lg"} className={`${loading && "opacity-50 cursor-not-allowed pointer-events-none"}`}>
            {loading ? (
              <div className="flex items-center gap-2">
                <LoaderCircle />
                Carregando
              </div>
            ): "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
