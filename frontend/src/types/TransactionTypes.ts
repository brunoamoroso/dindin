export interface AllTransactionType {
    type: string;
    desc: string;
    amount: number;
    account: {
        desc: string;
    }
    category: {
        desc: string;
    }
    subCategory?:{
        desc: string;
    }
    date: string;
}


export interface DataAllTransactionsType {
    allTransactionsByMonth: AllTransactionType[];
    sumAllAmountGained: number;
    sumAllAmountExpend: number;
}