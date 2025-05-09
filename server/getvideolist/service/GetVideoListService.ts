import { YouTubeDataApiVideoListEndPointModel } from '../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListEndPointModel';
import { YouTubeDataApiVideoListModel } from '../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListModel';
import { YouTubeDataApiVideoListNextPageToken } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListNextPageToken';
import { YouTubeDataApiVideoListKeyword } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListKeyword';
import { YouTubeDataApiVideoListMaxResult } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListMaxResult';
import { YouTubeDataApiVideoListVideoType } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoType';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { YouTubeDataApiVideoListVideoCategoryId } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoCategoryId';
import { YouTubeDataApiVideoListResponseType } from '../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListResponseType';
import { YouTubeDataApiVideoListItemType } from '../../external/youtubedataapi/videolist/type/YouTubeDataApiVideoListItemType';
import { GetVideoListResponseType } from '../type/GetVideoListResponseType';
import { FLG, RepositoryType } from '../../util/const/CommonConst';
import { CookieModel } from '../../cookie/model/CookieModel';
import { JsonWebTokenModel } from '../../jsonwebtoken/model/JsonWebTokenModel';
import { JsonWebTokenUserModel } from '../../jsonwebtoken/model/JsonWebTokenUserModel';
import { Router, Request, Response, NextFunction } from 'express';
import { GetVideoListRepositorys } from '../repository/GetVideoListRepositorys';
import { GetVideoListSelectEntity } from '../entity/GetVideoListSelectEntity';
import { GetVideoListItemType } from '../type/GetVideoListItemType';
import { FavoriteVideoTransaction } from '@prisma/client';


export class GetVideoListService {


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
     * @param convertedVideoList 
     * @param jsonWebTokenUserModel 
     * @returns 
     */
    public async checkFavorite(convertedVideoList: GetVideoListResponseType,
        jsonWebTokenUserModel: JsonWebTokenUserModel,
    ) {

        // ユーザーID
        const frontUserIdModel = jsonWebTokenUserModel.frontUserIdModel;
        const getVideoListRepositorys = (new GetVideoListRepositorys()).get(RepositoryType.POSTGRESQL);

        // お気に入り動画取得用Entity
        const getVideoDetialSelectEntity = new GetVideoListSelectEntity(frontUserIdModel);

        // お気に入り動画を取得
        const favoriteVideoList = await getVideoListRepositorys.selectVideo(getVideoDetialSelectEntity);

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
}