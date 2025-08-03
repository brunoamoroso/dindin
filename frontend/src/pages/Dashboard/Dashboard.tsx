import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { currencyFormat } from "@/utils/currency-format";
import BottomNav from "@/components/BottomNav";
import LastTransactions from "./LastTransactions";
import ExpenseByCatChart from "./ExpenseByCatChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useOutletContext } from "react-router-dom";
import { MonthPicker } from "../MonthPicker";
import { AvatarDashboard } from "@/components/AvatarDashboard";
import { CoinSelector } from "@/components/CoinSelector";
import { DashboardContextType } from "@/context/DashboardContext";
import { getAllTransactionsByMonth } from "@/api/transactionService";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  const { selectedDate, userDefaultCoin } = useOutletContext<DashboardContextType>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-data", selectedDate],
    queryFn: () => getAllTransactionsByMonth(selectedDate.toISOString()),
  });

  return (
    <div className="min-h-dvh bg-surface flex flex-col text-content-secondary">
      <div className="flex flex-1 flex-col gap-5 pb-32">
        <div className="relative flex items-center justify-start py-6 mx-6">
          {/* <CoinSelector /> */}
          <AvatarDashboard />
        </div>
        <div className="flex flex-1 justify-center mx-6">
          <MonthPicker />
        </div>
        {isError && (
          <>
            <h1 className="text-content-primary headline-small">
              Tivemos um problema ao carregar os dados
            </h1>
            <span className="text-content-secondary body-large">
              Pedimos desculpa pela inconveniência, mas não conseguimos carregar
              os seus dados.
            </span>
          </>
        )}
        {!isError && (
          <div className="flex gap-6 mx-6 mt-2">
            <div className="flex flex-col flex-1">
              <span className="label-small text-content-primary">Recebeu</span>
              {isLoading && <Skeleton className="w-full h-4 rounded-xl" />}
              {!isLoading && data && (
                <span className="title-medium text-positive">
                  {currencyFormat(data.sumAllAmountGained, userDefaultCoin?.code)}
                </span>
              )}
            </div>
            <div className="flex flex-col flex-1 text-right">
              <span className="label-small text-content-primary">Gastou</span>
              {isLoading && <Skeleton className="w-full h-4 rounded-xl" />}
              {!isLoading && data && (
                <span className="title-medium text-critical">
                  {currencyFormat(data.sumAllAmountExpend, userDefaultCoin?.code)}
                </span>
              )}
            </div>
          </div>
        )}
        
        <Separator />
        
        {!isLoading && data && !isError && (
          <LastTransactions data={data.allTransactionsByMonth} />
        )}

        {isLoading && (
          <div className="flex flex-col bg-layer-tertiary rounded-lg py-4">
            <h1 className="title-small text-content-primary px-6 pb-1">
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
          <div className="bg-layer-tertiary rounded-lg py-4">
            <h1 className="title-small text-content-primary px-6">Gasto por Categoria</h1>
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
