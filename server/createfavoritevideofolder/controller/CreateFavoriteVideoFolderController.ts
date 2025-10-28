import { Router, Request, Response, NextFunction } from 'express';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { ZodIssue } from 'zod';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { Prisma } from '@prisma/client';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { RequestSchema, RequestType } from '../schema/RequestSchema';
import { CreateFavoriteVideoFolderService } from '../service/CreateFavoriteVideoFolderService';
import { FolderIdModel } from '../../internaldata/foldermaster/model/FolderIdModel';
import { PathParamSchema } from '../schema/PathParamSchema';


export class CreateFavoriteVideoFolderController extends RouteController {

    private readonly createFavoriteVideoFolderService = new CreateFavoriteVideoFolderService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_FOLDER
        );
    }

    /**
     * お気に入り動画をフォルダに登録する
     * @param req 
     * @param res 
     * @returns 
     */
    async doExecute(req: Request, res: Response, next: NextFunction) {

        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER}`);
        }

        // リクエストボディのバリデーションチェック
        const validateResult = RequestSchema.safeParse(req.body);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            throw Error(`${validatErrMessage} endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER}`);
        }

        // リクエストボディ
        const requestBody: RequestType = validateResult.data;
        const folderIdModel = new FolderIdModel(pathValidateResult.data.folderId);
        const videoIdModel = new VideoIdModel(requestBody.videoId);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.createFavoriteVideoFolderService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // フォルダのマスタ存在チェック

            // お気に入り動画の存在チェック

            // お気に入りフォルダテーブルに登録

            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダに登録しました。`);
        }, next);
    }
}