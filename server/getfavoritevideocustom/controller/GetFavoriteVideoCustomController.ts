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
import { RouteController } from "../../router/controller/RouteController";
import { Prisma } from "@prisma/client";
import { PrismaTransaction } from "../../util/service/PrismaTransaction";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { GetFavoriteVideoCustomService } from "../service/GetFavoriteVideoCustomService";
import { GetFavoriteVideoCustomResponseModel } from "../model/GetFavoriteVideoCustomResponseModel";
import { FavoriteVideoCustomMergedModel } from "../model/FavoriteVideoCustomMergedModel";
import { GetFavoriteVideoCustomRepositorys } from "../repository/GetFavoriteVideoCustomRepositorys";
import { RepositoryType } from "../../util/const/CommonConst";


export class GetFavoriteVideoCustomController extends RouteController {

    private readonly getFavoriteVideoCustomService = new GetFavoriteVideoCustomService((new GetFavoriteVideoCustomRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_CUSTOM
        );
    }

    /**
     * お気に入り動画カスタム情報を取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_CUSTOM} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFavoriteVideoCustomService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // お気に入り動画を取得
        const favoriteVideoList = await this.getFavoriteVideoCustomService.getFavoriteVideoCustom(
            frontUserIdModel,
            videoIdModel);

        // ユーザーのお気に入り動画が存在しない
        if (favoriteVideoList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画が登録されていません。`)
        }

        // お気に入り動画メモを取得する
        const favoriteVideoMemoList = await this.getFavoriteVideoCustomService.getFavoriteVideoMemo(
            frontUserIdModel,
            videoIdModel);

        // お気に入り動画カテゴリを取得する
        const favoriteVideoCategoryList = await this.getFavoriteVideoCustomService.getFavoriteVideoCategory(
            frontUserIdModel,
            videoIdModel);

        // お気に入り動画タグを取得する
        const favoriteVideoTagList = await this.getFavoriteVideoCustomService.getFavoriteVideoTagList(
            frontUserIdModel,
            videoIdModel);

        // 取得したデータをマージ
        const favoriteVideoCustomMergedModel = new FavoriteVideoCustomMergedModel(
            favoriteVideoList,
            favoriteVideoMemoList,
            favoriteVideoCategoryList,
            favoriteVideoTagList,
        );

        // レスポンスを作成
        const getFavoriteVideoCustomResponse = new GetFavoriteVideoCustomResponseModel(favoriteVideoCustomMergedModel);

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画カスタム情報を取得しました。`, getFavoriteVideoCustomResponse.data);
    }
}