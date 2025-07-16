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
import { BlockCommentTransaction, Prisma } from '@prisma/client';
import { CreateBlockCommentService } from '../service/CreateBlockCommentService';
import { CreateBlockCommentRequestType } from '../model/CreateBlockCommentRequestType';
import { CreateBlockCommentRequestModelSchema } from '../model/CreateBlockCommentRequestModelSchema';
import { CreateBlockCommentRequestModel } from '../model/CreateBlockCommentRequestModel';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';


export class CreateBlockCommentController extends RouteController {

    private readonly createBlockCommentService = new CreateBlockCommentService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.BLOCK_COMMENT
        );
    }

    /**
     * ブロックコメントを登録する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

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

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.createBlockCommentService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

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