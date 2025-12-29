import { NextFunction, Response } from 'express';
import { AccessTokenModel } from '../../accesstoken/model/AccessTokenModel';
import { CookieModel } from '../../cookie/model/CookieModel';
import { CsrfTokenModel } from '../../csrftoken/model/CsrfTokenModel';
import { RefreshTokenModel } from '../../refreshtoken/model/RefreshTokenModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { RepositoryType } from '../../util/const/CommonConst';
import { HTTP_STATUS_FORBIDDEN, HTTP_STATUS_OK } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { FrontUserCheckAuthResponseModel } from '../model/FrontUserCheckAuthResponseModel';
import { FrontUserCheckAuthRepositorys } from '../repository/FrontUserCheckAuthRepositorys';
import { FrontUserCheckAuthService } from '../service/FrontUserCheckAuthService';


export class FrontUserCheckAuthController extends RouteController {

    private readonly frontUserCheckAuthService = new FrontUserCheckAuthService((new FrontUserCheckAuthRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FRONT_USER_CHECK_AUTH,
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

            // cookie
            const cookieModel = new CookieModel(req);

            // リフレッシュトークン
            const refreshTokenModel = RefreshTokenModel.get(cookieModel);

            // 認証
            const userIdModel = this.frontUserCheckAuthService.verify(refreshTokenModel);

            // ユーザー情報取得
            const userInfo = await this.frontUserCheckAuthService.getUser(userIdModel);

            if (!userInfo || userInfo.length === 0) {

                res.clearCookie(RefreshTokenModel.COOKIE_KEY, RefreshTokenModel.COOKIE_OPTION);
                res.clearCookie(CsrfTokenModel.COOKIE_KEY, CsrfTokenModel.COOKIE_OPTION);

                return ApiResponse.create(res, HTTP_STATUS_FORBIDDEN, `認証失敗`);
            }

            // アクセストークンを発行
            const accessTokenModel = AccessTokenModel.create(userIdModel);

            // レスポンス
            const frontUserCheckAuthResponseModel = new FrontUserCheckAuthResponseModel(userInfo[0], accessTokenModel);

            return ApiResponse.create(res, HTTP_STATUS_OK, `認証成功`, frontUserCheckAuthResponseModel.data);
        } catch (e) {

            // エラー発生時はクッキーを削除する
            res.clearCookie(RefreshTokenModel.COOKIE_KEY, RefreshTokenModel.COOKIE_OPTION);
            res.clearCookie(CsrfTokenModel.COOKIE_KEY, CsrfTokenModel.COOKIE_OPTION);

            return ApiResponse.create(res, HTTP_STATUS_FORBIDDEN, `認証失敗`);
        }
    }
}