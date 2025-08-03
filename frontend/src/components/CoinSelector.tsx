import { Globe, PlusCircle } from "lucide-react";
import { CoinSelectorItem } from "./CoinSelectorItem";
import {useQuery } from "@tanstack/react-query";
import { getUserSelectedCoins } from "@/api/coinService";
import { CoinType } from "@/types/CoinTypes";
import { useNavigate } from "react-router-dom";
import { useDashboardContext } from "@/context/DashboardContext";

export function CoinSelector() {
  const navigate = useNavigate();

  const { coinSelected, setCoinSelected } = useDashboardContext();

  const {
    data: userCoins,
    isLoading: loadingUserCoins,
  } = useQuery<CoinType[]>({
    queryKey: ["userCoins"],
    queryFn: () => getUserSelectedCoins(),
  });

  const handleClickCoin = (e: React.MouseEvent<HTMLDivElement>) => {
    const coinCode = e.currentTarget.dataset.id;
    if (!coinCode) {
      return console.error(
        "user tried to select a coin without an id"
      );
    }

    if(setCoinSelected) {
      setCoinSelected(coinCode);
    }
  };
  return (
    <div className="flex gap-5 scroll-px-6 px-6 snap-mandatory snap-x overflow-x-auto no-scrollbar mb-9">
      <CoinSelectorItem variant={`${coinSelected === "global" ? "pressed" : "default"}`} id="global" onClick={handleClickCoin}>
        <Globe size={28} className="fill-text-content-primary" />
        <span>Global</span>
      </CoinSelectorItem>
      {!loadingUserCoins &&
        userCoins &&
        userCoins.map((coin) => (
          <CoinSelectorItem
            key={coin.code}
            id={coin.code}
            onClick={handleClickCoin}
            variant={`${coinSelected === coin.code ? "pressed" : "default"}`}
          >
            <img
              src={coin?.img}
              alt="coin"
              className="w-7 h-7 object-cover rounded-full"
            />
            <span>
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
