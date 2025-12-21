import { NextFunction, Response } from 'express';
import { JsonWebTokenModel } from '../../jsonwebtoken/model/JsonWebTokenModel';
import { NewJsonWebTokenModel } from '../../jsonwebtoken/model/NewJsonWebTokenModel';
import { authMiddleware } from '../../middleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { FrontUserCheckAuthResponseModel } from '../model/FrontUserCheckAuthResponseModel';
import { FrontUserCheckAuthService } from '../service/FrontUserCheckAuthService';


export class FrontUserCheckAuthController extends RouteController {

    private readonly frontUserCheckAuthService = new FrontUserCheckAuthService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FRONT_USER_CHECK_AUTH,
            [authMiddleware]
        );
    }

    /**
     * 認証チェック
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        try {

            const jsonWebTokenUserModel = req.jsonWebTokenUserModel;
            const frontUserIdModel = jsonWebTokenUserModel.frontUserIdModel;

            // jwtを作成
            const newJsonWebTokenModel = await this.frontUserCheckAuthService.createJsonWebToken(frontUserIdModel);

            // cookieを返却
            res.cookie(JsonWebTokenModel.KEY, newJsonWebTokenModel.token, NewJsonWebTokenModel.COOKIE_OPTION);

            // レスポンス
            const frontUserCheckAuthResponseModel = new FrontUserCheckAuthResponseModel(jsonWebTokenUserModel);

            return ApiResponse.create(res, HTTP_STATUS_OK, `認証成功`, frontUserCheckAuthResponseModel.data);
        } catch (e) {

            // エラー発生時はクッキーを削除する
            res.clearCookie(JsonWebTokenModel.KEY, { httpOnly: true });

            return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `認証失敗`);
        }
    }
}