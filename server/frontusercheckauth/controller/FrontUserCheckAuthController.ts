import { Response } from 'express';
import { AccessTokenError } from '../../accesstoken/model/AccessTokenError';
import { AccessTokenModel } from '../../accesstoken/model/AccessTokenModel';
import { RepositoryType } from '../../common/const/CommonConst';
import { HTTP_STATUS_FORBIDDEN, HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED } from '../../common/const/HttpStatusConst';
import { CookieModel } from '../../cookie/model/CookieModel';
import { HeaderModel } from '../../header/model/HeaderModel';
import { RefreshTokenModel } from '../../refreshtoken/model/RefreshTokenModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
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
    public async doExecute(req: AuthenticatedRequest, res: Response) {

        try {

            // cookie
            const cookieModel = new CookieModel(req);

            // リフレッシュトークン
            const refreshTokenModel = RefreshTokenModel.get(cookieModel);

            // 認証
            const userIdModel = refreshTokenModel.getPalyload();

            // ユーザー情報取得
            const userInfo = await this.frontUserCheckAuthService.getUser(userIdModel);

            if (!userInfo || userInfo.length === 0) {
                res.clearCookie(RefreshTokenModel.COOKIE_KEY, RefreshTokenModel.COOKIE_CLEAR_OPTION);
                return ApiResponse.create(res, HTTP_STATUS_FORBIDDEN, `認証失敗`);
            }

            const headerModel = new HeaderModel(req);
            const accessTokenModel = AccessTokenModel.get(headerModel);

            // アクセストークン検証
            accessTokenModel.getPalyload();

            // レスポンス
            const frontUserCheckAuthResponseModel = new FrontUserCheckAuthResponseModel(userInfo[0]);

            return ApiResponse.create(res, HTTP_STATUS_OK, `認証成功`, frontUserCheckAuthResponseModel.data);
        } catch (e) {

            if (e instanceof AccessTokenError) {
                return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `認証エラー`);
            }

            // エラー発生時はクッキーを削除する
            res.clearCookie(RefreshTokenModel.COOKIE_KEY, RefreshTokenModel.COOKIE_CLEAR_OPTION);
            return ApiResponse.create(res, HTTP_STATUS_FORBIDDEN, `認証失敗`);
        }
    }
}