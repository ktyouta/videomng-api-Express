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
import { CreateFolderService } from '../service/CreateFolderService';
import { CreateFolderRequestSchema, CreateFolderRequestType } from '../schema/CreateFolderRequestSchema';
import { CreateFolderRepositorys } from '../repository/CreateFolderRepositorys';
import { RepositoryType } from '../../util/const/CommonConst';


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

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.createFolderService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // フォルダの重複チェック
            const folderList = await this.createFolderService.getFolder(requestBody, frontUserIdModel);

            if (folderList && folderList.length > 0) {
                return ApiResponse.create(res, HTTP_STATUS_CONFLICT, `同じ名前のフォルダが既に存在します。`,);
            }

            // フォルダ作成
            const folder = await this.createFolderService.createFolder(requestBody, frontUserIdModel, tx);

            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダを作成しました。`, folder);
        }, next);
    }
}