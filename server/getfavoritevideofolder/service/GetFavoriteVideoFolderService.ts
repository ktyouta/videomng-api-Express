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
import { ThumbnailType } from "../../types/ThumbnailType";
import { GetFavoriteVideoFolderSelectEntity } from "../entity/GetFavoriteVideoFolderSelectEntity";
import { FavoriteVideoFolderThumbnailType } from "../model/FavoriteVideoFolderThumbnailType";
import { FavoriteVideoFolderType } from "../model/FavoriteVideoFolderType";
import { FavoriteVideoListMergedType } from "../model/FavoriteVideoListMergedType";
import { FolderListModel } from "../model/FolderListModel";
import { GetFavoriteVideoFolderResponseModel } from "../model/GetFavoriteVideoListResponseModel";
import { GetFavoriteVideoFolderRepositoryInterface } from "../repository/interface/GetFavoriteVideoFolderRepositoryInterface";


export class GetFavoriteVideoFolderService {

    constructor(private readonly getFavoriteVideoFolderRepository: GetFavoriteVideoFolderRepositoryInterface) { }

    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    public async getFavoriteVideoFolder(getFavoriteVideoFolderSelectEntity: GetFavoriteVideoFolderSelectEntity,
        defaultListLimit: number,
    ): Promise<FavoriteVideoTransaction[]> {

        // お気に入り動画取得
        const favoriteVideos = await this.getFavoriteVideoFolderRepository.selectFavoriteVideoList(
            getFavoriteVideoFolderSelectEntity,
            defaultListLimit
        );

        return favoriteVideos;
    }

