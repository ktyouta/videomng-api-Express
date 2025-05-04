import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_UNAUTHORIZED, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { Router, Request, Response, NextFunction } from 'express';
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { ZodIssue } from "zod";
import { PrismaClientInstance } from "../../util/service/PrismaClientInstance";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { RouteController } from "../../router/controller/RouteController";
import { Prisma } from "@prisma/client";
import { PrismaTransaction } from "../../util/service/PrismaTransaction";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { UpdateFrontUserPasswordService } from "../service/UpdateFrontUserPasswordService";
import { UpdateFrontUserPasswordRequestType } from "../model/UpdateFrontUserPasswordRequestType";
import { UpdateFrontUserPasswordRequestModelSchema } from "../model/UpdateFrontUserPasswordRequestModelSchema";
import { UpdateFrontUserPasswordRequestModel } from "../model/UpdateFrontUserPasswordRequestModel";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FrontUserSaltValueModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserSaltValueModel";


export class UpdateFrontUserPasswordController extends RouteController {

    private readonly updateFrontUserPasswordService = new UpdateFrontUserPasswordService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FRONT_USER_PASSWORD_ID
        );
    }

    /**
     * パスワードを更新する
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

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.updateFrontUserPasswordService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

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

            return ApiResponse.create(res, HTTP_STATUS_CREATED, `パスワードの更新が完了しました。`);
        }, next);
    }
}