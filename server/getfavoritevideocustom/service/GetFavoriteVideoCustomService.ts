import { FavoriteVideoTransaction } from "@prisma/client";
import { YouTubeDataApiVideoDetailEndPointModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel";
import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { GetFavoriteVideoCustomCategorySelectEntity } from "../entity/GetFavoriteVideoCustomCategorySelectEntity";
import { GetFavoriteVideoCustomMemoSelectEntity } from "../entity/GetFavoriteVideoCustomMemoSelectEntity";
import { GetFavoriteVideoCustomSelectEntity } from "../entity/GetFavoriteVideoCustomSelectEntity";
import { SelectTagListEntity } from "../entity/SelectTagListEntity";
import { GetFavoriteVideoCustomRepositoryInterface } from "../repository/interface/GetFavoriteVideoCustomRepositoryInterface";
import { FavoriteVideoTagType } from "../type/FavoriteVideoTagType";


export class GetFavoriteVideoCustomService {

    constructor(private readonly getGetFavoriteVideoCustomRepository: GetFavoriteVideoCustomRepositoryInterface) { }

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