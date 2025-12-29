import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { UpdateFavoriteVideoTagRequestModel } from '../model/UpdateFavoriteVideoTagRequestModel';
import { UpdateFavoriteVideoTagResponseModel } from '../model/UpdateFavoriteVideoTagResponseModel';
import { UpdateFavoriteVideoTagService } from '../service/UpdateFavoriteVideoTagService';
import { UpdateFavoriteVideoTagRequestType } from '../type/UpdateFavoriteVideoTagRequestType';


export class UpdateFavoriteVideoTagController extends RouteController {

    private readonly updateFavoriteVideoTagService = new UpdateFavoriteVideoTagService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_TAG_ID,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画タグを更新する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.frontUserIdModel;
        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_TAG_ID}`);
        }

        const videoId = new VideoIdModel(id);

        // リクエストボディ
        const requestBody: UpdateFavoriteVideoTagRequestType = req.body;

        // リクエストボディの型変換
        const updateFavoriteVideoTagRequestModel = new UpdateFavoriteVideoTagRequestModel(videoId, requestBody, frontUserIdModel);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // お気に入り動画更新の永続ロジックを取得
            const getUpdateFavoriteVideoTagRepository = this.updateFavoriteVideoTagService.getUpdateFavoriteVideoTagRepository();
            // タグマスタの永続ロジックを取得
            const tagMasterRepository = this.updateFavoriteVideoTagService.getTagMasterRepository();
            // お気に入り動画タグの永続ロジックを取得
            const favoriteVideoTagRepository = this.updateFavoriteVideoTagService.getFavoriteVideoTagRepository();

            // 動画の存在チェック
            const isExistFavoriteVideo = await this.updateFavoriteVideoTagService.checkExistFavoriteVideoTag(
                getUpdateFavoriteVideoTagRepository,
                updateFavoriteVideoTagRequestModel,);

            // お気に入り動画が存在しない
            if (!isExistFavoriteVideo) {
                return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画情報が存在しません。`)
            }

            // タグマスタに登録
            const updateTagMasterList = await this.updateFavoriteVideoTagService.addTagMaster(
                tagMasterRepository,
                getUpdateFavoriteVideoTagRepository,
                updateFavoriteVideoTagRequestModel,
                tx
            );

            // お気に入り動画タグを削除
            await this.updateFavoriteVideoTagService.deleteFavoriteVideoTag(
                favoriteVideoTagRepository,
                updateFavoriteVideoTagRequestModel,
                tx
            );

            // お気に入り動画タグを登録
            const favoriteCategoryList = await this.updateFavoriteVideoTagService.insertFavoriteVideoTag(
                favoriteVideoTagRepository,
                updateTagMasterList,
                updateFavoriteVideoTagRequestModel,
                tx
            );

            // 未使用のタグをマスタから削除
            await this.updateFavoriteVideoTagService.deleteTagMaster(
                getUpdateFavoriteVideoTagRepository,
                frontUserIdModel,
                tx
            );

            // レスポンス
            const updateFavoriteVideoTagResponseModel = new UpdateFavoriteVideoTagResponseModel(favoriteCategoryList);

            return ApiResponse.create(res, HTTP_STATUS_OK, `タグ情報の更新が完了しました。`, updateFavoriteVideoTagResponseModel.data);
        }, next);
    }
}