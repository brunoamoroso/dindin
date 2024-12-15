import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputChips } from "@/components/ui/input-chips";
import MenuListItem from "@/components/ui/menu-list-item";
import TextField from "@/components/ui/textfield";
import { TransactionsContextType } from "@/context/TransactionsContext";
import { currencyFormat } from "@/utils/currency-format";
import splitInstallmentsDisplay from "@/utils/get-split-installments";
import { Landmark, RefreshCw, Tag } from "lucide-react";
import { ChangeEvent, FormEvent, MouseEvent, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

/**
 * condition is used to understand if I'm going to update one specific transaction or all transaction of a group installment. If single is one, if multi is the whole group.
 */
interface ExpenseTransactionType {
  handleAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAmountPlaceholder: (e: MouseEvent<HTMLDivElement>) => void;
  handleDateToday: (e: MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  mode: string;
  transactionScope: string;
}

export default function ExpenseTransaction({
  handleAmountChange,
  handleInputChange,
  handleAmountPlaceholder,
  handleDateToday,
  handleSubmit,
  mode,
  transactionScope,
}: ExpenseTransactionType) {
  const { contextTransactionData, setContextTransactionData }: TransactionsContextType = useOutletContext();
  const [isDialogpOpen, setIsDialogOpen] = useState(false);

  const handlePaymentChips = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;

    if (
      target.value === "single" &&
      contextTransactionData.installments !== "0"
    ) {
      const installDisplay = document.getElementById("installment-helper");

      if (installDisplay !== null) {
        installDisplay.innerText = "";
      }

      setContextTransactionData((prevTransaction) => ({
        ...prevTransaction,
        installments: "0",
      }));
    }

    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      [target.id]: target.value,
    }));
  };

  const handleInstallmentsChange = (e: ChangeEvent<HTMLInputElement>) => {
    let sanitized = parseInt(e.target.value.replace(/[^0-9]+/g, ""));

    if (isNaN(sanitized)) {
      sanitized = 0;
    }

    e.target.value = sanitized.toString();

    handleInputChange(e);
  };

  const handleInstallDisplay = () => {
    const installments = parseInt(contextTransactionData.installments);
    const installDisplay = document.getElementById("installment-helper");

    if (installDisplay !== null) {
      installDisplay.innerText = splitInstallmentsDisplay(
        contextTransactionData.amount,
        installments
      );
    }
  };

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
    <>
      <div className="container">
        <div className="py-8 ">
          <span className="label-medium text-subtle">Valor Gasto</span>
          <div className="flex gap-1">
            <span className="headline-small text-title">R$</span>
            <span
              id="amount_placeholder"
              className="headline-small text-negative"
              onClick={handleAmountPlaceholder}
            >
              {contextTransactionData.amount
                ? currencyFormat(contextTransactionData.amount)
                : "0,00"}
            </span>
            <Input
              variant={"ghost"}
              inputMode="numeric"
              pattern="[0-9]"
              id="amount_input"
              type="text"
              className="hidden text-negative"
              placeholder="0,00"
              onChange={handleAmountChange}
              value={currencyFormat(contextTransactionData.amount)}
            />
          </div>
        </div>
      </div>
      <div className="container rounded-t-lg bg-container2 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-16">
          <div className="flex flex-col gap-6">
            <TextField
              id="desc"
              label="Descrição"
              value={contextTransactionData.desc}
              placeholder="Escreva uma descrição"
              onChange={handleInputChange}
            />
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-title">Categoria</span>
              <Link to="/categories/expense">
                <MenuListItem>
                  <Tag />
                  {!contextTransactionData.category && "Escolha uma categoria"}
                  {contextTransactionData.category && (
                    <div className="flex flex-col">
                      {contextTransactionData.category.desc}
                      {contextTransactionData.subCategory && (
                        <span className="body-small text-subtle">
                          {contextTransactionData.subCategory.desc}
                        </span>
                      )}
                    </div>
                  )}
                </MenuListItem>
              </Link>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-title">Conta</span>
              <Link to="/transaction-accounts/list">
                <MenuListItem>
                  <Landmark />
                  {!contextTransactionData.account && "Escolha uma conta"}
                  {contextTransactionData.account &&
                    contextTransactionData.account.desc}
                </MenuListItem>
              </Link>
            </div>

            {((transactionScope === "all-installments" && mode === "edit") ||
              mode === "create") && (
              <div className="py-3 flex flex-col gap-1.5">
                <span className="label-large text-title">
                  Condição de Pagamento
                </span>
                <div className="flex gap-2">
                  <InputChips
                    id="paymentCondition"
                    value={"single"}
                    variant={
                      contextTransactionData.paymentCondition === "single"
                        ? "pressed"
                        : "default"
                    }
                    onClick={handlePaymentChips}
                    pressed={
                      contextTransactionData.paymentCondition === "single"
                        ? true
                        : false
                    }
                  >
                    À vista
                  </InputChips>
                  <InputChips
                    id="paymentCondition"
                    value={"multi"}
                    variant={
                      contextTransactionData.paymentCondition === "multi"
                        ? "pressed"
                        : "default"
                    }
                    onClick={handlePaymentChips}
                    pressed={
                      contextTransactionData.paymentCondition === "multi"
                        ? true
                        : false
                    }
                  >
                    Parcelado
                  </InputChips>
                </div>
              </div>
            )}

            {((transactionScope === "all-installments" && mode === "edit") ||
              mode === "create") && (
              <div className="flex flex-col gap-1.5">
                <TextField
                  id="installments"
                  label="Número de Parcelas"
                  placeholder="Número de Parcelas"
                  onChange={handleInstallmentsChange}
                  onKeyUp={handleInstallDisplay}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  disabled={
                    contextTransactionData.paymentCondition === "single" ||
                    contextTransactionData.paymentCondition === "none"
                  }
                  value={contextTransactionData.installments}
                />
                <span
                  id="installment-helper"
                  className="body-small text-subtle"
                ></span>
              </div>
            )}

            <div className="py-3 flex flex-col gap-1.5">
              <span className="label-large text-title">Quando pagou</span>
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
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-title">
                Repetir essa despesa
              </span>
              <Link to="/recurrency">
                <MenuListItem>
                  <RefreshCw />
                  {contextTransactionData.recurrency.desc}
                </MenuListItem>
              </Link>
            </div>
          </div>
          <Button type="submit" size={"lg"}>
            {mode === "create" ? "Adicionar Transação" : "Editar Transação"}
          </Button>
        </form>
      </div>
    </>
  );
}
