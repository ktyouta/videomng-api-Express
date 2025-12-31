import { FavoriteVideoTransaction } from '@prisma/client';
import { Request } from 'express';
import { AccessTokenModel } from '../../accesstoken/model/AccessTokenModel';
import { YouTubeDataApiVideoListEndPointModel } from '../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListEndPointModel';
import { YouTubeDataApiVideoListModel } from '../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListModel';
import { YouTubeDataApiVideoListKeyword } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListKeyword';
import { YouTubeDataApiVideoListMaxResult } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListMaxResult';
import { YouTubeDataApiVideoListNextPageToken } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListNextPageToken';
import { YouTubeDataApiVideoListVideoCategoryId } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoCategoryId';
import { YouTubeDataApiVideoListVideoType } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoType';
import { YouTubeDataApiVideoListItemType } from '../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListItemType';
import { YouTubeDataApiVideoListResponseType } from '../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListResponseType';
import { HeaderModel } from '../../header/model/HeaderModel';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { FLG } from '../../util/const/CommonConst';
import { GetVideoListSelectEntity } from '../entity/GetVideoListSelectEntity';
import { GetVideoListRepositoryInterface } from '../repository/interface/GetVideoListRepositoryInterface';
import { GetVideoListItemType } from '../type/GetVideoListItemType';
import { GetVideoListResponseType } from '../type/GetVideoListResponseType';


export class GetVideoListService {

    constructor(private readonly repository: GetVideoListRepositoryInterface) { }

    /**
     * YouTube Data Apiを呼び出す
     * @param keyword 
     */
    public async callYouTubeDataListApi(youTubeDataApiVideoListKeyword: YouTubeDataApiVideoListKeyword,
        youTubeDataApiVideoListVideoType: YouTubeDataApiVideoListVideoType,
        youTubeDataApiVideoListNextPageToken: YouTubeDataApiVideoListNextPageToken,
        youTubeDataApiVideoListVideoCategoryId: YouTubeDataApiVideoListVideoCategoryId,
    ) {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiVideoListEndPointModel = new YouTubeDataApiVideoListEndPointModel(
                youTubeDataApiVideoListKeyword,
                youTubeDataApiVideoListVideoType,
                new YouTubeDataApiVideoListMaxResult(),
                youTubeDataApiVideoListNextPageToken,
                youTubeDataApiVideoListVideoCategoryId,
            );

            // YouTube Data APIデータ取得
            const youTubeVideoListApi = await YouTubeDataApiVideoListModel.call(youTubeDataApiVideoListEndPointModel);

            return youTubeVideoListApi;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_INFO}`);
        }
    }


    /**
     * 動画情報をフィルターする
     * @param youTubeVideoListApi 
     */
    public filterVideoList(youTubeVideoListApi: YouTubeDataApiVideoListModel) {

        const response = youTubeVideoListApi.response;

        const filterdYouTubeVideoList: YouTubeDataApiVideoListResponseType = {
            ...response,
            items: response.items.filter((e: YouTubeDataApiVideoListItemType) => {
                return !!e.id.videoId;
            })
        };

        return filterdYouTubeVideoList;
    }

    /**
     * Youtube Data APIから取得した動画一覧の型を変換する
     * @param youTubeVideoDetailApi 
     * @returns 
     */
    public convertVideoList(youTubeDataApiVideoListResponse: YouTubeDataApiVideoListResponseType) {

        const convertedVideoList: GetVideoListResponseType = {
            ...youTubeDataApiVideoListResponse,
            items: youTubeDataApiVideoListResponse.items.map((e: YouTubeDataApiVideoListItemType) => {
                return {
                    ...e,
                    favoriteFlg: FLG.OFF
                }
            })
        }

        return convertedVideoList;
    }

    /**
     * お気に入り動画チェック
     * @param convertedVideoList 
     * @param jsonWebTokenUserModel 
     * @returns 
     */
    public async checkFavorite(convertedVideoList: GetVideoListResponseType,
        accessTokenModel: AccessTokenModel,
    ) {

        const userIdModel = FrontUserIdModel.fromHAccessToken(accessTokenModel);

        // お気に入り動画取得用Entity
        const getVideoDetialSelectEntity = new GetVideoListSelectEntity(userIdModel);

        // お気に入り動画を取得
        const favoriteVideoList = await this.repository.selectVideo(getVideoDetialSelectEntity);

        // お気に入り動画登録チェック
        const videoDetailItems: GetVideoListItemType[] = convertedVideoList.items.map((e: GetVideoListItemType) => {

            // お気に入り動画に登録済み
            const favoriteVideo = favoriteVideoList.find((e1: FavoriteVideoTransaction) => {
                return e1.videoId === e.id.videoId;
            });

            return {
                ...e,
                favoriteFlg: !!favoriteVideo ? FLG.ON : FLG.OFF
            }
        });

        const videoDetail: GetVideoListResponseType = {
            ...convertedVideoList,
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