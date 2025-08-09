import { useDashboardContext } from "@/context/DashboardContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "./ui/dialog";
import { IconButton } from "./ui/icon-button";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCoin } from "@/api/coinService";
import { useToast } from "./ui/use-toast";

export function RemoveCoin() {

    const { coinSelected, setCoinSelected } = useDashboardContext();

    const [openRemoveCoinDialog, setOpenRemoveCoinDialog] = useState(false);

    const {toast} = useToast();

    const queryClient = useQueryClient();

    const mutationRemoveCoin = useMutation({
        mutationFn: () => {
            return removeCoin({ coinCode: coinSelected });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
            queryClient.invalidateQueries({ queryKey: ["user-coins"] });
            setCoinSelected("global");
            setOpenRemoveCoinDialog(false);
        },
        onError: (error) => {
            toast({
                title: "Erro ao remover moeda",
                description: "Não foi possível remover a moeda selecionada. Tente novamente mais tarde.",
                variant: "destructive",
            })
            console.error("Error removing coin:", error);
        }
    });
    return (
        <>
          {coinSelected !== "global" && (
            <Dialog open={openRemoveCoinDialog} onOpenChange={setOpenRemoveCoinDialog}>
              <DialogTrigger>
                <IconButton variant={"outline"} size="small">
                  <Trash2 />
                </IconButton>
              </DialogTrigger>
              <DialogContent showCloseButton={false} className="flex flex-col gap-8">
                <div className="flex flex-col gap-1.5">
                  <DialogTitle>
                    Deseja remover a moeda?
                  </DialogTitle>
                  <DialogDescription>
                    Remover a moeda não vai excluir as transações associadas a ela, mas apenas a moeda selecionada. Você poderá adicioná-la novamente mais tarde.
                  </DialogDescription>
                </div>
                <DialogFooter className="flex flex-row gap-6">
                  <Button variant="outline" className="flex flex-1" size="lg" onClick={() => setOpenRemoveCoinDialog(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" className="flex flex-1" size="lg" onClick={() => mutationRemoveCoin.mutate()}>
                    Remover
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

        </>
    )
}