// Base shape shared by both
export type BaseTransaction = {
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
  code: string;
};

// For newly created (not yet saved) transactions
export type NewTransactionType = Omit<BaseTransaction, "id">;

// For transactions fetched from the backend
export type TransactionType = BaseTransaction & { id: string };



export type DataAllTransactionsType = {
    allTransactionsByMonth: TransactionType[];
    sumAllAmountGained: number;
    sumAllAmountExpend: number;
}