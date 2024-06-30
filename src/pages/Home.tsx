import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container h-dvh font-sans bg-splash-cover bg-cover text-white">
      <div className="flex flex-col gap-8 h-full justify-end pb-10">
        <div>
          <h1 className="text-5xl font-bold">DinDin</h1>
          <span className="text-2xl">
            Sua vida financeira finalmente ficará organizada e equilibrada.
          </span>
        </div>
        <div className="flex flex-col gap-6">
          <Button variant={'outline'} size={'lg'}>Já tenho conta</Button>
          <Button size={'lg'}>Criar Conta</Button>
        </div>
      </div>
    </div>
  );
}
