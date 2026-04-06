import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/menu-list-item";
import { LogOut, SquareAsterisk, UserCircleIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProfileType } from "@/types/UserProfileType";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "@/utils/log-out";
import { changePassword, checkPassword, getUserProfileData } from "@/api/profileService";
import GoogleIcon from "@/assets/google.svg?react";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { linkGoogleAccount, unlinkGoogleAccount } from "@/api/authService";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import TextField from "@/components/textfield";
import { Button } from "@/components/ui/button";
import PasswordValidator from "@/components/passwordvalidator";
import { passwordCheck } from "@/utils/password-check";

export function UserProfile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [sheetSetNewPassword, setSheetSetNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const rules = ["Maiúscula", "Minúscula", "Número", "8 Dígitos", "Símbolo"];
  const [validations, setValidations] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    minLength: false,
    hasSymbol: false,
  });

  const handlePasswordValidation = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    const passValidations = passwordCheck(password);
    setValidations(passValidations);

    if (!Object.values(passValidations).every((check) => check === true)) {
      setPasswordValid(false);
      return;
    }
    setNewPassword(password);
    setPasswordValid(true);
  };

  useEffect(() => {
    const linkedAccount = searchParams.get("linkedAccount");
    if (linkedAccount === "true") {
      toast.success("Conta do Google vinculada com sucesso!", { id: "google-link" });
      const next = new URLSearchParams(searchParams);
      next.delete("linkedAccount");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { data, isLoading } = useQuery<UserProfileType>({
    queryKey: ["userData"],
    queryFn: () => getUserProfileData(),
  });

  
  const mutationUnlinkGoogle = useMutation({
    mutationFn: () => unlinkGoogleAccount(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"], });
      toast.success("Conta do Google desvinculada com sucesso!");
    }
  });
  
  const newPasswordMutation = useMutation({
    mutationFn: (password: string) => changePassword({oldPassword: "", newPassword: password}),
    onSuccess: () => {
      toast.success("Senha definida com sucesso!");
      mutationUnlinkGoogle.mutate();
      setSheetSetNewPassword(false);
    }
  });

  const handleNewPasswordSubmit = () => {
    return () => {
      if(!passwordValid){
        toast.error("Senha inválida. Verifique os requisitos.");
        return;
      }
      newPasswordMutation.mutate(newPassword);
    }
  } 

  const handleGoogleLink = async () => {
    if (data?.google_linked) {
      const passwordSet = await queryClient.fetchQuery({
        queryKey: ["checkPassword"],
        queryFn: () => checkPassword<boolean>(),
      });

      if(passwordSet){
        mutationUnlinkGoogle.mutate();
      }else{
        setSheetSetNewPassword(true);
      }

      return;
    }
    const {url} = await queryClient.fetchQuery({
      queryKey: ["linkGoogleAccount"],
      queryFn: () => linkGoogleAccount<{url: string}>(),
    });

    window.location.assign(url);
  }

  return (
    <div className="bg-surface min-h-dvh">
      <AppBar title="Perfil" />
      <main className="px-6 flex flex-1 flex-col mt-6">
        {isLoading && (
          <div className="flex items-center gap-3 py-4">
            <div className="bg-layer-tertiary rounded-full w-16 h-16 flex items-center justify-center">
              <Skeleton />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="flex h-7 w-40" />
              <Skeleton className="flex h-3.5 w-28" />
            </div>
          </div>
        )}
        {!isLoading && data && (
          <div className="flex items-center gap-3 py-4">
            <div className="bg-layer-tertiary rounded-full w-16 h-16 flex items-center justify-center title-small text-content-secondary">
              {data.photo !== "" && (
                <img
                  src={data.photo as string}
                  alt="user"
                  className="w-full h-full object-cover rounded-full"
                />
              )}
              {data.photo === "" && (
                <>{data.name[0] + data.surname[0]}</>
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="title-medium text-content-primary">{`${data.name} ${data.surname}`}</h1>
              <span className="body-medium text-content-subtle">{data.email}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 p-4 bg-layer-tertiary rounded-lg mt-6">
          <h2 className="title-small text-content-primary px-3">Minha Conta</h2>
          <div className="flex flex-col">
            <MenuListItem
              separator
              onClick={() => navigate("/profile/user/edit")}
            >
              <UserCircleIcon />
              Dados Cadatrais
            </MenuListItem>
            <MenuListItem
              separator
              onClick={() => navigate("/profile/user/change-password")}
            >
              <SquareAsterisk />
              Mudar Senha
            </MenuListItem>
            <MenuListItem
              separator
              onClick={() => handleGoogleLink()}
              trailingIcon={false}
            >
              <GoogleIcon className="size-5 fill-content-primary"/>
              {data?.google_linked ? "Desvincular conta do Google" : "Vincular conta do Google"}
            </MenuListItem>
            <MenuListItem trailingIcon={false} onClick={() => signOut()}>
              <LogOut />
              Sair
            </MenuListItem>
          </div>
        </div>
        <Drawer open={sheetSetNewPassword} onOpenChange={setSheetSetNewPassword}>
          <DrawerContent className="mb-10">
            <DrawerHeader>
              <DrawerTitle>Defina uma senha para a sua conta</DrawerTitle>
              <DrawerDescription>Sua conta ainda não tem uma senha. Para desvincular sua conta do Google, você precisa definir uma senha primeiro.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 ">
              <TextField label="Nova senha" type="password" className="mb-3" onChange={handlePasswordValidation}/>
              <PasswordValidator validations={validations} rules={rules} />
            </div>
            <DrawerFooter className="gap-6">
              <Button size={"lg"} onClick={handleNewPasswordSubmit()}>Definir senha</Button>
              <Button size={"lg"} variant={"outline"} onClick={() => setSheetSetNewPassword(false)}>Cancelar</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </main>
    </div>
  );
}
