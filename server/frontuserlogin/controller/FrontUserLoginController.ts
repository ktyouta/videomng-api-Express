import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { ZodIssue } from 'zod';
import { CsrfTokenModel } from '../../csrftoken/model/CsrfTokenModel';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { FrontUserNameModel } from '../../internaldata/frontuserinfomaster/properties/FrontUserNameModel';
import { FrontUserPasswordModel } from '../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel';
import { FrontUserSaltValueModel } from '../../internaldata/frontuserloginmaster/properties/FrontUserSaltValueModel';
import { JsonWebTokenModel } from '../../jsonwebtoken/model/JsonWebTokenModel';
import { NewJsonWebTokenModel } from '../../jsonwebtoken/model/NewJsonWebTokenModel';
import { PepperModel } from '../../pepper/model/PepperModel';
import { RefreshTokenModel } from '../../refreshtoken/model/RefreshTokenModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { RepositoryType } from '../../util/const/CommonConst';
import { HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { LOGIN_ERR_MESSAGE } from '../const/FrontUserLoginConst';
import { FrontUserLoginRequestModelSchema } from '../model/FrontUserLoginRequestModelSchema';
import { FrontUserLoginRequestType } from '../model/FrontUserLoginRequestType';
import { FrontUserLoginCreateResponseModel } from '../model/FrontUserLoginResponseModel';
import { FrontUserLoginRepositorys } from '../repository/FrontUserLoginRepositorys';
import { FrontUserLoginService } from '../service/FrontUserLoginService';


export class FrontUserLoginController extends RouteController {

    private frontUserLoginService = new FrontUserLoginService((new FrontUserLoginRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FRONT_USER_LOGIN
        );
    }

    /**
     * ログイン
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // リクエストボディ
        const requestBody: FrontUserLoginRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = FrontUserLoginRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        const userNameModel = new FrontUserNameModel(requestBody.userName);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // ログインユーザーを取得
            const frontUserLoginList = await this.frontUserLoginService.getLoginUser(userNameModel);

            // ユーザーの取得に失敗
            if (frontUserLoginList.length === 0) {
                return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, LOGIN_ERR_MESSAGE);
            }

            const frontUserLogin = frontUserLoginList[0];
            const salt = frontUserLogin.salt;
            const frontUserIdModel = FrontUserIdModel.reConstruct(frontUserLogin.userId);

            if (!salt) {
                throw Error(`ソルト値を取得できませんでした。ユーザーID:${frontUserLogin.userId}`);
            }

            // テーブルから取得したソルト値とペッパー値をもとに入力されたパスワードをハッシュ化する
            const saltModel = FrontUserSaltValueModel.reConstruct(salt);
            const pepperModel = new PepperModel();

            const secureInputPasswordModel = FrontUserPasswordModel.secureHash(requestBody.password, saltModel, pepperModel);

            // salt + pepper認証に失敗
            if (secureInputPasswordModel.frontUserPassword !== frontUserLogin.password) {

                // salt認証
                const inputPasswordModel = FrontUserPasswordModel.hash(requestBody.password, saltModel);

                if (inputPasswordModel.frontUserPassword !== frontUserLogin.password) {
                    return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, LOGIN_ERR_MESSAGE);
                }

                // パスワードをsalt + pepperハッシュで更新する
                await this.frontUserLoginService.updatePassword(frontUserIdModel, secureInputPasswordModel, tx);
            }

            // ユーザー情報を取得
            const frontUserList = await this.frontUserLoginService.getUserInfo(frontUserIdModel);

            // ユーザーの取得に失敗
            if (frontUserList.length === 0) {
                return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, LOGIN_ERR_MESSAGE);
            }

            const frontUser = frontUserList[0];

            // jwtを作成
            const newJsonWebTokenModel =
                await this.frontUserLoginService.createJsonWebToken(frontUserIdModel);

            // リフレッシュトークンを発行
            const refreshTokenModel = RefreshTokenModel.create(frontUserIdModel);
            // CSRFトークンを発行
            const csrfTokenModel = CsrfTokenModel.create();

            // レスポンスを作成
            const frontUserLoginCreateResponseModel = new FrontUserLoginCreateResponseModel(frontUser);

            // 最終ログイン日時を更新する
            await this.frontUserLoginService.updateLastLoginDate(frontUserIdModel, tx);

            // cookieを返却
            res.cookie(JsonWebTokenModel.KEY, newJsonWebTokenModel.token, NewJsonWebTokenModel.COOKIE_OPTION);
            res.cookie(RefreshTokenModel.COOKIE_KEY, refreshTokenModel.token, RefreshTokenModel.COOKIE_OPTION);
            res.cookie(CsrfTokenModel.COOKIE_KEY, csrfTokenModel.token, CsrfTokenModel.COOKIE_OPTION);

            return ApiResponse.create(res, HTTP_STATUS_OK, `ログイン成功`, frontUserLoginCreateResponseModel.data);
        }, next);
    }
}