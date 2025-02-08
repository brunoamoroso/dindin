import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { AuthContextType } from "./AuthContext";


export default function AuthenticatedRoutesContext(){
    const {token} = useOutletContext<AuthContextType>();

    if(!token){
        return <Navigate to="/"/>
    }

    return <Outlet />
}