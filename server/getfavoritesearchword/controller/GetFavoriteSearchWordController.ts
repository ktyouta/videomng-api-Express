import { Response } from 'express';
import { RepositoryType } from '../../constant/CommonConst';
import { HTTP_STATUS_OK } from '../../constant/HttpStatusConst';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { GetFavoriteSearchWordRepositorys } from '../repository/GetFavoriteSearchWordRepositorys';
import { GetFavoriteSearchWordService } from '../service/GetFavoriteSearchWordService';


export class GetFavoriteSearchWordController extends RouteController {

    private readonly getFavoriteSearchWordService = new GetFavoriteSearchWordService((new GetFavoriteSearchWordRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_SEARCH_WORD,
            [authMiddleware]
        );
    }

    /**
     * お気に入りワードを取得する
     * @param req
     * @param res
     * @returns
     */
    public async doExecute(req: AuthenticatedRequest, res: Response) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;

        // お気に入りワード取得
        const result = await this.getFavoriteSearchWordService.getFavoriteSearchWord(frontUserIdModel);

        return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入りワードを取得しました。`, result);
    }
}
