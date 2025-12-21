import { Response } from 'express';
import { YouTubeDataApiCommentThreadNextPageToken } from '../../external/youtubedataapi/videocomment/properties/YouTubeDataApiCommentThreadNextPageToken';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { authMiddleware } from '../../middleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { HTTP_STATUS_OK } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/GetFavoriteVideoCommentConst';
import { FavoriteVideoCommentResponseDataModel } from '../model/FavoriteVideoCommentResponseDataModel2';
import { FilterdBlockCommentModel } from '../model/FilterdBlockCommentModel';
import { GetFavoriteVideoCommentResponseModel } from '../model/GetFavoriteVideoCommentResponseModel';
import { GetFavoriteVideoCommentService } from '../service/GetFavoriteVideoCommentService';


export class GetFavoriteVideoCommentController extends RouteController {

    private getFavoriteVideoCommentService = new GetFavoriteVideoCommentService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_COMMENT,
            [authMiddleware]
        );
    }


    /**
     * お気に入り動画コメントを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response) {

        const frontUserIdModel = req.jsonWebTokenUserModel.frontUserIdModel;
        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。`);
        }

        const videoIdModel = new VideoIdModel(id);

        // クエリパラメータ
        const query = req.query;

        // 次コメント取得トークン
        const nextPageToken = query[`nextpagetoken`] as string;
        const nextPageTokenModel = new YouTubeDataApiCommentThreadNextPageToken(nextPageToken);

        // YouTube Data Apiから動画コメントを取得する
        const youTubeFavoriteVideoCommentApi = await this.getFavoriteVideoCommentService.callYouTubeDataCommentApi(
            videoIdModel,
            nextPageTokenModel
        );

        // 永続ロジック用オブジェクトを取得
        const getFavoriteVideoCommentRepository = this.getFavoriteVideoCommentService.getGetFavoriteVideoCommentRepository();

        // ブロックコメントリストを取得する
        const blockComment = await this.getFavoriteVideoCommentService.getBlockComment(
            getFavoriteVideoCommentRepository,
            frontUserIdModel
        );

        // ブロックコメントをフィルターする
        const filterdBlockCommentModel = new FilterdBlockCommentModel(
            youTubeFavoriteVideoCommentApi,
            blockComment,
        );

        // お気に入りコメントを取得する
        const favoriteComment = await this.getFavoriteVideoCommentService.getFavoriteComment(
            getFavoriteVideoCommentRepository,
            frontUserIdModel
        );

        // お気に入りステータスをチェックする
        const favoriteVideoCommentResponseDataModel = new FavoriteVideoCommentResponseDataModel(
            filterdBlockCommentModel,
            favoriteComment,
        );

        // レスポンス
        const favoriteVideoCommentResponseModel = new GetFavoriteVideoCommentResponseModel(favoriteVideoCommentResponseDataModel);

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, favoriteVideoCommentResponseModel.data);
    }
}