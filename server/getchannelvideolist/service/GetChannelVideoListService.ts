import { FavoriteVideoTransaction } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenModel } from '../../accesstoken/model/AccessTokenModel';
import { FLG } from '../../common/const/CommonConst';
import { YouTubeDataApiChannelEndPointModel } from '../../external/youtubedataapi/channel/model/YouTubeDataApiChannelEndPointModel';
import { YouTubeDataApiChannelModel } from '../../external/youtubedataapi/channel/model/YouTubeDataApiChannelModel';
import { YouTubeDataApiChannelId } from '../../external/youtubedataapi/channel/properties/YouTubeDataApiChannelId';
import { YouTubeDataApiChannelItemType } from '../../external/youtubedataapi/channel/type/YouTubeDataApiChannelItemType';
import { YouTubeDataApiPlaylistEndPointModel } from '../../external/youtubedataapi/playlist/model/YouTubeDataApiPlaylistEndPointModel';
import { YouTubeDataApiPlaylistModel } from '../../external/youtubedataapi/playlist/model/YouTubeDataApiPlaylistModel';
import { YouTubeDataApiPlaylistId } from '../../external/youtubedataapi/playlist/properties/YouTubeDataApiPlaylistId';
import { YouTubeDataApiPlaylistMaxResult } from '../../external/youtubedataapi/playlist/properties/YouTubeDataApiPlaylistMaxResult';
import { YouTubeDataApiPlaylistNextPageToken } from '../../external/youtubedataapi/playlist/properties/YouTubeDataApiVideoListNextPageToken';
import { YouTubeDataApiPlaylistItemType } from '../../external/youtubedataapi/playlist/type/YouTubeDataApiPlaylistItemType';
import { YouTubeDataApiPlaylistResponseType } from '../../external/youtubedataapi/playlist/type/YouTubeDataApiPlaylistResponseType';
import { YouTubeDataApiVideoListItemType } from '../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListItemType';
import { HeaderModel } from '../../header/model/HeaderModel';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { GetChannelVideoListSelectEntity } from '../entity/GetChannelVideoListSelectEntity';
import { GetChannelVideoListRepositoryInterface } from '../repository/interface/GetChannelVideoListRepositoryInterface';
import { GetChannelVideoListItemType } from '../type/GetChannelVideoListItemType';
import { GetChannelVideoListResponseType } from '../type/GetChannelVideoListResponseType';


export class GetChannelVideoListService {

    constructor(private readonly repository: GetChannelVideoListRepositoryInterface) { }

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
     * お気に入り動画チェック
     * @param convertedChannelVideoList 
     * @param jsonWebTokenUserModel 
     * @returns 
     */
    public async checkFavorite(convertedChannelVideoList: GetChannelVideoListResponseType,
        accessTokenModel: AccessTokenModel,
    ) {

        // ユーザーID
        const userIdModel = FrontUserIdModel.fromHAccessToken(accessTokenModel);

        // お気に入り動画取得用Entity
        const getVideoDetialSelectEntity = new GetChannelVideoListSelectEntity(userIdModel);

        // お気に入り動画を取得
        const favoriteChannelVideoList = await this.repository.selectVideo(getVideoDetialSelectEntity);

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

    /**
     * アクセストークン取得
     * @param req 
     * @returns 
     */
    getAccessToken(req: Request) {

        const headerModel = new HeaderModel(req);
        const accessTokenModel = AccessTokenModel.get(headerModel);

        return accessTokenModel
    }
}