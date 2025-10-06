import { copyPreviousLimits, getLimits } from "@/api/limitService";
import AppBar from "@/components/AppBar";
import { LimitListItem } from "@/components/LimitListItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLimitContext } from "@/context/LimitContext";
import { LimitType } from "@/types/LimitType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function Limits() {
  const { limitData } = useLimitContext();
  const { selectedDate, coinSelected } = limitData;
  const queryClient = useQueryClient();

  const monthKey = (d: Date) => d.toISOString().slice(0, 7); // "YYYY-MM"
  const key = ["limits-data", monthKey(selectedDate), coinSelected];

  const { data, isLoading } = useQuery<LimitType[]>({
    queryKey: key,
    queryFn: () => getLimits(selectedDate, coinSelected),
    enabled: !!selectedDate && !!coinSelected,
  });

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
      <AppBar title="Limites de Gastos" pageBack="dashboard" />
      <div className="px-6 py-10 flex flex-col flex-1 justify-center items-center bg-layer-tertiary rounded-t-lg border-outline">
        {(isLoading || mutation.isPending) && (
          <div className="flex flex-1 flex-col gap-4 w-full self-start">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-sm" />
            ))}
          </div>
        )}
        {data && data.length > 0 && data[0].id !== null && !mutation.isPending && (
          <div className="flex flex-1 flex-col justify-between w-full">
            <div className="flex flex-col gap-6">
              {data.map((item) => (
                <LimitListItem key={item.id} {...item} />
              ))}
            </div>
            <Link to="/limits/create" className=" w-full">
              <Button size="lg" className="w-full">
                <Plus strokeWidth={3} /> Definir Limite
              </Button>
            </Link>
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
              <Link to="/limits/create" className="flex flex-1">
                <Button size="lg" className="w-full">
                  <Plus strokeWidth={3} /> Definir Limite
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
