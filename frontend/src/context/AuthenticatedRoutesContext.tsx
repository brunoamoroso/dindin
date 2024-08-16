import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";


export default function AuthenticatedRoutesContext(){
    const {token} = useAuth();

    if(!token){
        return <Navigate to="/"/>
    }

    return <Outlet />
}