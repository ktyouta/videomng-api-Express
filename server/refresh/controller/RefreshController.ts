import { NextFunction, Request, Response } from 'express';
import { AccessTokenModel } from '../../accesstoken/model/AccessTokenModel';
import { CookieModel } from '../../cookie/model/CookieModel';
import { HeaderModel } from '../../header/model/HeaderModel';
import { RefreshTokenModel } from '../../refreshtoken/model/RefreshTokenModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AUTH_ALLOWED_ORIGINS } from '../../util/const/AuthAllowedOrigins';
import { RepositoryType } from '../../util/const/CommonConst';
import { HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { Logger } from '../../util/service/Logger';
import { RefreshRepositorys } from '../repository/RefreshRepositorys';
import { RefreshService } from '../service/RefreshService';


export class RefreshController extends RouteController {

    private readonly refreshService = new RefreshService((new RefreshRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.REFRESH,
        );
    }

    /**
     * トークンリフレッシュ
     * @param req 
     * @param res 
     * @returns 
     */
    async doExecute(req: Request, res: Response, next: NextFunction) {

        try {

            // cookie
            const cookieModel = new CookieModel(req);
            // ヘッダー
            const headerModel = new HeaderModel(req);
            const origin = headerModel.get(`origin`);
            const customHeader = headerModel.get(`X-CSRF-Token`)

            // 許可Originチェック
            if (!origin || !AUTH_ALLOWED_ORIGINS.some(e => e === origin)) {
                throw Error(`許可されていないOrigin`);
            }

            // カスタムヘッダチェック
            if (customHeader !== `web`) {
                throw Error(`カスタムヘッダが不正`);
            }

            // リフレッシュトークン
            const refreshTokenModel = RefreshTokenModel.get(cookieModel);

            // 認証
            const userIdModel = this.refreshService.verify(refreshTokenModel);

            // ユーザー情報取得
            const userInfo = await this.refreshService.getUser(userIdModel);

            if (!userInfo || userInfo.length === 0) {
                throw Error(`該当ユーザーなし`);
            }

            // アクセストークン発行
            const accessTokenModel = AccessTokenModel.create(userIdModel);

            return ApiResponse.create(res, HTTP_STATUS_OK, `認証成功`, accessTokenModel.token);
        } catch (e) {

            Logger.warn(`Refresh failed:${e}`);

            // エラー発生時はトークンを削除する
            res.clearCookie(RefreshTokenModel.COOKIE_KEY, RefreshTokenModel.COOKIE_OPTION);

            return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `認証失敗`);
        }
    }
}