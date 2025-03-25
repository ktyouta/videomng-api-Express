import { Router, Request, Response, NextFunction } from 'express';
import ENV from '../../env.json';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { ZodIssue } from 'zod';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/GetFavoriteVideoCommentConst';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { VideoIdModel } from '../../internaldata/favoritevideotransaction/properties/VideoIdModel';
import { GetFavoriteVideoCommentService } from '../service/GetFavoriteVideoCommentService';
import { GetFavoriteVideoCommentResponseModel } from '../model/GetFavoriteVideoCommentResponseModel';
import { FrontUserIdModel } from '../../internaldata/frontuserinfomaster/properties/FrontUserIdModel';


export class GetFavoriteVideoCommentController extends RouteController {

    private getFavoriteVideoCommentService = new GetFavoriteVideoCommentService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_COMMENT_ID
        );
    }


    /**
     * お気に入り動画コメントを取得する
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

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFavoriteVideoCommentService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // YouTube Data Apiから動画コメントを取得する
        const youTubeFavoriteVideoCommentApi = await this.getFavoriteVideoCommentService.callYouTubeDataCommentApi(videoIdModel);

        // ブロックコメントリストを取得する

        // レスポンスのYouTube動画
        const favoriteVideoCommentResponseModel = new GetFavoriteVideoCommentResponseModel(youTubeFavoriteVideoCommentApi);

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, favoriteVideoCommentResponseModel.data);
    }
}