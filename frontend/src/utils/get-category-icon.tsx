import { ArrowRightLeft, Backpack, BadgePercent, Banknote, Car, Coins, Cross, DiamondPercent, Dumbbell, Gift, GraduationCap, HandCoins, Heart, House, Package, PartyPopper, PiggyBank, Pizza, Shirt, ShoppingCart, TvMinimalPlay } from "lucide-react";

export default function getCategoryIcon(category: string){
    const icons: Record<string, JSX.Element> = {
        //expenses icons
        transporte: <Car />,
        mantimentos: <ShoppingCart />,
        viagens: <Backpack />,
        esportes: <Dumbbell />,
        presentes: <Gift />,
        mercadorias: <Package />,
        pessoal: <Heart />,
        taxas: <Coins />,
        dividas: <DiamondPercent />,
        assinaturas: <TvMinimalPlay />,
        casa: <House />,
        vestuário: <Shirt />,
        saúde: <Cross />,
        lazer: <PartyPopper />,
        estudos: <GraduationCap />,
        restaurantes: <Pizza />,
        
        //gain icons
        salário: <Banknote />,
        investimentos: <PiggyBank />,
        cashback: <HandCoins />,
        "receitas variáveis": <BadgePercent />,
        transferências: <ArrowRightLeft />
    }

    return (
        icons[category.toLowerCase()]
    ) || null;
}