import { Response } from 'express';
import { RepositoryType } from '../../common/const/CommonConst';
import { HTTP_STATUS_OK } from '../../common/const/HttpStatusConst';
import { FolderIdModel } from '../../internaldata/foldermaster/model/FolderIdModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { GetFolderRepositorys } from '../repository/GetFolderRepositorys';
import { PathParamSchema } from '../schema/PathParamSchema';
import { GetFolderService } from '../service/GetFolderService';


export class GetFolderController extends RouteController {

    private readonly getFolderService = new GetFolderService((new GetFolderRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FOLDER_ID,
            [authMiddleware]
        );
    }

    /**
     * フォルダを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;
        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FOLDER_ID}`);
        }

        const folderIdModel = new FolderIdModel(pathValidateResult.data.folderId);

        // フォルダ取得
        const folderList = await this.getFolderService.getFolder(folderIdModel, frontUserIdModel);

        if (!folderList || folderList.length === 0) {
            throw Error(`フォルダが存在しません。フォルダID：${folderIdModel.id}`);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダを取得しました。`, folderList);
    }
}