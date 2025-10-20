import { CreateBlockCommentController } from "../../createblockcomment/controller/CreateBlockCommentController";
import { CreateFavoriteCommentController } from "../../createfavoritecomment/controller/CreateFavoriteCommentController";
import { CreateFavoriteVideoController } from "../../createfavoritevideo/controller/CreateFavoriteVideoController";
import { CreateFavoriteVideoMemoController } from "../../createfavoritevideomemo/controller/CreateFavoriteVideoMemoController";
import { CreateFrontUserInfoController } from "../../createfrontuserinfo/controller/CreateFrontUserInfoController";
import { DeleteBlockCommentController } from "../../deleteblockcomment/controller/DeleteBlockCommentController";
import { DeleteFavoriteCommentController } from "../../deletefavoritecomment/controller/DeleteFavoriteCommentController";
import { DeleteFavoriteVideoController } from "../../deletefavoritevideo/controller/DeleteFavoriteVideoController";
import { DeleteFavoriteVideoMemoController } from "../../deletefavoritevideomemo/controller/DeleteFavoriteVideoMemoController";
import { DownloadFavoriteVideoListCsvController } from "../../downloadfavoritevideolistcsv/controller/DownloadFavoriteVideoListCsvController";
import { FrontUserCheckAuthController } from "../../frontusercheckauth/controller/FrontUserCheckAuthController";
import { FrontUserLoginController } from "../../frontuserlogin/controller/FrontUserLoginController";
import { FrontUserLogoutController } from "../../frontuserlogout/controller/FrontUserLogoutController";
import { GetBlockCommentListController } from "../../getblockcommentlist/controller/GetBlockCommentListController";
import { GetChannelVideoListController } from "../../getchannelvideolist/controller/GetChannelVideoListController";
import { GetFavoriteCommentListController } from "../../getfavoritecommentlist/controller/GetFavoriteCommentListController";
import { GetFavoriteVideoCommentController } from "../../getfavoritevideocomment/controller/GetFavoriteVideoCommentController";
import { GetFavoriteVideoCustomController } from "../../getfavoritevideocustom/controller/GetFavoriteVideoCustomController";
import { GetFavoriteVideoDetialController } from "../../getfavoritevideodetail/controller/GetFavoriteVideoDetialController";
import { GetFavoriteVideoListController } from "../../getfavoritevideolist/controller/GetFavoriteVideoListController";
import { GetFavoriteVideoMemoController } from "../../getfavoritevideomemo/controller/GetFavoriteVideoMemoController";
import { GetFavoriteVideoSortListController } from "../../getfavoritevideosortlist/controller/GetFavoriteVideoSortListController";
import { GetFavoriteVideoTagListController } from "../../getfavoritevideotag/controller/GetFavoriteVideoTagListController";
import { GetTagListController } from "../../gettaglist/controller/GetTagListController";
import { GetVideoCategoryController } from "../../getvideocategory/controller/GetVideoCategoryController";
import { GetVideoCommentController } from "../../getvideocomment/controller/GetVideoCommentController";
import { GetVideoDetailController } from "../../getvideodetail/controller/GetVideoDetailController";
import { GetVideoListController } from "../../getvideolist/controller/GetVideoListController";
import { GetViewStatusListController } from "../../getviewstatuslist/controller/GetViewStatusListController";
import { HealthController } from "../../health/controller/HealthController";
import { SearchCommentByKeywordController } from "../../searchcommentbykeyword/controller/SearchCommentByKeywordController";
import { UpdateFavoriteVideoCustomController } from "../../updatefavoritevideocustom/controller/UpdateFavoriteVideoCustomController";
import { UpdateFavoriteVideoMemoController } from "../../updatefavoritevideomemo/controller/UpdateFavoriteVideoMemoController";
import { UpdateFavoriteVideoTagController } from "../../updatefavoritevideotag/controller/UpdateFavoriteVideoTagController";
import { UpdateFrontUserInfoController } from "../../updatefrontuserinfo/controller/UpdateFrontUserInfoController";
import { UpdateFrontUserPasswordController } from "../../updatefrontuserpassword/controller/UpdateFrontUserPasswordController";
import { UploadFavoriteVideoListCsvController } from "../../uploadfavoritevideolistcsv/controller/UploadFavoriteVideoListCsvController";
import { RouteController } from "../controller/RouteController";

/**
 * ルーティングリスト
 */
export const ROUTE_CONTROLLER_LIST: ReadonlyArray<RouteController> = [
    // フロントユーザー作成
    new CreateFrontUserInfoController(),
    // フロントユーザー更新
    new UpdateFrontUserInfoController(),
    // フロントユーザーパスワード更新
    new UpdateFrontUserPasswordController(),
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
    new UpdateFavoriteVideoCustomController(),
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
    // お気に入り動画コメント取得
    new GetFavoriteVideoCommentController(),
    // キーワード検索(コメント)
    new SearchCommentByKeywordController(),
    // ブロックコメント登録処理
    new CreateBlockCommentController(),
    // ブロックコメントリスト取得
    new GetBlockCommentListController(),
    // ブロックコメント削除
    new DeleteBlockCommentController(),
    // お気に入りコメント登録処理
    new CreateFavoriteCommentController(),
    // お気に入りコメントリスト取得
    new GetFavoriteCommentListController(),
    // お気に入りコメント削除処理
    new DeleteFavoriteCommentController(),
    // 動画カテゴリ取得
    new GetVideoCategoryController(),
    // 視聴状況リスト取得
    new GetViewStatusListController(),
    // タグリスト取得
    new GetTagListController(),
    // お気に入り動画タグ取得
    new GetFavoriteVideoTagListController(),
    // お気に入り動画タグ更新
    new UpdateFavoriteVideoTagController(),
    // お気に入り動画ソートリスト取得
    new GetFavoriteVideoSortListController(),
    // チャンネルの動画一覧取得
    new GetChannelVideoListController(),
    // お気に入り動画CSV取得
    new DownloadFavoriteVideoListCsvController(),
    // お気に入り動画CSV取込
    new UploadFavoriteVideoListCsvController(),
    // ヘルスチェック
    new HealthController(),
    // カスタム情報取得
    new GetFavoriteVideoCustomController(),
]