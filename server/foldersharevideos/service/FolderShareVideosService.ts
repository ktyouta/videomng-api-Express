import { FavoriteVideoTransaction } from "@prisma/client";
import { VideoIdListModel } from "../../external/youtubedataapi/videodetail/model/VideoIdListModel";
import { YouTubeDataApiVideoDetailEndPointModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel";
import { YouTubeDataApiVideoDetailMaxRequestModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailMaxRequestModel";
import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/type/YouTubeDataApiVideoDetailItemType";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { SelectFolderEntity } from "../entity/SelectFolderEntity";
import { SelectShareVideoEntity } from "../entity/SelectShareVideoEntity";
import { FolderShareVideosRepositoryInterface } from "../repository/interface/FolderShareVideosRepositoryInterface";
import { FolderShareVideosResponseType } from "../type/FolderShareVideosResponseType";
import { FolderVideoType } from "../type/FolderVideoType";


export class FolderShareVideosService {

    constructor(private readonly repository: FolderShareVideosRepositoryInterface) { }

    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    async getFavoriteVideoFolder(frontUserIdModel: FrontUserIdModel,
        folderIdModel: FolderIdModel): Promise<FavoriteVideoTransaction[]> {

        // 動画取得用Entity
        const getFavoriteVideoFolderSelectEntity = new SelectShareVideoEntity(
            frontUserIdModel,
            folderIdModel,
        );

        // お気に入り動画取得
        const favoriteVideos = await this.repository.selectFavoriteVideoList(getFavoriteVideoFolderSelectEntity,);

        return favoriteVideos;
    }

    /**
     * フォルダ情報を取得
     * @param videoList 
     */
    async getFolderInfo(frontUserIdModel: FrontUserIdModel,
        folderIdModel: FolderIdModel,
        videoList: FavoriteVideoTransaction[]): Promise<FolderVideoType[]> {

        const folderVideoList = (await Promise.all(videoList.map(async (e: FavoriteVideoTransaction) => {

            const entity = new SelectFolderEntity(
                frontUserIdModel,
                folderIdModel,
                new VideoIdModel(e.videoId),
            );

            const result = await this.repository.selectFolderList(entity);

            return {
                ...e,
                folder: result
            };
        }))).filter((e) => !!e);

        return folderVideoList;
    }

    /**
     * 動画情報を取得
     * @param videoList 
     */
    async getVideoInfo(folderVideoList: FolderVideoType[]): Promise<FolderShareVideosResponseType[]> {

        const videoIdcChunks: string[][] = [];

        const videoIdList = folderVideoList.map((e) => {
            return e.videoId;
        }).filter(Boolean);

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

        // YouTube Data Apiから動画情報を取得
        const videoInfoList = (await Promise.all(videoIdListModelList.map(async (e) => {

            // API Call
            const youtubeVideoDetailApi = await this.callYouTubeDataDetailApi(e);

            return youtubeVideoDetailApi.response.items;
        }))).filter((e) => !!e).flat();

        const videoMap = new Map<string, YouTubeDataApiVideoDetailItemType>(
            videoInfoList.map(item => [item.id, item])
        );

        // フォルダーリストとYouTube Data Apiの動画詳細のマージ
        const folderVideoMergedList = folderVideoList.map((e: FolderVideoType) => {

            const apiData = videoMap.get(e.videoId);

            // APIから動画情報の取得に失敗
            if (!apiData) {
                return;
            }

            const videoTitle = apiData.snippet.title;

            return { ...e, videoTitle };
        }).filter((e) => e !== undefined);

        return folderVideoMergedList;
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
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.FOLDER_SHARE_VIDEOS} id:${videoIdListModel.videoId}`);
        }
    }
}