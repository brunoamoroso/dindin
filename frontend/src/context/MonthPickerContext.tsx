import { SetStateAction, useState } from "react";
import { Outlet } from "react-router-dom";

export interface MonthPickerContextType {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
}

export function MonthPickerContext() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <>
      <Outlet context={{ selectedDate, setSelectedDate }} />
    </>
  );
}
