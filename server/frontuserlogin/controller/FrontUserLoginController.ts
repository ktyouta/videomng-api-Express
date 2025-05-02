import { Router, Request, Response } from 'express';
import ENV from '../../env.json';
import { RouteController } from '../../router/controller/RouteController';
import { FrontUserLoginService } from '../service/FrontUserLoginService';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ZodIssue } from 'zod';
import { ApiResponse } from '../../util/service/ApiResponse';
import { FrontUserLoginRequestModelSchema } from '../model/FrontUserLoginRequestModelSchema';
import { FrontUserLoginRequestType } from '../model/FrontUserLoginRequestType';
import { FrontUserLoginRepositoryInterface } from '../repository/interface/FrontUserLoginRepositoryInterface';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { FrontUserPasswordModel } from '../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel';
import { FrontUserSaltValueModel } from '../../internaldata/frontuserloginmaster/properties/FrontUserSaltValueModel';
import { FrontUserLoginCreateResponseModel } from '../model/FrontUserLoginResponseModel';
import { LOGIN_ERR_MESSAGE } from '../const/FrontUserLoginConst';
import { NewJsonWebTokenModel } from '../../jsonwebtoken/model/NewJsonWebTokenModel';
import { FrontUserNameModel } from '../../internaldata/frontuserinfomaster/properties/FrontUserNameModel';


export class FrontUserLoginController extends RouteController {

    private frontUserLoginService = new FrontUserLoginService();

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
    public async doExecute(req: Request, res: Response) {

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

        // 永続ロジックを取得する
        const frontUserLoginMasterRepository: FrontUserLoginRepositoryInterface =
            this.frontUserLoginService.getFrontUserLoginMasterRepository();

        // ログインユーザーを取得
        const frontUserLoginList = await this.frontUserLoginService.getLoginUser(frontUserLoginMasterRepository, userNameModel);

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

        // テーブルから取得したソルト値をもとに入力されたパスワードをハッシュ化する
        const saltModel = FrontUserSaltValueModel.reConstruct(salt);
        const inputPasswordModel = FrontUserPasswordModel.hash(requestBody.password, saltModel);

        if (inputPasswordModel.frontUserPassword !== frontUserLogin.password) {
            return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, LOGIN_ERR_MESSAGE);
        }

        // ユーザー情報を取得
        const frontUserList = await this.frontUserLoginService.getUserInfo(frontUserLoginMasterRepository, frontUserIdModel);

        // ユーザーの取得に失敗
        if (frontUserList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, LOGIN_ERR_MESSAGE);
        }

        const frontUser = frontUserList[0];

        // jwtを作成
        const newJsonWebTokenModel =
            await this.frontUserLoginService.createJsonWebToken(frontUserIdModel, inputPasswordModel);

        // レスポンスを作成
        const frontUserLoginCreateResponseModel =
            new FrontUserLoginCreateResponseModel(frontUser);

        // cookieを返却
        res.cookie(NewJsonWebTokenModel.COOKIE_KEY, newJsonWebTokenModel.token, NewJsonWebTokenModel.COOKIE_OPTION);

        return ApiResponse.create(res, HTTP_STATUS_OK, `ログイン成功`, frontUserLoginCreateResponseModel.data);
    }
}