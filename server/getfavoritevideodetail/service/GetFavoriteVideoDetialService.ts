import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import ENV from '../../env.json';
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { GetFavoriteVideoDetialResponseModel } from "../model/GetFavoriteVideoDetialResponseModel";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { GetFavoriteVideoDetialRepositorys } from "../repository/GetFavoriteVideoDetialRepositorys";
import { GetFavoriteVideoDetialSelectEntity } from "../entity/GetFavoriteVideoDetialSelectEntity";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { GetFavoriteVideoDetialRepositoryInterface } from "../repository/interface/GetFavoriteVideoDetialRepositoryInterface";
import { FavoriteVideoMemoTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { YoutubeVideoDetailApi } from "../../external/youtubedataapi/videodetail/service/YoutubeVideoDetailApi";
import { Request } from 'express';
import { CookieModel } from "../../cookie/model/CookieModel";


export class GetFavoriteVideoDetialService {

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
    public getGetFavoriteVideoDetialRepository(): GetFavoriteVideoDetialRepositoryInterface {
        return (new GetFavoriteVideoDetialRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    public async getFavoriteVideoDetial(getGetFavoriteVideoDetialRepository: GetFavoriteVideoDetialRepositoryInterface,
        frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel): Promise<FavoriteVideoTransaction[]> {

        // お気に入り動画取得用Entity
        const getFavoriteVideoDetialSelectEntity = new GetFavoriteVideoDetialSelectEntity(frontUserIdModel, videoIdModel);

        // お気に入り動画取得
        const favoriteVideoDetial = await getGetFavoriteVideoDetialRepository.selectVideo(getFavoriteVideoDetialSelectEntity);

        return favoriteVideoDetial;
    }


    /**
     * お気に入り動画コメント取得
     * @param userNameModel 
     */
    public async getFavoriteVideoMemo(getGetFavoriteVideoDetialRepository: GetFavoriteVideoDetialRepositoryInterface,
        frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel) {

        // お気に入り動画取得用Entity
        const getFavoriteVideoDetialSelectEntity = new GetFavoriteVideoDetialSelectEntity(frontUserIdModel, videoIdModel);

        // お気に入り動画取得
        const favoriteVideoMemo = await getGetFavoriteVideoDetialRepository.selectVideoMemo(getFavoriteVideoDetialSelectEntity);

        return favoriteVideoMemo;
    }

    /**
     * YouTube Data Apiを呼び出す
     * @param youTubeDataApiVideoId 
     * @returns 
     */
    public async callYouTubeDataDetailApi(videoIdModel: VideoIdModel) {

        try {

            // YouTube Data Apiデータ取得
            const youtubeVideoDetailApi = await YoutubeVideoDetailApi.call(videoIdModel);

            return youtubeVideoDetailApi;
        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_INFO_ID} id:${videoIdModel}`);
        }
    }

}