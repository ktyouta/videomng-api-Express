import { NextFunction, Response } from 'express';
import { ZodIssue } from 'zod';
import { RepositoryType } from "../../common/const/CommonConst";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../common/const/HttpStatusConst";
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from "../../util/ApiResponse";
import { GetFavoriteVideoListSelectEntity } from "../entity/GetFavoriteVideoListSelectEntity";
import { FolderListModel } from "../model/FolderListModel";
import { GetFavoriteVideoListFavoriteLevelModel } from "../model/GetFavoriteVideoListFavoriteLevelModel";
import { GetFavoriteVideoListPageModel } from "../model/GetFavoriteVideoListPageModel";
import { GetFavoriteVideoListResponseModel } from "../model/GetFavoriteVideoListResponseModel";
import { GetFavoriteVideoListSortIdModel } from "../model/GetFavoriteVideoListSortIdModel";
import { GetFavoriteVideoListTagNameModel } from "../model/GetFavoriteVideoListTagNameModel";
import { GetFavoriteVideoListVideoCategoryModel } from "../model/GetFavoriteVideoListVideoCategoryModel";
import { GetFavoriteVideoListViewStatusModel } from "../model/GetFavoriteVideoListViewStatusModel";
import { ModeModel } from '../model/ModeModel';
import { GetFavoriteVideoListRepositorys } from "../repository/GetFavoriteVideoListRepositorys";
import { RequestQuerySchema } from '../schema/RequestQuerySchema';
import { GetFavoriteVideoListService } from "../service/GetFavoriteVideoListService";


export class GetFavoriteVideoListController extends RouteController {

    private readonly getFavoriteVideoListService = new GetFavoriteVideoListService((new GetFavoriteVideoListRepositorys()).get(RepositoryType.POSTGRESQL));
    // 動画取得件条件
    private static readonly DEFAULT_LIST_LIMIT = 30;

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画リストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

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

        // 視聴状況
        const viewStatusModel = new GetFavoriteVideoListViewStatusModel(query.viewStatus);
        // 動画カテゴリ
        const videoCategoryId = new GetFavoriteVideoListVideoCategoryModel(query.videoCategory);
        // タグ
        const tagNameModel = new GetFavoriteVideoListTagNameModel(query.videoTag);
        // ソートID
        const sortIdModel = await GetFavoriteVideoListSortIdModel.set(query.sortKey);
        // お気に入り度
        const favoriteLevelModel = new GetFavoriteVideoListFavoriteLevelModel(query.favoriteLevel);
        // ページ
        const pageModel = new GetFavoriteVideoListPageModel(query.page);
        // フォルダ
        const folderListModel = new FolderListModel(query.folder);
        // モード
        const modeModel = new ModeModel(query.mode);

        // お気に入り動画取得用Entity
        const getFavoriteVideoListSelectEntity = new GetFavoriteVideoListSelectEntity(
            frontUserIdModel,
            viewStatusModel,
            videoCategoryId,
            tagNameModel,
            sortIdModel,
            favoriteLevelModel,
            pageModel,
            modeModel,
        );

        // お気に入り動画リストを取得
        const favoriteVideoList = await this.getFavoriteVideoListService.getFavoriteVideoList(
            getFavoriteVideoListSelectEntity,
            GetFavoriteVideoListController.DEFAULT_LIST_LIMIT
        );

        // フォルダリストを取得
        const folderList = modeModel.isFolderMode() ? await this.getFavoriteVideoListService.getFolderList(frontUserIdModel, folderListModel) : [];

        // ユーザーのお気に入り動画が存在しない
        if (favoriteVideoList.length === 0 && folderList.length === 0) {

            // レスポンスを作成
            const getFavoriteVideoListResponse: GetFavoriteVideoListResponseModel = this.getFavoriteVideoListService.createResponse(
                [],
                0,
                GetFavoriteVideoListController.DEFAULT_LIST_LIMIT,
                [],
            );

            ApiResponse.create(res, HTTP_STATUS_OK, `お気に入り動画が存在しません。`, getFavoriteVideoListResponse.data);
            return;
        }

        // お気に入り動画件数を取得
        const total = await this.getFavoriteVideoListService.getFavoriteVideoListCount(getFavoriteVideoListSelectEntity);

        // お気に入り動画リストからYouTube Data Apiの情報を取得してマージする
        const favoriteVideoListMergedList = await this.getFavoriteVideoListService.mergeYouTubeDataList(favoriteVideoList);

        // フォルダに表示するサムネを取得
        const folderListMergedList = await this.getFavoriteVideoListService.getFavoriteVideoFolderThumbnail(folderList);

        // レスポンスを作成
        const getFavoriteVideoListResponse: GetFavoriteVideoListResponseModel = this.getFavoriteVideoListService.createResponse(
            favoriteVideoListMergedList,
            total,
            GetFavoriteVideoListController.DEFAULT_LIST_LIMIT,
            folderListMergedList,
        );

        ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画リストを取得しました。`, getFavoriteVideoListResponse.data);
        return;
    }
}