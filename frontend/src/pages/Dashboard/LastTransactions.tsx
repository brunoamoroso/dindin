import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { currencyFormat } from "@/utils/currency-format";
import getCategoryIcon from "@/utils/get-category-icon";

export default function LastTransactions({dataLast}: {dataLast: object[]}){
    
    return(
        <div className="flex flex-col bg-container2 rounded-lg py-4">
            <span className="title-small text-title px-6 pb-1">
                Últimas Transações
            </span>
            <div className="px-2">
                {
                    dataLast.map((d, i) => (
                        <div key={i} className="flex px-4 py-3.5 gap-4 justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div>{getCategoryIcon(d.category.desc)}</div>
                                <div className="flex flex-col">
                                    <span className="label-large text-title">{d.description}</span>
                                    <span className="body-medium text-subtle">{new Date(d.date_earned).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="label-medium">{currencyFormat(d.amount)}</span>
                                <span className="body-small text-subtle">{d.account.description}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
            <Separator />
            <div className="pt-2 px-2">
                <Button variant={"ghost"}>Ver todas as transações</Button>
            </div>
        </div>
    )
}