import { Button } from "@/components/ui/button";
import { currencyFormat } from "@/utils/currency-format";
import getCategoryIcon from "@/utils/get-category-icon";
import { Link } from "react-router-dom";
import * as Types from "@/types/TransactionTypes";
import { cn } from "@/lib/utils";

export default function LastTransactions({
  data,
}: {
  data: Types.TransactionType[];
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-1 justify-between items-baseline px-6">
        <h1 className="title-small text-content-primary pb-1">
          Últimas Transações
        </h1>
        <Link to={`/transaction/list`}>
          <Button variant={"link"} size={'link'}>Ver todas</Button>
        </Link>
      </div>
      <div className="px-2">
        {data.slice(0, 3).map((d, i) => (
          <div
            key={i}
            className="flex px-4 py-3.5 gap-4 justify-between items-center"
          >
            <div className="flex gap-4 items-center">
              <div>{getCategoryIcon(d.category).icon}</div>
              <div className="flex flex-col">
                <span className="label-large text-content-primary">
                  {d.description}
                </span>
                <span className="body-medium text-content-subtle">
                  {new Date(d.date).toLocaleDateString()}
                  {d.install_number &&
                    " - " + d.install_number + " / " + d.installments}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={cn("label-medium whitespace-nowrap", {
                  "text-content-positive": d.type === "gain",
                  "text-content-negative": d.type === "expense",
                })}
              >
                {(d.type === "gain" ? "+ " : "- ") + currencyFormat(d.amount)}
                <span className="text-content-secondary">
                  {" " + d.code}
                </span>
              </span>
              <span className="body-small text-content-subtle">
                {d.account}
              </span>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <span className="flex px-4 text-content-subtle body-large">
            Sem transções neste mês.
          </span>
        )}
      </div>
    </div>
  );
}
