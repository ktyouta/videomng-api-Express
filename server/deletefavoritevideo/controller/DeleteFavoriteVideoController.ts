import { Router, Request, Response, NextFunction } from 'express';
import ENV from '../../env.json';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { ZodIssue } from 'zod';
import { FrontUserIdModel } from '../../internaldata/frontuserinfomaster/properties/FrontUserIdModel';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { Prisma } from '@prisma/client';
import { DeleteFavoriteVideoService } from '../service/DeleteFavoriteVideoService';
import { VideoIdModel } from '../../internaldata/favoritevideotransaction/properties/VideoIdModel';


export class DeleteFavoriteVideoController extends RouteController {

    private readonly deleteFavoriteVideoService = new DeleteFavoriteVideoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_ID
        );
    }

    /**
     * お気に入り動画を削除する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        const id = req.params.id;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_ID}`);
        }

        const videoId = new VideoIdModel(id);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.deleteFavoriteVideoService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

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

            // コメントを削除
            await this.deleteFavoriteVideoService.deleteMemo(
                favoriteVideoMemoRepository,
                videoId,
                frontUserIdModel,
                tx
            );

            return ApiResponse.create(res, HTTP_STATUS_OK, `動画情報の削除が完了しました。`);
        }, next);
    }
}