import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK } from '../../common/const/HttpStatusConst';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { VideoMemoSeqModel } from '../../internaldata/favoritevideomemotransaction/properties/VideoMemoSeqModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { PrismaTransaction } from '../../util/PrismaTransaction';
import { DeleteFavoriteVideoMemoRequestModel } from '../model/DeleteFavoriteVideoMemoRequestModel';
import { DeleteFavoriteVideoMemoResponseModel } from '../model/DeleteFavoriteVideoMemoResponseModel';
import { DeleteFavoriteVideoMemoService } from '../service/DeleteFavoriteVideoMemoService';


export class DeleteFavoriteVideoMemoController extends RouteController {

    private readonly deleteFavoriteVideoMemoService = new DeleteFavoriteVideoMemoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_MEMO_ID,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画メモを削除する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;
        const videoId = req.params.videoId;

        if (!videoId) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_ID} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(videoId);

        const memoId = req.params.memoId;

        if (!memoId) {
            throw Error(`メモIDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_ID} | method:${HttpMethodType.GET}`);
        }

        const videoMemoSeqModel = new VideoMemoSeqModel(parseInt(memoId));

        // リクエストボディの型変換
        const deleteFavoriteVideoMemoRequestModel = new DeleteFavoriteVideoMemoRequestModel(videoIdModel, videoMemoSeqModel);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // 永続ロジックを取得
            const deleteFavoriteVideoMemoRepository = this.deleteFavoriteVideoMemoService.getDeleteFavoriteVideoMemoRepository();
            const favoriteVideoMemoRepository = this.deleteFavoriteVideoMemoService.getFavoriteVideoMemoRepository();

            // 動画の存在チェック
            const isExistFavoriteVideoMemo = await this.deleteFavoriteVideoMemoService.checkExistFavoriteVideoMemo(
                deleteFavoriteVideoMemoRepository,
                deleteFavoriteVideoMemoRequestModel,
                frontUserIdModel);

            // お気に入り動画が存在しない
            if (!isExistFavoriteVideoMemo) {
                return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画情報が存在しません。`)
            }

            // お気に入り動画メモを削除
            const favoriteVideoMemo = await this.deleteFavoriteVideoMemoService.softDelete(
                favoriteVideoMemoRepository,
                deleteFavoriteVideoMemoRequestModel,
                frontUserIdModel,
                tx);

            // レスポンス
            const deleteFavoriteVideoMemoResponseModel = new DeleteFavoriteVideoMemoResponseModel(favoriteVideoMemo);

            return ApiResponse.create(res, HTTP_STATUS_OK, `動画メモを削除しました。`, deleteFavoriteVideoMemoResponseModel.data);
        }, next);
    }
}