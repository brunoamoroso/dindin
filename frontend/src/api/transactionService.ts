import { api } from "./api";
import { DataAllTransactionsType, TransactionType } from "@/types/TransactionTypes";

export function addTransaction<T>(body: unknown): Promise<T>{
    return api.post<T>("/transactions/add", body);
}

export function updateTransaction<T>(id: string, body: unknown):Promise<T>{
    return api.put<T>(`/transactions/update/${id}`, body);
}

export function deleteTransaction<T>(id: string): Promise<T>{
    return api.delete<T>(`/transactions/delete/${id}`);
}

export function getOneTransaction(id: string): Promise<TransactionType>{
    return api.get(`/transactions/${id}`);
}

export function getAllTransactionsByMonth(date: string): Promise<DataAllTransactionsType>{
    return api.get(`/transactions/all-month/${date}`);
}

export function getAllInstallmentsTransaction(id: string): Promise<TransactionType>{
    return api.get(`/transactions/all-installments/${id}`);
}

export function updateAllInstallmentsTransaction<T>(id: string, body: unknown):Promise<T>{
    return api.put<T>(`/transactions/update/all-installments/${id}`, body);
}

export function deleteOneTransactionInstallment<T>(id: string): Promise<T>{
    return api.delete<T>(`/transactions/delete/one-installment/${id}`);
}

export function deleteAllTransactionInstallment<T>(id: string): Promise<T>{
    return api.delete<T>(`/transactions/delete/all-installment/${id}`);
}