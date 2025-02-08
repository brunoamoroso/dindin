import AppBar from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import imgSplash from '@/assets/main-coin.png';

export function SplashDefaultCoin(){
    return (
        <div className="flex flex-col bg-surface min-h-dvh">
            <div className="flex flex-col">
                <AppBar title="Configurar Conta"/>
            </div>
            <main className="container my-10 flex flex-col flex-1 justify-between">
                <div className="flex flex-col gap-10">
                    <img src={imgSplash} alt="Moeda em verde no centro da imagem com moedas em volta formando uma ellipse" className="mix-blend-lighten"/>
                    <div className="flex flex-col gap-3 text-center">
                        <h1 className="title-medium text-title">
                            Escolha sua moeda inicial
                        </h1>
                        <span className="body-large text-body">
                        Recomendamos que você escolha a moeda que mais usa no seu dia a dia. Depois, você poderá adicionar outras moedas à sua carteira para acompanhar transações em diferentes moedas.
                        </span>
                    </div>
                </div>
                <Button variant='default' size='lg'>Escolher minha moeda</Button>
            </main>
        </div>
    );
}