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
import { UpdateFavoriteVideoTagRequestType } from '../type/UpdateFavoriteVideoTagRequestType';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { UpdateFavoriteVideoTagService } from '../service/UpdateFavoriteVideoTagService';
import { UpdateFavoriteVideoTagRequestModel } from '../model/UpdateFavoriteVideoTagRequestModel';
import { UpdateFavoriteVideoTagResponseModel } from '../model/UpdateFavoriteVideoTagResponseModel';


export class UpdateFavoriteVideoTagController extends RouteController {

    private readonly updateFavoriteVideoTagService = new UpdateFavoriteVideoTagService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_TAG
        );
    }

    /**
     * お気に入り動画タグを更新する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        const id = req.params.id;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_TAG}`);
        }

        const videoId = new VideoIdModel(id);

        // リクエストボディ
        const requestBody: UpdateFavoriteVideoTagRequestType = req.body;

        // リクエストボディの型変換
        const updateFavoriteVideoTagRequestModel = await UpdateFavoriteVideoTagRequestModel.set(videoId, requestBody);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.updateFavoriteVideoTagService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

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
                updateFavoriteVideoTagRequestModel,
                frontUserIdModel);

            // お気に入り動画が存在しない
            if (!isExistFavoriteVideo) {
                return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画情報が存在しません。`)
            }

            // タグマスタに登録
            const updateTagMasterList = await this.updateFavoriteVideoTagService.addTagMaster();

            // お気に入り動画タグを削除
            await this.updateFavoriteVideoTagService.deleteFavoriteVideoTag(
                favoriteVideoTagRepository,
                updateFavoriteVideoTagRequestModel,
                frontUserIdModel,
                tx
            );

            // お気に入り動画タグを登録
            const favoriteCategoryList = await this.updateFavoriteVideoTagService.insertFavoriteVideoTag(
                favoriteVideoTagRepository,
                updateTagMasterList,
                frontUserIdModel,
                videoId,
                tx
            );

            // レスポンス
            const updateFavoriteVideoTagResponseModel = new UpdateFavoriteVideoTagResponseModel([]);

            return ApiResponse.create(res, HTTP_STATUS_OK, `タグ情報の更新が完了しました。`, updateFavoriteVideoTagResponseModel.data);
        }, next);
    }
}