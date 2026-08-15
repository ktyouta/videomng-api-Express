import { Response } from 'express';
import { RepositoryType } from '../../constant/CommonConst';
import { HTTP_STATUS_OK } from '../../constant/HttpStatusConst';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { GetRecentSearchWordRepositorys } from '../repository/GetRecentSearchWordRepositorys';
import { GetRecentSearchWordService } from '../service/GetRecentSearchWordService';


export class GetRecentSearchWordController extends RouteController {

    private readonly getRecentSearchWordService = new GetRecentSearchWordService((new GetRecentSearchWordRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.RECENT_SEARCH_WORD,
            [authMiddleware]
        );
    }

    /**
     * 最近の検索実績を取得する
     * @param req
     * @param res
     * @returns
     */
    public async doExecute(req: AuthenticatedRequest, res: Response) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;

        // 最近の検索実績取得
        const result = await this.getRecentSearchWordService.getRecentSearchWord(frontUserIdModel);

        return ApiResponse.create(res, HTTP_STATUS_OK, `最近の検索実績を取得しました。`, result);
    }
}
