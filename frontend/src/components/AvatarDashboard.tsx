import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { Link } from "react-router-dom";
import { getUserProfileData } from "@/api/profileService";

export function AvatarDashboard() {
  const { data: avatar, isLoading } = useQuery<{
    photo: string;
    name: string;
    surname: string;
  }>({
    queryKey: ["getAvatar"],
    queryFn: () => getUserProfileData(),
  });

  return (
    <Link to="/profile/user">
      {isLoading && <Skeleton className="w-8 h-8 rounded-full" />}
      {!isLoading && avatar && avatar.photo !== "" && (
        <div className="flex items-center gap-2">
          <img
            src={avatar.photo}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-layer-primary"
          />
        </div>
      )}
      {!isLoading && avatar && avatar.photo === "" && (
        <div className="w-8 h-8 rounded-full bg-layer-secondary border-2 border-layer-primary flex items-center justify-center">
          <span className="label-small">
            {avatar.name[0]}
            {avatar.surname[0]}
          </span>
        </div>
      )}
    </Link>
  );
}
