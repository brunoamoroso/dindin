import AppBar from "@/components/AppBar"
import { InlineTabs, InlineTabsContent, InlineTabsList, InlineTabsTrigger } from "@/components/ui/inline-tabs"
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { ChangeEvent, FormEvent, MouseEvent, useEffect } from "react";
import { currencyFormat } from "@/utils/currencyFormat";
import GainTransaction from "./GainTransaction";

export default function Transaction() {
  const {contextTransactionData, setContextTransactionData, chipPressed, setChipPressed}  = useTransactionsContext();

  useEffect(() => {
    const amountPlaceholder = document.getElementById("amount_placeholder");

    if((contextTransactionData.amount !== 0) && (amountPlaceholder !== null)){
      amountPlaceholder.innerHTML = currencyFormat(contextTransactionData.amount);
    }
  }, [contextTransactionData]);

  const handleDate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(chipPressed !== "today"){
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const today = new Date(year, month, day);
      setChipPressed("today");
      setContextTransactionData((prevTransaction) => ({
        ...prevTransaction,
        date: today
      }))
      return;
    }

    setChipPressed("none");
    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      date: undefined
    }))
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
    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      amount: amountInt,
    }));
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      [e.target.id]: e.target.value
    }));
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(contextTransactionData);
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
