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
import { CommentIdModel } from '../../internaldata/common/properties/CommentIdModel';
import { DeleteFavoriteCommentService } from '../service/DeleteFavoriteCommentService';
import { DeleteFavoriteCommentResponseModel } from '../model/DeleteFavoriteCommentResponseModel';


export class DeleteFavoriteCommentController extends RouteController {

    private readonly deleteFavoriteCommentService = new DeleteFavoriteCommentService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.FAVORITE_COMMENT_ID
        );
    }

    /**
     * お気に入りコメントを削除する
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
        const jsonWebTokenVerifyModel = await this.deleteFavoriteCommentService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // 永続ロジックを取得
            const favoriteCommentRepository = this.deleteFavoriteCommentService.getFavoriteCommentRepository();

            // お気に入りコメントを削除
            const favoriteComment = await this.deleteFavoriteCommentService.softDelete(
                favoriteCommentRepository,
                commentId,
                frontUserIdModel,
                tx);

            // レスポンス
            const deleteFavoriteCommentResponseModel = new DeleteFavoriteCommentResponseModel(favoriteComment);

            return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入りコメントを削除しました。`, deleteFavoriteCommentResponseModel.data);
        }, next);
    }
}