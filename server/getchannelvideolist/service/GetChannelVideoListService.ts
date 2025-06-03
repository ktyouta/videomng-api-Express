import { FavoriteVideoTransaction } from '@prisma/client';
import { YouTubeDataApiChannelId } from '../../external/youtubedataapi/channel/properties/YouTubeDataApiChannelId';
import { YouTubeDataApiChannelEndPointModel } from '../../external/youtubedataapi/channel/model/YouTubeDataApiChannelEndPointModel';
import { YouTubeDataApiChannelModel } from '../../external/youtubedataapi/channel/model/YouTubeDataApiChannelModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { YouTubeDataApiPlaylistEndPointModel } from '../../external/youtubedataapi/playlist/model/YouTubeDataApiPlaylistEndPointModel';
import { YouTubeDataApiPlaylistId } from '../../external/youtubedataapi/playlist/properties/YouTubeDataApiPlaylistId';
import { YouTubeDataApiVideoListNextPageToken } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListNextPageToken';
import { YouTubeDataApiPlaylistMaxResult } from '../../external/youtubedataapi/playlist/properties/YouTubeDataApiPlaylistMaxResult';
import { YouTubeDataApiPlaylistNextPageToken } from '../../external/youtubedataapi/playlist/properties/YouTubeDataApiVideoListNextPageToken';
import { YouTubeDataApiPlaylistModel } from '../../external/youtubedataapi/playlist/model/YouTubeDataApiPlaylistModel';
import { YouTubeDataApiPlaylistResponseType } from '../../external/youtubedataapi/playlist/type/YouTubeDataApiPlaylistResponseType';
import { YouTubeDataApiPlaylistItemType } from '../../external/youtubedataapi/playlist/type/YouTubeDataApiPlaylistItemType';
import { Router, Request, Response, NextFunction } from 'express';
import { CookieModel } from '../../cookie/model/CookieModel';
import { JsonWebTokenModel } from '../../jsonwebtoken/model/JsonWebTokenModel';
import { JsonWebTokenUserModel } from '../../jsonwebtoken/model/JsonWebTokenUserModel';
import { GetChannelVideoListResponseType } from '../type/GetChannelVideoListResponseType';
import { FLG, RepositoryType } from '../../util/const/CommonConst';
import { GetChannelVideoListItemType } from '../type/GetChannelVideoListItemType';
import { YouTubeDataApiVideoListItemType } from '../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListItemType';
import { GetChannelVideoListRepositorys } from '../repository/GetChannelVideoListRepositorys';
import { GetChannelVideoListSelectEntity } from '../entity/GetChannelVideoListSelectEntity';
import { YouTubeDataApiChannelResponseType } from '../../external/youtubedataapi/channel/type/YouTubeDataApiChannelResponseType';
import { YouTubeDataApiChannelItemType } from '../../external/youtubedataapi/channel/type/YouTubeDataApiChannelItemType';


export class GetChannelVideoListService {


