import { useUserDefaultCoin } from "@/hooks/useUserDefaultCoin";
import { getCurrencySymbol } from "@/utils/get-currency-symbol";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export interface TransactionDataType {
  coin: string;
  id?: string;
  type: "gain" | "expense";
  amount: number | 0;
  description: string;
  category_id: string | undefined;
  category: string | undefined;
  subcategory_id: string | undefined;
  subcategory: string | undefined;
  account_id: string | undefined;
  account: string | undefined;
  date: {
    chip: "none" | "today" | "otherDate";
    value: Date | undefined;
  };
  paymentCondition: string;
  installments: string;
  transactionScope: string;
}

export interface TransactionsContextType {
  contextTransactionData: TransactionDataType;
  setContextTransactionData: React.Dispatch<
    React.SetStateAction<TransactionDataType>
  >;
}

function CoinTransaction(): string{
  const {data} = useUserDefaultCoin();
  return getCurrencySymbol(data!.code);
}

export function TransactionsContext(){
  const [contextTransactionData, setContextTransactionData] =
    useState<TransactionDataType>({
      coin: CoinTransaction(),
      type: "gain",
      amount: 0,
      description: "",
      category_id: undefined,
      category: undefined,
      subcategory_id: undefined,
      subcategory: undefined,
      account_id: undefined,
      account: undefined,
      date: {
        chip: "none",
        value: undefined,
      },
      paymentCondition: "none",
      installments: "0",
      transactionScope: "single",
    });

  return (
    <>
      <Outlet context={{ contextTransactionData, setContextTransactionData }} />
    </>
  );
}
