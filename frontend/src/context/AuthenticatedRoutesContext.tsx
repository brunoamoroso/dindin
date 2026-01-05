import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { AuthContextType } from "./AuthContext";


export default function AuthenticatedRoutesContext(){
    const {token, authReady} = useOutletContext<AuthContextType>();

    if (!authReady) return null;

    if(!token){
        return <Navigate to="/"/>
    }

    return <Outlet />
}