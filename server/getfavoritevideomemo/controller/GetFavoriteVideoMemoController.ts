import { NextFunction, Response } from 'express';
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { authMiddleware } from "../../middleware/authMiddleware/authMiddleware";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { HTTP_STATUS_CREATED } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { GetFavoriteVideoMemoResponseModel } from "../model/GetFavoriteVideoMemoResponseModel";
import { GetFavoriteVideoMemoService } from "../service/GetFavoriteVideoMemoService";


export class GetFavoriteVideoMemoController extends RouteController {

    private readonly getFavoriteVideoMemoService = new GetFavoriteVideoMemoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_MEMO,
            [authMiddleware]
        );
    }

    /**
     * お気に入り動画メモを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.frontUserIdModel;
        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_ID} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteVideoMemoRepository = this.getFavoriteVideoMemoService.getGetFavoriteVideoMemoRepository();

        // お気に入り動画メモを取得する
        const favoriteVideoMemoList = await this.getFavoriteVideoMemoService.getFavoriteVideoMemo(
            getGetFavoriteVideoMemoRepository,
            frontUserIdModel,
            videoIdModel);

        // レスポンスを作成
        const getFavoriteVideoMemoResponse = new GetFavoriteVideoMemoResponseModel(favoriteVideoMemoList);

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画メモを取得しました。`, getFavoriteVideoMemoResponse.data);
    }
}