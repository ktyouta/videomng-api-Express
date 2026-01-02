import { NextFunction, Request, Response } from 'express';
import { AccessTokenModel } from '../../accesstoken/model/AccessTokenModel';
import { AuthOriginModel } from '../../authorigin/model/AuthOriginModel';
import { RepositoryType } from '../../common/const/CommonConst';
import { HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED } from '../../common/const/HttpStatusConst';
import { CookieModel } from '../../cookie/model/CookieModel';
import { HeaderModel } from '../../header/model/HeaderModel';
import { Logger } from '../../logger/Logger';
import { RefreshCustomHeaderModel } from '../../refreshcustomheader/model/RefreshCustomHeaderModel';
import { RefreshTokenModel } from '../../refreshtoken/model/RefreshTokenModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiResponse } from '../../util/ApiResponse';
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
            const authOriginModel = new AuthOriginModel(headerModel);

            // 許可Originチェック
            if (!authOriginModel.isAllowed()) {
                throw Error(`許可されていないOrigin`);
            }

            const customHeader = new RefreshCustomHeaderModel(headerModel);

            // カスタムヘッダチェック
            if (!customHeader.isValid()) {
                throw Error(`カスタムヘッダが不正`);
            }

            // リフレッシュトークン
            const refreshTokenModel = RefreshTokenModel.get(cookieModel);

            // 認証
            const userIdModel = refreshTokenModel.getPalyload();

            // ユーザー情報取得
            const userInfo = await this.refreshService.getUser(userIdModel);

            if (!userInfo || userInfo.length === 0) {
                throw Error(`リフレッシュトークンからユーザー情報を取得できませんでした`);
            }

            // リフレッシュトークンの絶対期限チェック
            if (refreshTokenModel.isAbsoluteExpired()) {
                throw new Error('リフレッシュトークンの絶対期限切れ');
            }

            // リフレッシュトークン再発行
            const newRefreshTokenModel = refreshTokenModel.refresh();
            res.cookie(RefreshTokenModel.COOKIE_KEY, newRefreshTokenModel.token, RefreshTokenModel.COOKIE_SET_OPTION);

            // アクセストークン発行
            const accessTokenModel = AccessTokenModel.create(userIdModel);

            return ApiResponse.create(res, HTTP_STATUS_OK, `認証成功`, accessTokenModel.token);
        } catch (e) {

            Logger.warn(`Refresh failed:${e}`);

            // エラー発生時はトークンを削除する
            res.clearCookie(RefreshTokenModel.COOKIE_KEY, RefreshTokenModel.COOKIE_CLEAR_OPTION);

            return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `認証失敗`);
        }
    }
}