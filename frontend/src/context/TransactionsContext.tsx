import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";

interface CategoryType{
    id: string;
    desc: string;
}

interface SubCategoryType{
    id: string;
    desc: string;
}

interface AccountType{
    id: string;
    desc: string;
}

interface RecurrencyType{
  id: string;
  desc: string;
}

export interface TransactionDataType{
  id?: string;
  type: "gain" | "expense";
  amount: number | 0;
  desc: string;
  category: CategoryType | undefined;
  subCategory: SubCategoryType | undefined;
  account: AccountType | undefined;
  recurrency: RecurrencyType;
  date: {
    chip: "none" | "today" | "otherDate",
    value: Date | undefined
  };
  paymentCondition: string;
  installments: string;

}


interface TransactionsContextType{
    contextTransactionData: TransactionDataType;
    setContextTransactionData: React.Dispatch<React.SetStateAction<TransactionDataType>>;
}

export const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsContextProvider = () => {
  const [contextTransactionData, setContextTransactionData] = useState<TransactionDataType>({
    type: "gain",
    amount: 0,
    desc: "",
    category: undefined,
    subCategory: undefined,
    account: undefined,
    recurrency: {id: "never", desc: "Nunca"},
    date: {
      chip: "none",
      value: undefined
    },
    paymentCondition: "none",
    installments: "0",
  });

  return (
    <TransactionsContext.Provider
      value={{contextTransactionData, setContextTransactionData}}
    >
      <Outlet />
    </TransactionsContext.Provider>
  );
};
