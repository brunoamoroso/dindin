import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import api from '@/api/api';
import { currencyFormat } from "@/utils/currency-format";
import BottomNav from "@/components/BottomNav";
import LastTransactions from "./LastTransactions";
import { useEffect, useState } from "react";
import ExpenseByCatChart from "./ExpenseByCatChart";
import * as Types from '@/types/TransactionTypes';
import { Link, useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";

export default function Dashboard() {
    const location = useLocation();
    const {data, isLoading, isError} = useQuery<Types.DataAllTransactionsType>({
        queryKey: ["dashboard-data"],
        queryFn: () => api.getAllTransactionsByMonth("2024-08-01T03:00:00.000Z")
    });
  return (
    <div className="bg-surface flex flex-col text-body">
        <div className="container flex flex-col gap-6 pb-32">
            <div className="flex justify-center py-6">
               <Link to="/dashboard/date" state={{previousLocation: location}}>
                <Button variant={"ghost"}>
                    <ChevronDown /> Julho
                </Button>
               </Link> 
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
                <LastTransactions data={data.allTransactionsByMonth} selectedDate={"2024-08-01T03:00:00.000Z"}/>
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
