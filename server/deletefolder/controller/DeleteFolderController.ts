import { Router, Request, Response, NextFunction } from 'express';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { HTTP_STATUS_CONFLICT, HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { ZodIssue } from 'zod';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { Prisma } from '@prisma/client';
import { RepositoryType } from '../../util/const/CommonConst';
import { FolderNameModel } from '../../internaldata/foldermaster/model/FolderNameModel';
import { FolderIdModel } from '../../internaldata/foldermaster/model/FolderIdModel';
import { PathParamSchema } from '../schema/PathParamSchema';
import { DeleteFolderRepositorys } from '../repository/DeleteFolderRepositorys';
import { DeleteFolderService } from '../service/DeleteFolderService';
import { RequestBodySchema, RequestBodyType } from '../schema/RequestBodySchema';


export class DeleteFolderController extends RouteController {

    private readonly deleteFolderService = new DeleteFolderService((new DeleteFolderRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.FOLDER_ID
        );
    }

    /**
     * フォルダを削除する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FOLDER_ID}`);
        }

        const folderIdModel = new FolderIdModel(pathValidateResult.data.folderId);

        // リクエストのバリデーションチェック
        const validateResult = RequestBodySchema.safeParse(req.body);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディ
        const requestBody: RequestBodyType = validateResult.data;

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.deleteFolderService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // フォルダ削除
            const result = await this.deleteFolderService.deleteFolder(folderIdModel, frontUserIdModel, tx);

            if (result && result.count > 1) {
                throw Error(`フォルダ削除処理で想定外の削除件数が発生しました。（ユーザーID=${frontUserIdModel.frontUserId}, フォルダID=${folderIdModel.id},  件数=${result.count}）`);
            }

            // フォルダ内の動画も削除する
            if (requestBody.deleteVideos) {
                await this.deleteFolderService.deleteFavoriteVideo(folderIdModel, frontUserIdModel, tx);
            }

            // お気に入り動画フォルダ削除
            await this.deleteFolderService.deleteFavoriteVideoFolder(folderIdModel, frontUserIdModel, tx);

            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダを削除しました。`);
        }, next);
    }
}