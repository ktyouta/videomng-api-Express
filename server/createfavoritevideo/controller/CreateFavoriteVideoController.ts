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
import { CreateFavoriteVideoService } from '../service/CreateFavoriteVideoService';
import { CreateFavoriteVideoRequestType } from '../model/CreateFavoriteVideoRequestType';
import { CreateFavoriteVideoRequestModelSchema } from '../model/CreateFavoriteVideoRequestModelSchema';
import { CreateFavoriteVideoRequestModel } from '../model/CreateFavoriteVideoRequestModel';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { Prisma } from '@prisma/client';


export class CreateFavoriteVideoController extends RouteController {

    private readonly createFavoriteVideoService = new CreateFavoriteVideoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO
        );
    }

    /**
     * お気に入り動画を登録する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

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

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.createFavoriteVideoService.checkJwtVerify(req.cookies.jwt);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // お気に入り動画の永続ロジックを取得
            const favoriteVideoRepository = this.createFavoriteVideoService.getFavoriteVideoRepository();
            // 動画の重複チェック
            const isExistFavoriteVideo = await this.createFavoriteVideoService.checkDupulicateFavoriteVideo(createFavoriteVideoRequestModel, frontUserIdModel);

            // 重複している場合は削除動画を復元する
            if (isExistFavoriteVideo) {
                // お気に入り動画コメントの永続ロジックを取得
                const favoriteVideoCommentRepository = this.createFavoriteVideoService.getFavoriteVideoCommentRepository();

                // 削除動画を復元
                await this.createFavoriteVideoService.recoveryVideo(
                    favoriteVideoRepository,
                    createFavoriteVideoRequestModel,
                    frontUserIdModel,
                    tx);

                // 削除コメントを復元
                await this.createFavoriteVideoService.recoveryComment(
                    favoriteVideoCommentRepository,
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