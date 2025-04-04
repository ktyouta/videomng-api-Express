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
import { GetBlockCommentListService } from "../service/GetBlockCommentListService";
import { GetBlockCommentListResponseModel } from "../model/GetBlockCommentListResponseModel";


export class GetBlockCommentListController extends RouteController {

    private readonly getBlockCommentListService = new GetBlockCommentListService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.BLOCK_COMMENT
        );
    }

    /**
     * ブロックコメントリストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.getBlockCommentListService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

        // ブロックコメントリストを取得
        const blockCommentList = await this.getBlockCommentListService.getBlockCommentList(frontUserIdModel);

        // ユーザーのブロックコメントが存在しない
        if (blockCommentList.length === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NO_CONTENT, `ブロックコメントが登録されていません。`);
        }

        // ブロックコメントリストからYouTube Data Apiの情報を取得してマージする
        const youTubeDataApiCommentDetailModel = await this.getBlockCommentListService.getYouTubeVideoCommentList(blockCommentList);

        // レスポンスを作成
        const getBlockCommentListResponse = new GetBlockCommentListResponseModel(youTubeDataApiCommentDetailModel);

        return ApiResponse.create(res, HTTP_STATUS_OK, `ブロックコメントリストを取得しました。`, getBlockCommentListResponse.data);
    }
}