import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import { Separator } from "@/components/ui/separator";
import TextField from "@/components/ui/textfield";
import { useParams } from "react-router-dom";

export default function Categories() {
  const type = useParams();
  console.log(type);
  return (
    <div className="bg-surface h-dvh">
      <AppBar title="Escolha uma categoria"/>
      <div className="container flex flex-col bg-container2 h-dvh rounded-t-lg py-10 gap-6">
        <TextField label="Buscar" placeholder="Busque por uma categoria ou subcategoria"/>
        <div className="flex flex-col">
          <MenuListItem size="lg" trailingIcon={false}>Salário</MenuListItem>
          <Separator />
        </div>
      </div>
    </div>
  );
}
