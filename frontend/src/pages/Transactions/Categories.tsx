import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import TextField from "@/components/ui/textfield";
import { MouseEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from '@/api/api';
import { useTransactionsContext } from "@/hooks/useTransactionsContext";

export default function Categories() {
  const {type} = useParams();
  const [categories, setCategories] = useState([{id: "", desc: ""}]);
  const navigate = useNavigate();
  const {setContextTransactionData} = useTransactionsContext();

  useEffect(() => {
    const getCategories = async () => {
      if(type === undefined){
        throw new Error("type undefined");
      }

      const response: {status: string, message: []} = await api.getCategories(type);
      setCategories(response.message)
    }
    
    getCategories();
  }, [type]);

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

  return (
    <div className="bg-surface h-dvh flex flex-col">
      <AppBar title="Escolha uma categoria"/>
      <div className="container flex flex-1 flex-col bg-container2 rounded-t-lg py-10 gap-6">
        <TextField label="Buscar" placeholder="Busque por uma categoria ou subcategoria"/>
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
      </div>
    </div>
  );
}
