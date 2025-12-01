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
import { GetFolderService } from '../service/GetFolderListService';
import { GetFolderListRepositorys } from '../repository/GetFolderListRepositorys';


export class GetFolderListController extends RouteController {

    private readonly getFolderService = new GetFolderService((new GetFolderListRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FOLDER
        );
    }

    /**
     * フォルダを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFolderService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // フォルダリスト取得
        const result = await this.getFolderService.getFolderList(frontUserIdModel);

        if (!result || result.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダが存在しません。`, []);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダを取得しました。`, result);
    }
}