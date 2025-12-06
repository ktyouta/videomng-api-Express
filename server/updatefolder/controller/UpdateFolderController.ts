import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { ZodIssue } from 'zod';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { FolderColorModel } from '../../internaldata/foldermaster/model/FolderColorModel';
import { FolderIdModel } from '../../internaldata/foldermaster/model/FolderIdModel';
import { FolderNameModel } from '../../internaldata/foldermaster/model/FolderNameModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { RepositoryType } from '../../util/const/CommonConst';
import { HTTP_STATUS_CONFLICT, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
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

            if (duplicationFolder && duplicationFolder.length > 1) {
                return ApiResponse.create(res, HTTP_STATUS_CONFLICT, `同じ名前のフォルダが既に存在します。`,);
            }

            // フォルダ更新
            const folder = await this.updateFolderService.update(folderIdModel, folderNameModel, frontUserIdModel, folderColorModel, tx);

            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダを更新しました。`, folder);
        }, next);
    }
}