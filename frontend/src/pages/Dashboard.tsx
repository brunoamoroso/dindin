import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Plus } from "lucide-react";
import api from '@/api/api';
import { currencyFormat } from "@/utils/currencyFormat";
import BottomNav from "@/components/BottomNav";

interface AllTransactionsByMonthType{
    allTransactionGainByMonth: [];
    sumAllAmountGained: number;
    allTransactionExpenseByMonth: [];
    sumAllAmountExpend: number;
}

export default function Dashboard() {
    const {data, isLoading, isError} = useQuery<AllTransactionsByMonthType>({
        queryKey: ["dashboard-data"],
        queryFn: () => api.getAllTransactionsByMonth("2024-08-01T03:00:00.000Z")
    });

    console.log(data);

  return (
    <div className="bg-surface h-dvh flex flex-col text-body">
        <div className="container">
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
        </div>
        <BottomNav />
    </div>
  )
}
