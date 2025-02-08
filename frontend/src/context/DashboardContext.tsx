import { useUserDefaultCoin } from "@/hooks/useUserDefaultCoin";
import { CoinType } from "@/types/CoinTypes";
import { SetStateAction, useState } from "react";
import { Outlet } from "react-router-dom";

export interface DashboardContextType {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
  userDefaultCoin: CoinType;
  isErrorDefaultCoin: boolean;
  isLoadingDefaultCoin: boolean;
}

export function DashboardContext() {
  const {data: userDefaultCoin, isError: isErrorDefaultCoin, isLoading: isLoadingDefaultCoin} = useUserDefaultCoin();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <>
      <Outlet context={{ selectedDate, setSelectedDate, userDefaultCoin, isErrorDefaultCoin, isLoadingDefaultCoin }} />
    </>
  );
}
