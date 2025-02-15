import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useLocation,
} from "react-router-dom";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { TransactionsContextType } from "@/context/TransactionsContext";

export default function SubCategories() {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, mode, transactionScope } = location.state || {};
  const { category } = useParams();
  const { setContextTransactionData }: TransactionsContextType =
    useOutletContext();
  if (category === undefined) {
    throw new Error("category undefined");
  }

  interface SubCategoryType {
    id: string;
    description: string;
  }

  const { data, isError, isLoading } = useQuery<SubCategoryType[]>({
    queryKey: ["subCategories", category],
    queryFn: () => api.getSubCategories(category),
  });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const idSubCat = e.currentTarget.dataset.id;
    const descSubCat = e.currentTarget.dataset.value;

    if (idSubCat === undefined || descSubCat === undefined) {
      throw new Error("subcategory undefined");
    }

    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      subcategory_id: idSubCat,
      subcategory: descSubCat,
    }));

    navigate("/transaction", { state: { mode: mode, id: id, transactionScope: transactionScope } });
  };

  const handleClickNoSub = () => {
    setContextTransactionData((prev) => ({
      ...prev,
      subcategory_id: "",
      subcategory: "",
    }));

    navigate("/transaction", { state: { mode: mode, id: id, transactionScope: transactionScope } });
  };

  return (
    <div className="bg-surface flex flex-col h-dvh">
      <AppBar title={`SubCategorias de ${category}`} />
      <div className="container flex flex-1 flex-col bg-container2 rounded-t-lg py-10 justify-between">
        {isError && (
          <span className="title-medium text-title">
            Tivemos um problema ao carregar as suas SubCategorias
          </span>
        )}

        {isLoading && (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 5 }).map((_x, i, arr) => {
              if (arr.length - 1 === i) {
                return (
                  <div key={i} className="flex flex-col gap-4">
                    <Skeleton className="w-full h-4 rounded-xl" />
                  </div>
                );
              } else {
                return (
                  <div key={i} className="flex flex-col gap-4">
                    <Skeleton className="w-full h-4 rounded-xl" />
                    <Separator />
                  </div>
                );
              }
            })}
          </div>
        )}

        {!isLoading && data !== undefined && (
          <>
            <div className="flex flex-col flex-1">
              {data.map((subCategory, index, arr) => (
                    <MenuListItem
                      size="lg"
                      trailingIcon={false}
                      key={index}
                      dataId={subCategory.id}
                      value={subCategory.description}
                      onClick={handleClick}
                      separator={(arr.length - 1) !== index}
                    >
                      {subCategory.description}
                    </MenuListItem>
                  ))}
              {data.length === 0 && (
                <h1 className="title-large text-title">
                  Essa categoria não possuí nenhuma subcategoria ainda.
                </h1>
              )}
            </div>
            <div className="flex flex-col gap-6">
              <Button variant={"ghost"} onClick={handleClickNoSub}>
                Não escolher subcategoria
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
