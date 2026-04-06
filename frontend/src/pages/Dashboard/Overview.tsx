import ExpenseByCatChart from "./ExpenseByCatChart";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormat } from "@/utils/currency-format";
import { Separator } from "@/components/ui/separator";
import { useDashboardContext } from "@/context/DashboardContext";
import { ChevronRight, Gauge } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { IconButton } from "@/components/icon-button";
import { useNavigate } from "react-router-dom";
import { useBudgetData } from "@/hooks/useBudgetData";
import { useAllTransactionsByMonthData } from "@/hooks/useAllTransactionsByMonthData";
import { HeaderGainedSpent } from "./HeaderGainedSpent";
import { ListAllTransactions } from "./ListAllTransactions";

export function Overview() {

  const { coinSelected, selectedDate } = useDashboardContext();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useAllTransactionsByMonthData(selectedDate.toISOString(), coinSelected);

  const {data: dataBudget} = useBudgetData(selectedDate, coinSelected);

  const totalBudget = dataBudget?.reduce((acc, limit) => acc + (limit.amount_limit || 0), 0) ?? 0;
  const totalSpent = dataBudget?.reduce((acc, limit) => acc + (limit.amount_spent || 0), 0) ?? 0;
  const percentualSpent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      {isError && (
        <div className="flex flex-col px-6">
          <h1 className="text-content-primary headline-small">
            Tivemos um problema ao carregar os dados
          </h1>
          <span className="text-content-secondary body-large">
            Pedimos desculpa pela inconveniência, mas não conseguimos carregar
            os seus dados.
          </span>
        </div>
      )}

      <HeaderGainedSpent 
        query={{ data, isLoading, isError }}
        coinSelected={coinSelected}
      />
      
      {!isError && coinSelected !== "global" && <Separator />}

      {coinSelected !== "global" && (     
        <div className="flex flex-1 mx-6 gap-4">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex gap-3 items-center">
              <Gauge />
              <div className="flex flex-col">
                <span className="label-medium text-content-primary">Meu orçamento</span>
                <span className="body-medium text-content-secondary">
                  Você planejou {currencyFormat(totalBudget)} e gastou {currencyFormat(totalSpent)}
                </span>
              </div>
            </div>

            <Progress value={percentualSpent} />
          </div>
          <IconButton variant={"ghost"} className="self-end" onClick={() => (navigate("limits"))}>
            <ChevronRight />
          </IconButton>
        </div>
      )}

      {!isLoading && data && !isError && coinSelected === "global" && (
        <ListAllTransactions />
      )}

      {isLoading && (
        <div className="flex flex-col">
          <div className="flex justify-between px-6">
            <h1 className="title-small text-content-primary pb-1">
              Últimas Transações
            </h1>
            <Skeleton className="h-8 rounded-full w-16" />
          </div>
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
      )}

      {!isError && coinSelected !== "global" && <Separator />}

      {!isLoading && data && !isError && coinSelected !== "global" && (
        <ExpenseByCatChart data={data.allTransactionsByMonth} />
      )}
      {isLoading && coinSelected !== "global" && (
        <div className="px-6 pt-4">
          <Skeleton className="w-full rounded-lg h-56 mb-10" />
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_x, i) => {
              return (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="w-full h-14 rounded" />
                  {i < 2 && <Separator />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
