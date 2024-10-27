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
            const errorText = await response.text();
            throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorText}`);
        }

        return await response.json();
    }

    private get<T>(endpoint: string): Promise<T>{
        return this.request<T>(endpoint, "GET");
    }

    /**
     * 
     * @param endpoint
     * @param body 
     * @returns 
     */
    private post<T>(endpoint: string, body: unknown): Promise<T>{
        return this.request<T>(endpoint, "POST", body);
    }

    private put<T>(endpoint: string, body: unknown): Promise<T>{
        return this.request<T>(endpoint, "PUT", body);
    }

    private delete<T>(endpoint:string): Promise<T>{
        return this.request<T>(endpoint, "DELETE");
    }

    public createProfile<T>(body: unknown): Promise<T>{
        return this.post<T>("/profile/create", body);
    }
    
    public signIn<T>(body: {username: string; password: string;}): Promise<T>{
        console.log(body);
        return this.post<T>("/profile/signin", body);
    }

    public getCategories<T>(type: string): Promise<T>{
        return this.get<T>(`/categories/${type}`);
    }

    public getSubCategories<T>(category: string): Promise<T>{
        return this.get<T>(`/categories/sub/${category}`);
    }

    public getAccounts<T>(): Promise<T>{
        return this.get<T>(`/accounts/list`);
    }

    public addTransaction<T>(body: unknown): Promise<T>{
        return this.post<T>("/transactions/add", body);
    }

    public getAllTransactionsByMonth<T>(date: string): Promise<T>{
        return this.get<T>(`/transactions/all-month/${date}`);
    }

    public deleteTransaction<T>(id: string): Promise<T>{
        return this.delete<T>(`/transactions/delete/${id}`);
    }

    public getOneTransaction<T>(id: string): Promise<T>{
        return this.get<T>(`/transactions/${id}`);
    }

    public updateTransaction<T>(id: string, body: unknown):Promise<T>{
        return this.put<T>(`/transactions/update/${id}`, body);
    }
}

const instance = new Api();
export default instance;