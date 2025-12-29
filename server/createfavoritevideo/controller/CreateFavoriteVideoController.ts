import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { ZodIssue } from 'zod';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { CreateFavoriteVideoRequestModel } from '../model/CreateFavoriteVideoRequestModel';
import { CreateFavoriteVideoRequestModelSchema } from '../model/CreateFavoriteVideoRequestModelSchema';
import { CreateFavoriteVideoRequestType } from '../model/CreateFavoriteVideoRequestType';
import { CreateFavoriteVideoService } from '../service/CreateFavoriteVideoService';


export class CreateFavoriteVideoController extends RouteController {

    private readonly createFavoriteVideoService = new CreateFavoriteVideoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画を登録する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;
        // リクエストボディ
        const requestBody: CreateFavoriteVideoRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = CreateFavoriteVideoRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディの型変換
        const createFavoriteVideoRequestModel: CreateFavoriteVideoRequestModel = new CreateFavoriteVideoRequestModel(requestBody);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // お気に入り動画の永続ロジックを取得
            const favoriteVideoRepository = this.createFavoriteVideoService.getFavoriteVideoRepository();
            // 動画の重複チェック
            const isExistFavoriteVideo = await this.createFavoriteVideoService.checkDupulicateFavoriteVideo(createFavoriteVideoRequestModel, frontUserIdModel);

            // 重複している場合は削除動画を復元する
            if (isExistFavoriteVideo) {
                // お気に入り動画コメントの永続ロジックを取得
                const favoriteVideoMemoRepository = this.createFavoriteVideoService.getFavoriteVideoMemoRepository();

                // 削除動画を復元
                await this.createFavoriteVideoService.recoveryVideo(
                    favoriteVideoRepository,
                    createFavoriteVideoRequestModel,
                    frontUserIdModel,
                    tx);

                // 削除コメントを復元
                await this.createFavoriteVideoService.recoveryMemo(
                    favoriteVideoMemoRepository,
                    createFavoriteVideoRequestModel,
                    frontUserIdModel,
                    tx);
            }
            else {
                // お気に入り動画に動画を追加
                await this.createFavoriteVideoService.insert(
                    favoriteVideoRepository,
                    createFavoriteVideoRequestModel,
                    frontUserIdModel,
                    tx);
            }

            return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入り動画に登録しました。`);
        }, next);
    }
}