import { SetStateAction, useState } from "react";
import { useOutletContext } from "react-router-dom";

type ContextType = {selectedDate: Date, setSelectedDate: React.Dispatch<SetStateAction<Date>>, setShowDatePicker: React.Dispatch<SetStateAction<boolean>>};

export function useMonthPicker() {
  return useOutletContext<ContextType>();
}
