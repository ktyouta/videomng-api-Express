import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { ZodIssue } from 'zod';
import { RepositoryType } from '../../constant/CommonConst';
import { HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../constant/HttpStatusConst';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { PrismaTransaction } from '../../util/PrismaTransaction';
import { CreateFavoriteVideoRequestModel } from '../model/CreateFavoriteVideoRequestModel';
import { CreateFavoriteVideoRequestModelSchema } from '../model/CreateFavoriteVideoRequestModelSchema';
import { CreateFavoriteVideoRequestType } from '../model/CreateFavoriteVideoRequestType';
import { CreateFavoriteVideoRepositorys } from '../repository/CreateFavoriteVideoRepositorys';
import { CreateFavoriteVideoService } from '../service/CreateFavoriteVideoService';


export class CreateFavoriteVideoController extends RouteController {

    private readonly createFavoriteVideoService = new CreateFavoriteVideoService((new CreateFavoriteVideoRepositorys).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画を登録する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;
        // リクエストボディ
        const requestBody: CreateFavoriteVideoRequestType = req.body;

        // リクエストのバリデーションチェック
        const validateResult = CreateFavoriteVideoRequestModelSchema.safeParse(requestBody);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディの型変換
        const createFavoriteVideoRequestModel: CreateFavoriteVideoRequestModel = new CreateFavoriteVideoRequestModel(requestBody);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // お気に入り動画の永続ロジックを取得
            const favoriteVideoRepository = this.createFavoriteVideoService.getFavoriteVideoRepository();

            // お気に入り動画に動画を追加
            await this.createFavoriteVideoService.insertFavoriteVideo(
                favoriteVideoRepository,
                createFavoriteVideoRequestModel,
                frontUserIdModel,
                tx);

            // タグリスト
            const tagList = createFavoriteVideoRequestModel.tagList;

            if (tagList.length > 0) {

                // タグのマスタ存在チェック
                const missingTagIdList = await this.createFavoriteVideoService.checkTagListExists(tagList, frontUserIdModel);

                if (missingTagIdList.length > 0) {
                    throw Error(`存在しないタグIDが含まれています。tagId:${missingTagIdList.join(`,`)} endpoint:${ApiEndopoint.FAVORITE_VIDEO}`);
                }
            }

            // タグ登録
            await this.createFavoriteVideoService.insertVideoTag(
                createFavoriteVideoRequestModel,
                frontUserIdModel,
                tx
            );

            // フォルダ登録
            const folderIdModel = createFavoriteVideoRequestModel.folderIdModel;
            if (folderIdModel) {

                // フォルダのマスタ存在チェック
                const folder = await this.createFavoriteVideoService.getFolder(folderIdModel, frontUserIdModel);

                if (!folder) {
                    throw Error(`フォルダが存在しません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER}`);
                }

                // お気に入りフォルダに登録
                await this.createFavoriteVideoService.insertFavoriteVideoFolder(
                    frontUserIdModel,
                    createFavoriteVideoRequestModel.videoIdModel,
                    folderIdModel,
                    tx
                );
            }

            return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入り動画に登録しました。`);
        }, next);
    }
}