    /**
     * お気に入り動画件数取得
     * @param userNameModel 
     */
    public async getFavoriteVideoFolderCount(getFavoriteVideoFolderSelectEntity: GetFavoriteVideoFolderSelectEntity) {

        // お気に入り動画取得
        const countResult = await this.getFavoriteVideoFolderRepository.selectFavoriteVideoListCount(getFavoriteVideoFolderSelectEntity);

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
        folderList: FavoriteVideoFolderThumbnailType[]): GetFavoriteVideoFolderResponseModel {
        return new GetFavoriteVideoFolderResponseModel(favoriteVideoListMergedList, total, defaultListLimit, folderList);
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
     * フォルダリスト取得
     * @param userNameModel 
     */
    async getFolderList(
        frontUserIdModel: FrontUserIdModel,
        folderIdModel: FolderIdModel,
        folderListModel: FolderListModel): Promise<FavoriteVideoFolderType[]> {
        // お気に入り動画取得
        const favoriteVideos = await this.getFavoriteVideoFolderRepository.selectFolderList(
            frontUserIdModel,
            folderIdModel,
            folderListModel
        );
        return favoriteVideos;
    }

    /**
     * フォルダに表示するサムネを取得
     * 最新動画がYouTube側で削除/非公開等により情報取得できない場合があるため、
     * 取得できるまで次に新しい動画を順に試す（getVideoInfoRecursive参照）
     * @param folder
     */
    async getFavoriteVideoFolderThumbnail(folderList: FavoriteVideoFolderType[]): Promise<FavoriteVideoFolderThumbnailType[]> {

        const videoFolderMap = new Map<number, Set<string>>();
        const resultVideoFolderMap = new Map<number, string | null>();
        const folderMap = new Map<number, Omit<FavoriteVideoFolderType, "videoId">>();

        // フォルダに属する動画をグルーピング & フォルダ情報を取得
        folderList.forEach((e) => {
            const folderId = e.folderId;
            if (!videoFolderMap.has(folderId)) {
                videoFolderMap.set(folderId, new Set());
            }

            if (!folderMap.has(folderId)) {
                folderMap.set(folderId, {
                    folderId,
                    name: e.name,
                    folderColor: e.folderColor,
                    updateDate: e.updateDate
                });
            }

            const videoIdList = videoFolderMap.get(folderId);
            if (videoIdList) {
                videoIdList.add(e.videoId);
            }
        });

        // 動画情報を取得
        const result = await this.getVideoInfoRecursive(videoFolderMap, [], resultVideoFolderMap);
        const videoMap = new Map<string, YouTubeDataApiVideoDetailItemType>(
            result.folderThumbnailList.map(item => [item.id, item])
        );

        // フォルダーリストとYouTube Data Apiの動画詳細のマージ
        const folderListMergedList: FavoriteVideoFolderThumbnailType[] = [];
        for (const [folderId, videoId] of result.resultVideoFolderMap) {
            const folder = folderMap.get(folderId);
            if (!folder) {
                continue;
            }

            if (!videoId) {
                folderListMergedList.push(folder);
                continue;
            }

            const apiData = videoMap.get(videoId);
            // APIから動画情報の取得に失敗
            if (!apiData) {
                folderListMergedList.push(folder);
                continue;
            }

            const thumbnails: ThumbnailType = apiData.snippet.thumbnails;
            folderListMergedList.push({
                ...folder,
                thumbnails
            });
        }

        return folderListMergedList;
    }

    /**
     * サムネ情報を再帰的に取得
     * @param videoFolderMap
     * @returns
     */
    async getVideoInfoRecursive(videoFolderMap: Map<number, Set<string>>,
        folderThumbnailList: YouTubeDataApiVideoDetailItemType[],
        resultVideoFolderMap: Map<number, string | null>
    ): Promise<{ folderThumbnailList: YouTubeDataApiVideoDetailItemType[], resultVideoFolderMap: Map<number, string | null> }> {
        if (videoFolderMap.size === 0) {
            return {
                folderThumbnailList,
                resultVideoFolderMap
            };
        }

        const videoIdList: { folderId: number, videoId: string }[] = [];
        const videoIdcChunks: { folderId: number, videoId: string }[][] = [];

        for (const [key, videoIds] of videoFolderMap.entries()) {
            // 各フォルダの最新の動画IDを取得
            const videoId = videoIds.values().next().value;
            if (videoId) {
                videoIdList.push({
                    folderId: key,
                    videoId
                });
            }
        }

        // 動画詳細取得APIの1回当たりの最大取得可能件数で分割
        for (let i = 0; i < videoIdList.length; i += YouTubeDataApiVideoDetailMaxRequestModel.MAX_VIDEO_IDS_PER_REQUEST) {
            videoIdcChunks.push(videoIdList.slice(i, i + YouTubeDataApiVideoDetailMaxRequestModel.MAX_VIDEO_IDS_PER_REQUEST));
        }

        const videoIdListModelList = videoIdcChunks.map((e) => {
            const videoIdListModel = new VideoIdListModel();
            e.forEach((e1) => {
                videoIdListModel.add(new VideoIdModel(e1.videoId));
            });

            return videoIdListModel;
        });

        // YouTube Data Apiから動画情報を取得
        const newFolderThumbnailList = (await Promise.all(videoIdListModelList.map(async (e) => {
            // API Call
            const youtubeVideoDetailApi = await this.callYouTubeDataDetailApi(e);
            return youtubeVideoDetailApi.response.items;
        }))).filter((e) => !!e).flat();

        // サムネの取得に成功したフォルダ情報をMapから削除
        videoIdList.forEach((e) => {
            const folderId = e.folderId;
            const videoId = e.videoId;
            const folderThumbnail = newFolderThumbnailList.find((e1) => e1.id === videoId);
            if (folderThumbnail) {
                videoFolderMap.delete(folderId);
                resultVideoFolderMap.set(folderId, videoId);
                return;
            }

            const videoIdSet = videoFolderMap.get(folderId);
            if (videoIdSet) {
                videoIdSet.delete(videoId);
                // フォルダ内の動画全てに対して探索が完了
                if (videoIdSet.size === 0) {
                    videoFolderMap.delete(folderId);
                    resultVideoFolderMap.set(folderId, null);
                }
            }
        });

        // YouTube側で動画が削除/非公開等のため取得に失敗した場合、次に新しい動画で再取得を試みる
        return await this.getVideoInfoRecursive(videoFolderMap, [...folderThumbnailList, ...newFolderThumbnailList], resultVideoFolderMap);
    }
}