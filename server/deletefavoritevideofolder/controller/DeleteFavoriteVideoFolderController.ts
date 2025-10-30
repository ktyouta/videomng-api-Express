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
import { FolderIdModel } from '../../internaldata/foldermaster/model/FolderIdModel';
import { PathParamSchema } from '../schema/PathParamSchema';
import { RepositoryType } from '../../util/const/CommonConst';
import { DeleteFavoriteVideoFolderService } from '../service/DeleteFavoriteVideoFolderService';
import { DeleteFavoriteVideoFolderRepositorys } from '../repository/DeleteavoriteVideoFolderRepositorys';


export class DeleteFavoriteVideoFolderController extends RouteController {

    private readonly deleteFavoriteVideoFolderService = new DeleteFavoriteVideoFolderService((new DeleteFavoriteVideoFolderRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_FOLDER_ID
        );
    }

    /**
     * お気に入り動画をフォルダから削除する
     * @param req 
     * @param res 
     * @returns 
     */
    async doExecute(req: Request, res: Response, next: NextFunction) {

        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER_ID}`);
        }

        const folderIdModel = new FolderIdModel(pathValidateResult.data.folderId);
        const videoIdModel = new VideoIdModel(pathValidateResult.data.videoId);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.deleteFavoriteVideoFolderService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // お気に入りフォルダテーブルから削除
            const result = await this.deleteFavoriteVideoFolderService.delete(
                frontUserIdModel,
                videoIdModel,
                folderIdModel,
                tx
            );

            if (result && result.count > 1) {
                throw Error(`お気に入り動画のフォルダ削除処理で想定外の削除件数が発生しました。（ユーザーID=${frontUserIdModel.frontUserId}, フォルダID=${folderIdModel.id}, 動画ID=${videoIdModel.videoId}, 件数=${result.count}）`);
            }

            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `フォルダから削除しました。`);
        }, next);
    }
}