import AppBar from "@/components/AppBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TextField from "@/components/ui/textfield";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Camera, CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { UserProfileType } from "@/types/UserProfileType";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { editProfileData, getUserProfileData } from "@/api/profileService";

export default function EditUserData() {
  const { toast } = useToast();
  const [user, setUser] = useState<Partial<UserProfileType>>();

  const { data, isLoading, isError } = useQuery<UserProfileType>({
    queryKey: ["userData"],
    queryFn: () => getUserProfileData(),
  });

  useEffect(() => {
    if (data) {
      setUser({
        photo: data.photo,
        name: data.name,
        surname: data.surname,
        username: data.username,
        email: data.email,
        password: "",
      });
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  interface CreationResponse {
    message: string;
    token: string;
  }

  const mutation = useMutation<CreationResponse, Error, FormData>({
    mutationFn: (data: FormData) => {
      return editProfileData(data);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    for (const [key, value] of Object.entries(user!)) {
      formData.append(key, value as string | File);
    }

      mutation.mutate(formData, {
        onSuccess: () => {
          toast({
            title: (
              <div className="flex gap-3 items-center">
                <CircleCheck />
                Dados atualizados!
              </div>
            ),
            variant: "positive",
            duration: 1000,
          });
        },
        onError: (err) => {
          console.error(err);
          const errorMessage = (err as Error).message || "Erro desconhecido. Tente novamente.";
          toast({
            title: (
              <div className="flex gap-3 items-center">
                <CircleX />
                {errorMessage}
              </div>
            ),
            variant: "destructive",
            duration: 1500,
          });
        },
      });
  };

  const triggerInputFile = () => {
    const inputFile = document.getElementById("photoFile");
    inputFile?.click();
  };

  const changeInputFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return;
    }
    const file = e.target.files[0];
    setUser((prevState) => ({
      ...prevState,
      photo: file,
    }));
  };

  return (
    <div className="bg-surface min-h-dvh flex flex-1 flex-col">
      <AppBar title="Editar Dados Cadastrais" />
      {isError && (
        <div className="container flex flex-1">
          <h1 className="headline-medium text-content-primary">
            Tivemos um problema ao carregar seus dados, tente novamente mais
            tarde.
          </h1>
        </div>
      )}
      {data && user && !isLoading && (
        <div className="container flex flex-1 py-10">
          <form
            className="flex flex-col gap-10 flex-1 justify-between"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-6">
              <div
                className="flex flex-col items-center gap-2"
                onClick={triggerInputFile}
              >
                <Input
                  id="photoFile"
                  type="file"
                  className="hidden"
                  onChange={changeInputFile}
                />

                {!user.photo && (
                  <div className="flex bg-primary text-neutral-950 py-11 px-11 rounded-full">
                    <Camera />
                  </div>
                )}

                {user.photo && typeof user.photo === "string" && (
                  <img
                    src={user.photo}
                    alt="User profile picture"
                    className="h-28 w-28 rounded-full object-cover"
                  />
                )}

                {user.photo && user.photo instanceof File && (
                  <img src={URL.createObjectURL(user.photo)} alt="User profile picture" className="h-28 w-28 rounded-full object-cover"/>
                )}
                <Button variant={"ghost"}>Escolher uma foto</Button>
              </div>

              <TextField
                id="name"
                label="Nome"
                required={true}
                onChange={handleChange}
                value={user.name}
              />
              <TextField
                id="surname"
                label="Sobrenome"
                required={true}
                onChange={handleChange}
                value={user.surname}
              />
              <TextField
                id="username"
                label="Nome de Usuário"
                required={true}
                onChange={handleChange}
                value={user.username}
              />
              <TextField
                id="email"
                label="Email"
                required={true}
                onChange={handleChange}
                value={user.email}
              />
            </div>

            <Button size={"lg"} type="submit" className={cn("w-full", `${mutation.isPending && "opacity-50 cursor-not-allowed pointer-events-none"}`)}>
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle size={16} className="animate-spin" />
                  Carregando
                </div>
              ) : ("Salvar")}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
