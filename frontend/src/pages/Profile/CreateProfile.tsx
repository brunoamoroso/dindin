import AppBar from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import TextField from "@/components/ui/textfield";
import { Camera } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

export default function CreateProfile() {
  const [user, setUser] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(user);
  };

  return (
    <div className="h-dvh flex flex-col bg-neutral-950">
      <AppBar title="Configurar Conta" />
      <div className="container flex flex-1 py-10">
          <form className="flex flex-col flex-1 justify-between" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex bg-primary text-neutral-950 py-11 px-11 rounded-full">
                  <Camera />
                </div>
                <Button variant={"ghost"}>Escolher uma foto</Button>
              </div>

              <TextField
                id="name"
                label="Nome"
                required={true}
                onChange={handleChange}
              />
              <TextField id="surname" label="Sobrenome" required={true} onChange={handleChange} />
              <TextField id="email" label="Email" required={true} onChange={handleChange}/>
              <TextField id="password" label="Senha"  required={true} onChange={handleChange} />
            </div>

            <Button
              size={"lg"}
              type="submit"
              className="w-full"
            >
              Continuar
            </Button>
          </form>
      </div>
    </div>
  );
}
