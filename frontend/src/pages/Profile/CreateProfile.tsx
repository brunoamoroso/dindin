import AppBar from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import TextField from "@/components/ui/textfield";
import { Camera } from "lucide-react";

export default function CreateProfile() {
  return (
    <div className="h-dvh flex flex-col bg-neutral-950">
      <AppBar title="Configurar Conta" />
      <div className="container flex flex-1 py-10">
        <div className="flex flex-col flex-1 justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="flex bg-primary text-neutral-950 py-11 px-11 rounded-full">
                <Camera/>
              </div>
              <Button variant={'ghost'}>Escolher uma foto</Button>
            </div>

            <TextField id="name" label="Nome" />
            <TextField id="surname" label="Sobrenome" />
            <TextField id="email" label="Email" />
            <TextField id="password" label="Senha" />
          </div>

          <Button size={"lg"} className="w-full">
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
