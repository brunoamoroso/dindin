class Api{
    private baseURL: string;

    constructor(){
        if(import.meta.env.VITE_BACKEND_URL === undefined){
            throw new Error("BACKEND_URL NOT DEFINED");
        }

        this.baseURL = import.meta.env.VITE_BACKEND_URL;

    }

    private async request<T>(endpoint: string, method: string, body?: unknown, headers?: HeadersInit): Promise<T>{
        const isFormData = body instanceof FormData;

        const response = await fetch(this.baseURL+endpoint, {
            method: method,
            headers: isFormData ? headers : {...headers, "Content-Type": "application/json"},
            body: body as BodyInit
        });

        if(!response.ok){
            const errorText = await response.text();
            throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorText}`);
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

    public createProfile<T>(body: unknown): Promise<T>{
        return this.post<T>("/profile/create", body);
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
        return this.post<T>("/transactions/add", JSON.stringify(body));
    }
}

const instance = new Api();
export default instance;