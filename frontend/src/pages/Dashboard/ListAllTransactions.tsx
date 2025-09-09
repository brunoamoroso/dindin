import AppBar from "@/components/AppBar";
import { useQuery } from "@tanstack/react-query";
import getCategoryIcon from "@/utils/get-category-icon";
import { currencyFormat } from "@/utils/currency-format";
import { Separator } from "@/components/ui/separator";
import ActionsTransaction from "@/components/ActionsTransaction";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDashboardContext } from "@/context/DashboardContext";
import { MonthPicker } from "../MonthPicker";
import { getAllTransactionsByMonth } from "@/api/transactionService";
import { Skeleton } from "@/components/ui/skeleton";
import { DataAllTransactionsType } from "@/types/TransactionTypes";

export function ListAllTransactions() {
  const { selectedDate, setSelectedDate, coinSelected } = useDashboardContext();

  const { dateParams } = useParams();

  useEffect(() => {
    if (dateParams !== undefined) {
      setSelectedDate(new Date(dateParams));
    }
  }, [dateParams, setSelectedDate]);

  const { data, isLoading } = useQuery<DataAllTransactionsType>({
    queryKey: ["listalltransactions-data", selectedDate],
    queryFn: () => getAllTransactionsByMonth(selectedDate.toISOString(), coinSelected),
  });

  return (
    <div className="min-h-dvh bg-surface flex flex-col text-content-secondary gap-6">
      <AppBar title="Todas as Transações" pageBack="dashboard" />

      <div className="container flex gap-6 items-center justify-center">
        <MonthPicker  />
      </div>

      <div className="container flex flex-col flex-1 bg-layer-tertiary rounded-t-lg py-10 px-6">
        {isLoading && (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 mb-4 flex" />
          ))
        )}
        {!isLoading && data?.allTransactionsByMonth.length === 0 && (
          <span className="body-large">Não houveram transações neste mês.</span>
        )}
        {!isLoading && data?.allTransactionsByMonth.map((d, i, arr) => (
          <div key={i} className="flex flex-col">
            <div
              key={i}
              className="flex px-4 py-3.5 gap-4 justify-between items-center"
            >
              <div className="flex flex-1 gap-4 items-center">
                <div>{getCategoryIcon(d.category).icon}</div>
                <div className="flex flex-col">
                  <span className="label-large text-content-primary">{d.category}</span>
                  <span className="body-medium text-content-subtle">
                    {new Date(d.date).toLocaleDateString()}
                    {d.install_number && " - " + d.install_number + " / " + d.installments}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`label-medium ${
                    d.type === "gain" ? "text-content-positive" : "text-content-negative"
                  }`}
                >
                  {currencyFormat(d.amount)}
                  <span className="text-content-secondary">{" " + d.code}</span>
                </span>
                <span className="body-small text-content-subtle">{d.account}</span>
              </div>
              <ActionsTransaction
                id={d.id!}
                desc={d.description}
                date={d.date}
                amount={d.amount}
                installments={d.installments}
              />
            </div>
            {i !== arr.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  );
}
