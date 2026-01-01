import axios, { AxiosInstance } from 'axios';
import { envConfig } from '../common/const/EnvConfig';

export class ApiClient {
    private client: AxiosInstance;

    constructor() {

        const timeout = envConfig.timeout;

        if (!timeout) {
            throw Error(`設定ファイルにタイムアウト時間が設定されていません。`);
        }

        if (isNaN(Number.parseInt(timeout))) {
            throw Error(`設定ファイルのタイムアウト時間が不正です。`);
        }

        this.client = axios.create({
            // タイムアウト設定
            timeout: Number.parseInt(timeout),
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
