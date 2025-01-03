import AppBar from "@/components/AppBar";
import {
  InlineTabs,
  InlineTabsContent,
  InlineTabsList,
  InlineTabsTrigger,
} from "@/components/ui/inline-tabs";
import { ChangeEvent, FormEvent, MouseEvent, useEffect } from "react";
import { currencyFormat } from "@/utils/currency-format";
import GainTransaction from "./GainTransaction";
import ExpenseTransaction from "./ExpenseTransaction";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../api/api";
import {
  TransactionDataType,
  TransactionsContextType,
} from "@/context/TransactionsContext";
import {
  useNavigate,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { CircleCheck, CircleX } from "lucide-react";
import * as Types from "@/types/TransactionTypes";
import { getRecurrencyDesc } from "@/utils/get-recurrency-desc";

export default function Transaction({ mode }: { mode: "create" | "edit" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    contextTransactionData,
    setContextTransactionData,
  }: TransactionsContextType = useOutletContext();
  const { toast } = useToast();
  const { paramId, paramTransactionScope } = useParams();
  let id;
  let transactionScope = "";

  mode = location.state?.mode ?? mode;
  if(mode === "edit"){
    id = paramId ?? location.state.id;
    transactionScope = paramTransactionScope ?? location.state.transactionScope;
  }

  const { data } = useQuery<Types.TransactionType>({
    queryKey: ["transaction-edit", paramId],
    queryFn: () =>
      transactionScope !== "all-installments"
        ? api.getOneTransaction(paramId!)
        : api.getAllInstallmentsTransaction(paramId!),
    enabled: mode === "edit" && !!paramId,
  });

  useEffect(() => {
    if (data) {
      setContextTransactionData((prev) => ({
        ...prev,
        id: data.id,
        type: data.type,
        amount: data.amount,
        desc: data.desc,
        category: data.category,
        subCategory: data.subCategory,
        account: data.account,
        recurrency: {
          id: data.recurrency,
          desc: getRecurrencyDesc(data.recurrency),
        },
        date: {
          chip: "otherDate",
          value: new Date(data.date),
        },
        paymentCondition: data.payment_condition,
        installments:
          data.installments !== null && data.installments !== undefined
            ? String(data.installments)
            : "",
      }));
    }
  }, [data, setContextTransactionData]);

  const handleDate = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (contextTransactionData.date.chip !== "today") {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      const today = new Date(year, month, day);
      setContextTransactionData((prevTransaction) => ({
        ...prevTransaction,
        date: {
          chip: "today",
          value: today,
        },
      }));
      return;
    }

    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      date: {
        chip: "none",
        value: undefined,
      },
    }));
  };

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
    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      amount: amountInt,
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      [e.target.id]: e.target.value,
    }));
  };

  const handleTypeTransaction = (e: string) => {
    if (e === "gain" || e === "expense") {
      setContextTransactionData((prevTransaction) => ({
        ...prevTransaction,
        type: e,
        category: undefined,
        subCategory: undefined,
      }));
    }
  };

  const mutationAdd = useMutation({
    mutationFn: (data: TransactionDataType) => {
      return api.addTransaction(data);
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: TransactionDataType) => {
      return api.updateTransaction(id!, data);
    },
  });

  const mutationUpdateAllInstallments = useMutation({
    mutationFn: (data: TransactionDataType) => {
      return api.updateAllInstallmentsTransaction(id!, data);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      type,
      amount,
      category,
      account,
      date,
      paymentCondition,
      installments,
    } = contextTransactionData;

    if (amount === 0) {
      toast({
        title: "Sua transação não tem um valor",
        variant: "destructive",
        duration: 2000,
      });

      return;
    }

    if (category === undefined) {
      toast({
        title: "Selecione ao menos uma categoria",
        variant: "destructive",
        duration: 2000,
      });

      return;
    }

    if (account === undefined) {
      toast({
        title: "Selecione uma conta para a transação",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (date.value === undefined) {
      toast({
        title: "Selecione quando foi a transação",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (type === "expense" && paymentCondition === "none") {
      toast({
        title: "Selecione uma Condição de Pagamento para a transação",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (paymentCondition === "multi" && installments === "0") {
      toast({
        title: "Informe quantas parcelas terá a sua transação",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (mode === "create") {
      mutationAdd.mutate(contextTransactionData, {
        onSuccess: () => {
          toast({
            title: (
              <div className="flex gap-3 items-center">
                <CircleCheck />
                Transação registrada!
              </div>
            ),
            duration: 2500,
            variant: "positive",
          });
          navigate("/dashboard");
        },
      });
      return;
    }

    if (mode === "edit") {
      mutationUpdate.mutate(contextTransactionData, {
        onSuccess: (data) => {
          const transactionData = data as Types.TransactionType;
          toast({
            title: (
              <div className="flex gap-3 items-center">
                <CircleCheck />
                Transação atualizada!
              </div>
            ),
            duration: 2500,
            variant: "positive",
          });
          navigate(`/transaction/list/${transactionData.date}`);
        },
        onError: () => {
          toast({
            title: (
              <div className="flex gap-3 items-center">
                <CircleX />
                Não conseguimos editar a transação
              </div>
            ),
            duration: 2500,
            variant: "destructive",
          });
        },
      });
    }
  };

  return (
    <div className="bg-surface h-dvh flex flex-col">
      {mode === "create" ? (
        <AppBar title="Adicionar Transação" pageBack="dashboard" />
      ) : (
        <AppBar title="Editar Transação" pageBack="transaction/list" />
      )}
      <InlineTabs
        defaultValue="gain"
        value={contextTransactionData.type}
        className="pt-8 flex flex-1 flex-col"
        onValueChange={handleTypeTransaction}
      >
        <InlineTabsList>
          <InlineTabsTrigger
            value="gain"
            className={`${
              contextTransactionData.type === "expense" &&
              contextTransactionData.paymentCondition === "multi"
                ? "hidden"
                : ""
            }`}
          >
            Ganho
          </InlineTabsTrigger>
          <InlineTabsTrigger
            value="expense"
            className={
              "data-[state=active]:text-negative data-[state=active]:border-negative"
            }
          >
            Despesa
          </InlineTabsTrigger>
        </InlineTabsList>
        <InlineTabsContent value="gain">
          <GainTransaction
            handleAmountChange={handleAmountChange}
            handleInputChange={handleInputChange}
            handleAmountPlaceholder={handleAmountPlaceholder}
            handleDateToday={handleDate}
            handleSubmit={handleSubmit}
            mode={mode}
          />
        </InlineTabsContent>
        <InlineTabsContent value="expense" className="flex flex-col flex-1">
          <ExpenseTransaction
            handleAmountChange={handleAmountChange}
            handleInputChange={handleInputChange}
            handleAmountPlaceholder={handleAmountPlaceholder}
            handleDateToday={handleDate}
            handleSubmit={handleSubmit}
            mode={mode}
            transactionScope={transactionScope}
          />
        </InlineTabsContent>
      </InlineTabs>
    </div>
  );
}
