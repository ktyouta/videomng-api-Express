import { Router, Request, Response, NextFunction } from 'express';
import ENV from '../../env.json';
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
import { DeleteFavoriteVideoMemoRequestType } from '../Type/DeleteFavoriteVideoMemoRequestType';
import { DeleteFavoriteVideoMemoRequestModelSchema } from '../model/DeleteFavoriteVideoMemoRequestModelSchema';
import { DeleteFavoriteVideoMemoResponseModel } from '../model/DeleteFavoriteVideoMemoResponseModel';
import { DeleteFavoriteVideoMemoService } from '../service/DeleteFavoriteVideoMemoService';
import { DeleteFavoriteVideoMemoRequestModel } from '../model/DeleteFavoriteVideoMemoRequestModel';


export class DeleteFavoriteVideoMemoController extends RouteController {

    private readonly deleteFavoriteVideoMemoService = new DeleteFavoriteVideoMemoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_MEMO
        );
    }

    /**
     * お気に入り動画メモを削除する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // リクエストボディ
        const requestBody: DeleteFavoriteVideoMemoRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = DeleteFavoriteVideoMemoRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディの型変換
        const deleteFavoriteVideoMemoRequestModel = new DeleteFavoriteVideoMemoRequestModel(requestBody);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.deleteFavoriteVideoMemoService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // 永続ロジックを取得
            const deleteFavoriteVideoMemoRepository = this.deleteFavoriteVideoMemoService.getDeleteFavoriteVideoMemoRepository();
            const favoriteVideoMemoRepository = this.deleteFavoriteVideoMemoService.getFavoriteVideoMemoRepository();

            // 動画の存在チェック
            const isExistFavoriteVideoMemo = await this.deleteFavoriteVideoMemoService.checkExistFavoriteVideoMemo(
                deleteFavoriteVideoMemoRepository,
                deleteFavoriteVideoMemoRequestModel,
                frontUserIdModel);

            // お気に入り動画が存在しない
            if (!isExistFavoriteVideoMemo) {
                return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画情報が存在しません。`)
            }

            // お気に入り動画メモを削除
            const favoriteVideoMemo = await this.deleteFavoriteVideoMemoService.softDelete(
                favoriteVideoMemoRepository,
                deleteFavoriteVideoMemoRequestModel,
                frontUserIdModel,
                tx);

            // レスポンス
            const deleteFavoriteVideoMemoResponseModel = new DeleteFavoriteVideoMemoResponseModel(favoriteVideoMemo);

            return ApiResponse.create(res, HTTP_STATUS_OK, `動画メモを削除しました。`, deleteFavoriteVideoMemoResponseModel.data);
        }, next);
    }
}