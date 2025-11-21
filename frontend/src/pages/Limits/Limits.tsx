import { copyPreviousLimits, getLimits } from "@/api/limitService";
import { LimitListItem } from "@/components/LimitListItem";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardContext } from "@/context/DashboardContext";
import { LimitType } from "@/types/LimitType";
import { currencyFormat } from "@/utils/currency-format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function Limits() {
  const { selectedDate, coinSelected } = useDashboardContext();
  const queryClient = useQueryClient();

  const monthKey = (d: Date) => d.toISOString().slice(0, 7); // "YYYY-MM"
  const key = ["limits-data", monthKey(selectedDate), coinSelected];

  const { data, isLoading } = useQuery<LimitType[]>({
    queryKey: key,
    queryFn: () => getLimits(selectedDate, coinSelected),
    enabled: !!selectedDate && !!coinSelected,
  });

  const totalSpent = data?.reduce((acc, limit) => acc + (limit.amount_spent || 0), 0) ?? 0;
  const totalBudget = data?.reduce((acc, limit) => acc + (limit.amount_limit || 0), 0) ?? 0;

  const mutation = useMutation<
    { selectedDate: Date; coinSelected: string },
    unknown,
    { selectedDate: Date; coinSelected: string }
  >({
    mutationFn: (data) => copyPreviousLimits(data.selectedDate, data.coinSelected),
    onSuccess: (data) => {
        // Refetch the limits data after copying previous limits
        queryClient.setQueryData(key, data);
      }
  });

  const handleCopyPreviousLimits = () => {
    mutation.mutate({ selectedDate, coinSelected });
  }

  return (
    <div className="bg-surface min-h-dvh flex flex-col">
        {(isLoading || mutation.isPending) && (
          <div className="flex flex-1 flex-col gap-4 w-full self-start">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-sm" />
            ))}
          </div>
        )}
        {data && data.length > 0 && data[0].id !== null && !mutation.isPending && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-1 justify-between items-center mx-6">
              <h1 className="label-large text-content-primary">Meu orçamento</h1>
              <div>
                <span className="label-large text-content-primary">
                  {currencyFormat(totalSpent)}
                </span>
                <span className="body-large text-content-subtle">
                  {" "} / {currencyFormat(totalBudget)}
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-6 mx-6">
              {data.map((item) => (
                <LimitListItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
        {data && data.length > 0 && data[0].id === null && !isLoading && (
          <div className="flex flex-col gap-6">
            <h1 className="title-small text-center text-content-primary">
              Nenhum limite de gasto definido no período
            </h1>
            <div className="flex self-center flex-col gap-6">
              {data[0].has_previous_limits && (
                <Button size="lg" variant="outline" className="flex flex-1" onClick={() => handleCopyPreviousLimits()}>
                  Copiar limites anteriores
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
  );
}
