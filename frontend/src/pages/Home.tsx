import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Splash from "@/assets/splash-home.png";
import TextField from "@/components/textfield";
import { Separator } from "@/components/ui/separator";
import  GoogleIcon  from "@/assets/google.svg?react";

export default function Home() {
  return (
    <div className="h-dvh bg-splash-cover bg-surface">
      <img src={Splash} alt="" className="object-top object-cover w-full h-full absolute z-0" />
      <div className="flex flex-col gap-8 h-full justify-end pb-10 px-6 z-10 relative">
        <div>
          <h1 className="headline-small text-content-primary">Bem-vindo à Allie</h1>
          <span className="body-large text-content-secondary">
            Acesse ou crie sua conta. Leva menos de 1 minuto para começar.
          </span>
        </div>
        <div className="flex flex-col gap-6">
          <TextField label="Email" placeholder="email@outlook.com"/>
          <Link to={'/profile/create'} className="flex flex-col">
            <Button size={'lg'}>Continuar</Button>
          </Link>
          <div className="flex flex-1 gap-6 items-center">
            <Separator className="flex flex-1"/>
            <span className="text-lg text-content-secondary">ou</span>
            <Separator className="flex flex-1"/>
          </div>
          <Link to={'/profile/signin'} className="flex flex-col">
            <Button variant={'outline'} size={'lg'}><GoogleIcon className="size-6 fill-content-primary"/>Continuar com Google</Button>
          </Link>
        </div>
        <div className="flex mt-2 body-small text-center">
          <span className="text-content-secondary">Ao continuar, você concorda com os <Link className="text-primary underline">Termos e Política de Privacidade</Link></span>
        </div>
      </div>
    </div>
  );
}
