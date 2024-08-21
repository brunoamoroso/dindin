import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import api from '@/api/api';
import { currencyFormat } from "@/utils/currency-format";
import BottomNav from "@/components/BottomNav";
import LastTransactions from "./LastTransactions";
import { useEffect, useState } from "react";

interface AllTransactionsByMonthType{
    allTransactionGainsByMonth: [object];
    sumAllAmountGained: number;
    allTransactionExpenseByMonth: [object];
    sumAllAmountExpend: number;
}

export default function Dashboard() {
    const {data, isLoading, isError} = useQuery<AllTransactionsByMonthType>({
        queryKey: ["dashboard-data"],
        queryFn: () => api.getAllTransactionsByMonth("2024-08-01T03:00:00.000Z")
    });

    console.log(data);
    const [lastTransactionData, setLastTransactionData] = useState([{}]);

    useEffect(() => {
        if(data !== undefined){
            const sliceSomeExpense = data.allTransactionExpenseByMonth.slice(2);
            const sliceSomeGain = data.allTransactionGainsByMonth.slice(2);
            const combinedArr = sliceSomeExpense.concat(sliceSomeGain);
            setLastTransactionData(combinedArr);
        }
    }, [data]);

    // console.log(data);

  return (
    <div className="bg-surface h-dvh flex flex-col text-body">
        <div className="container flex flex-col gap-6">
            <div className="flex justify-center py-6">
                <Button variant={"ghost"}>
                    <ChevronDown /> Julho
                </Button>
            </div>
            <div className="flex gap-6">
                <div className="flex flex-col flex-1 bg-container2 p-6 rounded-lg">
                    <span className="label-small text-title">Você ganhou</span>
                    <span className="title-medium text-positive">
                        {data && "R$" + currencyFormat(data.sumAllAmountGained)}
                    </span>
                </div>
                <div className="flex flex-col flex-1 bg-container2 p-6 rounded-lg">
                    <span className="label-small text-title">Você gastou</span>
                    <span className="title-medium text-negative">
                        {data && "R$" + currencyFormat(data.sumAllAmountExpend)}
                    </span>
                </div>
            </div>

            <LastTransactions dataLast={lastTransactionData}/>
        </div>
        <BottomNav />
    </div>
  )
}
