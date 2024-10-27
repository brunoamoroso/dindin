import { SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";

type ContextType = {selectedDate: Date, setSelectedDate: React.Dispatch<SetStateAction<Date>>, showDatePicker: boolean; setShowDatePicker: React.Dispatch<SetStateAction<boolean>>};

export function useDatePicker() {
  return useOutletContext<ContextType>();
}
