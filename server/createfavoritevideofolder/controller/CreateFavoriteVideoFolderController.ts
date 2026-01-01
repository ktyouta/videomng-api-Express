import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { ZodIssue } from 'zod';
import { RepositoryType } from '../../common/const/CommonConst';
import { HTTP_STATUS_CONFLICT, HTTP_STATUS_OK } from '../../common/const/HttpStatusConst';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { FolderIdModel } from '../../internaldata/foldermaster/model/FolderIdModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { PrismaTransaction } from '../../util/PrismaTransaction';
import { CreateFavoriteVideoFolderRepositorys } from '../repository/CreateFavoriteVideoFolderRepositorys';
import { PathParamSchema } from '../schema/PathParamSchema';
import { RequestSchema, RequestType } from '../schema/RequestSchema';
import { CreateFavoriteVideoFolderService } from '../service/CreateFavoriteVideoFolderService';


export class CreateFavoriteVideoFolderController extends RouteController {

    private readonly createFavoriteVideoFolderService = new CreateFavoriteVideoFolderService((new CreateFavoriteVideoFolderRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_FOLDER,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画をフォルダに登録する
     * @param req 
     * @param res 
     * @returns 
     */
    async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;
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

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // フォルダのマスタ存在チェック
            const folder = await this.createFavoriteVideoFolderService.getFolder(folderIdModel, frontUserIdModel);

            if (!folder) {
                throw Error(`フォルダが存在しません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER}`);
            }

            // お気に入り動画の存在チェック
            const video = await this.createFavoriteVideoFolderService.getFavoriteVideo(frontUserIdModel, videoIdModel);

            if (!video) {
                throw Error(`お気に入り動画が存在しません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER}`);
            }

            // お気に入り動画のフォルダ存在チェック
            const existFavoriteVideoFolder = await this.createFavoriteVideoFolderService.getFavoriteVideoFolder(
                frontUserIdModel,
                videoIdModel,
                folderIdModel,
            );

            if (existFavoriteVideoFolder) {
                return ApiResponse.create(res, HTTP_STATUS_CONFLICT, `既に登録されています。`);
            }

            // お気に入りフォルダテーブルに登録
            const favoriteVideoFolder = await this.createFavoriteVideoFolderService.createFavoriteVideoFolder(
                frontUserIdModel,
                videoIdModel,
                folderIdModel,
                tx
            );

            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダに登録しました。`, favoriteVideoFolder);
        }, next);
    }
}