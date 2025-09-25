import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { DateUtil } from "../../util/service/DateUtil";
import { ApiResponse } from "../../util/service/ApiResponse";
import { HTTP_STATUS_OK } from "../../util/const/HttpStatusConst";
import { Router, Request, Response, NextFunction } from 'express';


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