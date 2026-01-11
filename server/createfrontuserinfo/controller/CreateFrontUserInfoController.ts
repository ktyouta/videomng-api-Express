import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from 'express';
import { ZodIssue } from "zod";
import { AccessTokenModel } from "../../accesstoken/model/AccessTokenModel";
import { HTTP_STATUS_CREATED, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../common/const/HttpStatusConst";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { userOperationGuardMiddleware } from "../../middleware/userOperationGuardMiddleware";
import { RefreshTokenModel } from "../../refreshtoken/model/RefreshTokenModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { ApiResponse } from "../../util/ApiResponse";
import { PrismaTransaction } from "../../util/PrismaTransaction";
import { FrontUserInfoCreateRequestModel } from "../model/FrontUserInfoCreateRequestModel";
import { FrontUserInfoCreateRequestModelSchema } from "../model/FrontUserInfoCreateRequestModelSchema";
import { FrontUserInfoCreateRequestType } from "../model/FrontUserInfoCreateRequestType";
import { FrontUserInfoCreateResponseModel } from "../model/FrontUserInfoCreateResponseModel";
import { CreateFrontUserInfoService } from "../service/CreateFrontUserInfoService";


export class CreateFrontUserInfoController extends RouteController {

    private readonly createFrontUserInfoService = new CreateFrontUserInfoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FRONT_USER_INFO,
            [userOperationGuardMiddleware],
        );
    }

    /**
     * ユーザー情報を登録する
     * @param req 
     * @param res 
     * @returns 
     */
    public doExecute(req: Request, res: Response, next: NextFunction) {

        // リクエストボディ
        const requestBody: FrontUserInfoCreateRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = FrontUserInfoCreateRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`\r\n`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // リクエストボディの型を変換する
            const frontUserInfoCreateRequestBody: FrontUserInfoCreateRequestModel =
                this.createFrontUserInfoService.parseRequestBody(requestBody);

            // ユーザー重複チェック
            const isExistUser = await this.createFrontUserInfoService.checkUserNameExists(frontUserInfoCreateRequestBody);

            if (isExistUser) {
                return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, `既にユーザーが存在しています。`);
            }

            // ユーザーマスタの永続ロジック用オブジェクトを取得
            const frontUserInfoMasterRepository: FrontUserInfoMasterRepositoryInterface =
                this.createFrontUserInfoService.getFrontUserInfoMasterRepository();

            // ユーザーログインマスタの永続ロジック用オブジェクトを取得
            const frontUserLoginMasterRepository: FrontUserLoginMasterRepositoryInterface =
                this.createFrontUserInfoService.getFrontUserLoginMasterRepository();

            // ユーザーIDを採番する
            const userIdModel: FrontUserIdModel = await FrontUserIdModel.create(tx);

            // ユーザーマスタ登録用データの作成
            const frontUserInfoMasterInsertEntity: FrontUserInfoMasterInsertEntity =
                this.createFrontUserInfoService.createUserInfoMasterCreateBody(userIdModel, frontUserInfoCreateRequestBody);

            // ユーザー情報を追加する
            await frontUserInfoMasterRepository.insert(frontUserInfoMasterInsertEntity, tx);

            // ユーザーマスタログインマスタ登録用データの作成
            const frontUserLoginMasterInsertEntity =
                this.createFrontUserInfoService.createUserLoginMasterCreateBody(userIdModel, frontUserInfoCreateRequestBody);

            // ユーザーログイン情報を追加する
            await frontUserLoginMasterRepository.insert(frontUserLoginMasterInsertEntity, tx);

            // アクセストークンを発行
            const accessTokenModel = AccessTokenModel.create(userIdModel);

            // リフレッシュトークンを発行
            const refreshTokenModel = RefreshTokenModel.create(userIdModel);

            // レスポンスを作成
            const frontUserInfoCreateResponse: FrontUserInfoCreateResponseModel =
                this.createFrontUserInfoService.createResponse(frontUserInfoCreateRequestBody, userIdModel, accessTokenModel);

            // cookieを返却
            res.cookie(RefreshTokenModel.COOKIE_KEY, refreshTokenModel.token, RefreshTokenModel.COOKIE_SET_OPTION);

            return ApiResponse.create(res, HTTP_STATUS_CREATED, `ユーザー情報の登録が完了しました。`, frontUserInfoCreateResponse.data);
        }, next);
    }
}