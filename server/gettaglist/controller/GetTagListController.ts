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
import { GetTagListService } from "../service/GetTagListService";
import { GetTagListResponseModel } from "../model/GetTagListResponseModel";


export class GetTagListController extends RouteController {

    private readonly getTagListService = new GetTagListService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.TAG_INFO
        );
    }

    /**
     * タグを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getTagListService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // 永続ロジック用オブジェクトを取得
        const getGetTagListRepository = this.getTagListService.getGetTagListRepository();

        // タグを取得する
        const tagListList = await this.getTagListService.getTagList(
            getGetTagListRepository,
            frontUserIdModel,);

        // レスポンスを作成
        const getTagListResponse = new GetTagListResponseModel(tagListList);

        return ApiResponse.create(res, HTTP_STATUS_CREATED, `タグを取得しました。`, getTagListResponse.data);
    }
}