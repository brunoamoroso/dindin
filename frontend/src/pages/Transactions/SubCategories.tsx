import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from '@/api/api';
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { Button } from "@/components/ui/button";

export default function SubCategories() {
  const navigate = useNavigate();
  const {category} = useParams();
  const [subCategories, setSubCategories] = useState<{id: string; desc: string;}[]>([]);
  const {setContextCategory} = useTransactionsContext();

  useEffect(() => {
    const getSubCategories = async () => {
      if(category === undefined){ 
        throw new Error("category undefined");
      }

      const response: {status: number, message: []} = await api.getSubCategories(category);
      
      if(response.status === 200){
          setSubCategories(response.message)
      }
    }
    
    getSubCategories();
  }, [category]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.dataset.id;
    const desc = e.currentTarget.dataset.value;

    if((id === undefined) || (desc === undefined)){
      throw new Error("subcategory undefined");
    }

    setContextCategory((prevState) => ({
      ...prevState,
      subCategory: {
        id: id,
        desc: desc
      }
    }));

    navigate("/transaction");
  }

  return (
    <div className="bg-surface flex flex-col h-dvh">
      <AppBar title={`SubCategorias de ${category}`}/>
      <div className="container flex flex-1 flex-col bg-container2 rounded-t-lg py-10 justify-between">
        <div className="flex flex-col flex-1">
            {subCategories.map((subCategory, index, arr) => {
                if(arr.length - 1 === index){
                //last item
                return (                
                    <MenuListItem size="lg" trailingIcon={false} key={index} dataId={subCategory.id} value={subCategory.desc} onClick={handleClick}>{subCategory.desc}</MenuListItem>
                )
                }else{
                return (
                    <MenuListItem size="lg" trailingIcon={false} key={index} dataId={subCategory.id} value={subCategory.desc} onClick={handleClick} separator={true}>{subCategory.desc}</MenuListItem>          
                  )
                }
            })}
            {subCategories.length === 0 && (
                <h1 className="title-large text-title">Essa categoria não possuí nenhuma subcategoria ainda.</h1>
            )}
        </div>
        <div className="flex flex-col gap-6">
            <Button variant={"ghost"}>Não escolher subcategoria</Button>
        </div>
      </div>
    </div>
  );
}
