import { HTTP_STATUS_CREATED, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { Router, Request, Response, NextFunction } from 'express';
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { ZodIssue } from "zod";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { PrismaClientInstance } from "../../util/service/PrismaClientInstance";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { RouteController } from "../../router/controller/RouteController";
import { Prisma } from "@prisma/client";
import { PrismaTransaction } from "../../util/service/PrismaTransaction";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { UpdateFrontUserInfoService } from "../service/UpdateFrontUserInfoService";
import { FrontUserInfoUpdateRequestType } from "../model/FrontUserInfoUpdateRequestType";
import { FrontUserInfoUpdateRequestModelSchema } from "../model/FrontUserInfoUpdateRequestModelSchema";
import { FrontUserInfoUpdateRequestModel } from "../model/FrontUserInfoUpdateRequestModel";
import { FrontUserInfoUpdateResponseModel } from "../model/FrontUserInfoUpdateResponseModel";
import { FrontUserInfoMasterUpdateEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterUpdateEntity";
import { FrontUserLoginMasterUpdateUserInfoEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterUpdateUserInfoEntity";


export class UpdateFrontUserInfoController extends RouteController {

    private readonly updateFrontUserInfoService = new UpdateFrontUserInfoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FRONT_USER_INFO_ID
        );
    }

    /**
     * ユーザー情報を更新する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

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

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.updateFrontUserInfoService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

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
            const isExistUser = await this.updateFrontUserInfoService.checkUserNameExists(frontUserInfoUpdateRequestBody);

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

            // レスポンスを作成
            const frontUserInfoUpdateResponse: FrontUserInfoUpdateResponseModel =
                new FrontUserInfoUpdateResponseModel(frontUserInfoUpdateRequestBody, userIdModel);

            return ApiResponse.create(res, HTTP_STATUS_CREATED, `ユーザー情報の更新が完了しました。`, frontUserInfoUpdateResponse);
        }, next);
    }
}