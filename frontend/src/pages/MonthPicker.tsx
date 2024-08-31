import { MouseEvent, useState } from "react";
import { Outlet } from "react-router-dom";
import DatePicker, {registerLocale} from 'react-datepicker';
import { IconButton } from "@/components/ui/icon-button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {ptBR} from 'date-fns/locale';

export default function MonthPicker() {
  const handleOutsideClose = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    setShowDatePicker(false);
  };

  const handleMonthClick = (date: Date | null) => {
    if(date === null){date = new Date()}
    setSelectedDate(date)
    setShowDatePicker(false);
  };

  const startDate = new Date();
  startDate.setDate(1);
  registerLocale("ptBR", ptBR);

  const [selectedDate, setSelectedDate] = useState<Date>(startDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <>
    {showDatePicker && (
      <div className="fixed bg-neutral-950/95 h-dvh w-full flex container flex items-center justify-center z-50" onClick={handleOutsideClose}>
        <DatePicker
          locale={"ptBR"}
          selected={selectedDate} 
          dateFormat="MM/yyyy" 
          showMonthYearPicker 
          showFullMonthYearPicker
          onChange={handleMonthClick}
          inline
          renderCustomHeader={({
            date,
            decreaseYear,
            increaseYear
          }) => {return (
            <div className="flex items-center justify-between py-3 gap-6">
              <IconButton variant={"ghost"} onClick={decreaseYear}>
                <ChevronLeft />
              </IconButton>
              <span className="label-large text-title">
                {date.getFullYear()}
              </span>
              <IconButton variant={"ghost"} onClick={increaseYear}>
                <ChevronRight />
              </IconButton>
            </div>
          )}}
          renderMonthContent={(_month, _shortMonth, longMonth) => {
            return(
              <div className="flex">
                {longMonth.charAt(0).toLocaleUpperCase() + longMonth.slice(1)}
              </div>
            )
          }}
          />
      </div>
    )}
      <div className="overflow-hidden">
        <Outlet context={{selectedDate, setShowDatePicker}}/>
      </div>
    </>
  );
}

