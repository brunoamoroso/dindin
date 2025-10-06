import { createLimit, getLimitById, updateLimit } from "@/api/limitService";
import AppBar from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MenuListItem from "@/components/ui/menu-list-item";
import { useToast } from "@/components/ui/use-toast";
import { LimitDataType, useLimitContext } from "@/context/LimitContext";
import { cn } from "@/lib/utils";
import { currencyFormat } from "@/utils/currency-format";
import getCategoryIcon from "@/utils/get-category-icon";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tag } from "lucide-react";
import { ChangeEvent, MouseEvent, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

export function CreateLimit({ mode }: { mode: "create" | "edit" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const { category, category_id } = location.state || {};
  const { limitData, setLimitData, resetLimitData } = useLimitContext();
  const badge = limitData.category ? getCategoryIcon(limitData.category) : null;

  const { data } = useQuery({
    queryKey: ["limits-data", id],
    queryFn: () => {
      return getLimitById<{
        amount_limit: string;
        category: string;
        category_id: string;
        code: string;
        created_at: string;
      }>(id!);
    },
    enabled: mode === "edit" && !!id,
  });

  useEffect(() => {
    return () => {
      resetLimitData();
    };
  }, [resetLimitData]);

  useEffect(() => {
    if (mode === "edit" && data && id) {
      setLimitData((prev) => ({
        ...prev,
        id: id,
        amount: parseInt(data.amount_limit),
        category: data.category,
        category_id: data.category_id,
      }));
    }
  }, [data, mode, setLimitData, id]);

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
      navigate("/limits", { replace: true });
    },
  });

  const mutationUpdateLimit = useMutation({
    mutationFn: (data: LimitDataType) => updateLimit(data.id!, data),
    onSuccess: () => {
      resetLimitData();
      navigate("/limits", { replace: true });
    },
  });

  const handleSubmit = () => {
    if (mode === "create") {
      mutationCreateLimit.mutate(limitData, {
        onSuccess: () => {
          navigate("/limits");
        },
        onError: (error) => {
          const message = error.message.includes("duplicate key")
            ? "Já existe um limite para essa categoria nesse mês."
            : "Ocorreu um erro ao criar o limite.";
          toast({
            title: "Erro ao criar limite",
            description: message,
            variant: "destructive",
          });
          console.error("Error creating limit:", error);
        },
      });
      return;
    }

    mutationUpdateLimit.mutate(limitData, {
      onSuccess: () => {
        navigate("/limits");
      },
      onError: (error) => {
        const message = error.message.includes("duplicate key")
          ? "Limite já existe"
          : "Ocorreu um erro ao editar o limite.";
        toast({
          title: "Erro ao editar limite",
          description: message,
          variant: "destructive",
        });
        console.error("Error updating limit:", error);
      },
    });
  };

  return (
    <div className="bg-surface min-h-dvh flex flex-col">
      <AppBar
        title={
          mode === "create"
            ? "Adicionar Limite de Gasto"
            : "Editar Limite de Gasto"
        }
        pageBack="limits"
      />

      <div className="mx-6 py-8 flex flex-col">
        <span className="label-medium text-content-subtle">Limite</span>
        <div className="flex gap-1">
          <span className="headline-small text-content-primary">
            {limitData.coinSelected}
          </span>
          <span
            id="amount_placeholder"
            className={cn(
              "headline-small text-content-subtle",
              (mode === "edit" || limitData.amount) && "hidden"
            )}
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
            className={cn(
              "text-content-primary bg-transparent focus-visible:ring-0",
              mode === "edit" || limitData.amount ? "block" : "hidden"
            )}
            placeholder="0.00"
            onChange={handleAmountChange}
            value={currencyFormat(limitData.amount)}
          />
        </div>
      </div>

      <div className="bg-layer-tertiary px-6 py-10 flex flex-col gap-6 flex-1 rounded-t-lg justify-between">
        <Link
          to="/categories/expense"
          state={{ flow: "limit", mode: mode, id: id }}
        >
          <MenuListItem>
            {!limitData.category && (
              <>
                <Tag />
                <span>Escolha uma categoria</span>
              </>
            )}
            {badge && (
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
        <Button onClick={handleSubmit} size="lg">
          Salvar
        </Button>
      </div>
    </div>
  );
}
