import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if(context === null){
        throw new Error("Context not found");
    }

    return context;
}