import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { IconButton } from "./ui/icon-button";
import { CircleCheck, EllipsisVertical, SquarePen, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "./ui/dialog";
import { currencyFormat } from "@/utils/currency-format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "./ui/use-toast";

interface ActionsTransactionProps {
  id: string;
  desc: string;
  date: string;
  amount: number;
  installments: number;
}

export default function ActionsTransaction({
  id,
  desc,
  date,
  amount,
  installments
}: ActionsTransactionProps) {
  const [isDrawerOpen, setDrawerIsOpen] = useState(false);
  const [isDialogOpen, setDialogIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => {
      return api.deleteTransaction(id);
    },
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: (
            <div className="flex gap-3 items-center">
              <CircleCheck />
              Transação excluída
            </div>
          ),
          duration: 2500,
          variant: "positive",
        });

        queryClient.invalidateQueries({
          queryKey: ["listalltransactions-data"],
        });

        setDrawerIsOpen(false);
        setDialogIsOpen(false);
      },
    });
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setDrawerIsOpen}>
      <DrawerTrigger asChild>
        <IconButton variant={"ghost"} size={"small"}>
          <EllipsisVertical width={16} />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent className="bg-container1 flex border-outline rounded-t-lg">
        <div className="container flex flex-col gap-6 py-10 w-full items-center">
          <DrawerTitle className="title-small text-title">
            O que você quer fazer?
          </DrawerTitle>
          <div className="flex flex-col w-full items-center gap-6">
            <Dialog open={isDialogOpen} onOpenChange={setDialogIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" variant={"destructive"} size={"lg"}>
                  <Trash2 /> Excluir
                </Button>
              </DialogTrigger>
              <DialogContent
                className="bg-container0 max-w-sm rounded-lg"
                showCloseButton={false}
              >
                <DialogHeader>
                  <DialogTitle className="title-small text-title text-left">
                    Excluir transação?
                  </DialogTitle>
                  <DialogDescription className="body-large text-body text-left">
                    Essa ação não pode ser desfeita.
                    <br />
                    <br />
                    Excluir a transação <strong>{desc}</strong>
                    <br />
                    do dia{" "}
                    <strong>{new Date(date).toLocaleDateString()}</strong>
                    <br />
                    no valor de{" "}
                    <strong> {"R$" + currencyFormat(amount)}</strong>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row-reverse gap-6">
                    <Button
                      className="w-full"
                      variant={"destructive"}
                      size={"lg"}
                      onClick={() => handleDelete(id)}
                    >
                      <Trash2 /> Excluir
                    </Button>
                  <DrawerClose asChild>
                    <Button className="w-full" variant={"outline"} size={"lg"}>
                      Cancelar
                    </Button>
                  </DrawerClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Link className="w-full" to={`/transaction/edit/${id}`}>
              <Button className="w-full" variant={"outline"} size={"lg"}>
                <SquarePen /> Editar
              </Button>
            </Link>
            <Button
              className="w-full text-body"
              variant={"ghost"}
              size={"lg"}
              onClick={() => setDrawerIsOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
