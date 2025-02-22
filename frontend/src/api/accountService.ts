import { AccountType } from '@/types/AccountTypes';
import api from './api';

export function getAccounts<T>(): Promise<T>{
    return api.get<T>(`/accounts/list`);
}

export function createAccount(body: {description: string}): Promise<AccountType>{
    return api.post<AccountType>(`/accounts/create`, body);
}