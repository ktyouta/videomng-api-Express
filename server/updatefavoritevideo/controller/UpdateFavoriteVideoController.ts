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
import { UpdateFavoriteVideoService } from '../service/UpdateFavoriteVideoService';
import { UpdateFavoriteVideoRequestType } from '../model/UpdateFavoriteVideoRequestType';
import { UpdateFavoriteVideoRequestModelSchema } from '../model/UpdateFavoriteVideoRequestModelSchema';
import { UpdateFavoriteVideoRequestModel } from '../model/UpdateFavoriteVideoRequestModel';
import { VideoIdModel } from '../../internaldata/favoritevideotransaction/properties/VideoIdModel';


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
        const updateFavoriteVideoRequestModel: UpdateFavoriteVideoRequestModel =
            new UpdateFavoriteVideoRequestModel(videoId, requestBody);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.updateFavoriteVideoService.checkJwtVerify(req.cookies.jwt);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // お気に入り動画コメントの永続ロジックを取得
            const favoriteVideoCommentRepository = this.updateFavoriteVideoService.getFavoriteVideoCommentRepository();

            // コメントを削除
            this.updateFavoriteVideoService.deleteComment(
                favoriteVideoCommentRepository,
                updateFavoriteVideoRequestModel,
                frontUserIdModel,
                tx
            );

            // コメントを登録
            this.updateFavoriteVideoService.insertComment(
                favoriteVideoCommentRepository,
                updateFavoriteVideoRequestModel,
                frontUserIdModel,
                tx
            );

            return ApiResponse.create(res, HTTP_STATUS_OK, `動画情報の更新が完了しました。`);
        }, next);
    }
}