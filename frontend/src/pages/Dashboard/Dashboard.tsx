import BottomNav from "@/components/BottomNav";
import { MonthPicker } from "../MonthPicker";
import { AvatarDashboard } from "@/components/AvatarDashboard";
import { CoinSelector } from "@/components/CoinSelector";
import { useDashboardContext } from "@/context/DashboardContext";
import { RemoveCoin } from "@/components/RemoveCoin";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  const {coinSelected, selectedDate} = useDashboardContext();

  return (
    <div className="min-h-dvh bg-surface flex flex-col text-content-secondary">
      <div className="flex flex-1 flex-col gap-5 pb-40">
        <div className="flex items-center justify-between py-6 mx-6">
          <AvatarDashboard />
          <RemoveCoin />
        </div>

        <CoinSelector />

        <div className="flex mx-6 mb-3">
          <MonthPicker />
        </div>

        <Outlet context={{ coinSelected, selectedDate }} />
      </div>
      {coinSelected !== "global" && <BottomNav />}
    </div>
  );
}
