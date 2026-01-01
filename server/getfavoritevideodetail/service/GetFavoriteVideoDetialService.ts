import { FavoriteVideoTransaction } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { YouTubeDataApiVideoDetailEndPointModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel";
import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { GetFavoriteVideoDetialCategorySelectEntity } from "../entity/GetFavoriteVideoDetialCategorySelectEntity";
import { GetFavoriteVideoDetialMemoSelectEntity } from "../entity/GetFavoriteVideoDetialMemoSelectEntity";
import { GetFavoriteVideoDetialSelectEntity } from "../entity/GetFavoriteVideoDetialSelectEntity";
import { GetFavoriteVideoDetialRepositorys } from "../repository/GetFavoriteVideoDetialRepositorys";
import { GetFavoriteVideoDetialRepositoryInterface } from "../repository/interface/GetFavoriteVideoDetialRepositoryInterface";


export class GetFavoriteVideoDetialService {

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
     * お気に入り動画メモ取得
     * @param userNameModel 
     */
    public async getFavoriteVideoMemo(getGetFavoriteVideoDetialRepository: GetFavoriteVideoDetialRepositoryInterface,
        frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel) {

        // お気に入り動画メモ取得用Entity
        const getFavoriteVideoDetialSelectEntity = new GetFavoriteVideoDetialMemoSelectEntity(frontUserIdModel, videoIdModel);

        // お気に入り動画メモ取得
        const favoriteVideoMemo = await getGetFavoriteVideoDetialRepository.selectVideoMemo(getFavoriteVideoDetialSelectEntity);

        return favoriteVideoMemo;
    }

    /**
     * お気に入り動画カテゴリ取得
     * @param userNameModel 
     */
    public async getFavoriteVideoCategory(getGetFavoriteVideoDetialRepository: GetFavoriteVideoDetialRepositoryInterface,
        frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel) {

        // お気に入り動画カテゴリ取得用Entity
        const getFavoriteVideoDetialCategorySelectEntity = new GetFavoriteVideoDetialCategorySelectEntity(frontUserIdModel, videoIdModel);

        // お気に入り動画カテゴリ取得
        const favoriteVideoCategory = await getGetFavoriteVideoDetialRepository.selectVideoCategory(getFavoriteVideoDetialCategorySelectEntity);

        return favoriteVideoCategory;
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