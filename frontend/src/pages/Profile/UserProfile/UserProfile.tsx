import AppBar from "@/components/AppBar";
import MenuListItem from "@/components/ui/menu-list-item";
import { LogOut, SquareAsterisk, UserCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { UserProfileType } from "@/types/UserProfileType";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut } from "@/utils/log-out";

export function UserProfile() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<UserProfileType>({
    queryKey: ["userData"],
    queryFn: () => api.getUserProfileData(),
  });

  return (
    <div className="bg-surface min-h-dvh">
      <AppBar title="Perfil" />
      <main className="container flex flex-1 flex-col mt-6">
        {isLoading && (
          <div className="flex items-center gap-3 py-4">
            <div className="bg-container2 rounded-full w-16 h-16 flex items-center justify-center">
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
            <div className="bg-container2 rounded-full w-16 h-16 flex items-center justify-center title-small text-body">
              {data.photo !== "" && (
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                    data.photo
                  }`}
                  alt="user"
                  className="w-full h-full object-cover rounded-full"
                />
              )}
              {data.photo === "" && (
                <>{data.name[0] + data.surname[0]}</>
              )}
            </div>
            <div className="flex flex-col">
              <h1 className="title-medium text-title">{`${data.name} ${data.surname}`}</h1>
              <span className="body-medium text-subtle">{data.email}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 p-4 bg-container2 rounded-lg mt-6">
          <h2 className="title-small text-title px-3">Minha Conta</h2>
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
