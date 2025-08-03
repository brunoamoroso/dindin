import { Link, NavLink } from "react-router-dom";
import { IconButton } from "./ui/icon-button";
import { Goal, LayoutGrid, Plus } from "lucide-react";
import { useDashboardContext } from "@/context/DashboardContext";

export default function BottomNav(){
    const {coinSelected} = useDashboardContext();

    const navButtons = [
        {
            link: "/dashboard",
            icon: <LayoutGrid />,
            title: "Início"
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
        }
    ];

    return(
        <div className="flex flex-1 fixed bottom-10 items-center w-dvw">
            <div className="flex justify-between items-center px-8 w-full mx-6 bg-neutral-950/75 border border-outline rounded-full backdrop-blur-lg">
                {navButtons.map((obj, i) => {
                    if( i === 1 && coinSelected === "global" ) return;
                    if(i === 1){
                        return(
                        <Link to={obj.link} key={i}>
                            <IconButton className="w-14 h-14">
                                {obj.icon}
                            </IconButton>
                        </Link>
                        );
                    }

                    return(
                        <NavLink to={obj.link} key={i} className={({isActive}) => `flex flex-col items-center gap-1 py-5 px-10 ${isActive ? " text-primary" : "text-content-primary"}`}>
                            {obj.icon}
                            <span className="label-small">{obj.title}</span>
                        </NavLink>
                    )
                })}
            </div>
        </div>
    )
}