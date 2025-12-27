import { NextFunction, Response } from 'express';
import { ZodIssue } from 'zod';
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { authMiddleware } from '../../middleware/authMiddleware';
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { RepositoryType } from "../../util/const/CommonConst";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { GetFavoriteVideoFolderSelectEntity } from "../entity/GetFavoriteVideoFolderSelectEntity";
import { GetFavoriteVideoFolderFavoriteLevelModel } from '../model/GetFavoriteVideoFolderFavoriteLevelModel';
import { GetFavoriteVideoFolderPageModel } from "../model/GetFavoriteVideoFolderPageModel";
import { GetFavoriteVideoFolderSortIdModel } from '../model/GetFavoriteVideoFolderSortIdModel';
import { GetFavoriteVideoFolderTagNameModel } from '../model/GetFavoriteVideoFolderTagNameModel';
import { GetFavoriteVideoFolderVideoCategoryModel } from '../model/GetFavoriteVideoFolderVideoCategoryModel';
import { GetFavoriteVideoFolderViewStatusModel } from '../model/GetFavoriteVideoFolderViewStatusModel';
import { GetFavoriteVideoFolderResponseModel } from "../model/GetFavoriteVideoListResponseModel";
import { GetFavoriteVideoFolderRepositorys } from "../repository/GetFavoriteVideoFolderRepositorys";
import { RequestPathParamSchema } from "../schema/RequestPathParamSchema";
import { RequestQuerySchema } from '../schema/RequestQuerySchema';
import { GetFavoriteVideoFolderService } from "../service/GetFavoriteVideoFolderService";


export class GetFavoriteVideoFolderController extends RouteController {

    private readonly getFavoriteVideoFolderService = new GetFavoriteVideoFolderService((new GetFavoriteVideoFolderRepositorys()).get(RepositoryType.POSTGRESQL));
    // 動画取得件条件
    private static readonly DEFAULT_LIST_LIMIT = 30;

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_FOLDER,
            [authMiddleware]
        );
    }

    /**
     * フォルダ配下のお気に入り動画リストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.jsonWebTokenUserModel.frontUserIdModel;

        // パスパラメータのバリデーションチェック
        const pathValidateResult = RequestPathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER}`);
        }

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

        // パスパラメータ
        const param = pathValidateResult.data;
        const folderIdModel = new FolderIdModel(param.folderId);

        // クエリパラメータ
        const query = validateResult.data;

        // 視聴状況
        const viewStatusModel = new GetFavoriteVideoFolderViewStatusModel(query.folderViewStatus);
        // 動画カテゴリ
        const videoCategoryId = new GetFavoriteVideoFolderVideoCategoryModel(query.folderVideoCategory);
        // タグ
        const tagNameModel = new GetFavoriteVideoFolderTagNameModel(query.folderVideoTag);
        // お気に入り度
        const favoriteLevelModel = new GetFavoriteVideoFolderFavoriteLevelModel(query.folderFavoriteLevel);
        // ページ
        const pageModel = new GetFavoriteVideoFolderPageModel(query.folderPage);
        // ソートキー
        const sortIdModel = await GetFavoriteVideoFolderSortIdModel.set(query.folderSortKey);

        // お気に入り動画取得用Entity
        const getFavoriteVideoFolderSelectEntity = new GetFavoriteVideoFolderSelectEntity(
            frontUserIdModel,
            pageModel,
            folderIdModel,
            sortIdModel,
            viewStatusModel,
            videoCategoryId,
            tagNameModel,
            favoriteLevelModel,
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