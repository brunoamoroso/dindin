import { useContext } from "react";
import { TransactionsContext } from "@/context/TransactionsContext";

export const useTransactionsContext = () => {
    const context = useContext(TransactionsContext);

    if(context === null){
        throw new Error("Context not found")
    }

    return context;
}