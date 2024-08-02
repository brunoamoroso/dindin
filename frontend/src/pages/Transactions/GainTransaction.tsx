import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputChips } from "@/components/ui/input-chips";
import MenuListItem from "@/components/ui/menu-list-item";
import TextField from "@/components/ui/textfield";
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { Landmark, RefreshCw, Tag } from "lucide-react";
import { ChangeEvent, FormEvent, MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";

interface GainTransactionType{
    handleAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleAmountPlaceholder: (e: MouseEvent<HTMLDivElement>) => void;
    handleDateToday: (e: MouseEvent<HTMLButtonElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function GainTransaction({handleAmountChange, handleInputChange, handleAmountPlaceholder, handleDateToday, handleSubmit}: GainTransactionType) {
  const {contextCategory, contextAccount, contextRecurrency, contextDate, chipPressed}  = useTransactionsContext();
  const location = useLocation(); 
  return (
    <>
      <div className="container">
        <div className="py-8 ">
          <span className="label-medium text-subtle">Valor Recebido</span>
          <div className="flex gap-1">
            <span className="headline-small text-title">R$</span>
            <span
              id="amount_placeholder"
              className="headline-small text-positive"
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
              className="hidden text-positive"
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
              id="description"
              label="Descrição"
            //   value={contextDescription}
              placeholder="Escreva uma descrição"
              onChange={handleInputChange}
            />
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-title">Categoria</span>
              <Link to="/categories/gain">
                <MenuListItem>
                  <Tag />
                  {!contextCategory && "Escolha uma categoria"}
                  {contextCategory && (
                    <div className="flex flex-col">
                      {contextCategory.category?.desc}
                      {contextCategory.subCategory && (
                        <span className="body-small text-subtle">
                          {contextCategory.subCategory.desc}
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
                  {!contextAccount && "Escolha uma conta"}
                  {contextAccount && contextAccount.desc}
                </MenuListItem>
              </Link>
            </div>
            <div className="py-3 flex flex-col gap-1.5">
              <span className="label-large text-title">Quando recebeu?</span>
              <div className="flex gap-2">
                <InputChips
                  value={"today"}
                  variant={chipPressed === "today" ? "pressed" : "default"}
                  onClick={handleDateToday}
                  pressed={chipPressed === "today" ? true : false}
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
                      chipPressed === "otherDate" ? "pressed" : "default"
                    }
                    pressed={chipPressed === "otherDate" ? true : false}
                  >
                    {chipPressed === "otherDate" &&
                      contextDate !== undefined &&
                      contextDate.toLocaleDateString()}
                    {chipPressed !== "otherDate" && "Outra Data"}
                  </InputChips>
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-title">Repetir esse ganho</span>
              <Link to="/recurrency">
                <MenuListItem>
                  <RefreshCw />
                  {contextRecurrency.desc}
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
