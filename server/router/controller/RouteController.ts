import { IRouterMatcher, Router } from "express";
import { HttpMethodType, RouteSettingModel } from "../model/RouteSettingModel";
import { AsyncErrorHandler } from "../service/AsyncErrorHandler";

export abstract class RouteController {

    public router: Router;

    constructor() {
        this.router = Router();

        const methods: Record<HttpMethodType, IRouterMatcher<Router>> = {
            [HttpMethodType.GET]: this.router.get.bind(this.router),
            [HttpMethodType.POST]: this.router.post.bind(this.router),
            [HttpMethodType.PUT]: this.router.put.bind(this.router),
            [HttpMethodType.DELETE]: this.router.delete.bind(this.router),
        }

        const routeSettingModel: RouteSettingModel = this.getRouteSettingModel();
        const httpMethodType = routeSettingModel.httpMethodType;
        const endPoint = routeSettingModel.endPoint;
        const executeFunction = routeSettingModel.executeFunction;
        const httpMethod = methods[httpMethodType];

        httpMethod(endPoint, AsyncErrorHandler.asyncHandler(executeFunction.bind(this)));
    }

    protected abstract getRouteSettingModel(): RouteSettingModel;
}