import { Response } from 'express';
import { ZodIssue } from 'zod';
import { RepositoryType } from '../../constant/CommonConst';
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../constant/HttpStatusConst';
import { FrequentSearchWordId } from '../../internaldata/frequentsearchwordtransaction/properties/FrequentSearchWordId';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { DeleteFrequentSearchWordRepositorys } from '../repository/DeleteFrequentSearchWordRepositorys';
import { PathParamSchema } from '../schema/PathParamSchema';
import { DeleteFrequentSearchWordService } from '../service/DeleteFrequentSearchWordService';


export class DeleteFrequentSearchWordController extends RouteController {

    private readonly deleteFrequentSearchWordService = new DeleteFrequentSearchWordService((new DeleteFrequentSearchWordRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.DELETE,
            this.doExecute,
            ApiEndopoint.FREQUENT_SEARCH_WORD_ID,
            [authMiddleware]
        );
    }

    /**
     * よく検索するワードを削除する
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

        const frequentSearchWordId = new FrequentSearchWordId(pathValidateResult.data.id);

        // よく検索するワード削除
        const deletedCount = await this.deleteFrequentSearchWordService.deleteFrequentSearchWord(frontUserIdModel, frequentSearchWordId);

        // 削除対象が存在しない（または他ユーザーのID）
        if (deletedCount === 0) {
            return ApiResponse.create(res, HTTP_STATUS_NOT_FOUND, `対象のよく検索するワードが存在しません。`);
        }

        return ApiResponse.create(res, HTTP_STATUS_OK, `よく検索するワードを削除しました。`);
    }
}
