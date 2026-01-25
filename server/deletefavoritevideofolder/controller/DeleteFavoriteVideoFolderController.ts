import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { RepositoryType } from '../../common/const/CommonConst';
import { HTTP_STATUS_OK } from '../../common/const/HttpStatusConst';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { FolderIdModel } from '../../internaldata/foldermaster/model/FolderIdModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { PrismaTransaction } from '../../util/PrismaTransaction';
import { DeleteFavoriteVideoFolderRepositorys } from '../repository/DeleteavoriteVideoFolderRepositorys';
import { PathParamSchema } from '../schema/PathParamSchema';
import { DeleteFavoriteVideoFolderService } from '../service/DeleteFavoriteVideoFolderService';


export class DeleteFavoriteVideoFolderController extends RouteController {

    private readonly deleteFavoriteVideoFolderService = new DeleteFavoriteVideoFolderService((new DeleteFavoriteVideoFolderRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_FOLDER_ID,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画をフォルダから削除する
     * @param req 
     * @param res 
     * @returns 
     */
    async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;
        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER_ID}`);
        }

        const folderIdModel = new FolderIdModel(pathValidateResult.data.folderId);
        const videoIdModel = new VideoIdModel(pathValidateResult.data.videoId);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // お気に入りフォルダテーブルから削除
            const result = await this.deleteFavoriteVideoFolderService.delete(
                frontUserIdModel,
                videoIdModel,
                folderIdModel,
                tx
            );

            if (!result) {
                throw Error(`お気に入り動画のフォルダ削除処理に失敗しました。（ユーザーID=${frontUserIdModel.frontUserId}, フォルダID=${folderIdModel.id}, 動画ID=${videoIdModel.videoId}）`);
            }

            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダから削除しました。`);
        }, next);
    }
}