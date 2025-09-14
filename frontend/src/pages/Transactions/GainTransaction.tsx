import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputChips } from "@/components/ui/input-chips";
import MenuListItem from "@/components/ui/menu-list-item";
import TextField from "@/components/ui/textfield";
import { TransactionsContextType } from "@/context/TransactionsContext";
import { cn } from "@/lib/utils";
import { currencyFormat } from "@/utils/currency-format";
import { getCurrencySymbol } from "@/utils/get-currency-symbol";
import { Landmark, LoaderCircle, Tag } from "lucide-react";
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

interface GainTransactionType {
  handleAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAmountPlaceholder: (e: MouseEvent<HTMLDivElement>) => void;
  handleDateToday: (e: MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  mutationPending: boolean;
  mode: string;
}

export default function GainTransaction({
  handleAmountChange,
  handleInputChange,
  handleAmountPlaceholder,
  handleDateToday,
  handleSubmit,
  mutationPending,
  mode,
}: GainTransactionType) {
  const {
    contextTransactionData,
    setContextTransactionData,
  }: TransactionsContextType = useOutletContext();
  const [isDialogpOpen, setIsDialogOpen] = useState(false);

  const handleDayClick = (day: Date) => {
    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      date: {
        chip: "otherDate",
        value: day,
      },
    }));
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="mx-6">
        <div className="py-8 ">
          <span className="label-medium text-content-subtle">Valor Recebido</span>
          <div className="flex gap-1">
            <span className="headline-small text-content-primary">
              {getCurrencySymbol(contextTransactionData.coin)}
            </span>
            <span
              id="amount_placeholder"
              className="headline-small text-positive"
              onClick={handleAmountPlaceholder}
            >
              {contextTransactionData.amount
                ? currencyFormat(contextTransactionData.amount)
                : "0.00"}
            </span>
            <Input
              variant={"ghost"}
              inputMode="numeric"
              pattern="[0-9]"
              id="amount_input"
              type="text"
              className="hidden text-positive bg-transparent focus-visible:ring-0"
              placeholder="0.00"
              onChange={handleAmountChange}
              value={currencyFormat(contextTransactionData.amount)}
            />
          </div>
        </div>
      </div>
      <div className="px-6 rounded-t-lg bg-layer-tertiary py-10 flex flex-col flex-1">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 gap-16 justify-between"
        >
          <div className="flex flex-col gap-6">
            <TextField
              id="description"
              label="Descrição"
              value={contextTransactionData.description}
              placeholder="Escreva uma descrição"
              onChange={handleInputChange}
            />
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-content-primary">Categoria</span>
              <Link
                to="/categories/gain"
                state={{ mode: mode, id: contextTransactionData.id }}
              >
                <MenuListItem>
                  <Tag />
                  {!contextTransactionData.category && "Escolha uma categoria"}
                  {contextTransactionData.category && (
                    <div className="flex flex-col">
                      {contextTransactionData.category}
                      {contextTransactionData.subcategory && (
                        <span className="body-small text-content-subtle">
                          {contextTransactionData.subcategory}
                        </span>
                      )}
                    </div>
                  )}
                </MenuListItem>
              </Link>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-content-primary">Conta</span>
              <Link
                to="/accounts/list"
                state={{ mode: mode, id: contextTransactionData.id, flow: "transaction" }}
              >
                <MenuListItem>
                  <Landmark />
                  {!contextTransactionData.account && "Escolha uma conta"}
                  {contextTransactionData.account &&
                    contextTransactionData.account}
                </MenuListItem>
              </Link>
            </div>
            <div className="py-3 flex flex-col gap-1.5">
              <span className="label-large text-content-primary">Quando recebeu</span>
              <div className="flex gap-2">
                <InputChips
                  value={"today"}
                  variant={
                    contextTransactionData.date.chip === "today"
                      ? "pressed"
                      : "default"
                  }
                  onClick={handleDateToday}
                  pressed={
                    contextTransactionData.date.chip === "today" ? true : false
                  }
                >
                  Hoje
                </InputChips>
                <Dialog open={isDialogpOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
                    <InputChips
                      value={"searchDate"}
                      variant={
                        contextTransactionData.date.chip === "otherDate"
                          ? "pressed"
                          : "default"
                      }
                      pressed={
                        contextTransactionData.date.chip === "otherDate"
                          ? true
                          : false
                      }
                    >
                      {contextTransactionData.date.chip === "otherDate" &&
                        contextTransactionData.date.value !== undefined &&
                        contextTransactionData.date.value.toLocaleDateString()}
                      {contextTransactionData.date.chip !== "otherDate" &&
                        "Outra Data"}
                    </InputChips>
                  </DialogTrigger>
                  <DialogContent
                    className="w-auto bg-transparent border-none"
                    showCloseButton={false}
                  >
                    <DialogTitle className="hidden">Calendário</DialogTitle>
                    <DialogDescription className="hidden">
                      Escolha a data em que aconteceu a transação
                    </DialogDescription>
                    <Calendar
                      selected={contextTransactionData.date.value}
                      onDayClick={handleDayClick}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {/* Removed for first release */}
            {/* <div className="flex flex-col gap-1.5">
              <span className="label-large text-content-primary">Repetir esse ganho</span>
              <Link to="/recurrency">
                <MenuListItem>
                  <RefreshCw />
                  {contextTransactionData.recurrency.desc}
                </MenuListItem>
              </Link>
            </div> */}
          </div>
          <Button
            type="submit"
            size={"lg"}
            className={cn(
              `${
                mutationPending &&
                "opacity-50 cursor-not-allowed pointer-events-none flex items-center gap-2"
              }`
            )}
          >
            {mutationPending ? (
              <div className="flex items-center gap-2">
                <LoaderCircle size={16} className="animate-spin" />
                Carregando
              </div>
            ) : (
              <>
                {mode === "create" ? "Adicionar Transação" : "Editar Transação"}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
