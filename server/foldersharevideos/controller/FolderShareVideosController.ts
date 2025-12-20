import { NextFunction, Request, Response } from 'express';
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { HTTP_STATUS_CREATED } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { SelectShareVideoEntity } from "../entity/SelectShareVideoEntity";
import { FolderShareVideosRepositorys } from "../repository/FolderShareVideosRepositorys";
import { PathParamSchema } from "../schema/PathParamSchema";
import { FolderShareVideosService } from "../service/FolderShareVideosService";


export class FolderShareVideosController extends RouteController {

    private readonly getFavoriteVideoFolderService = new FolderShareVideosService((new FolderShareVideosRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FOLDER_SHARE_VIDEOS
        );
    }

    /**
     * 別フォルダに登録された動画を取得
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FOLDER_SHARE_VIDEOS}`);
        }

        const folderIdModel = new FolderIdModel(pathValidateResult.data.folderId);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFavoriteVideoFolderService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // 動画取得用Entity
        const getFavoriteVideoFolderSelectEntity = new SelectShareVideoEntity(
            frontUserIdModel,
            folderIdModel,
        );

        // 動画リストを取得
        const favoriteVideoList = await this.getFavoriteVideoFolderService.getFavoriteVideoFolder(
            getFavoriteVideoFolderSelectEntity,
        );

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `動画リストを取得しました。`, favoriteVideoList);
    }
}