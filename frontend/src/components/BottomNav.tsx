import { Link, NavLink } from "react-router-dom";
import { IconButton } from "./ui/icon-button";
import { CircleUserRound, Goal, LayoutGrid, Plus, Wallet } from "lucide-react";

export default function BottomNav(){
    const navButtons = [
        {
            link: "/dashboard",
            icon: <LayoutGrid />,
            title: "Início"
        },
        {
            link: "/wallet",
            icon: <Wallet />,
            title: "Carteira"
        },
        {
            link: "/transaction",
            icon: <Plus strokeWidth={3}/>,
            title: "+"
        },
        {
            link: "/goals",
            icon: <Goal />,
            title: "Objetivos"
        },
        {
            link: "/profile/view",
            icon: <CircleUserRound />,
            title: "Perfil"
        }
    ];

    return(
        <div className="flex justify-between items-center px-4 fixed bottom-0 w-dvw bg-container0">
            {navButtons.map((obj, i) => {
                if(i === 2){
                    return(
                    <Link to={obj.link} key={i}>
                        <IconButton className="w-14 h-14">
                            {obj.icon}
                        </IconButton>
                    </Link>
                    );
                }

                return(
                    <NavLink to={obj.link} key={i} className={"flex flex-col items-center gap-1 py-5"}>
                        {obj.icon}
                        <span className="label-small text-title">{obj.title}</span>
                    </NavLink>
                )
            })}
        </div>
    )
}