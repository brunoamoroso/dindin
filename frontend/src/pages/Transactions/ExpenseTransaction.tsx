import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputChips } from "@/components/ui/input-chips";
import MenuListItem from "@/components/ui/menu-list-item";
import TextField from "@/components/ui/textfield";
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { Landmark, RefreshCw, Tag } from "lucide-react";
import { ChangeEvent, FormEvent, MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";

interface ExpenseTransactionType{
    handleAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleAmountPlaceholder: (e: MouseEvent<HTMLDivElement>) => void;
    handleDateToday: (e: MouseEvent<HTMLButtonElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ExpenseTransaction({handleAmountChange, handleInputChange, handleAmountPlaceholder, handleDateToday, handleSubmit}: ExpenseTransactionType) {
  const {contextTransactionData, setContextTransactionData}  = useTransactionsContext();
  const location = useLocation(); 

  const handlePaymentChips = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.target as HTMLButtonElement;

    if((contextTransactionData.paymentMethod === target.value) || (contextTransactionData.paymentCondition === target.value)){
      setContextTransactionData((prevTransaction) => ({
        ...prevTransaction,
        [target.id]: "none"
      }));
      return;
    }

    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      [target.id]: target.value
    }))

    if(target.value === "debit"){
      setContextTransactionData((prevTransaction) => ({
        ...prevTransaction,
        paymentCondition: "single"
      }))
    }

    if(contextTransactionData.paymentMethod === "credit" && target.value === "single"){
      setContextTransactionData((prevTransaction) => ({
        ...prevTransaction,
        installments: ""
      }))
    }
  }

  const handleInstallmentsChange = (e: ChangeEvent<HTMLInputElement>) => {
    let sanitized = parseInt(e.target.value.replace(/[^0-9]+/g, ''));

    if(isNaN(sanitized)){
      sanitized = 0;
    }

    e.target.value = sanitized.toString();

    handleInputChange(e);
  }

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
              0,00
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
                  {contextTransactionData.account && contextTransactionData.account.desc}
                </MenuListItem>
              </Link>
            </div>
            <div className="py-3 flex flex-col gap-1.5">
              <div className="flex flex-col gap-1">
                <span className="label-large text-title">Forma de Pagamento</span>
                <span className="body-small text-subtle">Pagamentos de boleto, no pix ou em dinheiro também devem ser considerados como débito</span>
              </div>
              <div className="flex gap-2">
                <InputChips
                    id="paymentMethod"
                    value={"debit"}
                    variant={
                      contextTransactionData.paymentMethod === "debit" ? "pressed" : "default"
                    }
                    onClick={handlePaymentChips}
                    pressed={contextTransactionData.paymentMethod === "debit" ? true : false}
                  >
                    Débito
                </InputChips>
                <InputChips
                  id="paymentMethod"
                  value={"credit"}
                  variant={contextTransactionData.paymentMethod === "credit" ? "pressed" : "default"}
                  onClick={handlePaymentChips}
                  pressed={contextTransactionData.paymentMethod === "credit" ? true : false}
                >
                  Crédito
                </InputChips>
              </div>
            </div>
            <div className="py-3 flex flex-col gap-1.5">
              <span className="label-large text-title">Condição de Pagamento</span>
              <div className="flex gap-2">
                <InputChips
                  id="paymentCondition"
                  value={"single"}
                  variant={(contextTransactionData.paymentCondition === "single" || contextTransactionData.paymentMethod ===  "debit") ? "pressed" : "default"}
                  onClick={handlePaymentChips}
                  pressed={(contextTransactionData.paymentCondition === "single" || contextTransactionData.paymentMethod === "debit" ) ? true : false}
                >
                  À vista
                </InputChips>
                <InputChips
                    id="paymentCondition"
                    value={"multi"}
                    variant={
                      (contextTransactionData.paymentCondition === "multi" && contextTransactionData.paymentMethod !== "debit") ? "pressed" : "default"
                    }
                    onClick={handlePaymentChips}
                    pressed={(contextTransactionData.paymentCondition === "multi" && contextTransactionData.paymentMethod !== "debit") ? true : false}
                    disabled={contextTransactionData.paymentMethod === "debit"}
                  >
                    Parcelado
                </InputChips>
              </div>
            </div>

            <TextField 
              id="installments"
              label="Número de Parcelas" 
              placeholder="Número de Parcelas" 
              onChange={handleInstallmentsChange} 
              pattern="[0-9]*" 
              inputMode="numeric"
              disabled={contextTransactionData.paymentMethod === "debit" || contextTransactionData.paymentCondition === "single"}
              value={contextTransactionData.installments}
            />
            
            <div className="py-3 flex flex-col gap-1.5">
              <span className="label-large text-title">Quando pagou</span>
              <div className="flex gap-2">
                <InputChips
                  value={"today"}
                  variant={contextTransactionData.date.chip === "today" ? "pressed" : "default"}
                  onClick={handleDateToday}
                  pressed={contextTransactionData.date.chip === "today" ? true : false}
                >
                  Hoje
                </InputChips>
                <Link
                  to={"/transaction/date"}
                  state={{ previousLocation: location }}
                >
                  <InputChips
                    value={"searchDate"}
                    variant={
                      contextTransactionData.date.chip === "otherDate" ? "pressed" : "default"
                    }
                    pressed={contextTransactionData.date.chip === "otherDate" ? true : false}
                  >
                    {contextTransactionData.date.chip === "otherDate" &&
                      contextTransactionData.date.value !== undefined &&
                      contextTransactionData.date.value.toLocaleDateString()}
                    {contextTransactionData.date.chip !== "otherDate" && "Outra Data"}
                  </InputChips>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-title">Repetir esse ganho</span>
              <Link to="/recurrency">
                <MenuListItem>
                  <RefreshCw />
                  {contextTransactionData.recurrency.desc}
                </MenuListItem>
              </Link>
            </div>
          </div>
          <Button type="submit" size={"lg"}>
            Adicionar Transação
          </Button>
        </form>
      </div>
    </>
  );
}
