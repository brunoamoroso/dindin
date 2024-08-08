import AppBar from "@/components/AppBar";
import api from '@/api/api';
import MenuListItem from "@/components/ui/menu-list-item";
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionAccount() {
  const {setContextTransactionData} = useTransactionsContext();
  const navigate = useNavigate();

  const {data, isError, isLoading} = useQuery<{id: string, description: string}[]>({
    queryKey: ['accountsList'],
    queryFn: () => api.getAccounts()
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const value = e.currentTarget.dataset.value;
    const id = e.currentTarget.dataset.id;

    if((id === undefined) || (value === undefined)){
      throw new Error("Account undefined");
    }
    
    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      account: {
        id: id,
        desc: value
      }
    }));
    
    navigate('/transaction');
  }

  return (
    <div className="bg-surface h-dvh flex flex-col">
      <AppBar title="Escolha uma conta" />
      <div className="container flex flex-1 flex-col rounded-t-lg bg-container2 py-10">
        {isError && (
          <h1 className="title-large text-title">Tivemos um problema ao tentar carregar suas contas.</h1>
        )}

        {isLoading && (
          <div className="flex flex-col gap-6">
          {Array.from({length: 5}).map((_x, i, arr) => {
            if(arr.length - 1 === i){
              return (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="w-full h-4 rounded-xl"/>
                </div>
              );
            }else{
              return (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="w-full h-4 rounded-xl"/>
                  <Separator />
                </div>
              );
            }
          })}
        </div>
        )}

        {(!isLoading && data !== undefined) && (
          data.map((account, index, arr) => {
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
          })
        )}
        {(!isLoading && data?.length === 0) && (
          <h1 className="title-large text-title">Não há nenhuma conta cadastrada ainda.</h1>
        )}
      </div>
    </div>
  )
}
