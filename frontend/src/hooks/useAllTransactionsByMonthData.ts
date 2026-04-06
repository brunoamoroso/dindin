import { getAllTransactionsByMonth } from "@/api/transactionService";
import { DataAllTransactionsType } from "@/types/TransactionTypes";
import { useQuery } from "@tanstack/react-query";

export function useAllTransactionsByMonthData(selectedDate: string, coinSelected: string) {
    return useQuery<DataAllTransactionsType>({
        queryKey: ["listalltransactions-data", selectedDate, coinSelected],
        queryFn: () =>
            getAllTransactionsByMonth(selectedDate, coinSelected),
        enabled: !!selectedDate && !!coinSelected,
    });
}