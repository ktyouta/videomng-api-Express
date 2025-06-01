import { Router, Request, Response, NextFunction } from 'express';
import ENV from '../../env.json';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { ZodIssue } from 'zod';
import { ApiResponse } from '../../util/service/ApiResponse';
import { GetChannelVideoListService } from '../service/GetChannelVideoListService';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { SUCCESS_MESSAGE } from '../const/GetVideoListConst';
import { YouTubeDataApiChannelId } from '../../external/youtubedataapi/channel/properties/YouTubeDataApiChannelId';
import { YouTubeDataApiPlaylistId } from '../../external/youtubedataapi/playlist/properties/YouTubeDataApiPlaylistId';
import { YouTubeDataApiVideoListNextPageToken } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListNextPageToken';
import { YouTubeDataApiPlaylistNextPageToken } from '../../external/youtubedataapi/playlist/properties/YouTubeDataApiVideoListNextPageToken';
import { YouTubeDataApiPlaylistItemType } from '../../external/youtubedataapi/playlist/type/YouTubeDataApiPlaylistItemType';
import { YouTubeDataApiPlaylistModel } from '../../external/youtubedataapi/playlist/model/YouTubeDataApiPlaylistModel';
import { YouTubeDataApiPlaylistResponseType } from '../../external/youtubedataapi/playlist/type/YouTubeDataApiPlaylistResponseType';


export class GetChannelVideoListController extends RouteController {

    private getChannelVideoListService = new GetChannelVideoListService();

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

        const id = req.params.id;

        if (!id) {
            throw Error(`チャンネルIDが指定されていません。`);
        }

        // クエリパラメータを取得
        const query = req.query;

        // 次データ取得用トークンを取得
        const nextPageToken = query[`nextpagetoken`] as string;
        const nextPageTokenModel = new YouTubeDataApiPlaylistNextPageToken(nextPageToken);

        // チャンネルID
        const channelIdModel = new YouTubeDataApiChannelId(id);

        // YouTube Data Apiからチャンネル情報を取得する
        const channelVideoList = await this.getChannelVideoListService.callYouTubeDataChannelApi(channelIdModel);

        if (!channelVideoList || !channelVideoList.response) {
            throw Error(`チャンネル情報の取得に失敗しました。`);
        }

        const channelResponse = channelVideoList.response;

        // チャンネル情報が存在しない
        if (!channelResponse.items || channelResponse.items.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_OK, `チャンネル情報が存在しません。`)
        }

        const playlistId = channelResponse.items[0].contentDetails.relatedPlaylists.uploads;
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
        let convertedChannelVideoList = this.getChannelVideoListService.convertChannelVideoList(filterdVideoListResponse);

        // jwt取得
        const token = this.getChannelVideoListService.getToken(req);

        // ログインしている場合はお気に入りチェックを実施
        if (token) {
            const jsonWebTokenUserModel = await this.getChannelVideoListService.checkJwtVerify(req);

            // お気に入り登録チェック
            convertedChannelVideoList = await this.getChannelVideoListService.checkFavorite(convertedChannelVideoList, jsonWebTokenUserModel);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, convertedChannelVideoList);
    }
}