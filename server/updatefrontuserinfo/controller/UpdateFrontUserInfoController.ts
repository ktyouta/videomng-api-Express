import { Prisma } from "@prisma/client";
import { NextFunction, Response } from 'express';
import { ZodIssue } from "zod";
import { AccessTokenModel } from "../../accesstoken/model/AccessTokenModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserInfoMasterUpdateEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterUpdateEntity";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { authMiddleware } from "../../middleware/authMiddleware/authMiddleware";
import { RefreshTokenModel } from "../../refreshtoken/model/RefreshTokenModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { IS_ALLOW_USER_OPERATION } from "../../util/const/AllowUserOperationConst";
import { HTTP_STATUS_CREATED, HTTP_STATUS_FORBIDDEN, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { PrismaTransaction } from "../../util/service/PrismaTransaction";
import { FrontUserInfoUpdateRequestModel } from "../model/FrontUserInfoUpdateRequestModel";
import { FrontUserInfoUpdateRequestModelSchema } from "../model/FrontUserInfoUpdateRequestModelSchema";
import { FrontUserInfoUpdateRequestType } from "../model/FrontUserInfoUpdateRequestType";
import { FrontUserInfoUpdateResponseModel } from "../model/FrontUserInfoUpdateResponseModel";
import { UpdateFrontUserInfoService } from "../service/UpdateFrontUserInfoService";


export class UpdateFrontUserInfoController extends RouteController {

    private readonly updateFrontUserInfoService = new UpdateFrontUserInfoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FRONT_USER_INFO_ID,
            [authMiddleware]
        );
    }

    /**
     * ユーザー情報を更新する
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
        const requestBody: FrontUserInfoUpdateRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = FrontUserInfoUpdateRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`\r\n`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        const frontUserIdModel = req.userInfo.frontUserIdModel;

        // パスパラメータのユーザーIDとtokenのユーザーIDを比較
        if (userIdModel.frontUserId !== frontUserIdModel.frontUserId) {
            throw Error(`ユーザーIDが不正です ユーザーID(パスパラメータ):${userIdModel.frontUserId} ユーザーID(token):${frontUserIdModel.frontUserId}`);
        }

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // リクエストボディの型を変換する
            const frontUserInfoUpdateRequestBody: FrontUserInfoUpdateRequestModel =
                this.updateFrontUserInfoService.parseRequestBody(requestBody);

            // ユーザーの存在チェック
            const isExistUser = await this.updateFrontUserInfoService.checkUserNameExists(
                frontUserIdModel,
                frontUserInfoUpdateRequestBody
            );

            if (isExistUser) {
                return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, `既にユーザーが存在しています。`);
            }

            // ユーザーマスタの永続ロジック用オブジェクトを取得
            const frontUserInfoMasterRepository: FrontUserInfoMasterRepositoryInterface =
                this.updateFrontUserInfoService.getFrontUserInfoMasterRepository();

            // ユーザーログインマスタの永続ロジック用オブジェクトを取得
            const frontUserLoginMasterRepository: FrontUserLoginMasterRepositoryInterface =
                this.updateFrontUserInfoService.getFrontUserLoginMasterRepository();

            // ユーザーマスタ更新用データの作成
            const frontUserInfoMasterUpdateEntity: FrontUserInfoMasterUpdateEntity =
                this.updateFrontUserInfoService.updateUserInfoMasterUpdateBody(userIdModel, frontUserInfoUpdateRequestBody);

            // ユーザー情報を更新する
            await frontUserInfoMasterRepository.update(frontUserInfoMasterUpdateEntity, tx);

            // ユーザーマスタログインマスタ更新用データの作成
            const frontUserLoginMasterUpdateEntity =
                this.updateFrontUserInfoService.updateUserLoginMasterUpdateBody(userIdModel, frontUserInfoUpdateRequestBody);

            // ユーザーログイン情報を更新する
            await frontUserLoginMasterRepository.updateUserInfo(frontUserLoginMasterUpdateEntity, tx);

            // アクセストークンを発行
            const accessTokenModel = AccessTokenModel.create(userIdModel);

            // リフレッシュトークンを発行
            const refreshTokenModel = RefreshTokenModel.create(userIdModel);

            // cookieを返却
            res.cookie(RefreshTokenModel.COOKIE_KEY, refreshTokenModel.token, RefreshTokenModel.COOKIE_SET_OPTION);

            // レスポンスを作成
            const frontUserInfoUpdateResponse: FrontUserInfoUpdateResponseModel =
                new FrontUserInfoUpdateResponseModel(frontUserInfoUpdateRequestBody, userIdModel, accessTokenModel);

            return ApiResponse.create(res, HTTP_STATUS_CREATED, `ユーザー情報の更新が完了しました。`, frontUserInfoUpdateResponse.data);
        }, next);
    }
}