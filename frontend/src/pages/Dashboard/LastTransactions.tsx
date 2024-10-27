import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { currencyFormat } from "@/utils/currency-format";
import getCategoryIcon from "@/utils/get-category-icon";
import { Link } from "react-router-dom";
import * as Types from '@/types/TransactionTypes';

export default function LastTransactions({data}: {data: Types.AllTransactionType[]}){
    return(
        <div className="flex flex-col bg-container2 rounded-lg py-4">
            <h1 className="title-small text-title px-6 pb-1">
                Últimas Transações
            </h1>
            <div className="px-2 max-h-44 overflow-hidden">
                {
                    data.map((d, i) => (
                        <div key={i} className="flex px-4 py-3.5 gap-4 justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div>{getCategoryIcon(d.category.desc).icon}</div>
                                <div className="flex flex-col">
                                    <span className="label-large text-title">{d.desc}</span>
                                    <span className="body-medium text-subtle">{new Date(d.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`label-medium ${d.type === 'gain' ? 'text-positive' : 'text-negative'}`}>{(d.type === "gain" ? "+ " : "- ") + currencyFormat(d.amount)}</span>
                                <span className="body-small text-subtle">{d.account.desc}</span>
                            </div>
                        </div>
                    ))
                }

                {data.length === 0 && (
                    <span className="flex p-4 text-subtle body-large">Sem transções neste mês.</span>
                )}
            </div>
            <Separator />
            <div className="pt-2 px-2">
                <Link to={`/transaction/list`}>
                    <Button variant={"ghost"}>Ver todas as transações</Button>
                </Link>
            </div>
        </div>
    )
}