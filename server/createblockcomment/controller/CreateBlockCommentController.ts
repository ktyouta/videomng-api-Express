import { BlockCommentTransaction, Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { ZodIssue } from 'zod';
import { HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../common/const/HttpStatusConst';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { PrismaTransaction } from '../../util/PrismaTransaction';
import { CreateBlockCommentRequestModel } from '../model/CreateBlockCommentRequestModel';
import { CreateBlockCommentRequestModelSchema } from '../model/CreateBlockCommentRequestModelSchema';
import { CreateBlockCommentRequestType } from '../model/CreateBlockCommentRequestType';
import { CreateBlockCommentService } from '../service/CreateBlockCommentService';


export class CreateBlockCommentController extends RouteController {

    private readonly createBlockCommentService = new CreateBlockCommentService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.BLOCK_COMMENT,
            [authMiddleware]
        );
    }

    /**
     * ブロックコメントを登録する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel: FrontUserIdModel = req.userInfo.frontUserIdModel;
        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。`);
        }

        const videoIdModel = new VideoIdModel(id);

        // リクエストボディ
        const requestBody: CreateBlockCommentRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = CreateBlockCommentRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディの型変換
        const createBlockCommentRequestModel: CreateBlockCommentRequestModel = new CreateBlockCommentRequestModel(requestBody, videoIdModel);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // ブロックコメントの永続ロジックを取得
            const blockCommentRepository = this.createBlockCommentService.getBlockCommentRepository();
            // ブロックコメントの重複チェック
            const isExistBlockComment = await this.createBlockCommentService.checkDupulicateBlockComment(
                createBlockCommentRequestModel, frontUserIdModel);

            let blockCommnet: BlockCommentTransaction;

            // 重複している場合はブロックコメントを復元する
            if (isExistBlockComment) {

                // ブロックコメントを復元
                blockCommnet = await this.createBlockCommentService.recovery(
                    blockCommentRepository,
                    createBlockCommentRequestModel,
                    frontUserIdModel,
                    tx);
            }
            else {
                // ブロックコメントを追加
                blockCommnet = await this.createBlockCommentService.insert(
                    blockCommentRepository,
                    createBlockCommentRequestModel,
                    frontUserIdModel,
                    tx);
            }

            return ApiResponse.create(res, HTTP_STATUS_OK, `ブロックリストに登録しました。`, blockCommnet);
        }, next);
    }
}