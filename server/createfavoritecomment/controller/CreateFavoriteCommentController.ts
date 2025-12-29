import { FavoriteCommentTransaction, Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { ZodIssue } from 'zod';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { CreateFavoriteCommentRequestModel } from '../model/CreateFavoriteCommentRequestModel';
import { CreateFavoriteCommentRequestModelSchema } from '../model/CreateFavoriteCommentRequestModelSchema';
import { CreateFavoriteCommentRequestType } from '../model/CreateFavoriteCommentRequestType';
import { CreateFavoriteCommentService } from '../service/CreateFavoriteCommentService';


export class CreateFavoriteCommentController extends RouteController {

    private readonly createFavoriteCommentService = new CreateFavoriteCommentService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FAVORITE_COMMENT,
            [authMiddleware]
        );
    }

    /**
     * お気に入りコメントを登録する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.frontUserIdModel;
        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。`);
        }

        const videoIdModel = new VideoIdModel(id);

        // リクエストボディ
        const requestBody: CreateFavoriteCommentRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = CreateFavoriteCommentRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディの型変換
        const createFavoriteCommentRequestModel: CreateFavoriteCommentRequestModel = new CreateFavoriteCommentRequestModel(
            requestBody,
            videoIdModel
        );

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // お気に入りコメントの永続ロジックを取得
            const favoriteCommentRepository = this.createFavoriteCommentService.getFavoriteCommentRepository();
            // お気に入りコメントの重複チェック
            const isExistFavoriteComment = await this.createFavoriteCommentService.checkDupulicateFavoriteComment(
                createFavoriteCommentRequestModel, frontUserIdModel);

            let favoriteComment: FavoriteCommentTransaction;

            // 重複している場合はお気に入りコメントを復元する
            if (isExistFavoriteComment) {

                // お気に入りコメントを復元
                favoriteComment = await this.createFavoriteCommentService.recovery(
                    favoriteCommentRepository,
                    createFavoriteCommentRequestModel,
                    frontUserIdModel,
                    tx);
            }
            else {
                // お気に入りコメントを追加
                favoriteComment = await this.createFavoriteCommentService.insert(
                    favoriteCommentRepository,
                    createFavoriteCommentRequestModel,
                    frontUserIdModel,
                    tx);
            }

            return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入りリストに登録しました。`, favoriteComment);
        }, next);
    }
}