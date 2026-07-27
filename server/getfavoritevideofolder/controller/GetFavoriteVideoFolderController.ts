import { NextFunction, Response } from 'express';
import { ZodIssue } from 'zod';
import { RepositoryType } from "../../constant/CommonConst";
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../constant/HttpStatusConst";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from "../../util/ApiResponse";
import { GetFavoriteVideoFolderSelectEntity } from "../entity/GetFavoriteVideoFolderSelectEntity";
import { FolderListModel } from '../model/FolderListModel';
import { GetFavoriteVideoFolderFavoriteLevelModel } from '../model/GetFavoriteVideoFolderFavoriteLevelModel';
import { GetFavoriteVideoFolderPageModel } from "../model/GetFavoriteVideoFolderPageModel";
import { GetFavoriteVideoFolderSortIdModel } from '../model/GetFavoriteVideoFolderSortIdModel';
import { GetFavoriteVideoFolderTagNameModel } from '../model/GetFavoriteVideoFolderTagNameModel';
import { GetFavoriteVideoFolderVideoCategoryModel } from '../model/GetFavoriteVideoFolderVideoCategoryModel';
import { GetFavoriteVideoFolderViewStatusModel } from '../model/GetFavoriteVideoFolderViewStatusModel';
import { GetFavoriteVideoFolderResponseModel } from "../model/GetFavoriteVideoListResponseModel";
import { ModeModel } from '../model/ModeModel';
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

        const frontUserIdModel = req.userInfo.frontUserIdModel;

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
        const viewStatusModel = new GetFavoriteVideoFolderViewStatusModel(query.viewStatus);
        // 動画カテゴリ
        const videoCategoryId = new GetFavoriteVideoFolderVideoCategoryModel(query.videoCategory);
        // タグ
        const tagNameModel = new GetFavoriteVideoFolderTagNameModel(query.videoTag);
        // お気に入り度
        const favoriteLevelModel = new GetFavoriteVideoFolderFavoriteLevelModel(query.favoriteLevel);
        // ページ
        const pageModel = new GetFavoriteVideoFolderPageModel(query.page);
        // ソートキー
        const sortIdModel = await GetFavoriteVideoFolderSortIdModel.set(query.sortKey);
        // フォルダ
        const folderListModel = new FolderListModel(query.folder);
        // モード
        const modeModel = new ModeModel(query.mode);

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
            modeModel,
        );

        // お気に入り動画リストとフォルダリストを取得
        const [favoriteVideoList, folderList] = await Promise.all([
            this.getFavoriteVideoFolderService.getFavoriteVideoFolder(
                getFavoriteVideoFolderSelectEntity,
                GetFavoriteVideoFolderController.DEFAULT_LIST_LIMIT
            ),
            modeModel.isFolderMode() ? this.getFavoriteVideoFolderService.getFolderList(
                frontUserIdModel,
                folderIdModel,
                folderListModel,
            ) : Promise.resolve([]),
        ]);

        // ユーザーのお気に入り動画が存在しない
        if (favoriteVideoList.length === 0 && folderList.length === 0) {

            // レスポンスを作成
            const getFavoriteVideoFolderResponse: GetFavoriteVideoFolderResponseModel = this.getFavoriteVideoFolderService.createResponse(
                [],
                0,
                GetFavoriteVideoFolderController.DEFAULT_LIST_LIMIT,
                [],
            );
            return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入り動画が存在しません。`, getFavoriteVideoFolderResponse.data)
        }

        // お気に入り動画件数の取得・YouTube Data Apiからの情報付与を並列実行
        const [total, favoriteVideoListMergedList, folderListMergedList] = await Promise.all([
            this.getFavoriteVideoFolderService.getFavoriteVideoFolderCount(getFavoriteVideoFolderSelectEntity),
            this.getFavoriteVideoFolderService.mergeYouTubeDataList(favoriteVideoList),
            this.getFavoriteVideoFolderService.getFavoriteVideoFolderThumbnail(folderList),
        ]);

        // レスポンスを作成
        const getFavoriteVideoFolderResponse: GetFavoriteVideoFolderResponseModel = this.getFavoriteVideoFolderService.createResponse(
            favoriteVideoListMergedList,
            total,
            GetFavoriteVideoFolderController.DEFAULT_LIST_LIMIT,
            folderListMergedList,
        );

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画リストを取得しました。`, getFavoriteVideoFolderResponse.data);
    }
}