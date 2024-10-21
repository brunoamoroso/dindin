import AppBar from "@/components/AppBar";
import { IconButton } from "@/components/ui/icon-button";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as Types from "@/types/TransactionTypes";
import api from "@/api/api";
import { useMonthPicker } from "@/hooks/useMonthPicker";
import getCategoryIcon from "@/utils/get-category-icon";
import { currencyFormat } from "@/utils/currency-format";
import { Separator } from "@/components/ui/separator";
import ActionsTransaction from "@/components/ActionsTransaction";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

interface ListAllTransactionsProps {}

export default function ListAllTransactions({}: ListAllTransactionsProps) {
  const { selectedDate, setSelectedDate, setShowDatePicker } = useMonthPicker();
  const {dateParams} = useParams();
  useEffect(() => {
    console.log(dateParams);
    if(dateParams !== undefined){
      setSelectedDate(new Date(dateParams));
    }
  }, [dateParams])

  console.log(selectedDate);
  const monthLong = selectedDate.toLocaleDateString("pt-BR", { month: "long" });



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

  const { data, isLoading, isError } = useQuery<Types.DataAllTransactionsType>({
    queryKey: ["listalltransactions-data", selectedDate],
    queryFn: () => api.getAllTransactionsByMonth(selectedDate.toISOString()),
  });

  return (
    <div className="min-h-dvh bg-surface flex flex-col text-body gap-6">
      <AppBar title="Todas as Transações" />

      <div className="flex gap-6 items-center justify-center">
        <IconButton
          variant={"ghost"}
          className="text-primary"
          onClick={handleDecreaseMonth}
        >
          <ChevronLeft />
        </IconButton>
        <span
          className="label-large text-primary"
          onClick={() => setShowDatePicker(true)}
        >
          {monthLong.charAt(0).toUpperCase() + monthLong.slice(1)}
        </span>
        <IconButton
          variant={"ghost"}
          className="text-primary"
          onClick={handleIncreaseMonth}
        >
          <ChevronRight />
        </IconButton>
      </div>

      <div className="container flex flex-col flex-1 bg-container2 rounded-t-lg py-10">
        {data?.allTransactionsByMonth.length === 0 && (
          <span className="body-large">Não houveram transações neste mês.</span>
        )}
        {data?.allTransactionsByMonth.map((d, i, arr) => {
          if (arr.length - 1 === i) {
            return (
              <div
                key={i}
                className="flex px-4 py-3.5 gap-4 justify-between items-center"
              >
                <div className="flex flex-1 gap-4 items-center">
                  <div>{getCategoryIcon(d.category.desc).icon}</div>
                  <div className="flex flex-col">
                    <span className="label-large text-title">{d.desc}</span>
                    <span className="body-medium text-subtle">
                      {new Date(d.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`label-medium ${
                      d.type === "gain" ? "text-positive" : "text-negative"
                    }`}
                  >
                    {"R$" + currencyFormat(d.amount)}
                  </span>
                  <span className="body-small text-subtle">
                    {d.account.desc}
                  </span>
                </div>
                <ActionsTransaction
                  id={d.id!}
                  desc={d.desc}
                  date={d.date}
                  amount={d.amount}
                />
              </div>
            );
          } else {
            return (
              <div key={i} className="flex flex-col px-4 py-3.5 gap-4">
                <div className="flex gap-4 items-center">
                  <div className="flex flex-1 gap-4 items-center">
                    <div>{getCategoryIcon(d.category.desc).icon}</div>
                    <div className="flex flex-col flex-1">
                      <span className="label-large text-title">{d.desc}</span>
                      <span className="body-medium text-subtle">
                        {new Date(d.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`label-medium ${
                        d.type === "gain" ? "text-positive" : "text-negative"
                      }`}
                    >
                      {"R$" + currencyFormat(d.amount)}
                    </span>
                    <span className="body-small text-subtle">
                      {d.account.desc}
                    </span>
                  </div>
                  <ActionsTransaction
                    id={d.id!}
                    desc={d.desc}
                    date={d.date}
                    amount={d.amount}
                  />
                </div>
                <Separator />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
