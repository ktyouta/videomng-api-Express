import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_OK } from "../../common/const/HttpStatusConst";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { ApiResponse } from "../../util/ApiResponse";
import { DateUtil } from "../../util/DateUtil";


export class HealthController extends RouteController {

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.HEALTH
        );
    }

    /**
     * ヘルスチェック
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        const nowDate = DateUtil.getNowDatetime(`yyyy-MM-dd HH:mm:ss`);

        return ApiResponse.create(res, HTTP_STATUS_OK, `service is running`, nowDate);
    }
}