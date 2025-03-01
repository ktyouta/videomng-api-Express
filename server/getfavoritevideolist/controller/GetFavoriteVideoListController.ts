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
import { GetFavoriteVideoListResponseModel } from "../model/GetFavoriteVideoListResponseModel";
import { RouteController } from "../../router/controller/RouteController";
import { Prisma } from "@prisma/client";
import { PrismaTransaction } from "../../util/service/PrismaTransaction";
import { GetFavoriteVideoListService } from "../service/GetFavoriteVideoListService";


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
        const jsonWebTokenVerifyModel = await this.getFavoriteVideoListService.checkJwtVerify(req.cookies.jwt);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // お気に入り動画リストを取得
        const favoriteVideoList = await this.getFavoriteVideoListService.getFavoriteVideoList(frontUserIdModel);

        // ユーザーのお気に入り動画が存在しない
        if (favoriteVideoList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入り動画が登録されていません。`)
        }

        // レスポンスを作成
        const getFavoriteVideoListResponse: GetFavoriteVideoListResponseModel =
            this.getFavoriteVideoListService.createResponse(favoriteVideoList);

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画リストを取得しました。`, getFavoriteVideoListResponse);
    }
}