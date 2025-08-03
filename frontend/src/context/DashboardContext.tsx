import { SetStateAction, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

export interface DashboardContextType {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
  coinSelected: "global" | string;
  setCoinSelected: React.Dispatch<SetStateAction<"global" | string>>;
}

export function DashboardContext() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [coinSelected, setCoinSelected] = useState<"global" | string>("global");
  return (
    <>
      <Outlet context={{ selectedDate, setSelectedDate, coinSelected, setCoinSelected }} />
    </>
  );
}

export function useDashboardContext(): DashboardContextType {
  const context = useOutletContext<DashboardContextType>();
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardContext");
  }
  return context;
}
