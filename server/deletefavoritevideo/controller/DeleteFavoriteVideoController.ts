import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { authMiddleware } from '../../middleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { RepositoryType } from '../../util/const/CommonConst';
import { HTTP_STATUS_OK } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { DeleteFavoriteVideoRepositorys } from '../repository/DeleteFavoriteVideoRepositorys';
import { DeleteFavoriteVideoService } from '../service/DeleteFavoriteVideoService';


export class DeleteFavoriteVideoController extends RouteController {

    private readonly deleteFavoriteVideoService = new DeleteFavoriteVideoService((new DeleteFavoriteVideoRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_ID,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画を削除する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.jsonWebTokenUserModel.frontUserIdModel;
        const id = req.params.id;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_ID}`);
        }

        const videoId = new VideoIdModel(id);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // お気に入り動画の永続ロジックを取得
            const favoriteVideoRepository = this.deleteFavoriteVideoService.getFavoriteVideoRepository();
            // お気に入り動画コメントの永続ロジックを取得
            const favoriteVideoMemoRepository = this.deleteFavoriteVideoService.getFavoriteVideoMemoRepository();

            // お気に入り動画を削除
            await this.deleteFavoriteVideoService.deleteVideo(
                favoriteVideoRepository,
                videoId,
                frontUserIdModel,
                tx
            );

            // メモを削除
            await this.deleteFavoriteVideoService.deleteMemo(
                favoriteVideoMemoRepository,
                videoId,
                frontUserIdModel,
                tx
            );

            // お気に入り動画フォルダを削除
            await this.deleteFavoriteVideoService.deleteFavoriteVideoFolder(
                videoId,
                frontUserIdModel,
                tx
            );

            return ApiResponse.create(res, HTTP_STATUS_OK, `動画情報の削除が完了しました。`);
        }, next);
    }
}