import { getLimits } from "@/api/limitService";
import { LimitType } from "@/types/LimitType";
import { useQuery } from "@tanstack/react-query";

export function useBudgetData(selectedDate: Date, coinSelected: string) {
    return useQuery<LimitType[]>({
        queryKey: ["widget-budget-data", selectedDate, coinSelected],
        queryFn: () =>
            getLimits(selectedDate, coinSelected),
        enabled: !!selectedDate && !!coinSelected,
    });
}