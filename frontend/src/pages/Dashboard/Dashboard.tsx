import BottomNav from "@/components/BottomNav";
import { MonthPicker } from "../MonthPicker";
import { AvatarDashboard } from "@/components/AvatarDashboard";
import { CoinSelector } from "@/components/CoinSelector";
import { useDashboardContext } from "@/context/DashboardContext";
import { RemoveCoin } from "@/components/RemoveCoin";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const {coinSelected, selectedDate, setSelectedDate} = useDashboardContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (coinSelected === "global") {
      navigate("/dashboard/overview", { replace: true });
    }
  }, [coinSelected, location.pathname, navigate]);

  return (
    <div className="min-h-dvh bg-surface flex flex-col text-content-secondary">
      <div className="flex flex-1 flex-col gap-5 pb-32">
        <div className="flex items-center justify-between py-6 mx-6">
          <AvatarDashboard />
          <RemoveCoin />
        </div>

        <CoinSelector />

        <div className="flex mx-6 mb-3">
          <MonthPicker />
        </div>

        <Outlet context={{ coinSelected, selectedDate, setSelectedDate }} />
      </div>
      {coinSelected !== "global" && <BottomNav />}
    </div>
  );
}
