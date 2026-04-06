import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ArrowRightLeft, Gauge, LayoutGrid, Plus } from "lucide-react";
import { useDashboardContext } from "@/context/DashboardContext";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const { coinSelected } = useDashboardContext();
  const navigate = useNavigate();
  const location = useLocation();

  const navButtons = [
    {
      link: "/dashboard",
      icon: <LayoutGrid />,
      title: "Início",
      end: true,
      growOnActive: false,
    },
    {
      link: "/dashboard/transactions",
      icon: <ArrowRightLeft />,
      title: "Transações",
      growOnActive: false,
    },
    {
      link: "/dashboard/limits",
      icon: <Gauge />,
      title: "Orçamento",
      growOnActive: true,
    },
  ];

  const fabConfigs = [
    {
      match: (path: string) => path.startsWith("/dashboard/transactions"),
      target: "/transaction",
    },
    {
      match: (path: string) => path.startsWith("/dashboard/limits"),
      target: "/limits/create",
    },
  ];

  const fabTarget = fabConfigs.find((config) =>
    config.match(location.pathname)
  )?.target;

  const shouldShowFab = coinSelected !== "global" && !!fabTarget;

  const [isFabMounted, setIsFabMounted] = useState(shouldShowFab);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if(shouldShowFab){
        setIsFabMounted(true);
        setIsExiting(false);
    }else if (isFabMounted){
        setIsExiting(true);
    }

  }, [shouldShowFab, isFabMounted]);

  return (
    <div className="flex flex-1 fixed h-14 bottom-10 items-center w-dvw">
      <div className="flex flex-1 items-center mx-4 gap-6">
        <div className="flex items-center px-1.5 py-1.5 w-full bg-neutral-950/75 border border-outline rounded-full backdrop-blur-lg transition-[width] duration-600">
          {navButtons.map((obj, i) => {
            if (i === 1 && coinSelected === "global") return;
            return (
              <NavLink
                to={obj.link}
                end={obj.end}
                key={i}
                className={({ isActive }) =>
                  cn(
                    "flex w-auto basis-0 items-center justify-center gap-2 py-2.5 px-3 rounded-full transition-[background-color,color, flex] duration-300",
                    isActive && obj.growOnActive ? "flex-[2.3]" : "flex-1",
                    isActive
                      ? "text-primary bg-state-hover"
                      : "text-content-primary"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {obj.icon}
                    {isActive && (
                      <span className="label-small">{obj.title}</span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
        {isFabMounted && (
        <div className={cn("overflow-hidden flex justify-end transition-[width] duration-200", isExiting ? "w-0" : "w-18")}>
            <IconButton
                className={cn(
                "h-14 w-18",
                fabTarget
                    ? "animate-add-bottom-nav"
                    : "animate-remove-add-bottom-nav"
                )}
                onAnimationEnd={() => {
                    if(isExiting){
                        setIsFabMounted(false);
                    }
                }}
                onClick={() => fabTarget && navigate(fabTarget)}
            >
                <Plus size={18} strokeWidth={3} />
            </IconButton>
            </div>
        )}
      </div>
    </div>
  );
}
