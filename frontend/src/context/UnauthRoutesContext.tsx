import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function UnauthRoutesContext(){
    const {token} = useAuth();

    if(token){
        return <Navigate to={"/dashboard"} />
    }

    return <Outlet />
}