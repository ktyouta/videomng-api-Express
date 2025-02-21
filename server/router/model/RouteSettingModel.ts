import { IRouterMatcher, Router, Request, Response } from "express";
import { ApiEndopoint } from "../conf/ApiEndpoint";

/**
 * httpメソッド
 */
export enum HttpMethodType {
    GET = `GET`,
    POST = `POST`,
    PUT = `PUT`,
    DELETE = `DELETE`,
}


export class RouteSettingModel {

    // httpメソッド
    private readonly _httpMethodType: HttpMethodType;
    // 実行関数
    private readonly _executeFunction: ((req: Request, res: Response, id: string) => Response<any, Record<string, any>>) | (
        (req: Request, res: Response, id: string) => Promise<Response<any, Record<string, any>>>);
    // エンドポイント
    private readonly _endPoint: ApiEndopoint;


    constructor(httpMthodType: HttpMethodType,
        executeFunction: ((req: Request, res: Response, id: string) => Response<any, Record<string, any>>) | (
            (req: Request, res: Response, id?: string) => Promise<Response<any, Record<string, any>>>),
        endPoint: ApiEndopoint,
    ) {

        if (!endPoint) {
            throw Error(`エンドポイントが設定されていません。`);
        }

        this._httpMethodType = httpMthodType;
        this._executeFunction = executeFunction;
        this._endPoint = endPoint;
    }

    get httpMethodType() {
        return this._httpMethodType;
    }

    get executeFunction() {
        return this._executeFunction;
    }

    get endPoint() {
        return this._endPoint;
    }
}