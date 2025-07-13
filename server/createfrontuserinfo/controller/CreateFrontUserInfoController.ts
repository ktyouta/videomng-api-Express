import { HTTP_STATUS_CREATED, HTTP_STATUS_FORBIDDEN, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { Router, Request, Response, NextFunction } from 'express';
import { CreateFrontUserInfoService } from "../service/CreateFrontUserInfoService";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserInfoCreateRequestType } from "../model/FrontUserInfoCreateRequestType";
import { FrontUserInfoCreateRequestModelSchema } from "../model/FrontUserInfoCreateRequestModelSchema";
import { ZodIssue } from "zod";
import { FrontUserInfoCreateRequestModel } from "../model/FrontUserInfoCreateRequestModel";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { PrismaClientInstance } from "../../util/service/PrismaClientInstance";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { FrontUserInfoCreateResponseModel } from "../model/FrontUserInfoCreateResponseModel";
import { RouteController } from "../../router/controller/RouteController";
import { Prisma } from "@prisma/client";
import { PrismaTransaction } from "../../util/service/PrismaTransaction";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { JsonWebTokenModel } from "../../jsonwebtoken/model/JsonWebTokenModel";
import { IS_ALLOW_USER_OPERATION } from "../../util/const/AllowUserOperationConst";


export class CreateFrontUserInfoController extends RouteController {

    private readonly createFrontUserInfoService = new CreateFrontUserInfoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FRONT_USER_INFO
        );
    }

    /**
     * ユーザー情報を登録する
     * @param req 
     * @param res 
     * @returns 
     */
    public doExecute(req: Request, res: Response, next: NextFunction) {

        if (!IS_ALLOW_USER_OPERATION) {
            return ApiResponse.create(res, HTTP_STATUS_FORBIDDEN, `この機能は現在の環境では無効化されています。`);
        }

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

            // jwtを作成
            const newJsonWebTokenModel =
                await this.createFrontUserInfoService.createJsonWebToken(userIdModel, frontUserInfoCreateRequestBody);

            // レスポンスを作成
            const frontUserInfoCreateResponse: FrontUserInfoCreateResponseModel =
                this.createFrontUserInfoService.createResponse(frontUserInfoCreateRequestBody, userIdModel);

            // cookieを返却
            res.cookie(JsonWebTokenModel.KEY, newJsonWebTokenModel.token, NewJsonWebTokenModel.COOKIE_OPTION);

            return ApiResponse.create(res, HTTP_STATUS_CREATED, `ユーザー情報の登録が完了しました。`, frontUserInfoCreateResponse.data);
        }, next);
    }
}