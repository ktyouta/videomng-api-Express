import { Response } from 'express';
import { RepositoryType } from '../../constant/CommonConst';
import { HTTP_STATUS_OK } from '../../constant/HttpStatusConst';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { GetFrequentSearchWordRepositorys } from '../repository/GetFrequentSearchWordRepositorys';
import { GetFrequentSearchWordService } from '../service/GetFrequentSearchWordService';


export class GetFrequentSearchWordController extends RouteController {

    private readonly getFrequentSearchWordService = new GetFrequentSearchWordService((new GetFrequentSearchWordRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FREQUENT_SEARCH_WORD,
            [authMiddleware]
        );
    }

    /**
     * よく検索するワードを取得する
     * @param req
     * @param res
     * @returns
     */
    public async doExecute(req: AuthenticatedRequest, res: Response) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;

        // よく検索するワード取得
        const result = await this.getFrequentSearchWordService.getFrequentSearchWord(frontUserIdModel);

        return ApiResponse.create(res, HTTP_STATUS_OK, `よく検索するワードを取得しました。`, result);
    }
}
