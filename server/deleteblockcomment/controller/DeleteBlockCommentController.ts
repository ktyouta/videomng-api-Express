import { Router, Request, Response, NextFunction } from 'express';
import ENV from '../../env.json';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { ZodIssue } from 'zod';
import { FrontUserIdModel } from '../../internaldata/frontuserinfomaster/properties/FrontUserIdModel';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { Prisma } from '@prisma/client';
import { DeleteBlockCommentService } from '../service/DeleteBlockCommentService';
import { DeleteBlockCommentResponseModel } from '../model/DeleteBlockCommentResponseModel';
import { CommentIdModel } from '../../internaldata/common/properties/CommentIdModel';


export class DeleteBlockCommentController extends RouteController {

    private readonly deleteBlockCommentService = new DeleteBlockCommentService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.BLOCK_COMMENT_ID
        );
    }

    /**
     * ブロックコメントを削除する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        const id = req.params.id;

        if (!id) {
            throw Error(`コメントIDが指定されていません。 endpoint:${ApiEndopoint.BLOCK_COMMENT_ID}`);
        }

        const commentId = new CommentIdModel(id);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.deleteBlockCommentService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // 永続ロジックを取得
            const blockCommentRepository = this.deleteBlockCommentService.getBlockCommentRepository();

            // ブロックコメントを削除
            const blockComment = await this.deleteBlockCommentService.softDelete(
                blockCommentRepository,
                commentId,
                frontUserIdModel,
                tx);

            // レスポンス
            const deleteBlockCommentResponseModel = new DeleteBlockCommentResponseModel(blockComment);

            return ApiResponse.create(res, HTTP_STATUS_OK, `ブロックコメントを削除しました。`, deleteBlockCommentResponseModel.data);
        }, next);
    }
}