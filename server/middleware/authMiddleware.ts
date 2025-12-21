import { NextFunction, Request, Response } from 'express';
import { CookieModel } from '../cookie/model/CookieModel';
import { JsonWebTokenModel } from '../jsonwebtoken/model/JsonWebTokenModel';
import { JsonWebTokenUserModel } from '../jsonwebtoken/model/JsonWebTokenUserModel';
import { HTTP_STATUS_UNAUTHORIZED } from '../util/const/HttpStatusConst';
import { ApiResponse } from '../util/service/ApiResponse';

/**
 * トークン認証処理
 * @param req 
 * @param res 
 * @param next 
 */
export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        const cookieModel = new CookieModel(req);
        const jsonWebTokenUserModel = await JsonWebTokenUserModel.get(cookieModel);

        req.jsonWebTokenUserModel = jsonWebTokenUserModel;

        next();
    } catch (err) {

        // cookieを削除
        res.clearCookie(JsonWebTokenModel.KEY, { httpOnly: true });
        ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `認証エラー`);
    }
};
