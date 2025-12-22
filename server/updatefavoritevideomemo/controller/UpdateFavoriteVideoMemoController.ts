import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { ZodIssue } from 'zod';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { VideoMemoSeqModel } from '../../internaldata/favoritevideomemotransaction/properties/VideoMemoSeqModel';
import { authMiddleware } from '../../middleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { UpdateFavoriteVideoMemoRequestModel } from '../model/UpdateFavoriteVideoMemoRequestModel';
import { UpdateFavoriteVideoMemoRequestModelSchema } from '../model/UpdateFavoriteVideoMemoRequestModelSchema';
import { UpdateFavoriteVideoMemoResponseModel } from '../model/UpdateFavoriteVideoMemoResponseModel';
import { UpdateFavoriteVideoMemoService } from '../service/UpdateFavoriteVideoMemoService';
import { UpdateFavoriteVideoMemoRequestType } from '../Type/UpdateFavoriteVideoMemoRequestType';


export class UpdateFavoriteVideoMemoController extends RouteController {

    private readonly updateFavoriteVideoMemoService = new UpdateFavoriteVideoMemoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_MEMO_ID,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画メモを更新する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.jsonWebTokenUserModel.frontUserIdModel;
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

        // リクエストボディ
        const requestBody: UpdateFavoriteVideoMemoRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = UpdateFavoriteVideoMemoRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディの型変換
        const updateFavoriteVideoMemoRequestModel = new UpdateFavoriteVideoMemoRequestModel(
            requestBody,
            videoIdModel,
            videoMemoSeqModel
        );

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // 永続ロジックを取得
            const updateFavoriteVideoMemoRepository = this.updateFavoriteVideoMemoService.getUpdateFavoriteVideoMemoRepository();
            const favoriteVideoMemoRepository = this.updateFavoriteVideoMemoService.getFavoriteVideoMemoRepository();

            // 動画の存在チェック
            const isExistFavoriteVideoMemo = await this.updateFavoriteVideoMemoService.checkExistFavoriteVideoMemo(
                updateFavoriteVideoMemoRepository,
                updateFavoriteVideoMemoRequestModel,
                frontUserIdModel);

            // お気に入り動画が存在しない
            if (!isExistFavoriteVideoMemo) {
                return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画情報が存在しません。`)
            }

            // お気に入り動画メモを更新
            const favoriteVideoMemo = await this.updateFavoriteVideoMemoService.update(
                updateFavoriteVideoMemoRepository,
                favoriteVideoMemoRepository,
                updateFavoriteVideoMemoRequestModel,
                frontUserIdModel,
                tx);

            // レスポンス
            const updateFavoriteVideoMemoResponseModel = new UpdateFavoriteVideoMemoResponseModel(favoriteVideoMemo);

            return ApiResponse.create(res, HTTP_STATUS_OK, `動画メモを更新しました。`, updateFavoriteVideoMemoResponseModel.data);
        }, next);
    }
}