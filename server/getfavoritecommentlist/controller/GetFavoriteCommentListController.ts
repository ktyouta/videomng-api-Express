import { NextFunction, Response } from 'express';
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { authMiddleware } from "../../middleware/authMiddleware";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { GetFavoriteCommentListResponseModel } from "../model/GetFavoriteCommentListResponseModel";
import { GetFavoriteCommentListService } from "../service/GetFavoriteCommentListService";


export class GetFavoriteCommentListController extends RouteController {

    private readonly getFavoriteCommentListService = new GetFavoriteCommentListService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_COMMENT,
            [authMiddleware]
        );
    }

    /**
     * お気に入りコメントリストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.jsonWebTokenUserModel.frontUserIdModel;
        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_COMMENT} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // お気に入りコメントリストを取得
        const favoriteCommentList = await this.getFavoriteCommentListService.getFavoriteCommentList(frontUserIdModel, videoIdModel);

        // ユーザーのお気に入りコメントが存在しない
        if (favoriteCommentList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入りコメントが登録されていません。`);
        }

        // お気に入りコメントリストからYouTube Data Apiの情報を取得してマージする
        const youTubeDataApiCommentDetailModel = await this.getFavoriteCommentListService.getYouTubeVideoCommentList(favoriteCommentList);

        // レスポンスを作成
        const getFavoriteCommentListResponse = new GetFavoriteCommentListResponseModel(youTubeDataApiCommentDetailModel);

        return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入りコメントリストを取得しました。`, getFavoriteCommentListResponse.data);
    }
}