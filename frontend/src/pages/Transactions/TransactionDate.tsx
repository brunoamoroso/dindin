import { Calendar } from "@/components/ui/calendar";
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { Outlet, useNavigate } from "react-router-dom";

export default function TransactionDate() {
  const navigate = useNavigate();
  const {setContextDate, setOtherDateChipPressed} = useTransactionsContext();

  const handleDayClick = (day: Date) => {
    setContextDate(day);
    setOtherDateChipPressed(true);
    navigate("/transaction");
  }

  return (
    <div className="h-dvh overflow-hidden">  
      <div className="fixed bg-neutral-950/95 h-dvh w-full flex" onClick={() => {navigate("/transaction")}}>
          <div className="container flex items-center justify-center">
              <Calendar onDayClick={handleDayClick}/>
          </div>
      </div>
      <div className="overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
