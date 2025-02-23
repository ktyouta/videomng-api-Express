import { CreateFrontUserInfoController } from "../../createfrontuserinfo/controller/CreateFrontUserInfoController";
import { RouteController } from "../controller/RouteController";


export const ROUTE_CONTROLLER_LIST: ReadonlyArray<RouteController> = [
    new CreateFrontUserInfoController(),
]