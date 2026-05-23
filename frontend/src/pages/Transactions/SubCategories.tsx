import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/menu-list-item";
import {
  useNavigate,
  useOutletContext,
  useParams,
  useLocation,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { TransactionsContextType } from "@/context/TransactionsContext";
import {
  createSubCategory,
  deleteSubCategory,
  editSubCategory,
  getSubCategories,
} from "@/api/categoriesService";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import TextField from "@/components/textfield";
import { useState } from "react";
import { IconButton } from "@/components/icon-button";
import { SquarePen, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SubCategories() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { id, mode, transactionScope } = location.state || {};
  const { category } = useParams();
  const { setContextTransactionData }: TransactionsContextType =
    useOutletContext();
  if (category === undefined) {
    throw new Error("category undefined");
  }
  const [subCategoryDescription, setSubCategoryDescription] = useState("");
  const [newSubcategorySheetOpen, setNewSubCategorySheetOpen] = useState(false);
  const [editSubcategorySheetOpen, setEditSubcategorySheetOpen] = useState(false);

  interface SubCategoryType {
    id: string;
    description: string;
    is_public: boolean;
  }

  const { data, isError, isLoading } = useQuery<SubCategoryType[]>({
    queryKey: ["subCategories", category],
    queryFn: () => getSubCategories(category),
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

    navigate("/transaction", {
      state: { mode: mode, id: id, transactionScope: transactionScope },
    });
  };

  const handleClickNoSub = () => {
    setContextTransactionData((prev) => ({
      ...prev,
      subcategory_id: "",
      subcategory: "",
    }));

    navigate("/transaction", {
      state: { mode: mode, id: id, transactionScope: transactionScope },
    });
  };

  const createSubCategoryMutation = useMutation({
    mutationFn: (description: string) =>
      createSubCategory(category, description),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["subCategories", category] });
      setNewSubCategorySheetOpen(false);
    },
  });

  const handleCreateSubCategory = () => {
    createSubCategoryMutation.mutate(subCategoryDescription);
  };

  const editSubCategoryMutation = useMutation({
    mutationFn: ({ id, description }: { id: string; description: string }) =>
      editSubCategory(id, description),
    onSuccess: () => {
      // Invalidate and refetch
      setEditSubcategorySheetOpen(false);
      queryClient.invalidateQueries({ queryKey: ["subCategories", category] });
    },
  });

  const handleEditSubCategory = (id: string) => {
    editSubCategoryMutation.mutate({ id, description: subCategoryDescription });
  };

  const deleteSubCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteSubCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subCategories", category] });
    },
  });

  const handleDeleteSubCategory = (id: string) => {
    deleteSubCategoryMutation.mutate(id);
  };

  return (
    <div className="bg-surface flex flex-col h-dvh pt-11">
      <AppBar title={`SubCategorias de ${category}`} />
      <div className="px-6 flex flex-1 flex-col bg-layer-tertiary rounded-t-lg py-10 justify-between">
        {isError && (
          <span className="title-medium text-content-primary">
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
                  trailingIcon={false}
                  key={index}
                  dataId={subCategory.id}
                  value={subCategory.description}
                  onClick={handleClick}
                  separator={arr.length - 1 !== index}
                  action={
                    subCategory.is_public ? null : (
                      <div
                        className="flex gap-1"
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.stopPropagation();
                        }}
                      >
                        <Drawer open={editSubcategorySheetOpen} onOpenChange={setEditSubcategorySheetOpen}>
                          <DrawerTrigger asChild>
                            <IconButton variant="ghost" size="small" onClick={() => {
                              setSubCategoryDescription(subCategory.description);
                              setEditSubcategorySheetOpen(true);
                            }}>
                              <SquarePen />
                            </IconButton>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>Editar subcategoria</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4">
                              <TextField
                                label="Nome"
                                value={subCategoryDescription}
                                onChange={(e) =>
                                  setSubCategoryDescription(e.target.value)
                                }
                              />
                            </div>
                            <DrawerFooter className="gap-6 mb-10">
                              <Button
                                onClick={() =>
                                  handleEditSubCategory(subCategory.id)
                                }
                              >
                                Salvar
                              </Button>
                              <DrawerClose asChild onClick={() => setSubCategoryDescription("")}>
                                <Button variant={"outline"}>Cancelar</Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                        <Dialog>
                          <DialogTrigger asChild>
                            <IconButton
                              variant="ghost"
                              size="small"
                            >
                              <Trash2 />
                            </IconButton>
                          </DialogTrigger>
                          <DialogContent showCloseButton={false}>
                            <DialogHeader>
                              <DialogTitle className="text-left">Excluir subcategoria</DialogTitle>
                              <DialogDescription className="text-left">
                                Tem certeza que deseja excluir a subcategoria{" "}
                                <strong>{subCategory.description}</strong>? Essa
                                ação não pode ser desfeita.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex-row">
                              <DialogClose
                                asChild
                                onClick={(
                                  e: React.MouseEvent<HTMLButtonElement>,
                                ) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Button variant={"outline"} className="flex flex-1">Cancelar</Button>
                              </DialogClose>
                              <Button variant="destructive" className="flex flex-1" onClick={() => handleDeleteSubCategory(subCategory.id)}>Excluir</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )
                  }
                >
                  {subCategory.description}
                </MenuListItem>
              ))}
              {data.length === 0 && (
                <h1 className="title-large text-content-primary">
                  Essa categoria não possuí nenhuma subcategoria ainda.
                </h1>
              )}
            </div>
            <div className="flex flex-col gap-6 mt-10">
              <Drawer
                open={newSubcategorySheetOpen}
                onOpenChange={setNewSubCategorySheetOpen}
              >
                <DrawerTrigger>
                  <Button variant={"outline"} className="w-full">
                    Criar subcategoria
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Criar subcategoria</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <TextField
                      label="Nome"
                      value={subCategoryDescription}
                      onChange={(e) =>
                        setSubCategoryDescription(e.target.value)
                      }
                    />
                  </div>
                  <DrawerFooter className="gap-6 mb-10">
                    <Button onClick={handleCreateSubCategory}>Criar</Button>
                    <DrawerClose asChild>
                      <Button variant={"outline"}>Cancelar</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
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
