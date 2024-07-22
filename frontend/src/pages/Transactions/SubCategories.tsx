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
  const [subCategories, setSubCategories] = useState<{desc: string, type: string}[]>([]);
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
    if(category === undefined){ 
      throw new Error("category undefined");
    }

    if(setContextCategory){
      setContextCategory({category: category, subCategory: e.currentTarget.dataset.value});
    }
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
                    <MenuListItem size="lg" trailingIcon={false} key={index} value={subCategory.desc} onClick={handleClick}>{subCategory.desc}</MenuListItem>
                )
                }else{
                return (
                    <MenuListItem size="lg" trailingIcon={false} key={index} value={subCategory.desc} onClick={handleClick} separator={true}>{subCategory.desc}</MenuListItem>          
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
