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
    category: CategoryType;
    subCategory: SubCategoryType;
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
    contextCategory: ContextCategoryType | null; 
    setContextCategory: React.Dispatch<React.SetStateAction<ContextCategoryType| null>>;
    contextAccount: AccountType | null;
    setContextAccount: React.Dispatch<React.SetStateAction<AccountType| null>>
    contextRecurrency: RecurrencyType;
    setContextRecurrency: React.Dispatch<React.SetStateAction<RecurrencyType>>
}

export const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsContextProvider = () => {
  const [contextCategory, setContextCategory] = useState<ContextCategoryType | null>(null);
  const [contextAccount, setContextAccount] = useState<AccountType | null>(null);
  const [contextRecurrency, setContextRecurrency] = useState<RecurrencyType>({id:"never", desc: "Nunca"});


  return (
    <TransactionsContext.Provider
      value={{ contextCategory, setContextCategory, contextAccount, setContextAccount, contextRecurrency, setContextRecurrency }}
    >
      <Outlet />
    </TransactionsContext.Provider>
  );
};
