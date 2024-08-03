import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import TextField from "@/components/ui/textfield";
import { MouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from '@/api/api';
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Categories() {
  const {type} = useParams();
  const navigate = useNavigate();
  const {setContextTransactionData} = useTransactionsContext();

  if(type === undefined){
    throw new Error("type undefined");
  }

  const {data, isError, isLoading} = useQuery({
    queryKey: ['allCategories', type],
    queryFn: () => api.getCategories(type)
  });

  // useEffect(() => {
  //   const getCategories = async () => {
  //     if(type === undefined){
  //       throw new Error("type undefined");
  //     }

  //     const response: {status: string, message: []} = await api.getCategories(type);
  //     setCategories(response.message)
  //   }
    
  //   getCategories();
  // }, [type]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.dataset.id;
    const desc = e.currentTarget.dataset.value;

    if((id === undefined) || (desc === undefined)){
      throw new Error("Category is undefined");
    }

    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      category: {
        id: id,
        desc: desc
      }
    }))

    navigate(`/categories/sub/${desc}`);
  }

  const categories = data?.message || [];

  return (
    <div className="bg-surface h-dvh flex flex-col">
      <AppBar title="Escolha uma categoria"/>
      <div className="container flex flex-1 flex-col bg-container2 rounded-t-lg py-10 gap-6">
        <TextField label="Buscar" placeholder="Busque por uma categoria ou subcategoria"/>

        {isLoading && (
          <div className="flex flex-col gap-6">
            {Array.from({length: 5}).map((item, i, arr) => {
              if(arr.length - 1 === i){
                return (
                  <div className="flex flex-col gap-4">
                    <Skeleton className="w-full h-4 rounded-xl"/>
                  </div>
                );
              }else{
                return (
                  <div className="flex flex-col gap-4">
                    <Skeleton className="w-full h-4 rounded-xl"/>
                    <Separator />
                  </div>
                );
              }
            })}
          </div>
        )}

        {!isLoading && (
          <div className="flex flex-col">
            {categories.map((category, index, arr) => {
              if(arr.length - 1 === index){
                //last item
                return (                
                    <MenuListItem size="lg" key={index} dataId={category.id} value={category.desc} onClick={handleClick}>{category.desc}</MenuListItem>
                )
              }else{
                return (                
                    <MenuListItem size="lg" key={index} dataId={category.id} value={category.desc} onClick={handleClick} separator={true}>{category.desc}</MenuListItem>
                )
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
