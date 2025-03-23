import { CreateBlockCommentController } from "../../createblockcomment/controller/CreateBlockCommentController";
import { CreateFavoriteVideoController } from "../../createfavoritevideo/controller/CreateFavoriteVideoController";
import { CreateFavoriteVideoMemoController } from "../../createfavoritevideomemo/controller/CreateFavoriteVideoMemoController";
import { CreateFrontUserInfoController } from "../../createfrontuserinfo/controller/CreateFrontUserInfoController";
import { DeleteFavoriteVideoController } from "../../deletefavoritevideo/controller/DeleteFavoriteVideoController";
import { DeleteFavoriteVideoMemoController } from "../../deletefavoritevideomemo/controller/DeleteFavoriteVideoMemoController";
import { FrontUserCheckAuthController } from "../../frontusercheckauth/controller/FrontUserCheckAuthController";
import { FrontUserLoginController } from "../../frontuserlogin/controller/FrontUserLoginController";
import { FrontUserLogoutController } from "../../frontuserlogout/controller/FrontUserLogoutController";
import { GetFavoriteVideoDetialController } from "../../getfavoritevideodetail/controller/GetFavoriteVideoDetialController";
import { GetFavoriteVideoListController } from "../../getfavoritevideolist/controller/GetFavoriteVideoListController";
import { GetFavoriteVideoMemoController } from "../../getfavoritevideomemo/controller/GetFavoriteVideoMemoController";
import { GetVideoCommentController } from "../../getvideocomment/controller/GetVideoCommentController";
import { GetVideoDetailController } from "../../getvideodetail/controller/GetVideoDetailController";
import { GetVideoListController } from "../../getvideolist/controller/GetVideoListController";
import { SearchCommentByKeywordController } from "../../searchcommentbykeyword/controller/SearchCommentByKeywordController";
import { UpdateFavoriteVideoController } from "../../updatefavoritevideo/controller/UpdateFavoriteVideoController";
import { UpdateFavoriteVideoMemoController } from "../../updatefavoritevideomemo/controller/UpdateFavoriteVideoMemoController";
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
    // 認証チェック
    new FrontUserCheckAuthController(),
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
    // お気に入り動画メモ取得
    new GetFavoriteVideoMemoController(),
    // お気に入り動画メモ登録
    new CreateFavoriteVideoMemoController(),
    // お気に入り動画メモ削除
    new DeleteFavoriteVideoMemoController(),
    // お気に入り動画メモ更新
    new UpdateFavoriteVideoMemoController(),
    // 動画コメント取得
    new GetVideoCommentController(),
    // キーワード検索(コメント)
    new SearchCommentByKeywordController(),
    // ブロックコメント登録処理
    new CreateBlockCommentController(),
]