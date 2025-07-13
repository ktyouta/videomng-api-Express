import { Router, Request, Response, NextFunction } from 'express';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { ZodIssue } from 'zod';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { FavoriteCommentTransaction, Prisma } from '@prisma/client';
import { CreateFavoriteCommentService } from '../service/CreateFavoriteCommentService';
import { CreateFavoriteCommentRequestType } from '../model/CreateFavoriteCommentRequestType';
import { CreateFavoriteCommentRequestModelSchema } from '../model/CreateFavoriteCommentRequestModelSchema';
import { CreateFavoriteCommentRequestModel } from '../model/CreateFavoriteCommentRequestModel';


export class CreateFavoriteCommentController extends RouteController {

    private readonly createFavoriteCommentService = new CreateFavoriteCommentService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FAVORITE_COMMENT
        );
    }

    /**
     * お気に入りコメントを登録する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

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
        const createFavoriteCommentRequestModel: CreateFavoriteCommentRequestModel = new CreateFavoriteCommentRequestModel(requestBody);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.createFavoriteCommentService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

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