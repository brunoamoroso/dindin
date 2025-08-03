import { Globe, PlusCircle } from "lucide-react";
import { CoinSelectorItem } from "./CoinSelectorItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserSelectedCoins, setDefaultUserCoin } from "@/api/coinService";
import { CoinType } from "@/types/CoinTypes";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { DashboardContextType } from "@/context/DashboardContext";

export function CoinSelector() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { coinSelected, setCoinSelected } =
    useOutletContext<DashboardContextType>();

  const {
    data: userCoins,
    isError: errorUsercCoins,
    isLoading: loadingUserCoins,
  } = useQuery<CoinType[]>({
    queryKey: ["userCoins"],
    queryFn: () => getUserSelectedCoins(),
  });

  const setDefaultCoinMutation = useMutation({
    mutationFn: (data: { coinId: string }) => setDefaultUserCoin(data),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["userDefaultCoin"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-data"],
      });

      queryClient.invalidateQueries({
        queryKey: ["listalltransactions-data"],
      });
    },
  });

  const handleClickCoin = (e: React.MouseEvent<HTMLDivElement>) => {
    const coinId = e.currentTarget.dataset.id;
    if (!coinId) {
      return console.error(
        "user tried to set a default coin, but coinId is undefined"
      );
    }

    setDefaultCoinMutation.mutate({ coinId: coinId });
  };
  return (
    <div className="flex gap-5 scroll-px-6 px-6 snap-mandatory snap-x overflow-x-auto no-scrollbar mb-9">
      <CoinSelectorItem variant="pressed" id="global">
        <Globe size={28} className="fill-text-content-primary" />
        <span>Global</span>
      </CoinSelectorItem>
      {!loadingUserCoins &&
        userCoins &&
        userCoins.map((coin) => (
          <CoinSelectorItem
            key={coin.id}
            id={coin.id}
            onClick={handleClickCoin}
            variant="default"
          >
            <img
              src={coin?.img}
              alt="coin"
              className="w-7 h-7 object-cover rounded-full"
            />
            <span className="text-content-subtle label-medium">
              {coin?.code}
            </span>
          </CoinSelectorItem>
        ))}

      <div className="flex gap-2 items-end h-[152px] w-[140px] border-2 border-outline border-dashed rounded-lg p-6 snap-start shrink-0" onClick={() => navigate('/coins/search')}>
        <div className="flex gap-2 items-center">
          <PlusCircle size={28} className="fill-text-content-primary" />
          <span className="text-content-subtle label-medium">Add</span>
        </div>
      </div>
    </div>
  );
}
