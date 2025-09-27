import { SetStateAction, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { useDashboardContext } from "./DashboardContext";

export interface LimitDataType{
  id?: string;
  amount: number;
  selectedDate: Date;
  coinSelected: string;
  category_id: string;
  category: string;
}

export interface LimitContextType {
  limitData: LimitDataType;
  setLimitData: React.Dispatch<SetStateAction<LimitDataType>>;
}

export function LimitContext() {
    const {coinSelected, selectedDate} = useDashboardContext();

    const [limitData, setLimitData] = useState<LimitDataType>({
      amount: 0,
      selectedDate: selectedDate,
      coinSelected: coinSelected,
      category_id: "",
      category: "",
    });

  return (
    <>
      <Outlet context={{ limitData, setLimitData }} />
    </>
  );
}

export function useLimitContext(): LimitContextType {
  const context = useOutletContext<LimitContextType>();
  if (!context) {
    throw new Error("useLimitContext must be used within a LimitContext");
  }
  return context;
}
