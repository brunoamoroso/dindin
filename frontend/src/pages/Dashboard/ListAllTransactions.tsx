import getCategoryIcon from "@/utils/get-category-icon";
import { currencyFormat } from "@/utils/currency-format";
import { Separator } from "@/components/ui/separator";
import ActionsTransaction from "@/components/ActionsTransaction";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDashboardContext } from "@/context/DashboardContext";
import { Skeleton } from "@/components/ui/skeleton";
import { formatLocalDate } from "@/utils/format-local-date";
import { useAllTransactionsByMonthData } from "@/hooks/useAllTransactionsByMonthData";
import { HeaderGainedSpent } from "./HeaderGainedSpent";

export function ListAllTransactions() {
  const { selectedDate, setSelectedDate, coinSelected } = useDashboardContext();

  const { dateParams } = useParams();

  useEffect(() => {
    if (dateParams !== undefined) {
      setSelectedDate(new Date(dateParams));
    }
  }, [dateParams, setSelectedDate]);

  const { data, isLoading, isError } = useAllTransactionsByMonthData(selectedDate.toISOString(), coinSelected);

  return (
    <div className="flex flex-col gap-5">
      <HeaderGainedSpent
        query={{ data, isLoading, isError }}
        coinSelected={coinSelected}
      />

      <Separator />
      <div className="flex flex-col flex-1 mx-6 text-content-secondary gap-6">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 mb-4 flex" />
          ))}
        {!isLoading && data?.allTransactionsByMonth.length === 0 && (
          <span className="body-large">Não houveram transações neste mês.</span>
        )}
        {!isLoading &&
          data?.allTransactionsByMonth.map((d, i, arr) => (
            <div key={i} className="flex flex-col">
              <div
                key={i}
                className="flex px-2 py-3.5 gap-4 justify-between items-center"
              >
                <div className="flex flex-1 gap-4 items-center">
                  <div>{getCategoryIcon(d.category).icon}</div>
                  <div className="flex flex-col">
                    {d.description && (
                      <span className="body-small text-content-secondary">
                          {d.category} - {d.subcategory}
                      </span>
                    )}
                    <span className="label-large text-content-primary mb-1 leading-none">
                      {!d.description ? d.category + " - " + d.subcategory : d.description}
                    </span>
                    <span className="body-small text-content-subtle">
                      {formatLocalDate(d.date)}
                      {d.install_number &&
                        " - " + d.install_number + " / " + d.installments}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`label-medium ${
                      d.type === "gain"
                        ? "text-content-positive"
                        : "text-content-negative"
                    }`}
                  >
                    {currencyFormat(d.amount)}
                    <span className="text-content-secondary">{" " + d.code}</span>
                  </span>
                  <span className="body-small text-content-subtle">
                    {d.account}
                  </span>
                </div>
                <ActionsTransaction
                  id={d.id!}
                  desc={d.description}
                  date={d.date}
                  amount={d.amount}
                  installments={d.installments}
                />
              </div>
              {i !== arr.length - 1 && <Separator />}
            </div>
          ))}
      </div>
    </div>
  );
}
