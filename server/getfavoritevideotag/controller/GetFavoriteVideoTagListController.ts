import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../util/const/HttpStatusConst";
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
import { GetFavoriteVideoTagListService } from "../service/GetFavoriteVideoTagListService";
import { GetFavoriteVideoTagListResponseModel } from "../model/GetFavoriteVideoTagListResponseModel";


export class GetFavoriteVideoTagListController extends RouteController {

    private readonly getFavoriteVideoTagListService = new GetFavoriteVideoTagListService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_TAG_ID
        );
    }

    /**
     * お気に入り動画タグリストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_TAG_ID} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFavoriteVideoTagListService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // お気に入り動画タグリストを取得
        const favoriteVideoTagList = await this.getFavoriteVideoTagListService.getFavoriteVideoTagList(frontUserIdModel, videoIdModel);

        // ユーザーのお気に入り動画タグリストが存在しない
        if (favoriteVideoTagList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画タグリストが登録されていません。`);
        }

        // レスポンスを作成
        const getFavoriteVideoTagListResponse = new GetFavoriteVideoTagListResponseModel(favoriteVideoTagList);

        return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入り動画タグリストを取得しました。`, getFavoriteVideoTagListResponse.data);
    }
}