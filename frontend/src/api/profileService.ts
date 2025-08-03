import { api } from './api';

export function createProfile<T>(body: unknown): Promise<T>{
    return api.post<T>("/profile/create", body);
}

export function signIn<T>(body: {username: string; password: string;}): Promise<T>{
    return api.post<T>("/profile/signin", body);
}

export function getUserProfileData<T>(): Promise<T>{
    return api.get<T>("/profile/user/data");
}

export function editProfileData<T>(body: unknown): Promise<T>{
    return api.put("/profile/edit", body)
}

export function changePassword<T>(body: unknown): Promise<T>{
    return api.post("/profile/change-password", body)
}