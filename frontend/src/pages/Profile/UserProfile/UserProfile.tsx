import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/menu-list-item";
import { LogOut, SquareAsterisk, UserCircleIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { UserProfileType } from "@/types/UserProfileType";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "@/utils/log-out";
import { getUserProfileData } from "@/api/profileService";
import GoogleIcon from "@/assets/google.svg?react";
import { useEffect } from "react";
import { toast } from "sonner";
import { linkGoogleAccount } from "@/api/authService";

export function UserProfile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = new QueryClient();

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

  const handleGoogleLink = async () => {
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
              >
                <GoogleIcon className="size-5 fill-content-primary"/>
                Vincular conta do Google
              </MenuListItem>
            <MenuListItem trailingIcon={false} onClick={() => signOut()}>
              <LogOut />
              Sair
            </MenuListItem>
          </div>
        </div>
      </main>
    </div>
  );
}
