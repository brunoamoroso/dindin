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

interface ContextCategoryType{
    category?: CategoryType;
    subCategory?: SubCategoryType;
}

interface AccountType{
    id: string;
    desc: string;
}

interface RecurrencyType{
  id: string;
  desc: string;
}


interface TransactionsContextType{
    contextAmount: number;
    setContextAmount: React.Dispatch<React.SetStateAction<number>>;
    contextDescription: string;
    setContextDescription: React.Dispatch<React.SetStateAction<string>>;
    contextCategory: ContextCategoryType | null; 
    setContextCategory: React.Dispatch<React.SetStateAction<ContextCategoryType| null>>;
    contextAccount: AccountType | null;
    setContextAccount: React.Dispatch<React.SetStateAction<AccountType| null>>
    contextRecurrency: RecurrencyType;
    setContextRecurrency: React.Dispatch<React.SetStateAction<RecurrencyType>>;
    contextDate: Date | undefined;
    setContextDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    chipPressed: "none" | "today" | "otherDate";
    setChipPressed: React.Dispatch<React.SetStateAction<"none" | "today" | "otherDate">>;
}

export const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsContextProvider = () => {
  const [contextAmount, setContextAmount] = useState<number>(0);
  const [contextDescription, setContextDescription] = useState<string>("");
  const [contextCategory, setContextCategory] = useState<ContextCategoryType | null>(null);
  const [contextAccount, setContextAccount] = useState<AccountType | null>(null);
  const [contextRecurrency, setContextRecurrency] = useState<RecurrencyType>({id:"never", desc: "Nunca"});
  const [contextDate, setContextDate] = useState<Date | undefined>();
  const [chipPressed, setChipPressed] = useState<"none" | "today" | "otherDate">("none");


  return (
    <TransactionsContext.Provider
      value={{contextAmount, setContextAmount, contextDescription, setContextDescription, contextCategory, setContextCategory, contextAccount, setContextAccount, contextRecurrency, setContextRecurrency, contextDate, setContextDate, chipPressed, setChipPressed }}
    >
      <Outlet />
    </TransactionsContext.Provider>
  );
};
