import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import {
  useNavigate,
  useLocation,
  useOutletContext,
  Link,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionsContextType } from "@/context/TransactionsContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getAccounts } from "@/api/accountService";

export default function Accounts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setContextTransactionData }: TransactionsContextType =
    useOutletContext();
  const { id: idTransaction, mode } = location.state || {};

  const { data, isError, isLoading } = useQuery<
    { id: string; description: string }[]
  >({
    queryKey: ["accountsList"],
    queryFn: () => getAccounts(),
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const value = e.currentTarget.dataset.value;
    const id = e.currentTarget.dataset.id;

    if (id === undefined || value === undefined) {
      throw new Error("Account undefined");
    }

    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      account_id: id,
      account: value,
    }));

    navigate("/transaction", {
      state: { mode: mode, id: idTransaction },
    });
  };

  return (
    <div className="bg-surface h-dvh flex flex-col">
      <AppBar title="Escolha uma conta" />
      <div className="container flex flex-1 flex-col rounded-t-lg bg-container2 py-10 justify-between">
        {isError && (
          <h1 className="title-large text-title">
            Tivemos um problema ao tentar carregar suas contas.
          </h1>
        )}

        {isLoading && (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 5 }).map((_x, i) => (
              <div key={i} className="flex flex-col gap-4">
                <Skeleton className="w-full h-4 rounded-xl" />
                {i !== 4 && <Separator />}
              </div>
            ))}
          </div>
        )}

        {!isLoading &&
          data !== undefined && (
            <div className="flex flex-col">
              {data.map((account, index, arr) => (
                <MenuListItem
                  size="lg"
                  trailingIcon={false}
                  key={index}
                  dataId={account.id}
                  value={account.description}
                  onClick={handleClick}
                  separator={arr.length - 1 !== index}
                >
                  {account.description}
                </MenuListItem>
              ))}
            </div>
          )}

        {!isLoading && data?.length === 0 && (
          <h1 className="title-large text-title">
            Não há nenhuma conta cadastrada ainda.
          </h1>
        )}

        {!isError && !isLoading && (
          <Link to="/accounts/create" state={{ mode: mode, id: idTransaction }}>
            <Button variant="outline" size="sm" className="w-full">
              <Plus /> Criar conta
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
