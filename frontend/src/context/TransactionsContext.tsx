import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";

interface TransactionsContextType{
    contextCategory?: {
        category: string;
        subCategory: string | undefined;
    } | null;
    setContextCategory?: React.Dispatch<React.SetStateAction<{category: string; subCategory: string | undefined} | null >>;
}

export const TransactionsContext = createContext<TransactionsContextType | null>(null);

export const TransactionsContextProvider = () => {
    const [contextCategory, setContextCategory] = useState<{category: string; subCategory: string | undefined} | null>(null);

    return (
        <TransactionsContext.Provider value={{contextCategory, setContextCategory}}>
            <Outlet />
        </TransactionsContext.Provider>
    );
}