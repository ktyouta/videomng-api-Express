import { NextFunction, Request, Response } from "express";
import { IS_ALLOW_USER_OPERATION } from "../constant/AllowUserOperationConst";
import { HTTP_STATUS_FORBIDDEN } from "../constant/HttpStatusConst";
import { ApiResponse } from "../util/ApiResponse";

export function userOperationGuardMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {

    if (!IS_ALLOW_USER_OPERATION) {
        ApiResponse.create(res, HTTP_STATUS_FORBIDDEN, `この機能は現在の環境では無効化されています。`);
        return;
    }

    next();
}