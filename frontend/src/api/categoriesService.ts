import { api } from "./api";

export function getCategories<T>(type: string): Promise<T>{
    return api.get<T>(`/categories/${type}`);
}

export function getSubCategories<T>(category: string): Promise<T>{
    return api.get<T>(`/categories/sub/${category}`);
}

export function getSearchCategories<T>(type: string, searchQuery: string):Promise<T>{
    return api.get<T>(`/categories/search?type=${type}&query=${searchQuery}`);
}