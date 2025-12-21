import { NextFunction, Response } from 'express';
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { authMiddleware } from "../../middleware/authMiddleware";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { HTTP_STATUS_NO_CONTENT, HTTP_STATUS_OK } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { GetBlockCommentListResponseModel } from "../model/GetBlockCommentListResponseModel";
import { GetBlockCommentListService } from "../service/GetBlockCommentListService";


export class GetBlockCommentListController extends RouteController {

    private readonly getBlockCommentListService = new GetBlockCommentListService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.BLOCK_COMMENT,
            [authMiddleware]
        );
    }

    /**
     * ブロックコメントリストを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.jsonWebTokenUserModel.frontUserIdModel;
        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.BLOCK_COMMENT} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // ブロックコメントリストを取得
        const blockCommentList = await this.getBlockCommentListService.getBlockCommentList(frontUserIdModel, videoIdModel);

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