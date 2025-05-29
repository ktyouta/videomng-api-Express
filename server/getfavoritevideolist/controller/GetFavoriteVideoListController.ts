import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { Router, Request, Response, NextFunction } from 'express';
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { PrismaClientInstance } from "../../util/service/PrismaClientInstance";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { GetFavoriteVideoListResponseModel } from "../model/GetFavoriteVideoListResponseModel";
import { RouteController } from "../../router/controller/RouteController";
import { Prisma } from "@prisma/client";
import { PrismaTransaction } from "../../util/service/PrismaTransaction";
import { GetFavoriteVideoListService } from "../service/GetFavoriteVideoListService";
import { GetFavoriteVideoListViewStatusModel } from "../model/GetFavoriteVideoListViewStatusModel";
import { YouTubeDataApiVideoListVideoCategoryId } from "../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoCategoryId";
import { TagNameModel } from "../../internaldata/tagmaster/properties/TagNameModel";
import { GetFavoriteVideoListTagNameModel } from "../model/GetFavoriteVideoListTagNameModel";
import { FavoriteVideoSortIdModel } from "../../internaldata/favoritevideosortmaster/properties/FavoriteVideoSortIdModel";
import { GetFavoriteVideoListSortIdModel } from "../model/GetFavoriteVideoListSortIdModel";
import { FavoriteLevelModel } from "../../internaldata/favoritevideotransaction/properties/FavoriteLevelModel";
import { GetFavoriteVideoListFavoriteLevelModel } from "../model/GetFavoriteVideoListFavoriteLevelModel";


export class GetFavoriteVideoListController extends RouteController {

    private readonly getFavoriteVideoListService = new GetFavoriteVideoListService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO
        );
    }

    /**
     * お気に入り動画リストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFavoriteVideoListService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // クエリパラメータを取得
        const query = req.query;

        // 視聴状況を取得
        const viewStatus = query[`viewstatus`] as string;
        const viewStatusModel = await GetFavoriteVideoListViewStatusModel.set(viewStatus);

        // 動画カテゴリを取得
        const videoCategory = query[`videocategory`] as string;
        const videoCategoryId = new YouTubeDataApiVideoListVideoCategoryId(videoCategory);

        // タグを取得
        const videoTag = query[`videotag`] as string;
        const tagNameModel = new GetFavoriteVideoListTagNameModel(videoTag);

        // ソートID
        const sortId = query[`sortkey`] as string;
        const sortIdModel = await GetFavoriteVideoListSortIdModel.set(sortId);

        // お気に入り度
        let favoriteLevel = query[`favoritelevel`] as string;
        const favoriteLevelModel = new GetFavoriteVideoListFavoriteLevelModel(favoriteLevel);

        // お気に入り動画リストを取得
        const favoriteVideoList = await this.getFavoriteVideoListService.getFavoriteVideoList(
            frontUserIdModel,
            viewStatusModel,
            videoCategoryId,
            tagNameModel,
            sortIdModel,
            favoriteLevelModel,
        );

        // ユーザーのお気に入り動画が存在しない
        if (favoriteVideoList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画が登録されていません。`)
        }

        // お気に入り動画リストからYouTube Data Apiの情報を取得してマージする
        const favoriteVideoListMergedList = await this.getFavoriteVideoListService.mergeYouTubeDataList(favoriteVideoList);

        // レスポンスを作成
        const getFavoriteVideoListResponse: GetFavoriteVideoListResponseModel =
            this.getFavoriteVideoListService.createResponse(favoriteVideoListMergedList);

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画リストを取得しました。`, getFavoriteVideoListResponse.data);
    }
}