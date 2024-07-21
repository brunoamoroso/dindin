import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import { Separator } from "@/components/ui/separator";
import TextField from "@/components/ui/textfield";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from '@/api/api';

export default function Categories() {
  const {type} = useParams();
  const [categories, setCategories] = useState([{desc: "", type: ""}]);

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

  return (
    <div className="bg-surface h-dvh">
      <AppBar title="Escolha uma categoria"/>
      <div className="container flex flex-col bg-container2 h-dvh rounded-t-lg py-10 gap-6">
        <TextField label="Buscar" placeholder="Busque por uma categoria ou subcategoria"/>
        <div className="flex flex-col">
          {categories.map((category, index, arr) => {
            if(arr.length - 1 === index){
              //last item
              return (                
                <Link to="/" key={index}>
                  <MenuListItem size="lg" >{category.desc}</MenuListItem>
                </Link>
              )
            }else{
              return (                
                <Link to="/" key={index}>
                  <MenuListItem size="lg">{category.desc}</MenuListItem>
                  <Separator />
                </Link>
              )
            }
          })}
        </div>
      </div>
    </div>
  );
}
