import { ArrowRightLeft, Backpack, BadgePercent, Banknote, Car, Coins, Cross, DiamondPercent, Dumbbell, Gift, GraduationCap, HandCoins, Heart, HeartHandshake, House, Package, PartyPopper, PawPrint, PiggyBank, Pizza, Shirt, ShoppingCart, TvMinimalPlay } from "lucide-react";

export default function getCategoryIcon(category: string): {dataVizColor: string, dataVizBorderColor: string, icon: JSX.Element}{
    const icons: Record<string, {dataVizColor: string, dataVizBorderColor: string, icon: JSX.Element}> = {
        //expenses icons
        transporte: {
            dataVizColor: "#bf5708",
            dataVizBorderColor: "#dd6b20",
            icon: <Car />
        },
        mantimentos: {
            dataVizColor: "#188dbe",
            dataVizBorderColor: "#04a3df",
            icon: <ShoppingCart />
        },
        viagens: {
            dataVizColor: "#ba50de",
            dataVizBorderColor: "#d36ef6",
            icon: <Backpack />
        },
        esportes: {
            dataVizColor: "#9396fe",
            dataVizBorderColor: "#a8acfa",
            icon: <Dumbbell />
        },
        presentes: {
            dataVizColor: "#ecb052",
            dataVizBorderColor: "#ebbb74",
            icon: <Gift />
        },
        mercadorias: {
            dataVizColor: "#cb8c13",
            dataVizBorderColor: "#e29f2b",
            icon: <Package />
        },
        pessoal: {
            dataVizColor: "#09908b",
            dataVizBorderColor: "#10afa9",
            icon: <Heart />
        },
        taxas: {
            dataVizColor: "#fd5d62",
            dataVizBorderColor: "#fe9390",
            icon: <Coins />
        },
        dividas: {
            dataVizColor: "#ca2a39",
            dataVizBorderColor: "#f13747",
            icon: <DiamondPercent />
        },
        assinaturas: {
            dataVizColor: "#55626d",
            dataVizBorderColor: "#74808c",
            icon: <TvMinimalPlay />
        },
        casa: {
            dataVizColor: "#4fb6e9",
            dataVizBorderColor: "#71ccfb",
            icon: <House />
        },
        vestuário: {
            dataVizColor: "#6962e7",
            dataVizBorderColor: "#7d7cf7",
            icon: <Shirt />
        },
        saúde: {
            dataVizColor: "#1dc7c0",
            dataVizBorderColor: "#49d8d1",
            icon: <Cross />
        },
        lazer:{
            dataVizColor: "#de8afc",
            dataVizBorderColor: "#e2a5f7",
            icon: <PartyPopper />
        },
        estudos: {
            dataVizColor: "#11904c",
            dataVizBorderColor: "#11b761",
            icon: <GraduationCap />
        },
        restaurantes: {
            dataVizColor: "#24cc70",
            dataVizBorderColor: "#4fe187",
            icon: <Pizza />
        },
        pet: {
            dataVizColor: "#24cc70",
            dataVizBorderColor: "#4fe187",
            icon: <PawPrint />
        },
        doação:{
            dataVizColor: "#c2410c",
            dataVizBorderColor: "#f97316",
            icon: <HeartHandshake />
        },
        
        //gain icons
        salário: {
            dataVizColor: "#ca2a39",
            dataVizBorderColor: "#ca2a39",
            icon: <Banknote />
        },
        investimentos: {
            dataVizColor: "#ca2a39",
            dataVizBorderColor: "#ca2a39",
            icon: <PiggyBank />
        },
        cashback: {
            dataVizColor: "#ca2a39",
            dataVizBorderColor: "#ca2a39",
            icon: <HandCoins />
        },
        "receitas variáveis": {
            dataVizColor: "#ca2a39",
            dataVizBorderColor: "#ca2a39",
                icon: <BadgePercent />
            },
        transferências: {
            dataVizColor: "#ca2a39",
            dataVizBorderColor: "#ca2a39",
            icon: <ArrowRightLeft />
        }
    }

    return (
        icons[category.toLowerCase()]
    ) || null;
}