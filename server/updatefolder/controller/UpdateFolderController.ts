import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { ZodIssue } from 'zod';
import { RepositoryType } from '../../common/const/CommonConst';
import { HTTP_STATUS_CONFLICT, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../common/const/HttpStatusConst';
import { FolderColorModel } from '../../internaldata/foldermaster/model/FolderColorModel';
import { FolderIdModel } from '../../internaldata/foldermaster/model/FolderIdModel';
import { FolderNameModel } from '../../internaldata/foldermaster/model/FolderNameModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { PrismaTransaction } from '../../util/PrismaTransaction';
import { UpdateFolderRepositorys } from '../repository/UpdateFolderRepositorys';
import { PathParamSchema } from '../schema/PathParamSchema';
import { UpdateFolderRequestSchema, UpdateFolderRequestType } from '../schema/UpdateFolderRequestSchema';
import { UpdateFolderService } from '../service/UpdateFolderService';


export class UpdateFolderController extends RouteController {

    private readonly updateFolderService = new UpdateFolderService((new UpdateFolderRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FOLDER_ID,
            [authMiddleware]
        );
    }

    /**
     * フォルダを更新する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;
        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FOLDER_ID}`);
        }

        // リクエストのバリデーションチェック
        const validateResult = UpdateFolderRequestSchema.safeParse(req.body);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディ
        const requestBody: UpdateFolderRequestType = validateResult.data;
        const folderIdModel = new FolderIdModel(pathValidateResult.data.folderId);
        const folderNameModel = new FolderNameModel(requestBody.name);
        const folderColorModel = new FolderColorModel(requestBody.folderColor);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // フォルダの存在チェック
            const existsFolder = await this.updateFolderService.getExistsFolder(folderIdModel, frontUserIdModel);

            if (!existsFolder || existsFolder.length === 0) {
                throw Error(`更新対象のフォルダが存在しません。フォルダID：${folderIdModel.id}`);
            }

            // フォルダの重複チェック
            const duplicationFolder = await this.updateFolderService.getDuplicationFolder(folderNameModel, frontUserIdModel, folderIdModel);

            if (duplicationFolder && duplicationFolder.length > 1) {
                return ApiResponse.create(res, HTTP_STATUS_CONFLICT, `同じ名前のフォルダが既に存在します。`,);
            }

            // フォルダ更新
            const folder = await this.updateFolderService.update(folderIdModel, folderNameModel, frontUserIdModel, folderColorModel, tx);

            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダを更新しました。`, folder);
        }, next);
    }
}