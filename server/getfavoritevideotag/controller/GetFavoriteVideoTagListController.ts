import { NextFunction, Response } from 'express';
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { authMiddleware } from "../../middleware/authMiddleware/authMiddleware";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { GetFavoriteVideoTagListResponseModel } from "../model/GetFavoriteVideoTagListResponseModel";
import { GetFavoriteVideoTagListService } from "../service/GetFavoriteVideoTagListService";


export class GetFavoriteVideoTagListController extends RouteController {

    private readonly getFavoriteVideoTagListService = new GetFavoriteVideoTagListService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_TAG_ID,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画タグリストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.frontUserIdModel;
        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_TAG_ID} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // お気に入り動画タグリストを取得
        const favoriteVideoTagList = await this.getFavoriteVideoTagListService.getFavoriteVideoTagList(frontUserIdModel, videoIdModel);

        // ユーザーのお気に入り動画タグリストが存在しない
        if (favoriteVideoTagList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画タグリストが登録されていません。`);
        }

        // レスポンスを作成
        const getFavoriteVideoTagListResponse = new GetFavoriteVideoTagListResponseModel(favoriteVideoTagList);

        return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入り動画タグリストを取得しました。`, getFavoriteVideoTagListResponse.data);
    }
}