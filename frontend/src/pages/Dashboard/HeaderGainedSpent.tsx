import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormat } from "@/utils/currency-format";

interface QueryResult {
  data?: {
    sumAllAmountGained: number;
    sumAllAmountExpend: number;
    allTransactionsByMonth: Array<{ code: string }>;
  };
  isLoading: boolean;
  isError: boolean;
}

export function HeaderGainedSpent({query, coinSelected}: {query: QueryResult, coinSelected: string}) {
    const { data, isLoading, isError } = query;
    
    return (
        <>
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
        </>
    )
}