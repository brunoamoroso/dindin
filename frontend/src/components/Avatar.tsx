import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { Skeleton } from "./ui/skeleton";

export function Avatar(){
    const {data: avatar, isLoading: isLoadingAvatar} = useQuery<{ photo: string; name: string; surname: string; }>({
        queryKey: ["avatar"],
        queryFn: () => api.getAvatar(),
      });
    
    return (
        <>
            {isLoadingAvatar && (
                <Skeleton className="w-8 h-8 rounded-full" />
            )}
            {!isLoadingAvatar && avatar && avatar.photo && avatar.photo !== "" && (
                <div className="flex items-center gap-2">
                    <img
                        src={avatar.photo}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                    />
                </div>
            )}
            {!isLoadingAvatar && avatar && (!avatar.photo || avatar.photo === "") && (
                <div className="w-8 h-8 rounded-full bg-container1 border-2 border-container0 flex items-center justify-center">
                     <span className="label-small">{avatar.name[0]}{avatar.surname[0]}</span>
                </div>
            )}
        </>
    );
}