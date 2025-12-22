import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { authMiddleware } from '../../middleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { UpdateFavoriteVideoCustomRequestModel } from '../model/UpdateFavoriteVideoCustomRequestModel';
import { UpdateFavoriteVideoCustomRequestType } from '../model/UpdateFavoriteVideoCustomRequestType';
import { UpdateFavoriteVideoCustomResponseModel } from '../model/UpdateFavoriteVideoCustomResponseModel';
import { UpdateFavoriteVideoCustomService } from '../service/UpdateFavoriteVideoCustomService';


export class UpdateFavoriteVideoCustomController extends RouteController {

    private readonly updateFavoriteVideoCustomService = new UpdateFavoriteVideoCustomService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_CUSTOM,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画を更新する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.jsonWebTokenUserModel.frontUserIdModel;
        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_CUSTOM}`);
        }

        const videoId = new VideoIdModel(id);

        // リクエストボディ
        const requestBody: UpdateFavoriteVideoCustomRequestType = req.body;

        // リクエストボディの型変換
        const updateFavoriteVideoRequestModel = await UpdateFavoriteVideoCustomRequestModel.set(videoId, requestBody);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // お気に入り動画更新の永続ロジックを取得
            const getUpdateFavoriteVideoRepository = this.updateFavoriteVideoCustomService.getUpdateFavoriteVideoRepository();
            // お気に入り動画カテゴリの永続ロジックを取得
            const favoriteVideoCategoryRepository = this.updateFavoriteVideoCustomService.getFavoriteVideoCategoryRepository();
            // お気に入り動画の永続ロジックを取得
            const favoriteVideoRepository = this.updateFavoriteVideoCustomService.getFavoriteVideoRepository();

            // 動画の存在チェック
            const isExistFavoriteVideo = await this.updateFavoriteVideoCustomService.checkExistFavoriteVideo(
                getUpdateFavoriteVideoRepository,
                updateFavoriteVideoRequestModel,
                frontUserIdModel);

            // お気に入り動画が存在しない
            if (!isExistFavoriteVideo) {
                return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画情報が存在しません。`)
            }

            // カテゴリを削除
            await this.updateFavoriteVideoCustomService.deleteCategory(
                favoriteVideoCategoryRepository,
                updateFavoriteVideoRequestModel,
                frontUserIdModel,
                tx
            );

            // カテゴリを登録
            const favoriteCategoryList = await this.updateFavoriteVideoCustomService.insertCategory(
                favoriteVideoCategoryRepository,
                updateFavoriteVideoRequestModel,
                frontUserIdModel,
                tx
            );

            // お気に入り動画情報を更新
            const favoriteVideo = await this.updateFavoriteVideoCustomService.updateFavoriteVideo(
                favoriteVideoRepository,
                updateFavoriteVideoRequestModel,
                frontUserIdModel,
                tx
            );

            // レスポンス
            const updateFavoriteVideoResponseModel = new UpdateFavoriteVideoCustomResponseModel(
                favoriteVideo,
                favoriteCategoryList,
            );

            return ApiResponse.create(res, HTTP_STATUS_OK, `動画情報の更新が完了しました。`, updateFavoriteVideoResponseModel.data);
        }, next);
    }
}