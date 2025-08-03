import DatePicker, { registerLocale } from "react-datepicker";
import { IconButton } from "@/components/ui/icon-button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { useOutletContext } from "react-router-dom";
import { DashboardContextType } from "@/context/DashboardContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function MonthPicker() {
  const { selectedDate, setSelectedDate } =
    useOutletContext<DashboardContextType>();
  const [open, setOpen] = useState(false);

  const monthLong = selectedDate.toLocaleDateString("pt-BR", { month: "long" });

  const handleMonthClick = (date: Date | null) => {
    if (date === null) {
      date = new Date();
    }
    setSelectedDate(date);
    setOpen(false);
  };

  const handleDecreaseMonth = () => {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() - 1);
    setSelectedDate(date);
  };

  const handleIncreaseMonth = () => {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() + 1);
    setSelectedDate(date);
  };

  const startDate = new Date();
  startDate.setDate(1);
  registerLocale("ptBR", ptBR);

  return (
    <div className="flex gap-6">
      <IconButton variant={"ghost"} onClick={handleDecreaseMonth}><ChevronLeft /></IconButton>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"} size='sm'>
            {monthLong.charAt(0).toUpperCase() + monthLong.slice(1)}
            {selectedDate.getFullYear() < new Date().getFullYear() && (", " + selectedDate.getFullYear())}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="w-auto bg-transparent border-none"
          showCloseButton={false}
        >
          <DialogTitle className="hidden">Calendário</DialogTitle>
          <DialogDescription className="hidden">Escolha um mês</DialogDescription>
          <DatePicker
            locale={"ptBR"}
            selected={selectedDate}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            showFullMonthYearPicker
            onChange={handleMonthClick}
            inline
            renderCustomHeader={({ date, decreaseYear, increaseYear }) => {
              return (
                <div className="flex items-center justify-between py-3 gap-6">
                  <IconButton variant={"ghost"} onClick={decreaseYear}>
                    <ChevronLeft />
                  </IconButton>
                  <span className="label-large text-content-primary">
                    {date.getFullYear()}
                  </span>
                  <IconButton variant={"ghost"} onClick={increaseYear}>
                    <ChevronRight />
                  </IconButton>
                </div>
              );
            }}
            renderMonthContent={(_month, _shortMonth, longMonth) => {
              return (
                <div className="flex">
                  {longMonth.charAt(0).toLocaleUpperCase() + longMonth.slice(1)}
                </div>
              );
            }}
          />
        </DialogContent>
      </Dialog>
      <IconButton variant={"ghost"} onClick={handleIncreaseMonth}><ChevronRight /></IconButton>
    </div>
  );
}
