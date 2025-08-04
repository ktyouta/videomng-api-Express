import { Router, Request, Response } from 'express';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ZodIssue } from 'zod';
import { ApiResponse } from '../../util/service/ApiResponse';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { NewJsonWebTokenModel } from '../../jsonwebtoken/model/NewJsonWebTokenModel';
import { JsonWebTokenModel } from '../../jsonwebtoken/model/JsonWebTokenModel';


export class FrontUserLogoutController extends RouteController {

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FRONT_USER_LOGOUT
        );
    }

    /**
     * ログアウト
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response) {

        // cookieを削除
        res.clearCookie(JsonWebTokenModel.KEY, NewJsonWebTokenModel.COOKIE_OPTION);

        return ApiResponse.create(res, HTTP_STATUS_OK, `ログアウトしました。`);
    }
}