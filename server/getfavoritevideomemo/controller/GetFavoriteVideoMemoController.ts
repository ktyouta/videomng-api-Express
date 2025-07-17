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
import { GetFavoriteVideoMemoService } from "../service/GetFavoriteVideoMemoService";
import { GetFavoriteVideoMemoResponseModel } from "../model/GetFavoriteVideoMemoResponseModel";


export class GetFavoriteVideoMemoController extends RouteController {

    private readonly getFavoriteVideoMemoService = new GetFavoriteVideoMemoService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_MEMO
        );
    }

    /**
     * お気に入り動画メモを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.FAVORITE_VIDEO_ID} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getFavoriteVideoMemoService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteVideoMemoRepository = this.getFavoriteVideoMemoService.getGetFavoriteVideoMemoRepository();

        // お気に入り動画メモを取得する
        const favoriteVideoMemoList = await this.getFavoriteVideoMemoService.getFavoriteVideoMemo(
            getGetFavoriteVideoMemoRepository,
            frontUserIdModel,
            videoIdModel);

        // レスポンスを作成
        const getFavoriteVideoMemoResponse = new GetFavoriteVideoMemoResponseModel(favoriteVideoMemoList);

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `お気に入り動画メモを取得しました。`, getFavoriteVideoMemoResponse.data);
    }
}