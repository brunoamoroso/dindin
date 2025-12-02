import { ArrowRightLeft, Backpack, BadgePercent, Banknote, Car, Coins, Cross, DiamondPercent, Dumbbell, Gift, GraduationCap, HandCoins, Heart, HeartHandshake, House, Package, PartyPopper, PawPrint, PiggyBank, Pizza, Shirt, ShoppingCart, TvMinimalPlay } from "lucide-react";

export default function getCategoryIcon(category: string): {dataVizColor: string, dataVizBorderColor: string, icon: JSX.Element}{
    const icons: Record<string, {dataVizColor: string, dataVizBorderColor: string, icon: JSX.Element}> = {
        //expenses icons
        transporte: {
            dataVizColor: "var(--color-orange-600)",
            dataVizBorderColor: "var(--color-orange-500)",
            icon: <Car />
        },
        mantimentos: {
            dataVizColor: "var(--color-blue-600)",
            dataVizBorderColor: "var(--color-blue-500)",
            icon: <ShoppingCart />
        },
        viagens: {
            dataVizColor: "var(--color-pink-600)",
            dataVizBorderColor: "var(--color-pink-500)",
            icon: <Backpack />
        },
        esportes: {
            dataVizColor: "var(--color-purple-400)",
            dataVizBorderColor: "var(--color-purple-300)",
            icon: <Dumbbell />
        },
        presentes: {
            dataVizColor: "var(--color-yellow-400)",
            dataVizBorderColor: "var(--color-yellow-300)",
            icon: <Gift />
        },
        mercadorias: {
            dataVizColor: "var(--color-yellow-600)",
            dataVizBorderColor: "var(--color-yellow-500)",
            icon: <Package />
        },
        pessoal: {
            dataVizColor: "var(--color-cyan-600)",
            dataVizBorderColor: "var(--color-cyan-500)",
            icon: <Heart />
        },
        taxas: {
            dataVizColor: "var(--color-red-400)",
            dataVizBorderColor: "var(--color-red-300)",
            icon: <Coins />
        },
        dividas: {
            dataVizColor: "var(--color-red-600)",
            dataVizBorderColor: "var(--color-red-500)",
            icon: <DiamondPercent />
        },
        assinaturas: {
            dataVizColor: "var(--color-neutral-600)",
            dataVizBorderColor: "var(--color-neutral-500)",
            icon: <TvMinimalPlay />
        },
        casa: {
            dataVizColor: "var(--color-blue-400)",
            dataVizBorderColor: "var(--color-blue-300)",
            icon: <House />
        },
        vestuário: {
            dataVizColor: "var(--color-purple-600)",
            dataVizBorderColor: "var(--color-purple-500)",
            icon: <Shirt />
        },
        saúde: {
            dataVizColor: "var(--color-cyan-400)",
            dataVizBorderColor: "var(--color-cyan-300)",
            icon: <Cross />
        },
        lazer:{
            dataVizColor: "var(--color-pink-400)",
            dataVizBorderColor: "var(--color-pink-300)",
            icon: <PartyPopper />
        },
        estudos: {
            dataVizColor: "var(--color-purple-400)",
            dataVizBorderColor: "var(--color-purple-300)",
            icon: <GraduationCap />
        },
        restaurantes: {
            dataVizColor: "var(--color-green-400)",
            dataVizBorderColor: "var(--color-green-300)",
            icon: <Pizza />
        },
        pet: {
            dataVizColor: "var(--color-orange-400)",
            dataVizBorderColor: "var(--color-orange-300)",
            icon: <PawPrint />
        },
        doação:{
            dataVizColor: "var(--color-neutral-400)",
            dataVizBorderColor: "var(--color-neutral-300)",
            icon: <HeartHandshake />
        },
        
        //gain icons
        salário: {
            dataVizColor: "var(--color-green-600)",
            dataVizBorderColor: "var(--color-green-500)",
            icon: <Banknote />
        },
        investimentos: {
            dataVizColor: "var(--color-blue-600)",
            dataVizBorderColor: "var(--color-blue-500)",
            icon: <PiggyBank />
        },
        cashback: {
            dataVizColor: "var(--color-green-400)",
            dataVizBorderColor: "var(--color-green-300)",
            icon: <HandCoins />
        },
        "receitas variáveis": {
            dataVizColor: "var(--color-blue-400)",
            dataVizBorderColor: "var(--color-blue-300)",
            icon: <BadgePercent />
            },
        transferências: {
            dataVizColor: "var(--color-neutral-600)",
            dataVizBorderColor: "var(--color-neutral-500)",
            icon: <ArrowRightLeft />
        }
    }

    return (
        icons[category.toLowerCase()]
    ) || null;
}