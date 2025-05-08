import { Router, Request, Response, NextFunction } from 'express';
import ENV from '../../env.json';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { ZodIssue } from 'zod';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { FrontUserCheckAuthService } from '../service/FrontUserCheckAuthService';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { Prisma } from '@prisma/client';
import { NewJsonWebTokenModel } from '../../jsonwebtoken/model/NewJsonWebTokenModel';
import { FrontUserCheckAuthResponseModel } from '../model/FrontUserCheckAuthResponseModel';
import { JsonWebTokenModel } from '../../jsonwebtoken/model/JsonWebTokenModel';


export class FrontUserCheckAuthController extends RouteController {

    private readonly frontUserCheckAuthService = new FrontUserCheckAuthService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FRONT_USER_CHECK_AUTH
        );
    }

    /**
     * 認証チェック
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        try {

            // jwtの認証を実行する
            const jsonWebTokenVerifyModel = await this.frontUserCheckAuthService.checkJwtVerify(req);
            const frontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;
            const frontUserPasswordModel = jsonWebTokenVerifyModel.frontUserPasswordModel;

            // jwtを作成
            const newJsonWebTokenModel =
                await this.frontUserCheckAuthService.createJsonWebToken(frontUserIdModel, frontUserPasswordModel);

            // cookieを返却
            res.cookie(JsonWebTokenModel.KEY, newJsonWebTokenModel.token, NewJsonWebTokenModel.COOKIE_OPTION);

            // レスポンス
            const frontUserCheckAuthResponseModel = new FrontUserCheckAuthResponseModel(jsonWebTokenVerifyModel);

            return ApiResponse.create(res, HTTP_STATUS_OK, `認証成功`, frontUserCheckAuthResponseModel.data);
        } catch (e) {

            // エラー発生時はクッキーを削除する
            res.clearCookie(JsonWebTokenModel.KEY, { httpOnly: true });

            return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `認証失敗`);
        }
    }
}