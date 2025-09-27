import { LimitType } from "@/types/LimitType";
import getCategoryIcon from "@/utils/get-category-icon";
import { Progress } from "./ui/progress";
import { currencyFormat } from "@/utils/currency-format";
import { cn } from "@/lib/utils";
import { IconButton } from "./ui/icon-button";
import { EllipsisVertical, SquarePen, Trash2 } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";

export function LimitListItem({ ...props }: LimitType) {
  const badge = getCategoryIcon(props.category);
  const progressValue = (props.amount_spent / props.amount_limit) * 100;

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
                  <Button variant="destructive" size="lg" className="w-full">
                    <Trash2 /> Excluir
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    <SquarePen /> Editar
                  </Button>
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
