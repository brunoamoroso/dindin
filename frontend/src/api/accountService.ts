import api from './api';

export function getAccounts<T>(): Promise<T>{
    return api.get<T>(`/accounts/list`);
}

export function createAccount<T>(body: {description: string}): Promise<T>{
    return api.post<T>(`/accounts/create`, body);
}