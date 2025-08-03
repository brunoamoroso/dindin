import { CoinType } from "@/types/CoinTypes";
import { SetStateAction, useState } from "react";
import { Outlet } from "react-router-dom";

export interface DashboardContextType {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
  coinSelected?: "global" | CoinType;
  setCoinSelected?: React.Dispatch<SetStateAction<"global" | CoinType>>;
}

export function DashboardContext() {
  const [coinSelected, setCoinSelected] = useState<"global" | CoinType>("global");

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <>
      <Outlet context={{ selectedDate, setSelectedDate, coinSelected, setCoinSelected }} />
    </>
  );
}
