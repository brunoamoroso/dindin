import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from '@/api/api';

export default function SubCategories() {
  const {category} = useParams();
  const [subCategories, setSubCategories] = useState<{desc: string, type: string}[]>([]);

  useEffect(() => {
    const getSubCategories = async () => {
      if(category === undefined){ 
        throw new Error("type undefined");
      }

      const response: {status: number, message: []} = await api.getSubCategories(category);
      console.log(subCategories);
      if(response.status === 200){
          setSubCategories(response.message)
      }
    }
    
    getSubCategories();
  }, [category]);

  return (
    <div className="bg-surface h-dvh">
      <AppBar title={`SubCategorias de ${category}`}/>
      <div className="container flex flex-col bg-container2 h-dvh rounded-t-lg py-10">
          {subCategories.map((subCategory, index, arr) => {
            if(arr.length - 1 === index){
              //last item
              return (                
                <Link to="/" key={index}>
                  <MenuListItem size="lg" trailingIcon={false}>{subCategory.desc}</MenuListItem>
                </Link>
              )
            }else{
              return (                
                <Link to="/" key={index}>
                  <MenuListItem size="lg" trailingIcon={false}>{subCategory.desc}</MenuListItem>
                  <Separator />
                </Link>
              )
            }
          })}
          {subCategories.length === 0 && (
            <h1 className="title-large text-title">Essa categoria não possuí nenhuma subcategoria ainda.</h1>
          )}
      </div>
    </div>
  );
}
