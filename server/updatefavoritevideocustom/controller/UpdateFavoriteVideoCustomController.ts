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
import { UpdateFavoriteVideoCustomService } from '../service/UpdateFavoriteVideoCustomService';
import { UpdateFavoriteVideoCustomRequestType } from '../model/UpdateFavoriteVideoCustomRequestType';
import { UpdateFavoriteVideoCustomRequestModel } from '../model/UpdateFavoriteVideoCustomRequestModel';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { UpdateFavoriteVideoCustomResponseModel } from '../model/UpdateFavoriteVideoCustomResponseModel';


export class UpdateFavoriteVideoCustomController extends RouteController {

    private readonly updateFavoriteVideoCustomService = new UpdateFavoriteVideoCustomService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_CUSTOM
        );
    }

    /**
     * お気に入り動画を更新する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_CUSTOM}`);
        }

        const videoId = new VideoIdModel(id);

        // リクエストボディ
        const requestBody: UpdateFavoriteVideoCustomRequestType = req.body;

        // リクエストボディの型変換
        const updateFavoriteVideoRequestModel = await UpdateFavoriteVideoCustomRequestModel.set(videoId, requestBody);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.updateFavoriteVideoCustomService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

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