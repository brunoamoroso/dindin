export interface TransactionType {
    id?: string;
    type: "gain" | "expense";
    desc: string;
    amount: number;
    account: {
        id: string;
        desc: string;
    }
    category: {
        id: string;
        desc: string;
    }
    subCategory?:{
        id: string;
        desc: string;
    }
    date: string;
    recurrency: string;
    installments: string;
    payment_condition: "none" | "single" | "multi";
}


export interface DataAllTransactionsType {
    allTransactionsByMonth: TransactionType[];
    sumAllAmountGained: number;
    sumAllAmountExpend: number;
}