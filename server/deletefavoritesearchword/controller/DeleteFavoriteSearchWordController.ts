import { Response } from 'express';
import { ZodIssue } from 'zod';
import { RepositoryType } from '../../constant/CommonConst';
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../constant/HttpStatusConst';
import { FavoriteSearchWordId } from '../../internaldata/favoritesearchwordtransaction/properties/FavoriteSearchWordId';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { DeleteFavoriteSearchWordRepositorys } from '../repository/DeleteFavoriteSearchWordRepositorys';
import { PathParamSchema } from '../schema/PathParamSchema';
import { DeleteFavoriteSearchWordService } from '../service/DeleteFavoriteSearchWordService';


export class DeleteFavoriteSearchWordController extends RouteController {

    private readonly deleteFavoriteSearchWordService = new DeleteFavoriteSearchWordService((new DeleteFavoriteSearchWordRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.FAVORITE_SEARCH_WORD_ID,
            [authMiddleware]
        );
    }

    /**
     * お気に入りワードを削除する
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

        const favoriteSearchWordId = new FavoriteSearchWordId(pathValidateResult.data.id);

        // お気に入りワード削除
        const deletedCount = await this.deleteFavoriteSearchWordService.deleteFavoriteSearchWord(frontUserIdModel, favoriteSearchWordId);

        // 削除対象が存在しない（または他ユーザーのID）
        if (deletedCount === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NOT_FOUND, `対象のお気に入りワードが存在しません。`);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入りワードを削除しました。`);
    }
}
