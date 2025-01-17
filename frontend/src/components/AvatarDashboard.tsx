import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { Skeleton } from "./ui/skeleton";
import { Link } from "react-router-dom";

export function AvatarDashboard() {
  const { data: avatar, isLoading: isLoadingAvatar } = useQuery<{
    photo: string;
    name: string;
    surname: string;
  }>({
    queryKey: ["avatar"],
    queryFn: () => api.getAvatar(),
  });

  return (
    <>
      {isLoadingAvatar && <Skeleton className="w-8 h-8 rounded-full" />}
      {!isLoadingAvatar && (
        <Link to="/profile/user">
          {avatar && avatar.photo && avatar.photo !== "" && (
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${avatar.photo}`}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-container0"
              />
            </div>
          )}
          {avatar && (!avatar.photo || avatar.photo === "") && (
            <div className="w-8 h-8 rounded-full bg-container1 border-2 border-container0 flex items-center justify-center">
              <span className="label-small">
                {avatar.name[0]}
                {avatar.surname[0]}
              </span>
            </div>
          )}
        </Link>
      )}
    </>
  );
}
