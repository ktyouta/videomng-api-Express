import { Request, Response } from 'express';
import { ZodIssue } from 'zod';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { SUCCESS_MESSAGE } from '../const/SearchCommentByKeywordConst';
import { SearchCommentByKeywordKeywordModel } from '../model/SearchCommentByKeywordKeywordModel';
import { RequestPathParamSchema } from '../schema/RequestPathParamSchema';
import { RequestQuerySchema } from '../schema/RequestQuerySchema';
import { SearchCommentByKeywordService } from '../service/SearchCommentByKeywordService';


export class SearchCommentByKeywordController extends RouteController {

    private searchCommentByKeywordService = new SearchCommentByKeywordService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.SEARCH_COMMENT_BY_KEYWORD
        );
    }


    /**
     * キーワード検索(コメント)
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response) {

        // パスパラメータのバリデーションチェック
        const pathValidateResult = RequestPathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message} endpoint:${ApiEndopoint.FAVORITE_VIDEO_FOLDER}`);
        }

        // パスパラメータ
        const param = pathValidateResult.data;
        const videoIdModel = new VideoIdModel(param.videoId);

        // クエリパラメータのバリデーションチェック
        const validateResult = RequestQuerySchema.safeParse(req.query);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // クエリパラメータ
        const query = validateResult.data;

        // キーワード
        const searchCommentByKeywordKeywordModel = new SearchCommentByKeywordKeywordModel(query.q);

        // 動画コメントを取得
        const commentList = await this.searchCommentByKeywordService.getCommentList(
            videoIdModel
        );

        // 取得したコメントをキーワードでフィルター
        let filterdCommentList = this.searchCommentByKeywordService.filterComment(commentList, searchCommentByKeywordKeywordModel);

        // jwt取得
        const token = this.searchCommentByKeywordService.getToken(req);

        // ログインしている場合はお気に入りコメントと非表示コメントをチェック
        if (token) {

            try {
                const jsonWebTokenUserModel = await this.searchCommentByKeywordService.checkJwtVerify(req);
                const frontUserIdModel = jsonWebTokenUserModel.frontUserIdModel;

                // 非表示コメント取得
                const blockCommentList = await this.searchCommentByKeywordService.getBlockComment(frontUserIdModel, videoIdModel);

                // 非表示コメントでフィルター
                const filterdCommentListByBlock = this.searchCommentByKeywordService.filterCommentByBlock(
                    filterdCommentList,
                    blockCommentList
                );

                // お気に入りコメント取得
                const favoriteCommentList = await this.searchCommentByKeywordService.getFavoriteComment(frontUserIdModel, videoIdModel);

                // お気に入りステータスチェック
                filterdCommentList = this.searchCommentByKeywordService.favoriteStatusCheck(
                    filterdCommentListByBlock,
                    favoriteCommentList,
                );
            } catch (err) { }
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, SUCCESS_MESSAGE, {
            totalCount: filterdCommentList.length,
            items: filterdCommentList
        });
    }
}