import { NextFunction, Request, Response } from 'express';
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { GetFavoriteVideoListSelectEntity } from "../entity/GetFavoriteVideoListSelectEntity";
import { FolderListModel } from "../model/FolderListModel";
import { GetFavoriteVideoListFavoriteLevelModel } from "../model/GetFavoriteVideoListFavoriteLevelModel";
import { GetFavoriteVideoListPageModel } from "../model/GetFavoriteVideoListPageModel";
import { GetFavoriteVideoListResponseModel } from "../model/GetFavoriteVideoListResponseModel";
import { GetFavoriteVideoListSortIdModel } from "../model/GetFavoriteVideoListSortIdModel";
import { GetFavoriteVideoListTagNameModel } from "../model/GetFavoriteVideoListTagNameModel";
import { GetFavoriteVideoListVideoCategoryModel } from "../model/GetFavoriteVideoListVideoCategoryModel";
import { GetFavoriteVideoListViewStatusModel } from "../model/GetFavoriteVideoListViewStatusModel";
import { GetFavoriteVideoListRepositorys } from "../repository/GetFavoriteVideoListRepositorys";
import { GetFavoriteVideoListService } from "../service/GetFavoriteVideoListService";


export class GetFavoriteVideoListController extends RouteController {

    private readonly getFavoriteVideoListService = new GetFavoriteVideoListService((new GetFavoriteVideoListRepositorys()).get(RepositoryType.POSTGRESQL));
    // 動画取得件条件
    private static readonly DEFAULT_LIST_LIMIT = 30;

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO
        );
    }

    /**
     * お気に入り動画リストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFavoriteVideoListService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // クエリパラメータを取得
        const query = req.query;

        // 視聴状況を取得
        const viewStatus = query[`viewStatus`] as string;
        const viewStatusModel = new GetFavoriteVideoListViewStatusModel(viewStatus);

        // 動画カテゴリを取得
        const videoCategory = query[`videoCategory`] as string;
        const videoCategoryId = new GetFavoriteVideoListVideoCategoryModel(videoCategory);

        // タグを取得
        const videoTag = query[`videoTag`] as string;
        const tagNameModel = new GetFavoriteVideoListTagNameModel(videoTag);

        // ソートID
        const sortId = query[`sortKey`] as string;
        const sortIdModel = await GetFavoriteVideoListSortIdModel.set(sortId);

        // お気に入り度
        const favoriteLevel = query[`favoriteLevel`] as string;
        const favoriteLevelModel = new GetFavoriteVideoListFavoriteLevelModel(favoriteLevel);

        // ページ
        const page = query[`page`] as string;
        const pageModel = new GetFavoriteVideoListPageModel(page);

        // フォルダ
        const folder = query[`folder`] as string;
        const folderListModel = new FolderListModel(folder);

        // お気に入り動画取得用Entity
        const getFavoriteVideoListSelectEntity = new GetFavoriteVideoListSelectEntity(
            frontUserIdModel,
            viewStatusModel,
            videoCategoryId,
            tagNameModel,
            sortIdModel,
            favoriteLevelModel,
            pageModel,
        );

        // お気に入り動画リストを取得
        const favoriteVideoList = await this.getFavoriteVideoListService.getFavoriteVideoList(
            getFavoriteVideoListSelectEntity,
            GetFavoriteVideoListController.DEFAULT_LIST_LIMIT
        );

        // フォルダリストを取得
        const folderList = await this.getFavoriteVideoListService.getFolderList(frontUserIdModel, folderListModel);

        // ユーザーのお気に入り動画が存在しない
        if (favoriteVideoList.length === 0 && folderList.length === 0) {

            // レスポンスを作成
            const getFavoriteVideoListResponse: GetFavoriteVideoListResponseModel = this.getFavoriteVideoListService.createResponse(
                [],
                0,
                GetFavoriteVideoListController.DEFAULT_LIST_LIMIT,
                [],
            );
            return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入り動画が存在しません。`, getFavoriteVideoListResponse.data)
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

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画リストを取得しました。`, getFavoriteVideoListResponse.data);
    }
}