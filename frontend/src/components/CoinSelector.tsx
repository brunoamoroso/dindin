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
import { useQuery } from "@tanstack/react-query";
import { getUserSelectedCoins } from "@/api/coinService";
import { CoinType } from "@/types/CoinTypes";
import { Separator } from "./ui/separator";
import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";

export function CoinSelector() {
    const navigate = useNavigate();
    const {data} = useQuery<CoinType[]>({
        queryKey: ["userCoins"],
        queryFn: () => getUserSelectedCoins(),
    });
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex gap-2 items-center">
          <img
            src={`${
              import.meta.env.VITE_BACKEND_URL
            }/assets/coin-covers/brl.png`}
            alt="coin"
            className="w-7 h-7 object-cover rounded-full"
          />
          <div className="flex gap-1 items-center">
            <span className="text-subtle label-medium">BRL</span>
            <IconButton variant="ghost" size="small">
              <ChevronDown className="text-primary" />
            </IconButton>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-1 flex-col bg-container0 border-outline border p-6">
        <div className="flex flex-col gap-1">
            <DialogTitle className="flex justify-center title-small text-title">
                Selecione uma moeda
            </DialogTitle>
            <DialogDescription className="body-medium text-body">
                Selecione uma moeda para gerir suas finanças, caso esteja utilizando
                alguma outra adicione ela a suas moedas.
            </DialogDescription>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col">
            {data?.map((coin, i, arr) => (
                <Fragment key={i}>
                  <CoinSelectorListItem id={coin.id} img={coin.img} desc={coin.desc} code={coin.code}/>
                  {arr.length - 1 !== i && <Separator />}
                </Fragment>
            ))}
          </div>
          <Button variant="outline" size="lg" className="gap-2" onClick={() => navigate('/coins/search')}>
            <Plus />
            Adicionar Moeda
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
