import { Link, NavLink } from "react-router-dom";
import { IconButton } from "./ui/icon-button";
import { Goal, LayoutGrid, Plus } from "lucide-react";

export default function BottomNav(){
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
        <div className="flex justify-between items-center px-8 fixed bottom-0 w-dvw bg-container0">
            {navButtons.map((obj, i) => {
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
                    <NavLink to={obj.link} key={i} className={({isActive}) => `flex flex-col items-center gap-1 py-5 px-10 ${isActive ? " text-primary" : "text-title"}`}>
                        {obj.icon}
                        <span className="label-small">{obj.title}</span>
                    </NavLink>
                )
            })}
        </div>
    )
}