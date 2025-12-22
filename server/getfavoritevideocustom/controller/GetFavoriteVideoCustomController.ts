import { NextFunction, Response } from 'express';
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { authMiddleware } from "../../middleware/authMiddleware";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { RepositoryType } from "../../util/const/CommonConst";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { FavoriteVideoCustomMergedModel } from "../model/FavoriteVideoCustomMergedModel";
import { GetFavoriteVideoCustomResponseModel } from "../model/GetFavoriteVideoCustomResponseModel";
import { GetFavoriteVideoCustomRepositorys } from "../repository/GetFavoriteVideoCustomRepositorys";
import { GetFavoriteVideoCustomService } from "../service/GetFavoriteVideoCustomService";


export class GetFavoriteVideoCustomController extends RouteController {

    private readonly getFavoriteVideoCustomService = new GetFavoriteVideoCustomService((new GetFavoriteVideoCustomRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_CUSTOM,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画カスタム情報を取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.jsonWebTokenUserModel.frontUserIdModel;
        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_CUSTOM} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // お気に入り動画を取得
        const favoriteVideoList = await this.getFavoriteVideoCustomService.getFavoriteVideoCustom(
            frontUserIdModel,
            videoIdModel);

        // ユーザーのお気に入り動画が存在しない
        if (favoriteVideoList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画が登録されていません。`)
        }

        // お気に入り動画メモを取得する
        const favoriteVideoMemoList = await this.getFavoriteVideoCustomService.getFavoriteVideoMemo(
            frontUserIdModel,
            videoIdModel);

        // お気に入り動画カテゴリを取得する
        const favoriteVideoCategoryList = await this.getFavoriteVideoCustomService.getFavoriteVideoCategory(
            frontUserIdModel,
            videoIdModel);

        // お気に入り動画タグを取得する
        const favoriteVideoTagList = await this.getFavoriteVideoCustomService.getFavoriteVideoTagList(
            frontUserIdModel,
            videoIdModel);

        // 取得したデータをマージ
        const favoriteVideoCustomMergedModel = new FavoriteVideoCustomMergedModel(
            favoriteVideoList,
            favoriteVideoMemoList,
            favoriteVideoCategoryList,
            favoriteVideoTagList,
        );

        // レスポンスを作成
        const getFavoriteVideoCustomResponse = new GetFavoriteVideoCustomResponseModel(favoriteVideoCustomMergedModel);

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画カスタム情報を取得しました。`, getFavoriteVideoCustomResponse.data);
    }
}