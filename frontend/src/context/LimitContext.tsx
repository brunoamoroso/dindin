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
  resetLimitData: () => void;
}

export function LimitContext() {
    const {coinSelected, selectedDate} = useDashboardContext();

    const initialState: LimitDataType = {
        amount: 0,
      selectedDate: selectedDate,
      coinSelected: coinSelected,
      category_id: "",
      category: "",
    }

    const [limitData, setLimitData] = useState<LimitDataType>({...initialState});

    const resetLimitData = () => setLimitData({...initialState});

  return (
    <>
      <Outlet context={{ limitData, setLimitData, resetLimitData }} />
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
