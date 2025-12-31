import { Request, Response } from 'express';
import { ZodIssue } from 'zod';
import { YouTubeDataApiVideoListKeyword } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListKeyword';
import { YouTubeDataApiVideoListNextPageToken } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListNextPageToken';
import { YouTubeDataApiVideoListVideoCategoryId } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoCategoryId';
import { YouTubeDataApiVideoListVideoType } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoType';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { RepositoryType } from '../../util/const/CommonConst';
import { HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/GetVideoListConst';
import { GetVideoListRepositorys } from '../repository/GetVideoListRepositorys';
import { RequestQuerySchema } from '../schema/RequestQuerySchema';
import { GetVideoListService } from '../service/GetVideoListService';


export class GetVideoListController extends RouteController {

    private readonly getVideoListService = new GetVideoListService((new GetVideoListRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.VIDEO_INFO
        );
    }


    /**
     * 動画リストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response) {

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

        // キーワード
        const youTubeDataApiVideoListKeyword = new YouTubeDataApiVideoListKeyword(query.q);
        // 動画種別
        const youTubeDataApiVideoListVideoType = new YouTubeDataApiVideoListVideoType(query.videoType);
        // 次データ取得用トークン
        const youTubeDataApiVideoListNextPageToken = new YouTubeDataApiVideoListNextPageToken(query.nextPageToken);
        // 動画カテゴリ
        const youTubeDataApiVideoListVideoCategoryId = new YouTubeDataApiVideoListVideoCategoryId(query.videoCategory);

        // YouTube Data Apiから動画を取得する
        const youTubeVideoListApi = await this.getVideoListService.callYouTubeDataListApi(
            youTubeDataApiVideoListKeyword,
            youTubeDataApiVideoListVideoType,
            youTubeDataApiVideoListNextPageToken,
            youTubeDataApiVideoListVideoCategoryId,
        );

        // 動画IDの存在しない動画をフィルターする
        const filterdYouTubeVideoList = this.getVideoListService.filterVideoList(youTubeVideoListApi);

        // レスポンス用に型を変換する
        let convertedVideoList = this.getVideoListService.convertVideoList(filterdYouTubeVideoList);

        try {

            // アクセストークン取得
            const accessTokenModel = this.getVideoListService.getAccessToken(req);

            // ログインしている場合はお気に入りチェックを実施
            if (accessTokenModel.token) {

                // お気に入り登録チェック
                convertedVideoList = await this.getVideoListService.checkFavorite(convertedVideoList, accessTokenModel);
            }
        } catch (err) { }

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, convertedVideoList);
    }
}