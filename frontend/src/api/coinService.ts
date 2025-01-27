import api from "@/api/api";

export function getUserSelectedCoins<T>(): Promise<T>{
    return api.get<T>("/coins/user-coins-selection");
}