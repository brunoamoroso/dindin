import AppBar from "@/components/AppBar"
import { InlineTabs, InlineTabsContent, InlineTabsList, InlineTabsTrigger } from "@/components/ui/inline-tabs"
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { ChangeEvent, FormEvent, MouseEvent, useEffect } from "react";
import { currencyFormat } from "@/utils/currencyFormat";
import GainTransaction from "./GainTransaction";
import ExpenseTransaction from "./ExpenseTransaction";
import { useToast } from "@/components/ui/use-toast";
import { ReceiptRussianRuble } from "lucide-react";

export default function Transaction() {
  const {contextTransactionData, setContextTransactionData}  = useTransactionsContext();
  const {toast} = useToast();

  useEffect(() => {
    const amountPlaceholder = document.getElementById("amount_placeholder");

    if((contextTransactionData.amount !== 0) && (amountPlaceholder !== null)){
      amountPlaceholder.innerHTML = currencyFormat(contextTransactionData.amount);
    }
  }, [contextTransactionData]);

  const handleDate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(contextTransactionData.date.chip !== "today"){
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const today = new Date(year, month, day);
      setContextTransactionData((prevTransaction) => ({
        ...prevTransaction,
        date: {
          chip: "today",
          value: today
        }
      }))
      return;
    }

    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      date: {
        chip: "none",
        value: undefined
      }
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

  const handleTypeTransaction = (e: string) => {
    if(e === "gain" || e === "expense"){
      setContextTransactionData((prevTransaction) => ({
        ...prevTransaction,
        type: e,
        category: undefined,
        subCategory: undefined,
      }))
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {type, amount, category, account, date, paymentMethod, paymentCondition, installments} = contextTransactionData;

    if(amount === 0){
      toast({
        title: "Sua transação não tem um valor",
        variant: "destructive",
        duration: 2000,
      });

      return;
    }

    if(category === undefined){
      toast({
        title: "Selecione ao menos uma categoria",
        variant: "destructive",
        duration: 2000,
      });

      return;
    }

    if(account === undefined){
      toast({
        title: "Selecione uma conta para a transação",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if(date.value === undefined){
      toast({
        title: "Selecione quando foi a transação",
        variant: "destructive",
        duration: 2000
      });
      return;
    }

    if((type === "expense") && (paymentMethod === "none")){
      toast({
        title: "Selecione a Forma de Pagamento da transação",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if((type === "expense") && (paymentCondition === "none")){  
      toast({
        title: "Selecione uma Condição de Pagamento para a transação",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if((paymentCondition === "multi") && (installments === "0")){
      toast({
        title: "Informe quantas parcelas terá a sua transação",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }


    console.log(contextTransactionData);
    return;
  }

  return (
    <div className="bg-surface h-dvh">
      <AppBar title="Adicionar Transação"/>
      <InlineTabs defaultValue={contextTransactionData.type} className="pt-8" onValueChange={handleTypeTransaction}>
        <InlineTabsList >
          <InlineTabsTrigger value="gain">Ganho</InlineTabsTrigger>
          <InlineTabsTrigger value="expense" className="data-[state=active]:text-negative data-[state=active]:border-negative">Despesa</InlineTabsTrigger>
        </InlineTabsList>
        <InlineTabsContent value="gain">
          <GainTransaction handleAmountChange={handleAmountChange} handleInputChange={handleInputChange} handleAmountPlaceholder={handleAmountPlaceholder} handleDateToday={handleDate} handleSubmit={handleSubmit}/>
        </InlineTabsContent>
        <InlineTabsContent value="expense">
        <ExpenseTransaction handleAmountChange={handleAmountChange} handleInputChange={handleInputChange} handleAmountPlaceholder={handleAmountPlaceholder} handleDateToday={handleDate} handleSubmit={handleSubmit} />
        </InlineTabsContent>
      </InlineTabs>
    </div>
  )
}
