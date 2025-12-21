import { FavoriteVideoTransaction } from "@prisma/client";
import { ThumbnailType } from "../../common/type/ThumbnailType";
import { VideoIdListModel } from "../../external/youtubedataapi/videodetail/model/VideoIdListModel";
import { YouTubeDataApiVideoDetailEndPointModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel";
import { YouTubeDataApiVideoDetailMaxRequestModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailMaxRequestModel";
import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/type/YouTubeDataApiVideoDetailItemType";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { GetFavoriteVideoListSelectEntity } from "../entity/GetFavoriteVideoListSelectEntity";
import { GetFolderListEntity } from "../entity/GetFolderListEntity";
import { FavoriteVideoFolderThumbnailType } from "../model/FavoriteVideoFolderThumbnailType";
import { FavoriteVideoFolderType } from "../model/FavoriteVideoFolderType";
import { FavoriteVideoListMergedType } from "../model/FavoriteVideoListMergedType";
import { FolderListModel, } from "../model/FolderListModel";
import { GetFavoriteVideoListResponseModel } from "../model/GetFavoriteVideoListResponseModel";
import { GetFavoriteVideoListRepositoryInterface } from "../repository/interface/GetFavoriteVideoListRepositoryInterface";


export class GetFavoriteVideoListService {

    constructor(private readonly getFavoriteVideoListRepository: GetFavoriteVideoListRepositoryInterface) { }

    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    public async getFavoriteVideoList(getFavoriteVideoListSelectEntity: GetFavoriteVideoListSelectEntity,
        defaultListLimit: number,
    ): Promise<FavoriteVideoTransaction[]> {

        // お気に入り動画取得
        const favoriteVideos = await this.getFavoriteVideoListRepository.selectFavoriteVideoList(
            getFavoriteVideoListSelectEntity,
            defaultListLimit
        );

        return favoriteVideos;
    }

    /**
     * フォルダリスト取得
     * @param userNameModel 
     */
    public async getFolderList(frontUserIdModel: FrontUserIdModel,
        folderListModel: FolderListModel,
    ): Promise<FavoriteVideoFolderType[]> {

        // 永続ロジック用オブジェクトを取得
        const getFolderListEntity = new GetFolderListEntity(frontUserIdModel, folderListModel);

        // お気に入り動画取得
        const favoriteVideos = await this.getFavoriteVideoListRepository.selectFolderList(getFolderListEntity);

        return favoriteVideos;
    }

    /**
     * お気に入り動画件数取得
     * @param userNameModel 
     */
    public async getFavoriteVideoListCount(getFavoriteVideoListSelectEntity: GetFavoriteVideoListSelectEntity) {

        // お気に入り動画取得
        const countResult = await this.getFavoriteVideoListRepository.selectFavoriteVideoListCount(getFavoriteVideoListSelectEntity);

        return countResult?.length ?? 0;
    }


    /**
     * レスポンスを作成
     * @param frontUserInfoCreateRequestBody 
     * @param newJsonWebTokenModel 
     */
    public createResponse(favoriteVideoListMergedList: FavoriteVideoListMergedType[],
        total: number,
        defaultListLimit: number,
        folderList: FavoriteVideoFolderThumbnailType[]): GetFavoriteVideoListResponseModel {
        return new GetFavoriteVideoListResponseModel(favoriteVideoListMergedList, total, defaultListLimit, folderList);
    }


    /**
     * お気に入り動画リストからYouTube Data Apiの情報を取得してマージする
     * @param favoriteVideoList 
     * @returns 
     */
    public async mergeYouTubeDataList(favoriteVideoList: FavoriteVideoTransaction[]) {

        const videoIdList = favoriteVideoList.map((e) => {
            return e.videoId;
        });

        const videoIdcChunks: string[][] = [];

        // 動画詳細取得APIの1回当たりの最大取得可能件数で分割
        for (let i = 0; i < videoIdList.length; i += YouTubeDataApiVideoDetailMaxRequestModel.MAX_VIDEO_IDS_PER_REQUEST) {
            videoIdcChunks.push(videoIdList.slice(i, i + YouTubeDataApiVideoDetailMaxRequestModel.MAX_VIDEO_IDS_PER_REQUEST));
        }

        const videoIdListModelList = videoIdcChunks.map((e) => {

            const videoIdListModel = new VideoIdListModel();

            e.forEach((e1) => {
                videoIdListModel.add(new VideoIdModel(e1));
            });

            return videoIdListModel;
        });

        // YouTube Data Apiから動画詳細を取得
        const videoDetailList = (await Promise.all(videoIdListModelList.map(async (e) => {

            // API Call
            const youtubeVideoDetailApi = await this.callYouTubeDataDetailApi(e);

            return youtubeVideoDetailApi.response.items;
        }))).flat();

        const videoMap = new Map<string, YouTubeDataApiVideoDetailItemType>(
            videoDetailList.map(item => [item.id, item])
        );

        // お気に入り動画リストとYouTube Data Apiの動画詳細のマージ
        const favoriteVideoListMergedList = favoriteVideoList.map((e: FavoriteVideoTransaction) => {

            const apiData = videoMap.get(e.videoId);

            // APIから動画情報の取得に失敗
            if (!apiData) {
                return;
            }

            return { ...e, ...apiData };
        });

        return favoriteVideoListMergedList.filter((e) => e !== undefined);
    }


    /**
     * YouTube Data Apiを呼び出す
     * @param videoIdModel 
     * @returns 
     */
    private async callYouTubeDataDetailApi(videoIdListModel: VideoIdListModel) {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiVideoDetailEndPointModel = new YouTubeDataApiVideoDetailEndPointModel(
                videoIdListModel,
            );

            // YouTube Data APIデータ取得
            const youtubeVideoDetailApi = await YouTubeDataApiVideoDetailModel.call(youTubeDataApiVideoDetailEndPointModel);

            return youtubeVideoDetailApi;
        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_INFO_ID} id:${videoIdListModel.videoId}`);
        }
    }

    /**
     * フォルダに表示するサムネを取得
     * @param folder 
     */
    async getFavoriteVideoFolderThumbnail(folderList: FavoriteVideoFolderType[]): Promise<FavoriteVideoFolderThumbnailType[]> {

        // YouTube Data Apiから動画情報を取得
        const folderThumbnailList = (await Promise.all(folderList.map(async (e) => {

            if (!e.latestVideoId) {
                return;
            };

            const videoId = new VideoIdModel(e.latestVideoId);

            // YouTube Data APIのエンドポイント
            const youTubeDataApiVideoDetailEndPointModel = new YouTubeDataApiVideoDetailEndPointModel(
                videoId,
            );

            // YouTube Data APIデータ取得
            const youtubeVideoDetailApi = await YouTubeDataApiVideoDetailModel.call(youTubeDataApiVideoDetailEndPointModel);

            return youtubeVideoDetailApi.response.items;
        }))).filter((e) => !!e).flat();

        const videoMap = new Map<string, YouTubeDataApiVideoDetailItemType>(
            folderThumbnailList.map(item => [item.id, item])
        );

        // フォルダーリストとYouTube Data Apiの動画詳細のマージ
        const folderListMergedList = folderList.map((e) => {

            const apiData = videoMap.get(e.latestVideoId);

            // APIから動画情報の取得に失敗
            if (!apiData) {
                return { ...e };
            }

            const thumbnails: ThumbnailType = apiData.snippet.thumbnails;

            return { ...e, thumbnails };
        }).filter((e) => !!e);

        return folderListMergedList;
    }
}