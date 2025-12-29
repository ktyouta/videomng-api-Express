import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { CommentIdModel } from '../../internaldata/common/properties/CommentIdModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { HTTP_STATUS_OK } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { DeleteBlockCommentResponseModel } from '../model/DeleteBlockCommentResponseModel';
import { DeleteBlockCommentService } from '../service/DeleteBlockCommentService';


export class DeleteBlockCommentController extends RouteController {

    private readonly deleteBlockCommentService = new DeleteBlockCommentService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.BLOCK_COMMENT_ID,
            [authMiddleware]
        );
    }

    /**
     * ブロックコメントを削除する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.frontUserIdModel;
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
            const blockCommentRepository = this.deleteBlockCommentService.getBlockCommentRepository();

            // ブロックコメントを削除
            const blockComment = await this.deleteBlockCommentService.softDelete(
                blockCommentRepository,
                commentIdModel,
                frontUserIdModel,
                tx);

            // レスポンス
            const deleteBlockCommentResponseModel = new DeleteBlockCommentResponseModel(blockComment);

            return ApiResponse.create(res, HTTP_STATUS_OK, `ブロックコメントを削除しました。`, deleteBlockCommentResponseModel.data);
        }, next);
    }
}