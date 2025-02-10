import axios, { AxiosInstance } from 'axios';

export class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            timeout: 5000, // タイムアウト設定
            headers: { 'Content-Type': 'application/json' },
        });
    }

    public async get<T>(url: string, params?: object): Promise<T> {
        const response = await this.client.get<T>(url, { params });
        return response.data;
    }

    public async post<T>(url: string, data: object): Promise<T> {
        const response = await this.client.post<T>(url, data);
        return response.data;
    }

    public async put<T>(url: string, data: object): Promise<T> {
        const response = await this.client.put<T>(url, data);
        return response.data;
    }

    public async delete<T>(url: string, data: object): Promise<T> {
        const response = await this.client.delete<T>(url, data);
        return response.data;
    }
}
