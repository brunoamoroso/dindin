import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import TextField from "@/components/ui/textfield";
import { ChangeEvent, MouseEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/api";
import { useTransactionsContext } from "@/hooks/useTransactionsContext";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Categories() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { setContextTransactionData } = useTransactionsContext();
  const [searchQuery, setSearchQuery] = useState("");

  if (type === undefined) {
    throw new Error("type undefined");
  }

  interface CategoryType {
    id: string;
    desc: string;
  }

  interface SearchQueryType {
    id: string;
    desc: string;
    category?: {
      id: string;
      desc: string;
    }[];
    isCategory: boolean;
  }

  //fetch all the inicial categories
  const {
    data: allCategories,
    isError,
    isLoading,
  } = useQuery<CategoryType[]>({
    queryKey: ["allCategories", type],
    queryFn: () => api.getCategories(type),
  });

  const {
    data: searchedCategories,
    isLoading: loadingSearch,
    isError: errorSearch,
  } = useQuery<SearchQueryType[]>({
    queryKey: ["searchedCategories", type, searchQuery],
    queryFn: () => api.getSearchCategories(type, searchQuery),
    enabled: !!searchQuery,
  });

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.dataset.id;
    const desc = e.currentTarget.dataset.value;

    if (id === undefined || desc === undefined) {
      throw new Error("Category is undefined");
    }

    setContextTransactionData((prevTransaction) => ({
      ...prevTransaction,
      category: {
        id: id,
        desc: desc,
      },
    }));

    navigate(`/categories/sub/${desc}`);
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
      category: {
        id: idCat,
        desc: descCat,
      },
      subCategory: {
        id: idSub,
        desc: descSub
      }
    }));

    navigate(`/transaction`);
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
                value={category.desc}
                onClick={handleClick}
                separator={arr.length > index + 1}
              >
                {category.desc}
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
                            value={item.desc}
                            onClick={handleClick}
                            separator={arr.length > index + 1}
                          >
                            {item.desc}
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
                      .map((item, index, arrInitial) => {
                        if (item.category !== undefined) {
                          return item.category.map(
                            (
                              itemCat: { id: string; desc: string },
                              i,
                              arrSecondary
                            ) => (
                              <MenuListItem
                                size="lg"
                                key={`${index}-${i}`}
                                dataId={item.id}
                                value={item.desc}
                                onClick={() =>
                                  handleClickSub({
                                    idCat: item.category[i].id,
                                    descCat: item.category[i].desc,
                                    idSub: item.id,
                                    descSub: item.desc,
                                  })
                                }
                                trailingIcon={false}
                                separator={
                                  arrInitial.length > index + 1 ||
                                  arrSecondary.length > i + 1
                                }
                              >
                                <div className="flex flex-col gap-0.5">
                                  {itemCat.desc}
                                  <span className="body-medium text-subtle">
                                    {item.desc}
                                  </span>
                                </div>
                              </MenuListItem>
                            )
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
