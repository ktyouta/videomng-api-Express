import { VideoIdListModel } from "../../external/youtubedataapi/videodetail/model/VideoIdListModel";
import { YouTubeDataApiVideoDetailEndPointModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel";
import { YouTubeDataApiVideoDetailMaxRequestModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailMaxRequestModel";
import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/type/YouTubeDataApiVideoDetailItemType";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { SelectShareVideoEntity } from "../entity/SelectShareVideoEntity";
import { FolderShareVideosRepositoryInterface } from "../repository/interface/FolderShareVideosRepositoryInterface";
import { ConvertVideoFolderType } from "../type/ConvertVideoFolderType";
import { FolderShareVideosResponseType } from "../type/FolderShareVideosResponseType";
import { TargetVideoFolderType } from "../type/TargetVideoFolderType";


export class FolderShareVideosService {

    constructor(private readonly repository: FolderShareVideosRepositoryInterface) { }

    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    async getFavoriteVideoFolder(frontUserIdModel: FrontUserIdModel,
        folderIdModel: FolderIdModel): Promise<TargetVideoFolderType[]> {

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
     * フォルダ情報を変換
     * @param videoList 
     */
    convertFolderInfo(videoFolderList: TargetVideoFolderType[]) {

        const map = new Map<string, ConvertVideoFolderType>();

        for (const item of videoFolderList) {

            const existing = map.get(item.videoId);

            if (existing) {
                existing.folder.push({ folderName: item.folderName });
            }
            else {
                map.set(item.videoId, {
                    videoId: item.videoId,
                    folder: [{ folderName: item.folderName }],
                });
            }
        }

        return Array.from(map.values());
    }

    /**
     * 動画情報を取得
     * @param videoList 
     */
    async getVideoInfo(folderVideoList: ConvertVideoFolderType[]): Promise<FolderShareVideosResponseType[]> {

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
        const folderVideoMergedList = folderVideoList.map((e: ConvertVideoFolderType) => {

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