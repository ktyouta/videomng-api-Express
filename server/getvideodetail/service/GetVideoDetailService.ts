import { CookieModel } from '../../cookie/model/CookieModel';
import { YouTubeDataApiVideoDetailEndPointModel } from '../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel';
import { YouTubeDataApiVideoDetailModel } from '../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { JsonWebTokenModel } from '../../jsonwebtoken/model/JsonWebTokenModel';
import { JsonWebTokenUserModel } from '../../jsonwebtoken/model/JsonWebTokenUserModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { Router, Request, Response, NextFunction } from 'express';
import { GetVideoDetailResponseType } from '../type/GetVideoDetailResponseType';
import { YouTubeDataApiVideoDetailItemType } from '../../external/youtubedataapi/videodetail/type/YouTubeDataApiVideoDetailItemType';
import { FLG, RepositoryType } from '../../util/const/CommonConst';
import { GetVideoDetailItemType } from '../type/GetVideoDetailItemType';
import { GetFavoriteVideoDetialRepositorys } from '../../getfavoritevideodetail/repository/GetFavoriteVideoDetialRepositorys';
import { GetVideoDetialSelectEntity } from '../entity/GetVideoDetialSelectEntity';
import { GetVideoDetialRepositorys } from '../repository/GetVideoDetialRepositorys';


export class GetVideoDetailService {


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
     * jwtを取得
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
            throw Error(`動画詳細取得時の認証エラー ERROR:${err}`);
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
        jsonWebTokenUserModel: JsonWebTokenUserModel,
    ) {

        const getVideoDetialRepositorys = (new GetVideoDetialRepositorys()).get(RepositoryType.POSTGRESQL);

        // ユーザーID
        const frontUserIdModel = jsonWebTokenUserModel.frontUserIdModel;

        // 動画ID
        const videoIdModel = new VideoIdModel(convertedVideoDetail.items.id);

        // お気に入り動画取得用Entity
        const getVideoDetialSelectEntity = new GetVideoDetialSelectEntity(frontUserIdModel, videoIdModel);

        // お気に入り動画取得
        const favoriteVideoList = await getVideoDetialRepositorys.selectVideo(getVideoDetialSelectEntity);

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
}