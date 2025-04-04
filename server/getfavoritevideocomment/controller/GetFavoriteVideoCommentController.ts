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
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { GetFavoriteVideoCommentService } from '../service/GetFavoriteVideoCommentService';
import { GetFavoriteVideoCommentResponseModel } from '../model/GetFavoriteVideoCommentResponseModel';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { FilterdBlockCommentModel } from '../model/FilterdBlockCommentModel';
import { FavoriteVideoCommentResponseDataModel } from '../model/FavoriteVideoCommentResponseDataModel2';


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