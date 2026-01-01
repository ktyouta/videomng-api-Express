import { Request, Response } from 'express';
import { ZodIssue } from 'zod';
import { HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../common/const/HttpStatusConst';
import { YouTubeDataApiCommentThreadNextPageToken } from '../../external/youtubedataapi/videocomment/properties/YouTubeDataApiCommentThreadNextPageToken';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiResponse } from '../../util/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/GetVideoCommentConst';
import { GetVideoCommentResponseModel } from '../model/GetVideoCommentResponseModel';
import { RequestPathParamSchema } from '../schema/RequestPathParamSchema';
import { RequestQuerySchema } from '../schema/RequestQuerySchema';
import { GetVideoCommentService } from '../service/GetVideoCommentService';


export class GetVideoCommentController extends RouteController {

    private getVideoCommentService = new GetVideoCommentService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.VIDEO_COMMENT_ID
        );
    }


    /**
     * 動画コメントを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response) {

        // パスパラメータのバリデーションチェック
        const pathValidateResult = RequestPathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER}`);
        }

        // パスパラメータ
        const param = pathValidateResult.data;

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

        const videoIdModel = new VideoIdModel(param.videoId);

        // YouTube Data Apiから動画コメントを取得する
        const youTubeVideoCommentApi = await this.getVideoCommentService.callYouTubeDataCommentApi(videoIdModel, nextPageTokenModel);

        // レスポンスのYouTube動画
        const videoCommentResponseModel = new GetVideoCommentResponseModel(youTubeVideoCommentApi);

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, videoCommentResponseModel.data);
    }
}