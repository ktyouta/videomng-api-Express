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
import { FrontUserLoginRequestModel } from '../model/FrontUserLoginRequestModel';
import { FrontUserLoginMasterRepositoryInterface } from '../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface';
import { FrontUserLoginRepositoryInterface } from '../repository/interface/FrontUserLoginRepositoryInterface';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';


export class FrontUserLoginController extends RouteController {

    private FrontUserLoginService = new FrontUserLoginService();

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

        // リクエストボディの型を変換する
        const frontUserLoginRequestBody: FrontUserLoginRequestModel =
            this.FrontUserLoginService.parseRequestBody(requestBody);

        // 永続ロジックを取得する
        const frontUserLoginMasterRepository: FrontUserLoginRepositoryInterface =
            this.FrontUserLoginService.getFrontUserLoginMasterRepository();

        // ログインユーザーを取得
        const frontUserList = await this.FrontUserLoginService.getLoginUser(frontUserLoginMasterRepository, frontUserLoginRequestBody);

        // ユーザーの取得に失敗
        if (frontUserList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `IDかパスワードが間違っています。`);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, `ログイン成功`);
    }
}