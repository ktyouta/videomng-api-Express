import { Response } from 'express';
import { ZodIssue } from 'zod';
import { RepositoryType } from '../../constant/CommonConst';
import { HTTP_STATUS_CONFLICT, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../constant/HttpStatusConst';
import { FavoriteSearchWord } from '../../internaldata/favoritesearchwordtransaction/properties/FavoriteSearchWord';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { FAVORITE_SEARCH_WORD_REGISTRATION_LIMIT } from '../const/CreateFavoriteSearchWordConst';
import { CreateFavoriteSearchWordRepositorys } from '../repository/CreateFavoriteSearchWordRepositorys';
import { CreateFavoriteSearchWordRequestSchema, CreateFavoriteSearchWordRequestType } from '../schema/CreateFavoriteSearchWordRequestSchema';
import { CreateFavoriteSearchWordService } from '../service/CreateFavoriteSearchWordService';


export class CreateFavoriteSearchWordController extends RouteController {

    private readonly createFavoriteSearchWordService = new CreateFavoriteSearchWordService((new CreateFavoriteSearchWordRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FAVORITE_SEARCH_WORD,
            [authMiddleware]
        );
    }

    /**
     * お気に入りワードを登録する
     * @param req
     * @param res
     * @returns
     */
    public async doExecute(req: AuthenticatedRequest, res: Response) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;
        // リクエストのバリデーションチェック
        const validateResult = CreateFavoriteSearchWordRequestSchema.safeParse(req.body);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS_UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        // リクエストボディ
        const requestBody: CreateFavoriteSearchWordRequestType = validateResult.data;
        const favoriteSearchWord = new FavoriteSearchWord(requestBody.word);

        // 登録済みのお気に入りワードを取得
        const favoriteSearchWordList = await this.createFavoriteSearchWordService.getFavoriteSearchWord(frontUserIdModel);

        // 登録可能上限オーバー
        if (favoriteSearchWordList.length >= FAVORITE_SEARCH_WORD_REGISTRATION_LIMIT) {
            return ApiResponse.create(res, HTTP_STATUS_CONFLICT, `最大${FAVORITE_SEARCH_WORD_REGISTRATION_LIMIT}件まで登録可能です。`);
        }

        // 重複チェック
        const isDuplicated = favoriteSearchWordList.some((favoriteSearchWordItem) => {
            return favoriteSearchWordItem.word === favoriteSearchWord.value;
        });

        if (isDuplicated) {
            return ApiResponse.create(res, HTTP_STATUS_CONFLICT, `既に登録されているお気に入りワードです。`);
        }

        // お気に入りワード登録
        const result = await this.createFavoriteSearchWordService.insertFavoriteSearchWord(frontUserIdModel, favoriteSearchWord);

        return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入りワードを登録しました。`, result);
    }
}