    /**
     * YouTube Data Api(チャンネル)を呼び出す
     * @param keyword 
     */
    public async callYouTubeDataChannelApi(youTubeDataApiChannelId: YouTubeDataApiChannelId) {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiChannelEndPointModel = new YouTubeDataApiChannelEndPointModel(youTubeDataApiChannelId);

            // YouTube Data APIデータ取得
            const channelVideoList = await YouTubeDataApiChannelModel.call(youTubeDataApiChannelEndPointModel);

            return channelVideoList;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.CHANNEL_VIDEO_INFO_ID}`);
        }
    }


    /**
     * YouTube Data Api(プレイリスト)を呼び出す
     * @param keyword 
     */
    public async callYouTubeDataPlaylistApi(playlistIdModel: YouTubeDataApiPlaylistId,
        nextPageTokenModel: YouTubeDataApiPlaylistNextPageToken,
    ) {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiPlaylistEndPointModel = new YouTubeDataApiPlaylistEndPointModel(
                playlistIdModel,
                new YouTubeDataApiPlaylistMaxResult(),
                nextPageTokenModel
            );

            // YouTube Data APIデータ取得
            const playlist = await YouTubeDataApiPlaylistModel.call(youTubeDataApiPlaylistEndPointModel);

            return playlist;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.CHANNEL_VIDEO_INFO_ID}`);
        }
    }


    /**
     * 動画情報をフィルターする
     * @param youTubeChannelVideoListApi 
     */
    public filterVideoList(playlistReponse: YouTubeDataApiPlaylistResponseType) {

        const filterdVideoList: YouTubeDataApiPlaylistResponseType = {
            ...playlistReponse,
            items: playlistReponse.items.filter((e: YouTubeDataApiPlaylistItemType) => {
                return !!e.snippet.resourceId.videoId;
            })
        };

        return filterdVideoList;
    }

    /**
     * Youtube Data APIから取得した動画一覧の型を変換する
     * @param youTubeVideoDetailApi 
     * @returns 
     */
    public convertChannelVideoList(filterdVideoListResponse: YouTubeDataApiPlaylistResponseType,
        channelItem: YouTubeDataApiChannelItemType
    ) {

        const channelSnipet = channelItem.snippet;

        const convertedChannelVideoList: GetChannelVideoListResponseType = {
            ...filterdVideoListResponse,
            channelInfo: {
                channelTitle: channelSnipet.title,
                channelIcons: channelSnipet.thumbnails,
            },
            items: filterdVideoListResponse.items.map((e: YouTubeDataApiPlaylistItemType) => {

                const snippet = e.snippet;
                const thumbnails = snippet.thumbnails;

                const youTubeDataApiPlaylistItem: YouTubeDataApiVideoListItemType = {
                    kind: e.kind,
                    etag: e.etag,
                    id: {
                        kind: ``,
                        videoId: e.snippet.resourceId.videoId
                    },
                    snippet: {
                        publishedAt: snippet.publishedAt,
                        channelId: '',
                        title: snippet.title,
                        description: snippet.description,
                        thumbnails: {
                            default: {
                                url: thumbnails.default?.url ?? ``,
                                width: thumbnails.default?.width ?? 0,
                                height: thumbnails.default?.height ?? 0,
                            },
                            medium: {
                                url: thumbnails.medium?.url ?? ``,
                                width: thumbnails.medium?.width ?? 0,
                                height: thumbnails.medium?.height ?? 0,
                            },
                            high: {
                                url: thumbnails.high?.url ?? ``,
                                width: thumbnails.high?.width ?? 0,
                                height: thumbnails.high?.height ?? 0,
                            }
                        },
                        channelTitle: snippet.channelTitle,
                        liveBroadcastContent: ''
                    }
                }

                return {
                    ...youTubeDataApiPlaylistItem,
                    favoriteFlg: FLG.OFF
                }
            })
        }

        return convertedChannelVideoList;
    }


    /**
     * jwtを取得
     * @param req 
     * @returns 
     */
    public getToken(req: Request) {

        const cookieModel = new CookieModel(req);
        const jsonWebTokenModel = new JsonWebTokenModel(cookieModel);

        return jsonWebTokenModel.token;
    }


    /**
     * jwtからユーザー情報を取得
     * @param req 
     * @returns 
     */
    public checkJwtVerify(req: Request) {

        try {

            const cookieModel = new CookieModel(req);
            const jsonWebTokenUserModel = JsonWebTokenUserModel.get(cookieModel);

            return jsonWebTokenUserModel;
        } catch (err) {
            throw Error(`動画一覧取得時の認証エラー ERROR:${err}`);
        }
    }


    /**
     * お気に入り動画チェック
     * @param convertedChannelVideoList 
     * @param jsonWebTokenUserModel 
     * @returns 
     */
    public async checkFavorite(convertedChannelVideoList: GetChannelVideoListResponseType,
        jsonWebTokenUserModel: JsonWebTokenUserModel,
    ) {

        // ユーザーID
        const frontUserIdModel = jsonWebTokenUserModel.frontUserIdModel;
        const getChannelVideoListRepositorys = (new GetChannelVideoListRepositorys()).get(RepositoryType.POSTGRESQL);

        // お気に入り動画取得用Entity
        const getVideoDetialSelectEntity = new GetChannelVideoListSelectEntity(frontUserIdModel);

        // お気に入り動画を取得
        const favoriteChannelVideoList = await getChannelVideoListRepositorys.selectVideo(getVideoDetialSelectEntity);

        // お気に入り動画登録チェック
        const videoDetailItems: GetChannelVideoListItemType[] = convertedChannelVideoList.items.map((e: GetChannelVideoListItemType) => {

            // お気に入り動画に登録済み
            const favoriteVideo = favoriteChannelVideoList.find((e1: FavoriteVideoTransaction) => {
                return e1.videoId === e.id.videoId;
            });

            return {
                ...e,
                favoriteFlg: !!favoriteVideo ? FLG.ON : FLG.OFF
            }
        });

        const videoDetail: GetChannelVideoListResponseType = {
            ...convertedChannelVideoList,
            items: videoDetailItems
        }

        return videoDetail;
    }
}