import { api } from "./api";

export function getCategories<T>(type: string): Promise<T>{
    return api.get<T>(`/categories/${type}`);
}

export function getSubCategories<T>(category: string): Promise<T>{
    return api.get<T>(`/categories/${category}/sub`);
}

export function getSearchCategories<T>(type: string, searchQuery: string):Promise<T>{
    return api.get<T>(`/categories/search?type=${type}&query=${searchQuery}`);
}

export function createSubCategory<T>(category: string, description: string): Promise<T>{
    return api.post<T>(`/categories/${category}/sub/create`, { description });
}

export function editSubCategory<T>(id: string, description: string): Promise<T>{
    return api.put<T>(`/categories/sub/edit/${id}`, { description });
}

export function deleteSubCategory<T>(id: string): Promise<T>{
    return api.delete<T>(`/categories/sub/delete/${id}`);
}