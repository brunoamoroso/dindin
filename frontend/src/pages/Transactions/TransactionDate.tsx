import { Calendar } from "@/components/ui/calendar";
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { MouseEvent } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function TransactionDate() {
  const navigate = useNavigate();
  const { contextDate, setContextDate, setChipPressed } = useTransactionsContext();

  const handleOutsideClose = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    navigate("/transaction");
  };

  const handleDayClick = (day: Date) => {
    console.log(day);
    setContextDate(day);
    setChipPressed("otherDate");
    navigate("/transaction");
  };

  return (
    <>
      <div className="fixed bg-neutral-950/95 h-dvh w-full flex container flex items-center justify-center" onClick={handleOutsideClose}>
        <Calendar selected={contextDate} onDayClick={handleDayClick} />
      </div>
      <div className="overflow-hidden">
        <Outlet />
      </div>
    </>
  );
}
