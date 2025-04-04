import { Router, Request, Response, NextFunction } from 'express';
import ENV from '../../env.json';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { ZodIssue } from 'zod';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/GetVideoCommentConst';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { GetVideoCommentService } from '../service/GetVideoCommentService';
import { GetVideoCommentResponseModel } from '../model/GetVideoCommentResponseModel';


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

        const id = req.params.id;

        if (!id) {
            throw Error(`動画IDが指定されていません。`);
        }

        const videoIdModel = new VideoIdModel(id);

        // YouTube Data Apiから動画コメントを取得する
        const youTubeVideoCommentApi = await this.getVideoCommentService.callYouTubeDataCommentApi(videoIdModel);

        // レスポンスのYouTube動画
        const videoCommentResponseModel = new GetVideoCommentResponseModel(youTubeVideoCommentApi);

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, videoCommentResponseModel.data);
    }
}