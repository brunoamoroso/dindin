import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { currencyFormat } from "@/utils/currency-format";
import BottomNav from "@/components/BottomNav";
import LastTransactions from "./LastTransactions";
import ExpenseByCatChart from "./ExpenseByCatChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import { useOutletContext } from "react-router-dom";
import { MonthPicker } from "../MonthPicker";
import { AvatarDashboard } from "@/components/AvatarDashboard";
import { CoinSelector } from "@/components/CoinSelector";
import { DashboardContextType } from "@/context/DashboardContext";
import { getAllTransactionsByMonth } from "@/api/transactionService";

export default function Dashboard() {
  const { selectedDate, userDefaultCoin } = useOutletContext<DashboardContextType>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-data", selectedDate],
    queryFn: () => getAllTransactionsByMonth(selectedDate.toISOString()),
  });

  return (
    <div className="min-h-dvh bg-surface flex flex-col text-body">
      <div className="container flex flex-1 flex-col gap-6 pb-32">
        <div className="relative flex items-center justify-between py-6">
          <CoinSelector />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <MonthPicker />
          </div>
          <AvatarDashboard />
        </div>
        {isError && (
          <>
            <h1 className="text-title headline-small">
              Tivemos um problema ao carregar os dados
            </h1>
            <span className="text-body body-large">
              Pedimos desculpa pela inconveniência, mas não conseguimos carregar
              os seus dados.
            </span>
          </>
        )}
        {!isError && (
          <div className="flex gap-6">
            <div className="flex flex-col flex-1 bg-container2 p-6 rounded-lg">
              <span className="label-small text-title">Você ganhou</span>
              {isLoading && <Skeleton className="w-full h-4 rounded-xl" />}
              {!isLoading && data && (
                <span className="title-medium text-positive">
                  {currencyFormat(data.sumAllAmountGained, userDefaultCoin?.code)}
                </span>
              )}
            </div>
            <div className="flex flex-col flex-1 bg-container2 p-6 rounded-lg">
              <span className="label-small text-title">Você gastou</span>
              {isLoading && <Skeleton className="w-full h-4 rounded-xl" />}
              {!isLoading && data && (
                <span className="title-medium text-negative">
                  {currencyFormat(data.sumAllAmountExpend, userDefaultCoin?.code)}
                </span>
              )}
            </div>
          </div>
        )}

        {!isLoading && data && !isError && (
          <LastTransactions data={data.allTransactionsByMonth} />
        )}

        {isLoading && (
          <div className="flex flex-col bg-container2 rounded-lg py-4">
            <h1 className="title-small text-title px-6 pb-1">
              Últimas Transações
            </h1>
            <div className="px-2 max-h-44 overflow-hidden">
              <div className="flex flex-col gap-6 px-4 pt-3">
                {Array.from({ length: 3 }).map((_x, i) => {
                  return (
                    <div key={i} className="flex flex-col gap-4">
                      <Skeleton className="w-full h-12 rounded" />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pt-2 px-2 border-t border-outline">
              <Button variant={"ghost"}>Ver todas as transações</Button>
            </div>
          </div>
        )}

        {!isLoading && data && !isError && (
          <ExpenseByCatChart data={data.allTransactionsByMonth} />
        )}
        {isLoading && (
          <div className="bg-container2 rounded-lg py-4">
            <h1 className="title-small text-title px-6">Gasto por Categoria</h1>
            <div className="px-6 pt-4">
              <Skeleton className="w-full rounded-lg h-56 mb-10" />
              <div className="flex flex-col gap-6">
                {Array.from({ length: 3 }).map((_x, i) => {
                  return (
                    <div key={i} className="flex flex-col gap-4">
                      <Skeleton className="w-full h-14 rounded" />
                      <Separator />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
