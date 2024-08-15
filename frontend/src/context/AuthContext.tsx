import { createContext, useState } from "react";
import { Outlet } from "react-router-dom";

interface AuthContextType{
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = () => {
    const [token, setToken] = useState<string | null>(null);

    return(
        <AuthContext.Provider value={{token, setToken}}>
            <Outlet />
        </AuthContext.Provider>
    );
}