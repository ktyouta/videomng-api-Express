import { Prisma } from "@prisma/client";
import { NextFunction, Response } from 'express';
import { ZodIssue } from "zod";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FrontUserSaltValueModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserSaltValueModel";
import { authMiddleware } from "../../middleware/authMiddleware/authMiddleware";
import { PepperModel } from "../../pepper/model/PepperModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { IS_ALLOW_USER_OPERATION } from "../../util/const/AllowUserOperationConst";
import { RepositoryType } from "../../util/const/CommonConst";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_FORBIDDEN, HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { PrismaTransaction } from "../../util/service/PrismaTransaction";
import { UpdateFrontUserPasswordRequestModelSchema } from "../model/UpdateFrontUserPasswordRequestModelSchema";
import { UpdateFrontUserPasswordRequestType } from "../model/UpdateFrontUserPasswordRequestType";
import { UpdateFrontUserPasswordRepositorys } from "../repository/UpdateFrontUserPasswordRepositorys";
import { RequestPathParamSchema } from "../schema/RequestPathParamSchema";
import { UpdateFrontUserPasswordService } from "../service/UpdateFrontUserPasswordService";


export class UpdateFrontUserPasswordController extends RouteController {

    private updateFrontUserPasswordService = new UpdateFrontUserPasswordService((new UpdateFrontUserPasswordRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FRONT_USER_PASSWORD_ID,
            [authMiddleware]
        );
    }

    /**
     * パスワードを更新する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        if (!IS_ALLOW_USER_OPERATION) {
            return ApiResponse.create(res, HTTP_STATUS_FORBIDDEN, `この機能は現在の環境では無効化されています。`);
        }

        // パスパラメータのバリデーションチェック
        const pathValidateResult = RequestPathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER}`);
        }

        // パスパラメータ
        const param = pathValidateResult.data;
        const userIdModel = FrontUserIdModel.reConstruct(parseInt(param.id));

        // リクエストボディ
        const requestBody: UpdateFrontUserPasswordRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = UpdateFrontUserPasswordRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`\r\n`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // 確認用パスワードの同値チェック
        if (requestBody.newPassword !== requestBody.confirmPassword) {
            return ApiResponse.create(res, HTTP_STATUS_BAD_REQUEST, `確認用パスワードが一致しません。`);
        }

        const frontUserIdModel = req.userInfo.frontUserIdModel;

        // パスパラメータのユーザーIDとtokenのユーザーIDを比較
        if (userIdModel.frontUserId !== frontUserIdModel.frontUserId) {
            throw Error(`ユーザーIDが不正です ユーザーID(パスパラメータ):${userIdModel.frontUserId} ユーザーID(token):${frontUserIdModel.frontUserId}`);
        }

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // ユーザーの存在チェック
            const userInfoList = await this.updateFrontUserPasswordService.getUserInfo(userIdModel);

            if (!userInfoList || userInfoList.length === 0) {
                throw Error(`ユーザー情報が存在しません。 ユーザーID(token):${frontUserIdModel.frontUserId}`);
            }

            const userInfo = userInfoList[0];
            const salt = userInfo.salt;

            if (!salt) {
                throw Error(`ソルト値を取得できませんでした。ユーザーID:${userInfo.userId}`);
            }

            // テーブルから取得したソルト値をもとに入力されたパスワードをハッシュ化する
            const saltModel = FrontUserSaltValueModel.reConstruct(salt);
            // pepper
            const pepperModel = new PepperModel();

            // ハッシュパスワード(salt + pepper)
            const secureInputPasswordModel = FrontUserPasswordModel.secureHash(requestBody.currentPassword, saltModel, pepperModel);

            // salt + pepper認証に失敗
            if (secureInputPasswordModel.frontUserPassword !== userInfo.password) {

                // ハッシュパスワード(salt)
                const currentPasswordModel = FrontUserPasswordModel.hash(requestBody.currentPassword, saltModel);

                if (currentPasswordModel.frontUserPassword !== userInfo.password) {
                    return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `現在のパスワードが正しくありません。`);
                }
            }

            // パスワードを更新する
            await this.updateFrontUserPasswordService.update(
                requestBody,
                userIdModel,
                pepperModel,
                tx
            );

            return ApiResponse.create(res, HTTP_STATUS_CREATED, `パスワードの更新が完了しました。`);
        }, next);
    }
}