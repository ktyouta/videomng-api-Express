import { Response } from 'express';
import { ZodIssue } from 'zod';
import { YouTubeDataApiCommentThreadNextPageToken } from '../../external/youtubedataapi/videocomment/properties/YouTubeDataApiCommentThreadNextPageToken';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { authMiddleware } from '../../middleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/GetFavoriteVideoCommentConst';
import { FavoriteVideoCommentResponseDataModel } from '../model/FavoriteVideoCommentResponseDataModel2';
import { FilterdBlockCommentModel } from '../model/FilterdBlockCommentModel';
import { GetFavoriteVideoCommentResponseModel } from '../model/GetFavoriteVideoCommentResponseModel';
import { RequestPathParamSchema } from '../schema/RequestPathParamSchema';
import { RequestQuerySchema } from '../schema/RequestQuerySchema';
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

        // パスパラメータのバリデーションチェック
        const pathValidateResult = RequestPathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message}`);
        }

        // パスパラメータ
        const param = pathValidateResult.data;
        const videoIdModel = new VideoIdModel(param.videoId);

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

        // 次コメント取得トークン
        const nextPageTokenModel = new YouTubeDataApiCommentThreadNextPageToken(query.nextpagetoken);

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