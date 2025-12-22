import { Prisma } from "@prisma/client";
import { NextFunction, Response } from 'express';
import { ZodIssue } from "zod";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FrontUserSaltValueModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserSaltValueModel";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { JsonWebTokenModel } from "../../jsonwebtoken/model/JsonWebTokenModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { authMiddleware } from "../../middleware/authMiddleware";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { IS_ALLOW_USER_OPERATION } from "../../util/const/AllowUserOperationConst";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_FORBIDDEN, HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { PrismaTransaction } from "../../util/service/PrismaTransaction";
import { UpdateFrontUserPasswordRequestModel } from "../model/UpdateFrontUserPasswordRequestModel";
import { UpdateFrontUserPasswordRequestModelSchema } from "../model/UpdateFrontUserPasswordRequestModelSchema";
import { UpdateFrontUserPasswordRequestType } from "../model/UpdateFrontUserPasswordRequestType";
import { UpdateFrontUserPasswordService } from "../service/UpdateFrontUserPasswordService";


export class UpdateFrontUserPasswordController extends RouteController {

    private readonly updateFrontUserPasswordService = new UpdateFrontUserPasswordService();

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

        const id = req.params.id;

        if (!id) {
            throw Error(`ユーザーIDが指定されていません。 endpoint:${ApiEndopoint.FRONT_USER_INFO_ID}`);
        }

        const userIdModel = FrontUserIdModel.reConstruct(parseInt(id));

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

        const frontUserIdModel = req.jsonWebTokenUserModel.frontUserIdModel;

        // パスパラメータのユーザーIDとtokenのユーザーIDを比較
        if (userIdModel.frontUserId !== frontUserIdModel.frontUserId) {
            throw Error(`ユーザーIDが不正です ユーザーID(パスパラメータ):${userIdModel.frontUserId} ユーザーID(token):${frontUserIdModel.frontUserId}`);
        }

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // リクエストボディの型を変換する
            const updateFrontUserPasswordRequestBody: UpdateFrontUserPasswordRequestModel =
                this.updateFrontUserPasswordService.parseRequestBody(requestBody);

            // ユーザーの存在チェック
            const userInfoList = await this.updateFrontUserPasswordService.getUserInfo(userIdModel);

            if (!userInfoList || userInfoList.length === 0) {
                return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `現在のパスワードが正しくありません。`);
            }

            const userInfo = userInfoList[0];
            const salt = userInfo.salt;

            if (!salt) {
                throw Error(`ソルト値を取得できませんでした。ユーザーID:${userInfo.userId}`);
            }

            // テーブルから取得したソルト値をもとに入力されたパスワードをハッシュ化する
            const saltModel = FrontUserSaltValueModel.reConstruct(salt);
            const currentPasswordModel = FrontUserPasswordModel.hash(requestBody.currentPassword, saltModel);

            // 入力パスワードとテーブルのパスワードを比較
            if (currentPasswordModel.frontUserPassword !== userInfo.password) {
                return ApiResponse.create(res, HTTP_STATUS_UNAUTHORIZED, `現在のパスワードが正しくありません。`);
            }

            // ユーザーログインマスタの永続ロジック用オブジェクトを取得
            const frontUserLoginMasterRepository: FrontUserLoginMasterRepositoryInterface =
                this.updateFrontUserPasswordService.getFrontUserLoginMasterRepository();

            // ユーザーマスタログインマスタ更新用データの作成
            const frontUserLoginMasterUpdateEntity =
                this.updateFrontUserPasswordService.updateUserLoginMasterUpdateBody(userIdModel, updateFrontUserPasswordRequestBody);

            // パスワードを更新する
            await frontUserLoginMasterRepository.update(frontUserLoginMasterUpdateEntity, tx);

            // jwtを作成
            const newJsonWebTokenModel =
                await this.updateFrontUserPasswordService.createJsonWebToken(userIdModel);

            // cookieを返却
            res.cookie(JsonWebTokenModel.KEY, newJsonWebTokenModel.token, NewJsonWebTokenModel.COOKIE_OPTION);

            return ApiResponse.create(res, HTTP_STATUS_CREATED, `パスワードの更新が完了しました。`);
        }, next);
    }
}