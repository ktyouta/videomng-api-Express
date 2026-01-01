import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { HTTP_STATUS_OK } from '../../common/const/HttpStatusConst';
import { CommentIdModel } from '../../internaldata/common/properties/CommentIdModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { PrismaTransaction } from '../../util/PrismaTransaction';
import { DeleteFavoriteCommentResponseModel } from '../model/DeleteFavoriteCommentResponseModel';
import { DeleteFavoriteCommentService } from '../service/DeleteFavoriteCommentService';


export class DeleteFavoriteCommentController extends RouteController {

    private readonly deleteFavoriteCommentService = new DeleteFavoriteCommentService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.FAVORITE_COMMENT_ID,
            [authMiddleware]
        );
    }

    /**
     * お気に入りコメントを削除する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;
        const videoId = req.params.videoId;

        if (!videoId) {
            throw Error(`動画IDが指定されていません。`);
        }

        const commentId = req.params.commentId;

        if (!commentId) {
            throw Error(`コメントIDが指定されていません。 endpoint:${ApiEndopoint.BLOCK_COMMENT_ID}`);
        }

        const commentIdModel = new CommentIdModel(commentId);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // 永続ロジックを取得
            const favoriteCommentRepository = this.deleteFavoriteCommentService.getFavoriteCommentRepository();

            // お気に入りコメントを削除
            const favoriteComment = await this.deleteFavoriteCommentService.softDelete(
                favoriteCommentRepository,
                commentIdModel,
                frontUserIdModel,
                tx);

            // レスポンス
            const deleteFavoriteCommentResponseModel = new DeleteFavoriteCommentResponseModel(favoriteComment);

            return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入りコメントを削除しました。`, deleteFavoriteCommentResponseModel.data);
        }, next);
    }
}