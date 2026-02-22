import { Response } from 'express';
import { ZodIssue } from 'zod';
import { RepositoryType } from '../../common/const/CommonConst';
import { HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../common/const/HttpStatusConst';
import { ParentFolderIdModel } from '../../internaldata/foldermaster/model/ParentFolderIdModel';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { GetFolderListRepositorys } from '../repository/GetFolderListRepositorys';
import { RequestQuerySchema } from '../schema/RequestQuerySchema';
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
    public async doExecute(req: AuthenticatedRequest, res: Response) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;

        // クエリパラメータのバリデーションチェック
        const validateResult = RequestQuerySchema.safeParse(req.query);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // クエリパラメータ
        const query = validateResult.data;
        const parentFolderId = new ParentFolderIdModel(query.parentFolderId);

        // フォルダリスト取得
        const result = await this.getFolderService.getFolderList(frontUserIdModel, parentFolderId);

        if (!result || result.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダが存在しません。`, []);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, `フォルダを取得しました。`, result);
    }
}