import AppBar from "@/components/AppBar"
import { Button } from "@/components/ui/button"
import { InlineTabs, InlineTabsList, InlineTabsTrigger } from "@/components/ui/inline-tabs"
import {InputChips} from "@/components/ui/input-chips";
import MenuListItem from "@/components/ui/menu-list-item";
import TextField from "@/components/ui/textfield";
import { Landmark, RefreshCw, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useTransactionsContext } from "@/hooks/useTransactionsContext";

export default function Transaction() {
  const {contextCategory, contextAccount}  = useTransactionsContext();

  const handleSubmit = () => {
    return;
  }

  return (
    <div className="bg-surface h-dvh">
      <AppBar title="Adicionar Transação"/>
      <InlineTabs defaultValue="gain" className="pt-8">
        <InlineTabsList>
          <InlineTabsTrigger value="gain">Ganho</InlineTabsTrigger>
          <InlineTabsTrigger value="expense" className="data-[state=active]:text-negative data-[state=active]:border-negative">Despesa</InlineTabsTrigger>
        </InlineTabsList>
      </InlineTabs>
      <div className="container">
        <div className="py-8 ">
          <span className="label-medium text-subtle">Valor Recebido</span>
          <div className="flex gap-1">
            <span className="headline-small text-title">R$</span>
            <span className="headline-small text-positive">0,00</span>
          </div>
        </div>
      </div>
      <div className="container rounded-t-lg bg-container2 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-16">
          <div className="flex flex-col gap-6">
            <TextField label="Descrição" placeholder="Escreva uma descrição"/>
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-title">Categoria</span>
              <Link to="/categories/gain">
                <MenuListItem>
                  <Tag />
                  {!contextCategory && ("Escolha uma categoria")}
                  {contextCategory && (
                  <div className="flex flex-col">
                    {contextCategory.category.desc}
                    <span className="body-small text-subtle">{contextCategory.subCategory.desc}</span>
                  </div>
                  )}
                </MenuListItem>
              </Link>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-title">Conta</span>
              <Link to="/transaction-accounts/list">
                <MenuListItem>
                  <Landmark />
                  {!contextAccount && ("Escolha uma conta")}
                  {contextAccount && (contextAccount.desc)}
                </MenuListItem>
              </Link>
            </div>
            <div className="py-3 flex flex-col gap-1.5">
              <span className="label-large text-title">Quando recebeu?</span>
              <div className="flex gap-2">
                <InputChips>Hoje</InputChips>
                <InputChips>Outra Data</InputChips>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="label-large text-title">Repetir esse ganho</span>
              <Link to="/recurrency">
                <MenuListItem>
                  <RefreshCw />Nunca
                </MenuListItem>
              </Link>
            </div>
          </div>
          <Button type="submit" size={"lg"}>Adicionar Transação</Button>
        </form>
        
      </div>
    </div>
  )
}
