import { createContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


interface AuthContextType{
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = () => {
    const [token, setToken] = useState<string | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const cookieToken = Cookies.get('token')

        if(cookieToken){
            setToken(cookieToken);
            if(location.pathname === "/"){
                navigate("/dashboard");
            }
        }
    }, [token, navigate, location.pathname]);

    return(
        <AuthContext.Provider value={{token, setToken}}>
            <Outlet />
        </AuthContext.Provider>
    );
}