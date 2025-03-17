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
import { UpdateFavoriteVideoMemoService } from '../service/UpdateFavoriteVideoMemoService';
import { UpdateFavoriteVideoMemoRequestType } from '../Type/UpdateFavoriteVideoMemoRequestType';
import { UpdateFavoriteVideoMemoRequestModelSchema } from '../model/UpdateFavoriteVideoMemoRequestModelSchema';
import { UpdateFavoriteVideoMemoRequestModel } from '../model/UpdateFavoriteVideoMemoRequestModel';
import { UpdateFavoriteVideoMemoResponseModel } from '../model/UpdateFavoriteVideoMemoResponseModel';


export class UpdateFavoriteVideoMemoController extends RouteController {

    private readonly updateFavoriteVideoMemoService = new UpdateFavoriteVideoMemoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_MEMO
        );
    }

    /**
     * お気に入り動画メモを更新する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // リクエストボディ
        const requestBody: UpdateFavoriteVideoMemoRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = UpdateFavoriteVideoMemoRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディの型変換
        const updateFavoriteVideoMemoRequestModel = new UpdateFavoriteVideoMemoRequestModel(requestBody);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.updateFavoriteVideoMemoService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // 永続ロジックを取得
            const updateFavoriteVideoMemoRepository = this.updateFavoriteVideoMemoService.getUpdateFavoriteVideoMemoRepository();
            const favoriteVideoMemoRepository = this.updateFavoriteVideoMemoService.getFavoriteVideoMemoRepository();

            // 動画の存在チェック
            const isExistFavoriteVideoMemo = await this.updateFavoriteVideoMemoService.checkExistFavoriteVideoMemo(
                updateFavoriteVideoMemoRepository,
                updateFavoriteVideoMemoRequestModel,
                frontUserIdModel);

            // お気に入り動画が存在しない
            if (!isExistFavoriteVideoMemo) {
                return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画情報が存在しません。`)
            }

            // お気に入り動画メモを更新
            const favoriteVideoMemo = await this.updateFavoriteVideoMemoService.update(
                updateFavoriteVideoMemoRepository,
                favoriteVideoMemoRepository,
                updateFavoriteVideoMemoRequestModel,
                frontUserIdModel,
                tx);

            // レスポンス
            const updateFavoriteVideoMemoResponseModel = new UpdateFavoriteVideoMemoResponseModel(favoriteVideoMemo);

            return ApiResponse.create(res, HTTP_STATUS_OK, `動画メモを更新しました。`, updateFavoriteVideoMemoResponseModel.data);
        }, next);
    }
}