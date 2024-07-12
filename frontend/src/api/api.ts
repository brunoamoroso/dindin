import { configDotenv } from "dotenv";

configDotenv();

class Api{
    private baseURL: string;

    constructor(){
        if(process.env.BACKEND_URL === undefined){
            throw new Error("BACKEND_URL NOT DEFINED");
        }

        this.baseURL = process.env.BACKEND_URL;

    }

    private async request<T>(endpoint: string, method: string, body?: string): Promise<T>{
        const response = await fetch(this.baseURL+endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if(!response.ok){
            throw new Error(`HTTP ERROR! Status: ${response.status}`);
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
    public post<T>(endpoint: string, body: any): Promise<T>{
        return this.request<T>(endpoint, "POST", body);
    }

    public put<T>(endpoint: string, body: any): Promise<T>{
        return this.request<T>(endpoint, "PUT", body);
    }

    public delete<T>(endpoint:string): Promise<T>{
        return this.request<T>(endpoint, "DELETE");
    }
}

const instance = new Api();
export default instance;