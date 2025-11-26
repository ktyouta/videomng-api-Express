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
import { FolderIdModel } from '../../internaldata/foldermaster/model/FolderIdModel';
import { PathParamSchema } from '../schema/PathParamSchema';
import { GetFolderService } from '../service/GetFolderService';
import { GetFolderRepositorys } from '../repository/GetFolderRepositorys';


export class GetFolderController extends RouteController {

    private readonly getFolderService = new GetFolderService((new GetFolderRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FOLDER_ID
        );
    }

    /**
     * フォルダを取得する
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

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFolderService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // フォルダの存在チェック
        const folder = await this.getFolderService.getFolder(folderIdModel, frontUserIdModel);

        if (!folder) {
            throw Error(`フォルダが存在しません。フォルダID：${folderIdModel.id}`);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダを取得しました。`, folder);
    }
}