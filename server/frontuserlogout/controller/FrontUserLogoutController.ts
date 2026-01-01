import { Request, Response } from 'express';
import { HTTP_STATUS_OK } from '../../common/const/HttpStatusConst';
import { RefreshTokenModel } from '../../refreshtoken/model/RefreshTokenModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiResponse } from '../../util/ApiResponse';


export class FrontUserLogoutController extends RouteController {

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FRONT_USER_LOGOUT
        );
    }

    /**
     * ログアウト
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response) {

        // cookieを削除
        res.clearCookie(RefreshTokenModel.COOKIE_KEY, RefreshTokenModel.COOKIE_CLEAR_OPTION);

        return ApiResponse.create(res, HTTP_STATUS_OK, `ログアウトしました。`);
    }
}