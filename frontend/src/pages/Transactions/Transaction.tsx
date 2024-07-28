import AppBar from "@/components/AppBar"
import { Button } from "@/components/ui/button"
import { InlineTabs, InlineTabsList, InlineTabsTrigger } from "@/components/ui/inline-tabs"
import {InputChips} from "@/components/ui/input-chips";
import MenuListItem from "@/components/ui/menu-list-item";
import TextField from "@/components/ui/textfield";
import { Landmark, RefreshCw, Tag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { ChangeEvent, KeyboardEvent, MouseEvent, useState } from "react";
import { Input } from "@/components/ui/input";

export default function Transaction() {
  const {contextCategory, contextAccount, contextRecurrency, contextDate, setContextDate, otherDateChipPressed, setOtherDateChipPressed}  = useTransactionsContext();
  const [todayChipPressed, setTodayChipPressed] = useState(false);
  const location = useLocation();

  const handleDateToday = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(!todayChipPressed){
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const today = new Date(year, month, day);
      setOtherDateChipPressed(false);
      setContextDate(today);
      setTodayChipPressed(true);
      return;
    }

    setTodayChipPressed(false);
    setContextDate(undefined);
  }

  const handleClickAmountPlaceholder = (e: MouseEvent<HTMLSpanElement>) => {
    const placeholder = e.currentTarget;
    const ghostInput = document.getElementById("amount_input");
    if(ghostInput?.classList.contains("hidden")){
      placeholder.classList.add("hidden");
      ghostInput.classList.remove("hidden");
      ghostInput.focus();
      return;
    }

  }

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    let cleanInput = parseInt(e.target.value.replace(/[^0-9]+/g, ''))/100;
    if(isNaN(cleanInput)){
      cleanInput = 0;
    }
    const formattedValue = new Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(cleanInput).slice(3);
    e.target.value = formattedValue;
  }

  const handleSubmit = () => {
    return;
  }

  return (
    <div className="bg-surface h-dvh">
      <AppBar title="Adicionar Transação"/>
      <InlineTabs defaultValue="gain" className="pt-8">
        <InlineTabsList>
          <InlineTabsTrigger value="gain">Ganho</InlineTabsTrigger>
          <InlineTabsTrigger value="expense" className="data-[state=active]:text-negative data-[state=active]:border-negative">Despesa</InlineTabsTrigger>
        </InlineTabsList>
      </InlineTabs>
      <div className="container">
        <div className="py-8 ">
          <span className="label-medium text-subtle">Valor Recebido</span>
          <div className="flex gap-1">
            <span className="headline-small text-title">R$</span>
            <span className="headline-small text-positive" onClick={handleClickAmountPlaceholder}>0,00</span>
            <Input variant={"ghost"} inputMode="numeric" pattern="[0-9]" id="amount_input" type="text" className="hidden text-positive" placeholder="0,00" onChange={handleAmountChange} />
          </div>
        </div>
      </div>
      <div className="container rounded-t-lg bg-container2 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-16">
          <div className="flex flex-col gap-6">
            <TextField label="Descrição" placeholder="Escreva uma descrição"/>
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-title">Categoria</span>
              <Link to="/categories/gain">
                <MenuListItem>
                  <Tag />
                  {!contextCategory && ("Escolha uma categoria")}
                  {contextCategory && (
                  <div className="flex flex-col">
                    {contextCategory.category?.desc}
                    {contextCategory.subCategory && (
                      <span className="body-small text-subtle">{contextCategory.subCategory.desc}</span>
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
                  {!contextAccount && ("Escolha uma conta")}
                  {contextAccount && (contextAccount.desc)}
                </MenuListItem>
              </Link>
            </div>
            <div className="py-3 flex flex-col gap-1.5">
              <span className="label-large text-title">Quando recebeu?</span>
              <div className="flex gap-2">
                <InputChips value={"today"} variant={todayChipPressed ? "pressed" : "default"} onClick={handleDateToday} pressed={todayChipPressed}>Hoje</InputChips>
                <Link to={"/transaction/date"} state={{previousLocation: location}}>
                  <InputChips value={"searchDate"} variant={otherDateChipPressed ? "pressed" : "default"} pressed={otherDateChipPressed}>
                  {(!todayChipPressed && contextDate !== undefined) && (contextDate.toLocaleDateString())}
                  {!otherDateChipPressed && ("Outra Data")}
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
          <Button type="submit" size={"lg"}>Adicionar Transação</Button>
        </form>
      </div>
    </div>
  )
}
