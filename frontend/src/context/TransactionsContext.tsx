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


interface TransactionsContextType{
    contextCategory: ContextCategoryType | null; 
    setContextCategory: React.Dispatch<React.SetStateAction< ContextCategoryType| null>>;
    contextAccount: AccountType | null;
    setContextAccount: React.Dispatch<React.SetStateAction<AccountType| null>>
}

export const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsContextProvider = () => {
  const [contextCategory, setContextCategory] = useState<ContextCategoryType | null>(null);
  const [contextAccount, setContextAccount] = useState<AccountType | null>(null);


  return (
    <TransactionsContext.Provider
      value={{ contextCategory, setContextCategory, contextAccount, setContextAccount }}
    >
      <Outlet />
    </TransactionsContext.Provider>
  );
};
