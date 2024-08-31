import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import api from '@/api/api';
import { currencyFormat } from "@/utils/currency-format";
import BottomNav from "@/components/BottomNav";
import LastTransactions from "./LastTransactions";
import ExpenseByCatChart from "./ExpenseByCatChart";
import * as Types from '@/types/TransactionTypes';
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import { useDashboardDate } from "@/hooks/useDashboardDate";


export default function Dashboard() {
    const {selectedDate, setShowDatePicker} = useDashboardDate();
    const monthLong = selectedDate.toLocaleDateString('pt-BR', {month: 'long'});

    const {data, isLoading, isError} = useQuery<Types.DataAllTransactionsType>({
        queryKey: ["dashboard-data", selectedDate],
        queryFn: () => api.getAllTransactionsByMonth(selectedDate.toISOString())
    });
    
  return (
    <div className="bg-surface flex flex-col text-body">
        <div className="container flex flex-col gap-6 pb-32">
            <div className="flex justify-center py-6">
                <Button variant={"ghost"} onClick={() => setShowDatePicker(true)}>
                    <ChevronDown /> {monthLong.charAt(0).toUpperCase() + monthLong.slice(1)}
                </Button>

            </div>
            <div className="flex gap-6">
                <div className="flex flex-col flex-1 bg-container2 p-6 rounded-lg">
                    <span className="label-small text-title">Você ganhou</span>
                    {isLoading && (
                        <Skeleton className="w-full h-4 rounded-xl"/>
                    )}
                    {!isLoading && data && (
                        <span className="title-medium text-positive">
                            {"R$" + currencyFormat(data.sumAllAmountGained)}
                        </span>
                    )}
                </div>
                <div className="flex flex-col flex-1 bg-container2 p-6 rounded-lg">
                    <span className="label-small text-title">Você gastou</span>
                    {isLoading && (
                        <Skeleton className="w-full h-4 rounded-xl"/>
                    )}
                    {!isLoading && data && (
                        <span className="title-medium text-negative">
                            {"R$" + currencyFormat(data.sumAllAmountExpend)}
                        </span>
                    )}
                </div>
            </div>

            {(!isLoading && data !== undefined) && (
                <LastTransactions data={data.allTransactionsByMonth} selectedDate={selectedDate.toISOString()}/>
            )}

            {isLoading && (
                <div className="flex flex-col bg-container2 rounded-lg py-4">
                    <h1 className="title-small text-title px-6 pb-1">
                        Últimas Transações
                    </h1>
                    <div className="px-2 max-h-44 overflow-hidden">
                        <div className="flex flex-col gap-6 px-4 pt-3">
                            {Array.from({length: 3}).map((_x, i) => {
                                return (
                                <div key={i} className="flex flex-col gap-4">
                                    <Skeleton className="w-full h-12 rounded"/>
                                </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="pt-2 px-2 border-t border-outline">
                        <Button variant={"ghost"}>Ver todas as transações</Button>
                    </div>
                </div>
            )}

            {(!isLoading && data) && (
                <ExpenseByCatChart data={data.allTransactionsByMonth}/>
            )}
            {isLoading && (
                    <div className="bg-container2 rounded-lg py-4">
                        <h1 className="title-small text-title px-6">Gasto por Categoria</h1>
                        <div className="px-6 pt-4">
                            <Skeleton className='w-full rounded-lg h-56 mb-10'/>
                            <div className="flex flex-col gap-6">
                                {Array.from({length: 3}).map((_x, i) => {
                                    return (
                                    <div key={i} className="flex flex-col gap-4">
                                        <Skeleton className="w-full h-14 rounded"/>
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
  )
}
