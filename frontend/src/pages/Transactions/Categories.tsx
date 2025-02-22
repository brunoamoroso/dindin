import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import TextField from "@/components/ui/textfield";
import { ChangeEvent, MouseEvent, useState } from "react";
import {
  useNavigate,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { TransactionsContextType } from "@/context/TransactionsContext";
import { getCategories, getSearchCategories } from "@/api/categoriesService";

export default function Categories() {
  const { type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { setContextTransactionData }: TransactionsContextType =
    useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");

  const { id, mode, transactionScope } = location.state || {};

  if (type === undefined) {
    throw new Error("type undefined");
  }

  interface CategoryType {
    id: string;
    description: string;
  }

  interface SearchQueryType {
    id: string;
    description: string;
    category_id?: string;
    category_description?: string;
    isCategory: boolean;
  }

  //fetch all the inicial categories
  const {
    data: allCategories,
    isError,
    isLoading,
  } = useQuery<CategoryType[]>({
    queryKey: ["allCategories", type],
    queryFn: () => getCategories(type),
  });

  const {
    data: searchedCategories,
    isLoading: loadingSearch,
    isError: errorSearch,
  } = useQuery<SearchQueryType[]>({
    queryKey: ["searchedCategories", type, searchQuery],
    queryFn: () => getSearchCategories(type, searchQuery),
    enabled: !!searchQuery,
  });

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const idCat = e.currentTarget.dataset.id;
    const descCat = e.currentTarget.dataset.value;

    if (idCat === undefined || descCat === undefined) {
      throw new Error("Category is undefined");
    }

    setContextTransactionData((prev) => ({
      ...prev,
      category_id: idCat,
      category: descCat,
    }));

    navigate(`/categories/sub/${descCat}`, { state: { mode: mode, id: id, transactionScope: transactionScope } });
  };

  const handleClickSub = ({
    idCat,
    descCat,
    idSub,
    descSub,
  }: {
    idCat: string;
    descCat: string;
    idSub: string;
    descSub: string;
  }) => {
    setContextTransactionData((prev) => ({
      ...prev,
      category_id: idCat,
      category: descCat,
      subcategory_id: idSub,
      subcategory: descSub,
    }));

    navigate(`/transaction`, { state: { mode: mode, id: id, transactionScope: transactionScope } });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-surface h-dvh flex flex-col">
      <AppBar title="Escolha uma categoria" />
      <div className="container flex flex-1 flex-col bg-container2 rounded-t-lg py-10 gap-6">
        <TextField
          label="Buscar"
          placeholder="Busque por uma categoria ou subcategoria"
          onChange={handleSearch}
        />

        {isError ||
          (errorSearch && (
            <span className="title-medium text-title">
              Tivemos um problema ao carregar as categorias
            </span>
          ))}

        {isLoading ||
          (loadingSearch && (
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
          ))}

        {!isLoading && allCategories !== undefined && searchQuery === "" && (
          <div className="flex flex-col">
            {allCategories.map((category, index, arr) => (
              <MenuListItem
                size="lg"
                key={index}
                dataId={category.id}
                value={category.description}
                onClick={handleClick}
                separator={arr.length > index + 1}
              >
                {category.description}
              </MenuListItem>
            ))}
          </div>
        )}
        {!loadingSearch &&
          searchedCategories !== undefined &&
          searchQuery !== "" && (
            <div className="flex flex-col gap-10">
              {searchedCategories.find((i) => i.isCategory) && (
                <div className="flex flex-col gap-2">
                  <h1 className="title-small text-title">Categorias</h1>
                  <div className="flex flex-col">
                    {searchedCategories
                      .filter((item) => item.isCategory)
                      .map((item, index, arr) => {
                        return (
                          <MenuListItem
                            size="lg"
                            key={index}
                            dataId={item.id}
                            value={item.description}
                            onClick={handleClick}
                            separator={arr.length > index + 1}
                          >
                            {item.description}
                          </MenuListItem>
                        );
                      })}
                  </div>
                </div>
              )}

              {searchedCategories.find((i) => !i.isCategory) && (
                <div className="flex flex-col gap-2">
                  <h1 className="title-small text-title">SubCategorias</h1>
                  <div className="flex flex-col">
                    {searchedCategories
                      .filter((item) => !item.isCategory)
                      .map((item, i, arrInitial) => {
                        if (item.category_id !== undefined || item.category_description !== undefined) {
                          return (
                              <MenuListItem
                                size="lg"
                                key={`${item.category_id}-${i}`}
                                dataId={item.id}
                                value={item.description}
                                onClick={() =>
                                  handleClickSub({
                                    idCat: item.category_id!,
                                    descCat: item.category_description!,
                                    idSub: item.id,
                                    descSub: item.description,
                                  })
                                }
                                trailingIcon={false}
                                separator={
                                  arrInitial.length > i + 1
                                }
                              >
                                <div className="flex flex-col gap-0.5">
                                  {item.category_description}
                                  <span className="body-medium text-subtle">
                                    {item.description}
                                  </span>
                                </div>
                              </MenuListItem>
                          );
                        }
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
