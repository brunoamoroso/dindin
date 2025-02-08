import { getUserDefaultCoin } from "@/api/coinService";
import { CoinType } from "@/types/CoinTypes";
import { useQuery } from "@tanstack/react-query";

export function useUserDefaultCoin() {
    return useQuery<CoinType>({
        queryKey: ["userDefaultCoin"],
        queryFn: () => getUserDefaultCoin(),
    });
}