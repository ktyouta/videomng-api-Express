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


/**
 * フォルダごとのサムネ探索状態
 */
type FolderThumbnailState = {
    folder: Omit<FavoriteVideoFolderType, "videoId">;
    // サムネ候補の動画ID（新しい順・未試行分のみを保持する）
    candidateVideoIds: string[];
    // 取得できた動画ID（null: 未取得または全候補で取得失敗）
    resolvedVideoId: string | null;
};


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
     * @param folderList
     */
    async getFavoriteVideoFolderThumbnail(folderList: FavoriteVideoFolderType[]): Promise<FavoriteVideoFolderThumbnailType[]> {

        const folderStateMap = new Map<number, FolderThumbnailState>();

        // フォルダ情報とサムネ候補動画をフォルダ単位に集約
        folderList.forEach((e) => {
            const folderId = e.folderId;

            if (!folderStateMap.has(folderId)) {
                folderStateMap.set(folderId, {
                    folder: {
                        folderId,
                        name: e.name,
                        folderColor: e.folderColor,
                        updateDate: e.updateDate
                    },
                    candidateVideoIds: [],
                    resolvedVideoId: null
                });
            }

            const folderState = folderStateMap.get(folderId);
            const videoId = e.videoId;
            if (folderState && videoId) {
                folderState.candidateVideoIds.push(videoId);
            }
        });

        // 動画情報を取得（取得できた動画詳細を集約 & 各フォルダの resolvedVideoId を確定）
        const videoDetailList = await this.getVideoInfoRecursive(folderStateMap);
        const videoMap = new Map<string, YouTubeDataApiVideoDetailItemType>(
            videoDetailList.map(item => [item.id, item])
        );

        // フォルダーリストとYouTube Data Apiの動画詳細のマージ
        const folderListMergedList: FavoriteVideoFolderThumbnailType[] = [];
        for (const [, folderState] of folderStateMap) {
            const videoId = folderState.resolvedVideoId;

            // APIから動画情報の取得に失敗
            if (!videoId) {
                folderListMergedList.push(folderState.folder);
                continue;
            }

            const apiData = videoMap.get(videoId);
            // APIから動画情報の取得に失敗
            if (!apiData) {
                folderListMergedList.push(folderState.folder);
                continue;
            }

            const thumbnails: ThumbnailType = apiData.snippet.thumbnails;
            folderListMergedList.push({
                ...folderState.folder,
                thumbnails
            });
        }

        return folderListMergedList;
    }

    /**
     * サムネ情報を再帰的に取得
     * 各フォルダの先頭候補（最新動画）をまとめて取得し、取得できたフォルダは確定、
     * 取得できなかったフォルダは次に新しい候補で再取得を試みる。
     * 結果は folderStateMap の resolvedVideoId に反映する。
     * @param folderStateMap フォルダごとの探索状態
     * @param videoDetailList 取得済みの動画詳細（再帰間で引き継ぐ）
     * @returns 取得できた動画詳細の一覧
     */
    async getVideoInfoRecursive(folderStateMap: Map<number, FolderThumbnailState>,
        videoDetailList: YouTubeDataApiVideoDetailItemType[] = []
    ): Promise<YouTubeDataApiVideoDetailItemType[]> {

        // 各フォルダの現在の候補（先頭 = 最新の未試行動画）を取得
        const currentCandidateList: { folderId: number, videoId: string }[] = [];
        for (const [folderId, folderState] of folderStateMap) {
            // 取得済みのフォルダはスキップ
            if (folderState.resolvedVideoId !== null) {
                continue;
            }

            const videoId = folderState.candidateVideoIds[0];
            if (videoId) {
                currentCandidateList.push({
                    folderId,
                    videoId
                });
            }
        }

        // 探索対象の動画がなければ終了
        if (currentCandidateList.length === 0) {
            return videoDetailList;
        }

        // 動画詳細取得APIの1回当たりの最大取得可能件数で分割
        const videoIdcChunks: { folderId: number, videoId: string }[][] = [];
        for (let i = 0; i < currentCandidateList.length; i += YouTubeDataApiVideoDetailMaxRequestModel.MAX_VIDEO_IDS_PER_REQUEST) {
            videoIdcChunks.push(currentCandidateList.slice(i, i + YouTubeDataApiVideoDetailMaxRequestModel.MAX_VIDEO_IDS_PER_REQUEST));
        }

        const videoIdListModelList = videoIdcChunks.map((chunk) => {
            const videoIdListModel = new VideoIdListModel();
            chunk.forEach((e) => {
                videoIdListModel.add(new VideoIdModel(e.videoId));
            });

            return videoIdListModel;
        });

        // YouTube Data Apiから動画情報を取得
        const newVideoDetailList = (await Promise.all(videoIdListModelList.map(async (e) => {
            // API Call
            const youtubeVideoDetailApi = await this.callYouTubeDataDetailApi(e);
            return youtubeVideoDetailApi.response.items;
        }))).filter((e) => !!e).flat();
        const fetchedVideoIdSet = new Set<string>(newVideoDetailList.map((e) => {
            return e.id;
        }));

        // 取得結果を反映（成功: 確定 / 失敗: 先頭候補を除外し次候補へ）
        currentCandidateList.forEach((e) => {
            const folderState = folderStateMap.get(e.folderId);
            if (!folderState) {
                return;
            }

            // サムネの取得に成功
            if (fetchedVideoIdSet.has(e.videoId)) {
                folderState.resolvedVideoId = e.videoId;
                return;
            }

            // 取得できなかった先頭候補を除外（候補が尽きたフォルダは resolvedVideoId が null のまま探索完了）
            folderState.candidateVideoIds.shift();
        });

        // YouTube側で動画が削除/非公開等のため取得に失敗した場合、次に新しい動画で再取得を試みる
        return await this.getVideoInfoRecursive(folderStateMap, [...videoDetailList, ...newVideoDetailList]);
    }
}