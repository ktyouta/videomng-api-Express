import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { RepositoryType } from '../../constant/CommonConst';
import { HTTP_STATUS_OK } from '../../constant/HttpStatusConst';
import { authMiddleware } from '../../middleware/authMiddleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { ApiResponse } from '../../util/ApiResponse';
import { PrismaTransaction } from '../../util/PrismaTransaction';
import { GetSearchWordRepositorys } from '../repository/GetSearchWordRepositorys';
import { GetSearchWordService } from '../service/GetSearchWordService';


export class GetSearchWordController extends RouteController {

    private readonly getSearchWordService = new GetSearchWordService((new GetSearchWordRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.SEARCH_WORD,
            [authMiddleware]
        );
    }

    /**
     * 検索実績を取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {
            const frontUserIdModel = req.userInfo.frontUserIdModel;

            // 検索実績取得
            const folderList = await this.getSearchWordService.getSearchWord(frontUserIdModel);

            return ApiResponse.create(res, HTTP_STATUS_OK, `検索実績を取得しました。`, folderList);

        }, next);

    }
}