import api from "@/api/api";

export function getUserSelectedCoins<T>(): Promise<T>{
    return api.get<T>("/coins/user-coins-selection");
}

export function getCoins<T>(): Promise<T>{
    return api.get<T>("/coins/get-coins");
}

export function getUserDefaultCoin<T>(): Promise<T>{
    return api.get<T>("/coins/user-coins/default");
}

export function addNewUserSelectedCoin<T>(body: {coinId: string}): Promise<T>{
    return api.put<T>("/coins/user-coins/add", body);
}

export function setDefaultUserCoin <T>(body: {coinId: string}): Promise<T>{
    return api.put<T>("/coins/user-coins/set-default", body);
}
