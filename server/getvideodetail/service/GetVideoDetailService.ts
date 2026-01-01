import { Request } from 'express';
import { AccessTokenModel } from '../../accesstoken/model/AccessTokenModel';
import { FLG } from '../../common/const/CommonConst';
import { YouTubeDataApiVideoDetailEndPointModel } from '../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel';
import { YouTubeDataApiVideoDetailModel } from '../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel';
import { HeaderModel } from '../../header/model/HeaderModel';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { GetVideoDetialSelectEntity } from '../entity/GetVideoDetialSelectEntity';
import { GetVideoDetialRepositoryInterface } from '../repository/interface/GetVideoDetialRepositoryInterface';
import { GetVideoDetailResponseType } from '../type/GetVideoDetailResponseType';


export class GetVideoDetailService {

    constructor(private readonly repository: GetVideoDetialRepositoryInterface) { }

    /**
     * YouTube Data Apiを呼び出す
     * @param keyword 
     */
    public async callYouTubeDataDetailApi(videoIdModel: VideoIdModel) {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiVideoDetailEndPointModel = new YouTubeDataApiVideoDetailEndPointModel(
                videoIdModel,
            );

            // YouTube Data Apiデータ取得
            const youtubeVideoDetailApi = await YouTubeDataApiVideoDetailModel.call(youTubeDataApiVideoDetailEndPointModel);

            return youtubeVideoDetailApi;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_INFO_ID} id:${videoIdModel}`);
        }
    }

    /**
     * Youtube Data APIから取得した動画詳細の型を変換する
     * @param youTubeVideoDetailApi 
     */
    public convertVideoDetail(youTubeVideoDetailApi: YouTubeDataApiVideoDetailModel): GetVideoDetailResponseType {

        const apiResponse = youTubeVideoDetailApi.response;

        const convertedVideoDetail: GetVideoDetailResponseType = {
            ...apiResponse,
            items: {
                ...apiResponse.items[0],
                favoriteFlg: FLG.OFF
            }
        }

        return convertedVideoDetail;
    }


    /**
     * お気に入り動画チェック
     * @param convertedVideoDetail 
     * @param jsonWebTokenUserModel 
     */
    public async checkFavorite(convertedVideoDetail: GetVideoDetailResponseType,
        accessTokenModel: AccessTokenModel,
    ) {

        const userIdModel = FrontUserIdModel.fromHAccessToken(accessTokenModel);

        // 動画ID
        const videoIdModel = new VideoIdModel(convertedVideoDetail.items.id);

        // お気に入り動画取得用Entity
        const getVideoDetialSelectEntity = new GetVideoDetialSelectEntity(userIdModel, videoIdModel);

        // お気に入り動画取得
        const favoriteVideoList = await this.repository.selectVideo(getVideoDetialSelectEntity);

        // お気に入り動画登録チェック
        const videoDetail: GetVideoDetailResponseType = {
            ...convertedVideoDetail,
            items: {
                ...convertedVideoDetail.items,
                favoriteFlg: favoriteVideoList && favoriteVideoList.length > 0 ? FLG.ON : FLG.OFF
            }
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