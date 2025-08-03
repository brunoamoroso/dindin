import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container h-dvh bg-splash-cover bg-cover">
      <div className="flex flex-col gap-8 h-full justify-end pb-10">
        <div>
          <h1 className="text-5xl font-bold text-content-primary">DinDin</h1>
          <span className="text-2xl text-content-secondary">
            Sua vida financeira finalmente ficará organizada e equilibrada.
          </span>
        </div>
        <div className="flex flex-col gap-6">
          <Link to={'/profile/signin'} className="flex flex-col">
            <Button variant={'outline'} size={'lg'}>Já tenho conta</Button>
          </Link>
          <Link to={'/profile/create'} className="flex flex-col">
            <Button size={'lg'}>Criar Conta</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
