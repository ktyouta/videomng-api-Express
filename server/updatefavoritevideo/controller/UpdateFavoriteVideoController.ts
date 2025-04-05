import { Router, Request, Response, NextFunction } from 'express';
import ENV from '../../env.json';
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
import { UpdateFavoriteVideoService } from '../service/UpdateFavoriteVideoService';
import { UpdateFavoriteVideoRequestType } from '../model/UpdateFavoriteVideoRequestType';
import { UpdateFavoriteVideoRequestModelSchema } from '../model/UpdateFavoriteVideoRequestModelSchema';
import { UpdateFavoriteVideoRequestModel } from '../model/UpdateFavoriteVideoRequestModel';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { UpdateFavoriteVideoResponseModel } from '../model/UpdateFavoriteVideoResponseModel';


export class UpdateFavoriteVideoController extends RouteController {

    private readonly updateFavoriteVideoService = new UpdateFavoriteVideoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_ID
        );
    }

    /**
     * お気に入り動画を更新する
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

        // リクエストボディ
        const requestBody: UpdateFavoriteVideoRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = UpdateFavoriteVideoRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディの型変換
        const updateFavoriteVideoRequestModel = await UpdateFavoriteVideoRequestModel.set(videoId, requestBody);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.updateFavoriteVideoService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // お気に入り動画更新の永続ロジックを取得
            const getUpdateFavoriteVideoRepository = this.updateFavoriteVideoService.getUpdateFavoriteVideoRepository();
            // お気に入り動画カテゴリの永続ロジックを取得
            const favoriteVideoCategoryRepository = this.updateFavoriteVideoService.getFavoriteVideoCategoryRepository();
            // お気に入り動画の永続ロジックを取得
            const favoriteVideoRepository = this.updateFavoriteVideoService.getFavoriteVideoRepository();

            // 動画の存在チェック
            const isExistFavoriteVideoMemo = await this.updateFavoriteVideoService.checkExistFavoriteVideo(
                getUpdateFavoriteVideoRepository,
                updateFavoriteVideoRequestModel,
                frontUserIdModel);

            // お気に入り動画が存在しない
            if (!isExistFavoriteVideoMemo) {
                return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画情報が存在しません。`)
            }

            // カテゴリを削除
            await this.updateFavoriteVideoService.deleteCategory(
                favoriteVideoCategoryRepository,
                updateFavoriteVideoRequestModel,
                frontUserIdModel,
                tx
            );

            // カテゴリを登録
            const favoriteCategoryList = await this.updateFavoriteVideoService.insertCategory(
                favoriteVideoCategoryRepository,
                updateFavoriteVideoRequestModel,
                frontUserIdModel,
                tx
            );

            // お気に入り動画情報を更新
            const favoriteVideo = await this.updateFavoriteVideoService.updateFavoriteVideo(
                favoriteVideoRepository,
                updateFavoriteVideoRequestModel,
                frontUserIdModel,
                tx
            );

            // レスポンス
            const updateFavoriteVideoResponseModel = new UpdateFavoriteVideoResponseModel(
                favoriteVideo,
                favoriteCategoryList,
            );

            return ApiResponse.create(res, HTTP_STATUS_OK, `動画情報の更新が完了しました。`, updateFavoriteVideoResponseModel.data);
        }, next);
    }
}