import { NextFunction, Request, Response } from 'express';
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { GetFavoriteVideoFolderSelectEntity } from "../entity/GetFavoriteVideoFolderSelectEntity";
import { GetFavoriteVideoFolderPageModel } from "../model/GetFavoriteVideoFolderPageModel";
import { GetFavoriteVideoFolderSortIdModel } from '../model/GetFavoriteVideoFolderSortIdModel';
import { GetFavoriteVideoFolderResponseModel } from "../model/GetFavoriteVideoListResponseModel";
import { GetFavoriteVideoFolderRepositorys } from "../repository/GetFavoriteVideoFolderRepositorys";
import { PathParamSchema } from "../schema/PathParamSchema";
import { GetFavoriteVideoFolderService } from "../service/GetFavoriteVideoFolderService";


export class GetFavoriteVideoFolderController extends RouteController {

    private readonly getFavoriteVideoFolderService = new GetFavoriteVideoFolderService((new GetFavoriteVideoFolderRepositorys()).get(RepositoryType.POSTGRESQL));
    // 動画取得件条件
    private static readonly DEFAULT_LIST_LIMIT = 30;

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_FOLDER
        );
    }

    /**
     * フォルダ配下のお気に入り動画リストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER}`);
        }

        const folderIdModel = new FolderIdModel(pathValidateResult.data.folderId);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFavoriteVideoFolderService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // クエリパラメータを取得
        const query = req.query;

        // ページ
        const page = query[`folderPage`] as string;
        const pageModel = new GetFavoriteVideoFolderPageModel(page);

        // ソートキー
        const sortId = query[`folderSortkey`] as string;
        const sortIdModel = await GetFavoriteVideoFolderSortIdModel.set(sortId);

        // お気に入り動画取得用Entity
        const getFavoriteVideoFolderSelectEntity = new GetFavoriteVideoFolderSelectEntity(
            frontUserIdModel,
            pageModel,
            folderIdModel,
            sortIdModel
        );

        // お気に入り動画リストを取得
        const favoriteVideoList = await this.getFavoriteVideoFolderService.getFavoriteVideoFolder(
            getFavoriteVideoFolderSelectEntity,
            GetFavoriteVideoFolderController.DEFAULT_LIST_LIMIT
        );

        // ユーザーのお気に入り動画が存在しない
        if (favoriteVideoList.length === 0) {

            // レスポンスを作成
            const getFavoriteVideoFolderResponse: GetFavoriteVideoFolderResponseModel = this.getFavoriteVideoFolderService.createResponse(
                [],
                0,
                GetFavoriteVideoFolderController.DEFAULT_LIST_LIMIT,
            );
            return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入り動画が存在しません。`, getFavoriteVideoFolderResponse.data)
        }

        // お気に入り動画件数を取得
        const total = await this.getFavoriteVideoFolderService.getFavoriteVideoFolderCount(getFavoriteVideoFolderSelectEntity);

        // お気に入り動画リストからYouTube Data Apiの情報を取得してマージする
        const favoriteVideoListMergedList = await this.getFavoriteVideoFolderService.mergeYouTubeDataList(favoriteVideoList);

        // レスポンスを作成
        const getFavoriteVideoFolderResponse: GetFavoriteVideoFolderResponseModel = this.getFavoriteVideoFolderService.createResponse(
            favoriteVideoListMergedList,
            total,
            GetFavoriteVideoFolderController.DEFAULT_LIST_LIMIT,
        );

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画リストを取得しました。`, getFavoriteVideoFolderResponse.data);
    }
}