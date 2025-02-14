import AppBar from "@/components/AppBar";
import { useQuery } from "@tanstack/react-query";
import * as Types from "@/types/TransactionTypes";
import api from "@/api/api";
import getCategoryIcon from "@/utils/get-category-icon";
import { currencyFormat } from "@/utils/currency-format";
import { Separator } from "@/components/ui/separator";
import ActionsTransaction from "@/components/ActionsTransaction";
import { useOutletContext, useParams } from "react-router-dom";
import { useEffect } from "react";
import { DashboardContextType } from "@/context/DashboardContext";
import { MonthPicker } from "../MonthPicker";
import { CoinSelector } from "@/components/CoinSelector";

export function ListAllTransactions() {
  const { selectedDate, setSelectedDate } = useOutletContext<DashboardContextType>();

  const { dateParams } = useParams();

  useEffect(() => {
    if (dateParams !== undefined) {
      setSelectedDate(new Date(dateParams));
    }
  }, [dateParams, setSelectedDate]);

  const { data } = useQuery<Types.DataAllTransactionsType>({
    queryKey: ["listalltransactions-data", selectedDate],
    queryFn: () => api.getAllTransactionsByMonth(selectedDate.toISOString()),
  });

  return (
    <div className="min-h-dvh bg-surface flex flex-col text-body gap-6">
      <AppBar title="Todas as Transações" pageBack="dashboard" />

      <div className="container flex gap-6 items-center justify-between">
        <CoinSelector />
        <MonthPicker  />
      </div>

      <div className="container flex flex-col flex-1 bg-container2 rounded-t-lg py-10">
        {data?.allTransactionsByMonth.length === 0 && (
          <span className="body-large">Não houveram transações neste mês.</span>
        )}
        {data?.allTransactionsByMonth.map((d, i, arr) => (
          <div key={i} className="flex flex-col">
            <div
              key={i}
              className="flex px-4 py-3.5 gap-4 justify-between items-center"
            >
              <div className="flex flex-1 gap-4 items-center">
                <div>{getCategoryIcon(d.category).icon}</div>
                <div className="flex flex-col">
                  <span className="label-large text-title">{d.category}</span>
                  <span className="body-medium text-subtle">
                    {new Date(d.date).toLocaleDateString()}
                    {d.install_number && " - " + d.install_number + " / " + d.installments}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`label-medium ${
                    d.type === "gain" ? "text-positive" : "text-negative"
                  }`}
                >
                  {currencyFormat(d.amount)}
                </span>
                <span className="body-small text-subtle">{d.account}</span>
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
