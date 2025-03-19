import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import ENV from '../../env.json';
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { GetFavoriteVideoListResponseModel } from "../model/GetFavoriteVideoListResponseModel";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { GetFavoriteVideoListRepositorys } from "../repository/GetFavoriteVideoListRepositorys";
import { GetFavoriteVideoListSelectEntity } from "../entity/GetFavoriteVideoListSelectEntity";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { GetFavoriteVideoListRepositoryInterface } from "../repository/interface/GetFavoriteVideoListRepositoryInterface";
import { FavoriteVideoTransaction } from "@prisma/client";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { FavoriteVideoListMergedType } from "../model/FavoriteVideoListMergedType";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { YouTubeDataApiVideoDetailEndPointModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel";
import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";


export class GetFavoriteVideoListService {

    /**
     * jwtからユーザー情報を取得
     * @param jwt 
     * @returns 
     */
    public checkJwtVerify(req: Request) {

        try {
            const cookieModel = new CookieModel(req);
            const jsonWebTokenUserModel = JsonWebTokenUserModel.get(cookieModel);

            return jsonWebTokenUserModel;
        } catch (err) {
            throw Error(`お気に入り動画リスト取得時の認証エラー ERROR:${err}`);
        }
    }

    /**
     * 永続ロジック用オブジェクトを取得
     */
    private getGetFavoriteVideoListRepository(): GetFavoriteVideoListRepositoryInterface {
        return (new GetFavoriteVideoListRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    public async getFavoriteVideoList(frontUserIdModel: FrontUserIdModel): Promise<FavoriteVideoTransaction[]> {

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteVideoListRepository = this.getGetFavoriteVideoListRepository();

        // お気に入り動画取得用Entity
        const getFavoriteVideoListSelectEntity = new GetFavoriteVideoListSelectEntity(frontUserIdModel);

        // お気に入り動画取得
        const favoriteVideos = await getGetFavoriteVideoListRepository.select(getFavoriteVideoListSelectEntity);

        return favoriteVideos;
    }


    /**
     * レスポンスを作成
     * @param frontUserInfoCreateRequestBody 
     * @param newJsonWebTokenModel 
     */
    public createResponse(favoriteVideoListMergedList: FavoriteVideoListMergedType[]): GetFavoriteVideoListResponseModel {
        return new GetFavoriteVideoListResponseModel(favoriteVideoListMergedList);
    }


    /**
     * お気に入り動画リストからYouTube Data Apiの情報を取得してマージする
     * @param favoriteVideoList 
     * @returns 
     */
    public async mergeYouTubeDataList(favoriteVideoList: FavoriteVideoTransaction[]) {

        // お気に入り動画リストとYouTube Data Apiの動画詳細のマージ結果リスト
        const favoriteVideoListMergedList: FavoriteVideoListMergedType[] = [];

        // 取得したお気に入り動画の詳細情報をYouTube Data Apiから取得する
        await Promise.all(favoriteVideoList.map(async (e: FavoriteVideoTransaction) => {

            const videoIdModel = new VideoIdModel(e.videoId);
            // YouTube Data Apiから動画詳細を取得
            const youtubeVideoDetailApi = await this.callYouTubeDataDetailApi(videoIdModel);

            const youtubeVideoItems = youtubeVideoDetailApi.response.items;

            // YouTube Data APIからのデータ取得に失敗
            if (youtubeVideoItems.length === 0) {
                Promise.resolve(null);
            }

            const favoriteVideoListMergedInfo = { ...e, ...youtubeVideoItems[0] };

            favoriteVideoListMergedList.push(favoriteVideoListMergedInfo);
        }));

        return favoriteVideoListMergedList;
    }


    /**
     * YouTube Data Apiを呼び出す
     * @param videoIdModel 
     * @returns 
     */
    private async callYouTubeDataDetailApi(videoIdModel: VideoIdModel) {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiVideoDetailEndPointModel = new YouTubeDataApiVideoDetailEndPointModel(
                videoIdModel,
            );

            // YouTube Data APIデータ取得
            const youtubeVideoDetailApi = await YouTubeDataApiVideoDetailModel.call(youTubeDataApiVideoDetailEndPointModel);

            return youtubeVideoDetailApi;
        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_INFO_ID} id:${videoIdModel}`);
        }
    }
}