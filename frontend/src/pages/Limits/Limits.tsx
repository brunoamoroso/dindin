import { getLimits } from "@/api/limitService";
import AppBar from "@/components/AppBar";
import { LimitListItem } from "@/components/LimitListItem";
import { Button } from "@/components/ui/button";
import { useLimitContext } from "@/context/LimitContext";
import { LimitType } from "@/types/LimitType";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function Limits() {
  const { limitData } = useLimitContext();
  const { selectedDate, coinSelected } = limitData;

  const { data, isLoading } = useQuery<LimitType[]>({
    queryKey: ["limits-data", selectedDate, coinSelected],
    queryFn: () => getLimits(selectedDate, coinSelected),
    enabled: !!selectedDate && !!coinSelected,
  });

  return (
    <div className="bg-surface min-h-dvh flex flex-col">
      <AppBar title="Limites de Gastos" pageBack="dashboard" />
      <div className="px-6 py-10 flex flex-col flex-1 justify-center items-center bg-layer-tertiary rounded-t-lg border-outline">
        {data && (
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
        {!data && !isLoading && (
          <div className="flex flex-col gap-6">
            <h1 className="title-small text-center text-content-primary">
              Nenhum limite de gasto definido no período
            </h1>
            <Link to="/limits/create" className="flex flex-1 justify-center">
              <Button size="lg">
                <Plus strokeWidth={3} /> Definir Limite
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
