import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { GetFavoriteVideoCustomRepositorys } from "../repository/GetFavoriteVideoCustomRepositorys";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { GetFavoriteVideoCustomRepositoryInterface } from "../repository/interface/GetFavoriteVideoCustomRepositoryInterface";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { Request } from 'express';
import { CookieModel } from "../../cookie/model/CookieModel";
import { YouTubeDataApiVideoDetailEndPointModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel";
import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";
import { FavoriteVideoTransaction } from "@prisma/client";
import { GetFavoriteVideoCustomSelectEntity } from "../entity/GetFavoriteVideoCustomSelectEntity";
import { GetFavoriteVideoCustomMemoSelectEntity } from "../entity/GetFavoriteVideoCustomMemoSelectEntity";
import { GetFavoriteVideoCustomCategorySelectEntity } from "../entity/GetFavoriteVideoCustomCategorySelectEntity";
import { FavoriteVideoTagType } from "../type/FavoriteVideoTagType";
import { SelectTagListEntity } from "../entity/SelectTagListEntity";


export class GetFavoriteVideoCustomService {

    constructor(private readonly getGetFavoriteVideoCustomRepository: GetFavoriteVideoCustomRepositoryInterface) { }

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
     * お気に入り動画取得
     * @param userNameModel 
     */
    public async getFavoriteVideoCustom(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel): Promise<FavoriteVideoTransaction[]> {

        // お気に入り動画取得用Entity
        const getFavoriteVideoCustomSelectEntity = new GetFavoriteVideoCustomSelectEntity(frontUserIdModel, videoIdModel);

        // お気に入り動画取得
        const favoriteVideoCustom = await this.getGetFavoriteVideoCustomRepository.selectVideo(getFavoriteVideoCustomSelectEntity);

        return favoriteVideoCustom;
    }


    /**
     * お気に入り動画メモ取得
     * @param userNameModel 
     */
    public async getFavoriteVideoMemo(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel) {

        // お気に入り動画メモ取得用Entity
        const getFavoriteVideoCustomSelectEntity = new GetFavoriteVideoCustomMemoSelectEntity(frontUserIdModel, videoIdModel);

        // お気に入り動画メモ取得
        const favoriteVideoMemo = await this.getGetFavoriteVideoCustomRepository.selectVideoMemo(getFavoriteVideoCustomSelectEntity);

        return favoriteVideoMemo;
    }

    /**
     * お気に入り動画カテゴリ取得
     * @param userNameModel 
     */
    public async getFavoriteVideoCategory(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel) {

        // お気に入り動画カテゴリ取得用Entity
        const getFavoriteVideoCustomCategorySelectEntity = new GetFavoriteVideoCustomCategorySelectEntity(frontUserIdModel, videoIdModel);

        // お気に入り動画カテゴリ取得
        const favoriteVideoCategory = await this.getGetFavoriteVideoCustomRepository.selectVideoCategory(getFavoriteVideoCustomCategorySelectEntity);

        return favoriteVideoCategory;
    }

    /**
     * お気に入り動画タグリスト取得
     * @param userNameModel 
     */
    public async getFavoriteVideoTagList(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,): Promise<FavoriteVideoTagType[]> {

        // お気に入り動画タグリスト取得用Entity
        const entity = new SelectTagListEntity(frontUserIdModel, videoIdModel);

        // お気に入り動画タグリスト取得
        const favoriteVideoTagList = await this.getGetFavoriteVideoCustomRepository.selectVideoTag(entity);

        return favoriteVideoTagList;
    }

    /**
     * YouTube Data Apiを呼び出す
     * @param youTubeDataApiVideoId 
     * @returns 
     */
    public async callYouTubeDataDetailApi(videoIdModel: VideoIdModel) {

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