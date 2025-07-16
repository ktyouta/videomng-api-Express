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
import { GetFavoriteCommentListService } from "../service/GetFavoriteCommentListService";
import { GetFavoriteCommentListResponseModel } from "../model/GetFavoriteCommentListResponseModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";


export class GetFavoriteCommentListController extends RouteController {

    private readonly getFavoriteCommentListService = new GetFavoriteCommentListService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_COMMENT
        );
    }

    /**
     * お気に入りコメントリストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_COMMENT} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFavoriteCommentListService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // お気に入りコメントリストを取得
        const favoriteCommentList = await this.getFavoriteCommentListService.getFavoriteCommentList(frontUserIdModel, videoIdModel);

        // ユーザーのお気に入りコメントが存在しない
        if (favoriteCommentList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `お気に入りコメントが登録されていません。`);
        }

        // お気に入りコメントリストからYouTube Data Apiの情報を取得してマージする
        const youTubeDataApiCommentDetailModel = await this.getFavoriteCommentListService.getYouTubeVideoCommentList(favoriteCommentList);

        // レスポンスを作成
        const getFavoriteCommentListResponse = new GetFavoriteCommentListResponseModel(youTubeDataApiCommentDetailModel);

        return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入りコメントリストを取得しました。`, getFavoriteCommentListResponse.data);
    }
}