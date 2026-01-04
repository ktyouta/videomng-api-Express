import { NextFunction, Response } from 'express';
import { RepositoryType } from "../../common/const/CommonConst";
import { HTTP_STATUS_CREATED } from "../../common/const/HttpStatusConst";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from "../../util/ApiResponse";
import { FolderShareVideosRepositorys } from "../repository/FolderShareVideosRepositorys";
import { PathParamSchema } from "../schema/PathParamSchema";
import { FolderShareVideosService } from "../service/FolderShareVideosService";


export class FolderShareVideosController extends RouteController {

    private readonly getFavoriteVideoFolderService = new FolderShareVideosService((new FolderShareVideosRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FOLDER_SHARE_VIDEOS,
            [authMiddleware]
        );
    }

    /**
     * 別フォルダに登録された動画を取得
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;

        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FOLDER_SHARE_VIDEOS}`);
        }

        const folderIdModel = new FolderIdModel(pathValidateResult.data.folderId);

        // 動画リストを取得
        const videoList = await this.getFavoriteVideoFolderService.getFavoriteVideoFolder(
            frontUserIdModel,
            folderIdModel,
        );

        // フォルダ情報を取得
        const folderVideoList = await this.getFavoriteVideoFolderService.getFolderInfo(
            frontUserIdModel,
            folderIdModel,
            videoList,
        );

        // 動画情報を取得
        const favoriteVideoList = await this.getFavoriteVideoFolderService.getVideoInfo(folderVideoList);

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `動画リストを取得しました。`, favoriteVideoList);
    }
}