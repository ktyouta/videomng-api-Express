import { NextFunction, Request, Response } from 'express';
import { CookieModel } from '../cookie/model/CookieModel';
import { JsonWebTokenUserModel } from '../jsonwebtoken/model/JsonWebTokenUserModel';

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        const cookieModel = new CookieModel(req);
        const jsonWebTokenUserModel = await JsonWebTokenUserModel.get(cookieModel);

        req.frontUserIdModel = jsonWebTokenUserModel.frontUserIdModel;

        next();
    } catch (err) {
        res.status(401).json({ message: '認証エラー' });
    }
};
