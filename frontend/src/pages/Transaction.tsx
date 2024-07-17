import AppBar from "@/components/AppBar"
import { Button } from "@/components/ui/button"
import { InlineTabs, InlineTabsList, InlineTabsTrigger } from "@/components/ui/inline-tabs"
import TextField from "@/components/ui/textfield";

export default function Transaction() {
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <TextField label="Descrição" placeholder="Escreva uma descrição"/>
            <div>
              <span className="label-large text-title">Categoria</span>
            </div>
          </div>
          <Button type="submit" size={"lg"}>Adicionar Transação</Button>
        </form>
        
      </div>
    </div>
  )
}
