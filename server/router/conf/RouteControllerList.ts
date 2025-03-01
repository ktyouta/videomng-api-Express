import { CreateFavoriteVideoController } from "../../createfavoritevideo/controller/CreateFavoriteVideoController";
import { CreateFrontUserInfoController } from "../../createfrontuserinfo/controller/CreateFrontUserInfoController";
import { FrontUserLoginController } from "../../frontuserlogin/controller/FrontUserLoginController";
import { GetVideoDetailController } from "../../getvideodetail/controller/GetVideoDetailController";
import { GetVideoListController } from "../../getvideolist/controller/GetVideoListController";
import { UpdateFavoriteVideoController } from "../../updatefavoritevideo/controller/UpdateFavoriteVideoController";
import { RouteController } from "../controller/RouteController";

/**
 * ルーティングリスト
 */
export const ROUTE_CONTROLLER_LIST: ReadonlyArray<RouteController> = [
    // フロントユーザー作成
    new CreateFrontUserInfoController(),
    // 動画一覧取得
    new GetVideoListController(),
    // 動画詳細取得
    new GetVideoDetailController(),
    // ログイン
    new FrontUserLoginController(),
    // お気に入り動画登録処理
    new CreateFavoriteVideoController(),
    // お気に入り動画更新処理
    new UpdateFavoriteVideoController(),
]