import Cookies from "js-cookie";

class Api{
    private baseURL: string;

    constructor(){
        if(import.meta.env.VITE_BACKEND_URL === undefined){
            throw new Error("BACKEND_URL NOT DEFINED");
        }

        this.baseURL = import.meta.env.VITE_BACKEND_URL;

    }

    private async request<T>(endpoint: string, method: string, body?: unknown): Promise<T>{
        const isFormData = body instanceof FormData;
        const headers = new Headers();
        const token = Cookies.get('token');

        if(!isFormData){
            headers.append("Content-Type","application/json");
        }

        headers.append("Authorization", `Bearer ${token}`);

        const response = await fetch(this.baseURL+endpoint, {
            method: method,
            headers: headers,
            body: isFormData ? body as BodyInit: JSON.stringify(body)
        });

        if(!response.ok){
            const errorText = await response.json();
            throw new Error(errorText.message || 'Erro desconhecido');
        }

        return await response.json();
    }

    public get<T>(endpoint: string): Promise<T>{
        return this.request<T>(endpoint, "GET");
    }

    /**
     * 
     * @param endpoint
     * @param body 
     * @returns 
     */
    public post<T>(endpoint: string, body: unknown): Promise<T>{
        return this.request<T>(endpoint, "POST", body);
    }

    public put<T>(endpoint: string, body: unknown): Promise<T>{
        return this.request<T>(endpoint, "PUT", body);
    }

    public delete<T>(endpoint:string): Promise<T>{
        return this.request<T>(endpoint, "DELETE");
    }
}

export const api = new Api();