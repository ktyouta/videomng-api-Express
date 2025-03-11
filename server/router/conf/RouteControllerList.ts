import { CreateFavoriteVideoController } from "../../createfavoritevideo/controller/CreateFavoriteVideoController";
import { CreateFrontUserInfoController } from "../../createfrontuserinfo/controller/CreateFrontUserInfoController";
import { DeleteFavoriteVideoController } from "../../deletefavoritevideo/controller/DeleteFavoriteVideoController";
import { FrontUserLoginController } from "../../frontuserlogin/controller/FrontUserLoginController";
import { FrontUserLogoutController } from "../../frontuserlogout/controller/FrontUserLogoutController";
import { GetFavoriteVideoDetialController } from "../../getfavoritevideodetail/controller/GetFavoriteVideoDetialController";
import { GetFavoriteVideoListController } from "../../getfavoritevideolist/controller/GetFavoriteVideoListController";
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
    // ログアウト
    new FrontUserLogoutController(),
    // お気に入り動画登録処理
    new CreateFavoriteVideoController(),
    // お気に入り動画更新処理
    new UpdateFavoriteVideoController(),
    // お気に入り動画削除処理
    new DeleteFavoriteVideoController(),
    // お気に入り動画リスト取得
    new GetFavoriteVideoListController(),
    // お気に入り動画詳細取得
    new GetFavoriteVideoDetialController(),
]