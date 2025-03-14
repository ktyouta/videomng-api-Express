import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { Router, Request, Response, NextFunction } from 'express';
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { PrismaClientInstance } from "../../util/service/PrismaClientInstance";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { RouteController } from "../../router/controller/RouteController";
import { Prisma } from "@prisma/client";
import { PrismaTransaction } from "../../util/service/PrismaTransaction";
import { GetFavoriteVideoDetialService } from "../service/GetFavoriteVideoDetialService";
import { GetFavoriteVideoDetialResponseModel } from "../model/GetFavoriteVideoDetialResponseModel";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { FavoriteVideoDetailMergedModel } from "../model/FavoriteVideoDetailMergedModel";


export class GetFavoriteVideoDetialController extends RouteController {

    private readonly getFavoriteVideoDetialService = new GetFavoriteVideoDetialService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_ID
        );
    }

    /**
     * お気に入り動画リストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        const id = req.params.id;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_ID} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFavoriteVideoDetialService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteVideoDetialRepository = this.getFavoriteVideoDetialService.getGetFavoriteVideoDetialRepository();

        // お気に入り動画を取得
        const favoriteVideoList = await this.getFavoriteVideoDetialService.getFavoriteVideoDetial(
            getGetFavoriteVideoDetialRepository,
            frontUserIdModel,
            videoIdModel);

        // ユーザーのお気に入り動画が存在しない
        if (favoriteVideoList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画が登録されていません。`)
        }

        // お気に入り動画コメントを取得する
        const favoriteVideoMemoList = await this.getFavoriteVideoDetialService.getFavoriteVideoMemo(
            getGetFavoriteVideoDetialRepository,
            frontUserIdModel,
            videoIdModel);

        // YouTube Data Apiから動画詳細を取得する
        const youTubeVideoDetailApi = await this.getFavoriteVideoDetialService.callYouTubeDataDetailApi(videoIdModel);

        const youtubeVideoItemList = youTubeVideoDetailApi.response.items;

        // YouTube Data Apiから動画情報が取得できなかった場合
        if (youtubeVideoItemList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `YouTube上から動画が削除された可能性があります。`)
        }

        // 取得したデータをマージ
        const favoriteVideoDetailMergedModel = new FavoriteVideoDetailMergedModel(
            favoriteVideoList,
            favoriteVideoMemoList,
            youtubeVideoItemList,
        );

        // レスポンスを作成
        const getFavoriteVideoDetialResponse = new GetFavoriteVideoDetialResponseModel(favoriteVideoDetailMergedModel);

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画を取得しました。`, getFavoriteVideoDetialResponse.data);
    }
}