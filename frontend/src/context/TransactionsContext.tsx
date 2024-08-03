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

interface TransactionDataType{
  type: "gain" | "expense";
  amount: number | 0;
  desc: string;
  category: CategoryType | undefined;
  subCategory: SubCategoryType | undefined;
  account: AccountType | undefined;
  recurrency: RecurrencyType;
  date: Date | undefined;
}


interface TransactionsContextType{
    contextTransactionData: TransactionDataType;
    setContextTransactionData: React.Dispatch<React.SetStateAction<TransactionDataType>>;
    chipPressed: "none" | "today" | "otherDate";
    setChipPressed: React.Dispatch<React.SetStateAction<"none" | "today" | "otherDate">>;
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
    date: undefined
  });
  const [chipPressed, setChipPressed] = useState<"none" | "today" | "otherDate">("none");


  return (
    <TransactionsContext.Provider
      value={{contextTransactionData, setContextTransactionData, chipPressed, setChipPressed }}
    >
      <Outlet />
    </TransactionsContext.Provider>
  );
};
