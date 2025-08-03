import { ChevronDown, Plus } from "lucide-react";
import { IconButton } from "./ui/icon-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CoinSelectorListItem } from "./CoinSelectorListITem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserSelectedCoins, setDefaultUserCoin } from "@/api/coinService";
import { CoinType } from "@/types/CoinTypes";
import { Separator } from "./ui/separator";
import { Fragment } from "react/jsx-runtime";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { DashboardContextType } from "@/context/DashboardContext";

export function CoinSelector() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const {userDefaultCoin, isLoadingDefaultCoin} = useOutletContext<DashboardContextType>();

    const {data: userCoins, isError: errorUsercCoins, isLoading: loadingUserCoins} = useQuery<CoinType[]>({
        queryKey: ["userCoins"],
        queryFn: () => getUserSelectedCoins(),
    });

    const setDefaultCoinMutation = useMutation({
      mutationFn: (data: {coinId: string}) => setDefaultUserCoin(data),
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
      }
    });

    const handleClickCoin = (e: React.MouseEvent<HTMLDivElement>) => {
      const coinId = e.currentTarget.dataset.id;
      if(!coinId){
        return console.error("user tried to set a default coin, but coinId is undefined");
      }

      setDefaultCoinMutation.mutate({coinId: coinId});
    };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isLoadingDefaultCoin && (
        <Skeleton className="w-10 h-7 rounded-xl" />
      )}
      <DialogTrigger asChild>
        {!isLoadingDefaultCoin && ( 
          <div className="flex gap-2 items-center">
            <img
              src={userDefaultCoin?.img} 
              alt="coin"
              className="w-7 h-7 object-cover rounded-full"
            />
            <div className="flex gap-1 items-center">
              <span className="text-content-subtle label-medium">{userDefaultCoin?.code}</span>
              <IconButton variant="ghost" size="small">
                <ChevronDown className="text-primary" />
              </IconButton>
            </div>
          </div>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-1 flex-col bg-layer-primary border-outline border p-6">
        {errorUsercCoins && (
          <div className="flex flex-col gap-1">
            <DialogTitle className="flex justify-center title-small text-content-primary">
                Error ao carregar suas moedas
            </DialogTitle>
            <DialogDescription className="body-medium text-content-secondary">
                Não conseguimos encontrar suas moedas, contate um administrador da aplicação para resolver.
            </DialogDescription>
          </div>
        )}
        {loadingUserCoins && (
          <Skeleton className="w-full h-12 rounded-xl" />
        )}
        {!loadingUserCoins && !errorUsercCoins && (
          <Fragment>    
            <div className="flex flex-col gap-1">
                <DialogTitle className="flex justify-center title-small text-content-primary">
                    Selecione uma moeda
                </DialogTitle>
                <DialogDescription className="body-medium text-content-secondary">
                    Selecione uma moeda para gerir suas finanças, caso esteja utilizando
                    alguma outra adicione ela a suas moedas.
                </DialogDescription>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col">
                {userCoins?.map((coin, i, arr) => (
                    <Fragment key={i}>
                      <CoinSelectorListItem isDefault={coin.code === userDefaultCoin?.code} id={coin.id} img={coin.img} desc={coin.desc} code={coin.code} onClick={handleClickCoin}/>
                      {arr.length - 1 !== i && <Separator />}
                    </Fragment>
                ))}
              </div>
              <Button variant="outline" size="lg" className="gap-2" onClick={() => navigate('/coins/search')}>
                <Plus />
                Adicionar Moeda
              </Button>
            </div>
          </Fragment>
        )}
      </DialogContent>
    </Dialog>
  );
}
