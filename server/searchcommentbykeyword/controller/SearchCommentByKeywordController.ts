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
import { SearchCommentByKeywordQueryParameterSchema } from '../model/SearchCommentByKeywordQueryParameterSchema';
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

        const id = req.params.videoId;

        if (!id) {
            throw Error(`動画IDが指定されていません。 endpoint:${ApiEndopoint.SEARCH_COMMENT_BY_KEYWORD} | method:${HttpMethodType.GET}`);
        }

        const videoIdModel = new VideoIdModel(id);

        // クエリパラメータを取得
        const query = req.query;

        // クエリパラメータのバリデーションチェック
        const validateResult = SearchCommentByKeywordQueryParameterSchema.safeParse(query);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // キーワードを取得
        const keyword = query[`q`] as string;
        const searchCommentByKeywordKeywordModel = new SearchCommentByKeywordKeywordModel(keyword);

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