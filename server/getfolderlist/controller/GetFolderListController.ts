import { NextFunction, Response } from 'express';
import { RepositoryType } from '../../common/const/CommonConst';
import { HTTP_STATUS_OK } from '../../common/const/HttpStatusConst';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { GetFolderListRepositorys } from '../repository/GetFolderListRepositorys';
import { GetFolderService } from '../service/GetFolderListService';


export class GetFolderListController extends RouteController {

    private readonly getFolderService = new GetFolderService((new GetFolderListRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FOLDER,
            [authMiddleware]
        );
    }

    /**
     * フォルダを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;

        // フォルダリスト取得
        const result = await this.getFolderService.getFolderList(frontUserIdModel);

        if (!result || result.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダが存在しません。`, []);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダを取得しました。`, result);
    }
}