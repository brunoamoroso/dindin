import { Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { IconButton } from "./ui/icon-button";
import { EllipsisVertical, SquarePen, Trash2 } from "lucide-react";
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

interface ActionsTransactionProps {
  id: string;
}

export default function ActionsTransaction({ id }: ActionsTransactionProps) {
  const [isDrawerOpen, setDrawerIsOpen] = useState(false);
  const [isDialogOpen, setDialogIsOpen] = useState(false);

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
            <Dialog open={isDialogOpen} onOpenChange={setDialogIsOpen} >
              <DialogTrigger asChild>
                <Button className="w-full" variant={"destructive"} size={"lg"}>
                  <Trash2 /> Excluir
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-container0 max-w-sm rounded-lg" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="title-small text-title text-left">Excluir transação?</DialogTitle>
                    <DialogDescription className="body-large text-body text-left">
                        Essa ação não pode ser desfeita, você confirma que quer excluir a transação <strong>Ipiranga</strong> do dia <strong>01/07/2023</strong>no valor de <strong>R$630</strong>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row-reverse gap-6">
                    <Link className="w-full" to={`/transaction/delete/${id}`}>
                        <Button
                            className="w-full"
                            variant={"destructive"}
                            size={"lg"}
                        >
                            <Trash2 /> Excluir
                        </Button>
                    </Link>
                    <DrawerClose>
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
