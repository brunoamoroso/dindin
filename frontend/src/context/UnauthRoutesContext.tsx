import { Navigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { AuthContextType } from "./AuthContext";

export default function UnauthRoutesContext(){
    const location = useLocation();
    const {token} = useOutletContext<AuthContextType>();    

    if(token && !location.state.creationFlow){
        return <Navigate to={"/dashboard"} />
    }

    return <Outlet />
}