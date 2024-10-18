import { Calendar } from "@/components/ui/calendar";
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { MouseEvent, useState } from "react";
import { Outlet } from "react-router-dom";

export default function TransactionDate() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {contextTransactionData, setContextTransactionData } = useTransactionsContext();

  const handleOutsideClose = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    setShowDatePicker(false);
  };

  const handleDayClick = (day: Date) => {
    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      date: {
        chip: "otherDate",
        value: day
      }
    }));
    setShowDatePicker(false);
  };

  return (
    <>
      {showDatePicker && (
        <div
          className="fixed bg-neutral-950/95 h-dvh w-full flex container flex items-center justify-center"
          onClick={handleOutsideClose}
        >
          <Calendar
            selected={contextTransactionData.date.value}
            onDayClick={handleDayClick}
          />
        </div>
      )}
      <div className={showDatePicker ? "overflow-hidden" : ""}>
        <Outlet context={{showDatePicker, setShowDatePicker}}/>
      </div>
    </>
  );
}
