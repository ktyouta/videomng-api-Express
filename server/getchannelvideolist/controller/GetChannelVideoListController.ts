import { Request, Response } from 'express';
import { ZodIssue } from 'zod';
import { YouTubeDataApiChannelId } from '../../external/youtubedataapi/channel/properties/YouTubeDataApiChannelId';
import { YouTubeDataApiPlaylistModel } from '../../external/youtubedataapi/playlist/model/YouTubeDataApiPlaylistModel';
import { YouTubeDataApiPlaylistId } from '../../external/youtubedataapi/playlist/properties/YouTubeDataApiPlaylistId';
import { YouTubeDataApiPlaylistNextPageToken } from '../../external/youtubedataapi/playlist/properties/YouTubeDataApiVideoListNextPageToken';
import { YouTubeDataApiPlaylistItemType } from '../../external/youtubedataapi/playlist/type/YouTubeDataApiPlaylistItemType';
import { YouTubeDataApiPlaylistResponseType } from '../../external/youtubedataapi/playlist/type/YouTubeDataApiPlaylistResponseType';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { RepositoryType } from '../../util/const/CommonConst';
import { HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/GetVideoListConst';
import { GetChannelVideoListRepositorys } from '../repository/GetChannelVideoListRepositorys';
import { RequestPathParamSchema } from '../schema/RequestPathParamSchema';
import { RequestQuerySchema } from '../schema/RequestQuerySchema';
import { GetChannelVideoListService } from '../service/GetChannelVideoListService';
import { GetChannelVideoListResponseType } from '../type/GetChannelVideoListResponseType';


export class GetChannelVideoListController extends RouteController {

    private readonly getChannelVideoListService = new GetChannelVideoListService((new GetChannelVideoListRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.CHANNEL_VIDEO_INFO_ID
        );
    }


    /**
     * チャンネルの動画リストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response) {

        // パスパラメータのバリデーションチェック
        const pathValidateResult = RequestPathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message}`);
        }

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

        // パスパラメータ
        const param = pathValidateResult.data;
        // クエリパラメータ
        const query = validateResult.data;

        // 次データ取得用トークン
        const nextPageTokenModel = new YouTubeDataApiPlaylistNextPageToken(query.nextpagetoken);
        // チャンネルID
        const channelIdModel = new YouTubeDataApiChannelId(param.id);

        // YouTube Data Apiからチャンネル情報を取得する
        const channelVideoList = await this.getChannelVideoListService.callYouTubeDataChannelApi(channelIdModel);

        if (!channelVideoList || !channelVideoList.response) {
            throw Error(`チャンネル情報の取得に失敗しました。`);
        }

        const channelResponse = channelVideoList.response;
        const channelItems = channelResponse.items;

        // チャンネル情報が存在しない
        if (!channelItems || channelItems.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_OK, `チャンネル情報が存在しません。`)
        }

        const playlistId = channelItems[0].contentDetails.relatedPlaylists.uploads;
        const playlistIdModel = new YouTubeDataApiPlaylistId(playlistId);

        // YouTube Data Apiからプレイリストを取得する
        const playlist: YouTubeDataApiPlaylistModel = await this.getChannelVideoListService.callYouTubeDataPlaylistApi(
            playlistIdModel,
            nextPageTokenModel,
        );

        if (!playlist || !playlist.response) {
            throw Error(`動画の取得に失敗しました。`);
        }

        const playlistReponse: YouTubeDataApiPlaylistResponseType = playlist.response;
        const videoList: YouTubeDataApiPlaylistItemType[] = playlistReponse.items;

        // プレイリストが存在しない
        if (!videoList || videoList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_OK, `動画が存在しません。`)
        }

        // 動画IDの存在しない動画をフィルターする
        const filterdVideoListResponse = this.getChannelVideoListService.filterVideoList(playlistReponse);

        // レスポンス用に型を変換する
        let convertedChannelVideoList: GetChannelVideoListResponseType = this.getChannelVideoListService.convertChannelVideoList(
            filterdVideoListResponse,
            channelResponse.items[0]
        );

        try {

            // アクセストークン取得
            const accessTokenModel = this.getChannelVideoListService.getAccessToken(req);

            // ログインしている場合はお気に入りチェックを実施
            if (accessTokenModel.token) {

                // お気に入り登録チェック
                convertedChannelVideoList = await this.getChannelVideoListService.checkFavorite(convertedChannelVideoList, accessTokenModel);
            }
        } catch (err) { }

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, convertedChannelVideoList);
    }
}