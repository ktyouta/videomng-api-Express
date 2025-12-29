import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { ZodIssue } from 'zod';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { CreateFavoriteVideoMemoRequestModel } from '../model/CreateFavoriteVideoMemoRequestModel';
import { CreateFavoriteVideoMemoRequestModelSchema } from '../model/CreateFavoriteVideoMemoRequestModelSchema';
import { CreateFavoriteVideoMemoResponseModel } from '../model/CreateFavoriteVideoMemoResponseModel';
import { CreateFavoriteVideoMemoService } from '../service/CreateFavoriteVideoMemoService';
import { CreateFavoriteVideoMemoRequestType } from '../Type/CreateFavoriteVideoMemoRequestType';


export class CreateFavoriteVideoMemoController extends RouteController {

    private readonly createFavoriteVideoMemoService = new CreateFavoriteVideoMemoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_MEMO,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画メモを登録する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.frontUserIdModel;
        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_ID} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // リクエストボディ
        const requestBody: CreateFavoriteVideoMemoRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = CreateFavoriteVideoMemoRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディの型変換
        const createFavoriteVideoMemoRequestModel = new CreateFavoriteVideoMemoRequestModel(requestBody, videoIdModel);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // 永続ロジックを取得
            const createFavoriteVideoMemoRepository = this.createFavoriteVideoMemoService.getCreateFavoriteVideoMemoRepository();
            const favoriteVideoMemoRepository = this.createFavoriteVideoMemoService.getFavoriteVideoMemoRepository();

            // 動画の存在チェック
            const isExistFavoriteVideoMemo = await this.createFavoriteVideoMemoService.checkExistFavoriteVideoMemo(
                createFavoriteVideoMemoRepository,
                createFavoriteVideoMemoRequestModel,
                frontUserIdModel);

            // お気に入り動画が存在しない
            if (!isExistFavoriteVideoMemo) {
                return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画情報が存在しません。`)
            }

            // お気に入り動画メモを追加
            const favoriteVideoMemo = await this.createFavoriteVideoMemoService.insert(
                createFavoriteVideoMemoRepository,
                favoriteVideoMemoRepository,
                createFavoriteVideoMemoRequestModel,
                frontUserIdModel,
                tx);

            // レスポンス
            const createFavoriteVideoMemoResponseModel = new CreateFavoriteVideoMemoResponseModel(favoriteVideoMemo);

            return ApiResponse.create(res, HTTP_STATUS_OK, `動画メモを登録しました。`, createFavoriteVideoMemoResponseModel.data);
        }, next);
    }
}