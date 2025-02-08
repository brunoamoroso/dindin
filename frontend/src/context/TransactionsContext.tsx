import { useUserDefaultCoin } from "@/hooks/useUserDefaultCoin";
import { getCurrencySymbol } from "@/utils/get-currency-symbol";
import { useState } from "react";
import { Outlet } from "react-router-dom";

interface CategoryType {
  id: string;
  desc: string;
}

interface SubCategoryType {
  id: string;
  desc: string;
}

interface AccountType {
  id: string;
  desc: string;
}

interface RecurrencyType {
  id: string;
  desc: string;
}

export interface TransactionDataType {
  coin: string;
  id?: string;
  type: "gain" | "expense";
  amount: number | 0;
  desc: string;
  category: CategoryType | undefined;
  subCategory: SubCategoryType | undefined;
  account: AccountType | undefined;
  recurrency: RecurrencyType;
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
      desc: "",
      category: undefined,
      subCategory: undefined,
      account: undefined,
      recurrency: { id: "never", desc: "Nunca" },
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
