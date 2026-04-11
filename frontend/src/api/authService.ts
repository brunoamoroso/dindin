import { api } from "./api";

export function signIn<T>(body: {username: string; password: string;}): Promise<T>{
    return api.post<T>("/auth/signin", body);
}

export function linkGoogleAccount<T>(): Promise<T>{
    return api.get<T>("/auth/google/link");
}

export function unlinkGoogleAccount<T>(): Promise<T>{
    return api.post<T>("/auth/google/unlink", {});
}
