import AppBar from "@/components/AppBar";
import {useEffect, useState } from "react";
import api from '@/api/api';
import MenuListItem from "@/components/ui/menu-list-item";
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { useNavigate } from "react-router-dom";

export default function TransactionAccount() {
  const [accountsList, setAccountsList] = useState([]);
  const {setContextAccount} = useTransactionsContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getAccounts = async () => {
      const response: {status: number; message: []} = await api.getAccounts();
      setAccountsList(response.message);
    }

    getAccounts();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const value = e.currentTarget.dataset.value;
    const id = e.currentTarget.dataset.id;

    if((id === undefined) || (value === undefined)){
      throw new Error("Account undefined");
    }
    
    setContextAccount({
      id: id,
      desc: value
    })
    navigate('/transaction');
  }

  return (
    <div className="bg-surface h-dvh flex flex-col">
      <AppBar title="Escolha uma conta" />
      <div className="container flex flex-1 flex-col rounded-t-lg bg-container2 py-10">
         {accountsList.map((account: {id: string; description: string;}, index, arr) => {
                if(arr.length - 1 === index){
                //last item
                return (                
                    <MenuListItem size="lg" trailingIcon={false} key={index} dataId={account.id} value={account.description} onClick={handleClick}>{account.description}</MenuListItem>
                )
                }else{
                return (   
                    <MenuListItem size="lg" trailingIcon={false} key={index} dataId={account.id} value={account.description} onClick={handleClick} separator={true}>{account.description}</MenuListItem>          
                  )
                }
            })}
            {accountsList.length === 0 && (
                <h1 className="title-large text-title">Não há nenhuma conta cadastrada ainda.</h1>
            )}
      </div>
    </div>
  )
}
