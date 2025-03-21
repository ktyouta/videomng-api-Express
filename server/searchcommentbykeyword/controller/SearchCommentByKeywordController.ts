import { Router, Request, Response, NextFunction } from 'express';
import ENV from '../../env.json';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { ZodIssue } from 'zod';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/SearchCommentByKeywordConst';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { VideoType, YouTubeDataApiVideoListVideoType } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoType';
import { YouTubeDataApiVideoListKeyword } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListKeyword';
import { SearchCommentByKeywordService } from '../service/SearchCommentByKeywordService';
import { SearchCommentByKeywordQueryParameterSchema } from '../model/SearchCommentByKeywordQueryParameterSchema';
import { SearchCommentByKeywordResponseModel } from '../model/SearchCommentByKeywordResponseModel';
import { VideoIdModel } from '../../internaldata/favoritevideotransaction/properties/VideoIdModel';
import { SearchCommentByKeywordKeywordModel } from '../model/SearchCommentByKeywordKeywordModel';


export class SearchCommentByKeywordController extends RouteController {

    private searchCommentByKeywordService = new SearchCommentByKeywordService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.SEARCH_COMMENT_BY_KEYWORD
        );
    }


    /**
     * キーワード検索(コメント)
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response) {

        // クエリパラメータを取得
        const query = req.query;

        // クエリパラメータのバリデーションチェック
        const validateResult = SearchCommentByKeywordQueryParameterSchema.safeParse(query);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // キーワードを取得
        const keyword = query[`q`] as string;
        const searchCommentByKeywordKeywordModel = new SearchCommentByKeywordKeywordModel(keyword);

        // 動画IDを取得
        const videoId = query[`videoId`] as string;
        const videoIdModel = new VideoIdModel(videoId);

        // 動画コメントを取得
        const commentList = await this.searchCommentByKeywordService.getCommentList(
            videoIdModel
        );

        // 取得したコメントをフィルター
        const filterdCommentList = this.searchCommentByKeywordService.filterComment(commentList, searchCommentByKeywordKeywordModel);

        // レスポンスのYouTube動画
        const searchCommentByKeywordResponseModel = new SearchCommentByKeywordResponseModel(filterdCommentList);

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, searchCommentByKeywordResponseModel.data);
    }
}