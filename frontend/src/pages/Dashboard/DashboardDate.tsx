import { MouseEvent, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import { IconButton } from "@/components/ui/icon-button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TransactionDate() {
  const navigate = useNavigate();

  const handleOutsideClose = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    navigate("/dashboard");
  };

  const handleMonthClick = (date: Date | null) => {
    setDate(date)
    navigate("/dashboard");
  };

  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <>
      <div className="fixed bg-neutral-950/95 h-dvh w-full flex container flex items-center justify-center" onClick={handleOutsideClose}>
        <DatePicker
          selected={date} 
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
                {longMonth}
              </div>
            )
          }}
          />
      </div>
      <div className="overflow-hidden">
        <Outlet />
      </div>
    </>
  );
}
