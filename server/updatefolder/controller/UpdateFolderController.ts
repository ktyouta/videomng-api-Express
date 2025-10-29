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
import { UpdateFolderService } from '../service/UpdateFolderService';
import { UpdateFolderRepositorys } from '../repository/UpdateFolderRepositorys';
import { UpdateFolderRequestSchema, UpdateFolderRequestType } from '../schema/UpdateFolderRequestSchema';
import { FolderNameModel } from '../../internaldata/foldermaster/model/FolderNameModel';
import { FolderIdModel } from '../../internaldata/foldermaster/model/FolderIdModel';
import { PathParamSchema } from '../schema/PathParamSchema';


export class UpdateFolderController extends RouteController {

    private readonly updateFolderService = new UpdateFolderService((new UpdateFolderRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.PUT,
            this.doExecute,
            ApiEndopoint.FOLDER_ID
        );
    }

    /**
     * フォルダを更新する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER}`);
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

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.updateFolderService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // フォルダの存在チェック
            const existsFolder = await this.updateFolderService.getExistsFolder(folderIdModel, frontUserIdModel);

            if (!existsFolder || existsFolder.length === 0) {
                throw Error(`更新対象のフォルダが存在しません。フォルダID：${folderIdModel.id}`);
            }

            // フォルダの重複チェック
            const duplicationFolder = await this.updateFolderService.getDuplicationFolder(folderNameModel, frontUserIdModel);

            if (duplicationFolder && duplicationFolder.length > 0) {
                return ApiResponse.create(res, HTTP_STATUS_CONFLICT, `同じ名前のフォルダが既に存在します。`,);
            }

            // フォルダ更新
            const folder = await this.updateFolderService.update(folderIdModel, folderNameModel, frontUserIdModel, tx);

            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダを更新しました。`, folder);
        }, next);
    }
}