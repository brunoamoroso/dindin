import { SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";

type ContextType = {selectedDate: Date, setShowDatePicker: React.Dispatch<SetStateAction<boolean>>};

export function useMonthPicker() {
  return useOutletContext<ContextType>();
}
