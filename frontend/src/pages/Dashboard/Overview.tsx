import { useQuery } from "@tanstack/react-query";
import ExpenseByCatChart from "./ExpenseByCatChart";
import { getAllTransactionsByMonth } from "@/api/transactionService";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormat } from "@/utils/currency-format";
import { Separator } from "@/components/ui/separator";
import LastTransactions from "./LastTransactions";
import { useDashboardContext } from "@/context/DashboardContext";

export function Overview() {

  const { coinSelected, selectedDate } = useDashboardContext();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-data", selectedDate, coinSelected],
    queryFn: () =>
      getAllTransactionsByMonth(selectedDate.toISOString(), coinSelected),
  });

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
      {!isError && coinSelected !== "global" && (
        <div className="flex gap-6 mx-6 mt-3">
          <div className="flex flex-col flex-1">
            <span className="label-small text-content-primary">Recebeu</span>
            {isLoading && <Skeleton className="w-8/12 h-6 rounded-full" />}
            {!isLoading && data && (
              <span className="title-medium text-positive">
                {currencyFormat(
                  data.sumAllAmountGained,
                  data.allTransactionsByMonth[0]?.code
                )}
              </span>
            )}
          </div>
          <div className="flex flex-col flex-1 text-right">
            <span className="label-small text-content-primary">Gastou</span>
            {isLoading && (
              <Skeleton className="w-8/12 h-6 rounded-xl self-end" />
            )}
            {!isLoading && data && (
              <span className="title-medium text-critical">
                {currencyFormat(
                  data.sumAllAmountExpend,
                  data.allTransactionsByMonth[0]?.code
                )}
              </span>
            )}
          </div>
        </div>
      )}
      
      {!isError && coinSelected !== "global" && <Separator />}

      {!isLoading && data && !isError && (
        <LastTransactions data={data.allTransactionsByMonth} />
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
