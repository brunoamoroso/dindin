import AppBar from "@/components/AppBar"
import { InlineTabs, InlineTabsContent, InlineTabsList, InlineTabsTrigger } from "@/components/ui/inline-tabs"
// import { useLocation } from "react-router-dom";
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { currencyFormat } from "@/utils/currencyFormat";
import GainTransaction from "./GainTransaction";

export default function Transaction() {
  const {contextAmount, setContextAmount, contextDescription, setContextDescription, contextCategory, contextAccount, contextRecurrency, contextDate, setContextDate, chipPressed, setChipPressed}  = useTransactionsContext();
  const [transaction, setTransaction] = useState({});
  // const location = useLocation();

  useEffect(() => {
    const amountPlaceholder = document.getElementById("amount_placeholder");

    if((contextAmount !== 0) && (amountPlaceholder !== null)){
      amountPlaceholder.innerHTML = currencyFormat(contextAmount);
    }

    setTransaction((prevTransaction) => ({
        ...prevTransaction,
        amount: contextAmount,
        desc: contextDescription,
        category: contextCategory,
        account: contextAccount,
        date: contextDate,
        recurrency: contextRecurrency
      }
    ));
  }, [contextAmount, contextDescription, contextCategory, contextAccount, contextDate, contextRecurrency]);

  const handleDate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(chipPressed !== "today"){
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const today = new Date(year, month, day);
      setChipPressed("today");
      setContextDate(today);
      return;
    }

    setChipPressed("none");
    setContextDate(undefined);
  }

  const handleAmountPlaceholder = (e: MouseEvent<HTMLSpanElement>) => {
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
    const amountInt = parseInt(e.target.value.replace(/[^0-9]+/g, ''));
    e.target.value = currencyFormat(amountInt);
    setContextAmount(amountInt);
    setTransaction((prevState) => ({
      ...prevState,
      amount: amountInt
    }));
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContextDescription(e.target.value);
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      [e.target.id]: e.target.value
    }));
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(transaction);
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
        <InlineTabsContent value="gain">
          <GainTransaction handleAmountChange={handleAmountChange} handleInputChange={handleInputChange} handleAmountPlaceholder={handleAmountPlaceholder} handleDateToday={handleDate} handleSubmit={handleSubmit}/>
        </InlineTabsContent>
      </InlineTabs>
    </div>
  )
}
