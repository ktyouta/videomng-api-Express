import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { ZodIssue } from 'zod';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { FolderColorModel } from '../../internaldata/foldermaster/model/FolderColorModel';
import { FolderNameModel } from '../../internaldata/foldermaster/model/FolderNameModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { RepositoryType } from '../../util/const/CommonConst';
import { HTTP_STATUS_CONFLICT, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { CreateFolderRepositorys } from '../repository/CreateFolderRepositorys';
import { CreateFolderRequestSchema, CreateFolderRequestType } from '../schema/CreateFolderRequestSchema';
import { CreateFolderService } from '../service/CreateFolderService';


export class CreateFolderController extends RouteController {

    private readonly createFolderService = new CreateFolderService((new CreateFolderRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FOLDER
        );
    }

    /**
     * フォルダを作成する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // リクエストのバリデーションチェック
        const validateResult = CreateFolderRequestSchema.safeParse(req.body);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディ
        const requestBody: CreateFolderRequestType = validateResult.data;
        const folderNameModel = new FolderNameModel(requestBody.name);
        const folderColorModel = new FolderColorModel(requestBody.folderColor);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.createFolderService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // フォルダの重複チェック
            const folderList = await this.createFolderService.getFolder(folderNameModel, frontUserIdModel);

            if (folderList && folderList.length > 0) {
                return ApiResponse.create(res, HTTP_STATUS_CONFLICT, `同じ名前のフォルダが既に存在します。`,);
            }

            // フォルダ作成
            const folder = await this.createFolderService.createFolder(frontUserIdModel, folderNameModel, folderColorModel, tx);

            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダを作成しました。`, folder);
        }, next);
    }
}