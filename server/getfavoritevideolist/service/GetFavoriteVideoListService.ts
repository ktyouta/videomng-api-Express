import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
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
import { FavoriteVideoTransaction, FolderMaster } from "@prisma/client";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FavoriteVideoListMergedType } from "../model/FavoriteVideoListMergedType";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { YouTubeDataApiVideoDetailEndPointModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel";
import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";
import { GetFavoriteVideoListViewStatusModel } from "../model/GetFavoriteVideoListViewStatusModel";
import { YouTubeDataApiVideoListVideoCategoryId } from "../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoCategoryId";
import { TagNameModel } from "../../internaldata/tagmaster/properties/TagNameModel";
import { GetFavoriteVideoListTagNameModel } from "../model/GetFavoriteVideoListTagNameModel";
import { GetFavoriteVideoListSortIdModel } from "../model/GetFavoriteVideoListSortIdModel";
import { GetFavoriteVideoListFavoriteLevelModel } from "../model/GetFavoriteVideoListFavoriteLevelModel";
import { GetFavoriteVideoListPageModel } from "../model/GetFavoriteVideoListPageModel";
import { VideoIdListModel } from "../../external/youtubedataapi/videodetail/model/VideoIdListModel";
import { YouTubeDataApiVideoDetailItemType } from "../../external/youtubedataapi/videodetail/type/YouTubeDataApiVideoDetailItemType";
import { YouTubeDataApiVideoDetailMaxRequestModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailMaxRequestModel";
import { GetFolderListEntity } from "../entity/GetFolderListEntity";
import { FavoriteVideoFolderType } from "../model/FavoriteVideoFolderType";
import { FavoriteVideoFolderThumbnailType } from "../model/FavoriteVideoFolderThumbnailType";
import { ThumbnailType } from "../../common/type/ThumbnailType";


export class GetFavoriteVideoListService {

    constructor(private readonly getFavoriteVideoListRepository: GetFavoriteVideoListRepositoryInterface) { }

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
    public async getFolderList(frontUserIdModel: FrontUserIdModel): Promise<FavoriteVideoFolderType[]> {

        // 永続ロジック用オブジェクトを取得
        const getFolderListEntity = new GetFolderListEntity(frontUserIdModel);

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