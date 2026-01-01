import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT } from "../../common/const/HttpStatusConst";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { authMiddleware } from "../../middleware/authMiddleware/authMiddleware";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { ApiResponse } from "../../util/ApiResponse";
import { FavoriteVideoDetailMergedModel } from "../model/FavoriteVideoDetailMergedModel";
import { GetFavoriteVideoDetialResponseModel } from "../model/GetFavoriteVideoDetialResponseModel";
import { GetFavoriteVideoDetialService } from "../service/GetFavoriteVideoDetialService";


export class GetFavoriteVideoDetialController extends RouteController {

    private readonly getFavoriteVideoDetialService = new GetFavoriteVideoDetialService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_ID,
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
        const id = req.params.id;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_ID} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteVideoDetialRepository = this.getFavoriteVideoDetialService.getGetFavoriteVideoDetialRepository();

        // お気に入り動画を取得
        const favoriteVideoList = await this.getFavoriteVideoDetialService.getFavoriteVideoDetial(
            getGetFavoriteVideoDetialRepository,
            frontUserIdModel,
            videoIdModel);

        // ユーザーのお気に入り動画が存在しない
        if (favoriteVideoList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画が登録されていません。`)
        }

        // YouTube Data Apiから動画詳細を取得する
        const youTubeVideoDetailApi = await this.getFavoriteVideoDetialService.callYouTubeDataDetailApi(videoIdModel);

        const youtubeVideoItemList = youTubeVideoDetailApi.response.items;

        // YouTube Data Apiから動画情報が取得できなかった場合
        if (youtubeVideoItemList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `YouTube上から動画が削除された可能性があります。`)
        }

        // お気に入り動画メモを取得する
        const favoriteVideoMemoList = await this.getFavoriteVideoDetialService.getFavoriteVideoMemo(
            getGetFavoriteVideoDetialRepository,
            frontUserIdModel,
            videoIdModel);

        // お気に入り動画カテゴリを取得する
        const favoriteVideoCategoryList = await this.getFavoriteVideoDetialService.getFavoriteVideoCategory(
            getGetFavoriteVideoDetialRepository,
            frontUserIdModel,
            videoIdModel);

        // 取得したデータをマージ
        const favoriteVideoDetailMergedModel = new FavoriteVideoDetailMergedModel(
            favoriteVideoList,
            favoriteVideoMemoList,
            youtubeVideoItemList,
            favoriteVideoCategoryList,
        );

        // レスポンスを作成
        const getFavoriteVideoDetialResponse = new GetFavoriteVideoDetialResponseModel(favoriteVideoDetailMergedModel);

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画を取得しました。`, getFavoriteVideoDetialResponse.data);
    }
}