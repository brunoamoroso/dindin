import { LimitType } from "@/types/LimitType";
import getCategoryIcon from "@/utils/get-category-icon";
import { Progress } from "./ui/progress";
import { currencyFormat } from "@/utils/currency-format";
import { cn } from "@/lib/utils";
import { IconButton } from "./ui/icon-button";
import { CircleCheck, EllipsisVertical, SquarePen, Trash2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLimit } from "@/api/limitService";
import { useToast } from "./ui/use-toast";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Link } from "react-router-dom";

export function LimitListItem({ ...props }: LimitType) {
  const badge = getCategoryIcon(props.category);
  const progressValue = (props.amount_spent / props.amount_limit) * 100;
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const mutationDelete = useMutation({
    mutationFn: (id: string) => { return deleteLimit(id); },
  });

  const handleDelete = (id: string) => {
    mutationDelete.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["limits-data"] });
        toast({
          title: (
            <div className="flex gap-3 items-center">
              <CircleCheck />
              Limite Excluído
            </div>
          ),
          duration: 2500,
          variant: "positive",
        });
      }
    });
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-1 justify-between items-center">
        <div className="flex gap-2 items-center">
          <div
            className={"p-2 rounded text-content-primary"}
            style={{
              backgroundColor: badge.dataVizColor,
              borderColor: badge.dataVizBorderColor,
            }}
          >
            {badge.icon}
          </div>
          <div className="flex flex-col text-content-primary label-large">
            {props.category}
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <span className="text-content-primary label-large">
              {currencyFormat(props.amount_spent)}{" "}
            </span>
            <span className="text-content-subtle body-large">
              / {currencyFormat(props.amount_limit)}
            </span>
          </div>
          <Drawer>
            <DrawerTrigger asChild>
              <IconButton variant="ghost" size="small">
                <EllipsisVertical />
              </IconButton>
            </DrawerTrigger>
            <DrawerContent>
              <div className="container flex flex-col gap-6 py-10 w-full items-center">
                <DrawerTitle>O que você quer fazer?</DrawerTitle>
                <div className="flex flex-col w-full items-center gap-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="lg" className="w-full">
                        <Trash2 /> Excluir
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Tem certeza que deseja excluir este limite?</DialogTitle>
                      <DialogDescription className="body-medium text-content-secondary">
                          Esta ação não pode ser desfeita. As transações associadas a este limite não serão excluídas.
                      </DialogDescription>
                      <div className="flex gap-2 mt-8">
                        <DialogClose className="flex flex-1" asChild>
                          <Button variant="outline" className="w-full" size="lg">
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button variant="destructive" className="flex flex-1" size="lg" onClick={() => handleDelete(props.id!)}>
                          Excluir
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Link to={`/limits/edit/${props.id}`} className="w-full">
                    <Button variant="outline" size="lg" className="w-full">
                      <SquarePen /> Editar
                    </Button>
                  </Link>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      <Progress
        value={progressValue}
        className={cn(
          "bg-layer-primary",
          progressValue > 100 ? "[&>div]:bg-critical" : ""
        )}
      />
    </div>
  );
}
