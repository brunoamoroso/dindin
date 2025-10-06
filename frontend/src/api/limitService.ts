import { api } from "./api";

export function createLimit<T>(body: unknown): Promise<T>{
    return api.post<T>("/limits/create", body);
}

export function getLimitById<T>(id: string): Promise<T> {
    return api.get<T>(`/limits/${id}`);
}

export function getLimits<T>(selectedDate: Date, coinSelected: string):Promise<T>{
    return api.get<T>(`/limits/${selectedDate}/${coinSelected}`);
}   

export function updateLimit<T>(id: string, body: unknown):Promise<T>{
    return api.put<T>(`/limits/update/${id}`, body);
}

export function deleteLimit<T>(id: string):Promise<T>{
    return api.delete<T>(`/limits/delete/${id}`);
}

export function copyPreviousLimits<T>(selectedDate: Date, coinSelected: string):Promise<T>{
    return api.post<T>(`/limits/copy-previous`, {selectedDate, coinSelected});
}