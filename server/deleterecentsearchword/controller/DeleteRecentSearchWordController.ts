import { Response } from 'express';
import { ZodIssue } from 'zod';
import { RepositoryType } from '../../constant/CommonConst';
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../constant/HttpStatusConst';
import { RecentSearchWordId } from '../../internaldata/recentsearchwordtransaction/properties/RecentSearchWordId';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { DeleteRecentSearchWordRepositorys } from '../repository/DeleteRecentSearchWordRepositorys';
import { PathParamSchema } from '../schema/PathParamSchema';
import { DeleteRecentSearchWordService } from '../service/DeleteRecentSearchWordService';


export class DeleteRecentSearchWordController extends RouteController {

    private readonly deleteRecentSearchWordService = new DeleteRecentSearchWordService((new DeleteRecentSearchWordRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.RECENT_SEARCH_WORD_ID,
            [authMiddleware]
        );
    }

    /**
     * 最近の検索実績を削除する
     * @param req
     * @param res
     * @returns
     */
    public async doExecute(req: AuthenticatedRequest, res: Response) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;
        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        // バリデーションエラー
        if (!pathValidateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = pathValidateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        const recentSearchWordId = new RecentSearchWordId(pathValidateResult.data.id);

        // 最近の検索実績削除
        const deletedCount = await this.deleteRecentSearchWordService.deleteRecentSearchWord(frontUserIdModel, recentSearchWordId);

        // 削除対象が存在しない（または他ユーザーのID）
        if (deletedCount === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NOT_FOUND, `対象の検索実績が存在しません。`);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, `検索実績を削除しました。`);
    }
}
