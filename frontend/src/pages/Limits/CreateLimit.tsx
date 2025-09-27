import { createLimit } from "@/api/limitService";
import AppBar from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MenuListItem from "@/components/ui/menu-list-item";
import { useToast } from "@/components/ui/use-toast";
import { LimitDataType, useLimitContext } from "@/context/LimitContext";
import { currencyFormat } from "@/utils/currency-format";
import getCategoryIcon from "@/utils/get-category-icon";
import { useMutation } from "@tanstack/react-query";
import { Tag } from "lucide-react";
import { ChangeEvent, MouseEvent, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function CreateLimit() {
  const location = useLocation();
  const navigate = useNavigate();
  const {toast} = useToast();
  const { category, category_id } = location.state || {};
  const { limitData, setLimitData, resetLimitData } = useLimitContext();
  const badge = getCategoryIcon(limitData.category);

  useEffect(() => {
    if (category) {
      setLimitData((prev) => ({
        ...prev,
        category: category,
        category_id: category_id,
      }));
    }
  }, [category, category_id, setLimitData]);

  const handleAmountPlaceholder = (e: MouseEvent<HTMLSpanElement>) => {
    const placeholder = e.currentTarget;
    const ghostInput = document.getElementById("amount_input");
    if (ghostInput?.classList.contains("hidden")) {
      placeholder.classList.add("hidden");
      ghostInput.classList.remove("hidden");
      ghostInput.focus();
      return;
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const amountInt = parseInt(e.target.value.replace(/[^0-9]+/g, ""));
    e.target.value = currencyFormat(amountInt);
    setLimitData((prev) => ({ ...prev, amount: amountInt }));
  };

  const mutationCreateLimit = useMutation({
    mutationFn: (data: LimitDataType) => createLimit(data),
    onSuccess: () => {
      resetLimitData();
    }
  });

  const handleSubmit = () => {
    mutationCreateLimit.mutate(limitData, {
      onSuccess: () => {
        navigate("/limits");
      },
      onError: (error) => {
          toast({
            title: "Erro ao criar limite",
            description: "Ocorreu um erro ao criar o limite.",
            variant: "destructive",
          }); 
          console.error("Error creating limit:", error);
        }
    });
  };

  return (
    <div className="bg-surface min-h-dvh flex flex-col">
      <AppBar title="Adicionar Limite de Gasto" />

      <div className="mx-6 py-8 flex flex-col">
        <span className="label-medium text-content-subtle">Limite</span>
        <div className="flex gap-1">
          <span className="headline-small text-content-primary">
            {limitData.coinSelected}
          </span>
          <span
            id="amount_placeholder"
            className="headline-small text-content-subtle"
            onClick={handleAmountPlaceholder}
          >
            {limitData.amount ? currencyFormat(limitData.amount) : "0.00"}
          </span>
          <Input
            variant={"ghost"}
            inputMode="numeric"
            pattern="[0-9]"
            id="amount_input"
            type="text"
            className="hidden text-content-primary bg-transparent focus-visible:ring-0"
            placeholder="0.00"
            onChange={handleAmountChange}
            value={currencyFormat(limitData.amount)}
          />
        </div>
      </div>

      <div className="bg-layer-tertiary px-6 py-10 flex flex-col gap-6 flex-1 rounded-t-lg justify-between">
        <Link to="/categories/expense" state={{ flow: "limit" }}>
          <MenuListItem>
            {!limitData.category && (
              <>
                <Tag />
                <span>Escolha uma categoria</span>
              </>
            )}
            {limitData.category && (
              <>
                <div
                  className={"p-2 rounded text-content-primary"}
                  style={{
                    backgroundColor: badge.dataVizColor,
                    borderColor: badge.dataVizBorderColor,
                  }}
                >
                  {badge.icon}
                </div>
                <div className="flex flex-col">{limitData.category}</div>
              </>
            )}
          </MenuListItem>
        </Link>
        <Button onClick={handleSubmit} size="lg">Adicionar</Button>
      </div>
    </div>
  );
}
