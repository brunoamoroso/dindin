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
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import {
  addTransaction,
  getAllInstallmentsTransaction,
  getOneTransaction,
  getSimilarTransactionsByDescription,
  updateAllInstallmentsTransaction,
  updateTransaction,
} from "@/api/transactionService";

export default function Transaction({ mode }: { mode: "create" | "edit" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    contextTransactionData,
    setContextTransactionData,
  }: TransactionsContextType = useOutletContext();
  const { paramId, paramTransactionScope } = useParams();
  let id;
  let transactionScope = "";

  mode = location.state?.mode ?? mode;
  if (mode === "edit") {
    id = paramId ?? location.state.id;
    transactionScope = paramTransactionScope ?? location.state.transactionScope;
  }

  const {data: similarDescriptionData} = useQuery({
    queryKey: ["similar-description", contextTransactionData.description, contextTransactionData.type],
    queryFn: () => {
      return getSimilarTransactionsByDescription(contextTransactionData.description, contextTransactionData.type);
    },
    enabled: Boolean(contextTransactionData.description !== ""),
  });


  const { data } = useQuery({
    queryKey: ["transaction-edit", paramId],
    queryFn: () =>
      transactionScope !== "all-installments"
        ? getOneTransaction(paramId!)
        : getAllInstallmentsTransaction(paramId!),
    enabled: mode === "edit" && !!paramId,
  });

  useEffect(() => {
    if (data) {
      setContextTransactionData((prev) => ({
        ...prev,
        id: data.id,
        type: data.type,
        amount: data.amount,
        description: data.description,
        category: data.category,
        category_id: data.category_id,
        subcategory: data.subcategory,
        subcategory_id: data.subcategory_id,
        account: data.account,
        account_id: data.account_id,
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

  const handleSelectedSuggestion = (id: string) => {
    const selectedSuggestion = similarDescriptionData?.find(item => item.id === id);
    if (selectedSuggestion) {
      setContextTransactionData((prevTransaction) => ({
        ...prevTransaction,
        description: selectedSuggestion.description,
        category: selectedSuggestion.category,
        category_id: selectedSuggestion.category_id,
        subcategory: selectedSuggestion.subcategory,
        subcategory_id: selectedSuggestion.subcategory_id,
      }));
    }
  }

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
      return addTransaction(data);
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: TransactionDataType) => {
      return updateTransaction(id!, data);
    },
  });

  const mutationUpdateAllInstallments = useMutation({
    mutationFn: (data: TransactionDataType) => {
      return updateAllInstallmentsTransaction(id!, data);
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
      toast.error("Sua transação não tem um valor", { duration: 2000 });
      return;
    }

    if (category === undefined) {
      toast.error("Selecione ao menos uma categoria", { duration: 2000 });
      return;
    }

    if (account === undefined) {
      toast.error("Selecione uma conta para a transação", { duration: 2000 });
      return;
    }

    if (date.value === undefined) {
      toast.error("Selecione quando foi a transação", { duration: 2000 });
      return;
    }

    if (type === "expense" && paymentCondition === "none") {
      toast.error("Selecione uma Condição de Pagamento para a transação", { duration: 2000 });
      return;
    } 

    if (paymentCondition === "multi" && installments === "0") {
      toast.error("Informe quantas parcelas terá a sua transação", { duration: 2000 });
      return;
    }

    if (mode === "create") {
      mutationAdd.mutate(contextTransactionData, {
        onSuccess: () => {
          toast.success("Transação registrada!", { duration: 2000 });
          navigate("/dashboard");
        },
        onError: () => {
          toast.error("Não conseguimos adicionar a transação", { duration: 2000 });
        }
      });
    }

    if (mode === "edit" && transactionScope !== "all-installments") {
      mutationUpdate.mutate(contextTransactionData, {
        onSuccess: () => {
          toast.success("Transação atualizada!", { duration: 2000 });
          navigate(`/transaction/list/${contextTransactionData.date.value}`);
        },
        onError: () => {
          toast.error("Não conseguimos editar a transação", { duration: 2000 });
        },
      });
    }

    if (mode === "edit" && transactionScope === "all-installments") {
      mutationUpdateAllInstallments.mutate(contextTransactionData, {
        onSuccess: () => {
          toast.success("Transação atualizada!", { duration: 2000 });
          navigate(`/transaction/list/${contextTransactionData.date.value}`);
        },
        onError: () => {
          toast.error("Não conseguimos editar a transação", { duration: 2000 });
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
        defaultValue="expense"
        value={contextTransactionData.type}
        className="pt-8 flex flex-1 flex-col"
        onValueChange={handleTypeTransaction}
      >
        <InlineTabsList>
          <InlineTabsTrigger value="gain">Ganho</InlineTabsTrigger>
          <InlineTabsTrigger
            value="expense"
            className={
              "data-[state=active]:text-critical data-[state=active]:border-critical"
            }
          >
            Despesa
          </InlineTabsTrigger>
        </InlineTabsList>
        <InlineTabsContent
          value="gain"
          className="flex flex-col flex-1 data-[state='inactive']:hidden"
        >
          <GainTransaction
            handleAmountChange={handleAmountChange}
            handleInputChange={handleInputChange}
            similarDescriptionData={similarDescriptionData}
            handleAmountPlaceholder={handleAmountPlaceholder}
            handleDateToday={handleDate}
            handleSubmit={handleSubmit}
            handleSelectedSuggestion={handleSelectedSuggestion}
            mutationPending={
              mutationAdd.isPending ||
              mutationUpdate.isPending ||
              mutationUpdateAllInstallments.isPending
            }
            mode={mode}
          />
        </InlineTabsContent>
        <InlineTabsContent
          value="expense"
          className="flex flex-col flex-1 data-[state='inactive']:hidden"
        >
          <ExpenseTransaction
            handleAmountChange={handleAmountChange}
            handleInputChange={handleInputChange}
            similarDescriptionData={similarDescriptionData}
            handleSelectedSuggestion={handleSelectedSuggestion}
            handleAmountPlaceholder={handleAmountPlaceholder}
            handleDateToday={handleDate}
            handleSubmit={handleSubmit}
            mutationPending={
              mutationAdd.isPending ||
              mutationUpdate.isPending ||
              mutationUpdateAllInstallments.isPending
            }
            mode={mode}
            transactionScope={transactionScope}
            id={id}
          />
        </InlineTabsContent>
      </InlineTabs>
    </div>
  );
}
