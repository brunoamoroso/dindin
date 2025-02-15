export interface TransactionType {
    id?: string;
    type: "gain" | "expense";
    description: string;
    amount: number;
    account: string;
    account_id: string;
    category: string;
    category_id: string;
    subcategory?: string;
    subcategory_id?: string;
    date: string;
    recurrency: string;
    installments: number;
    install_number: number;
    payment_condition: "none" | "single" | "multi";
}


export interface DataAllTransactionsType {
    allTransactionsByMonth: TransactionType[];
    sumAllAmountGained: number;
    sumAllAmountExpend: number;
}