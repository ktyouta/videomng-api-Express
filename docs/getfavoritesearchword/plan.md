# getfavoritesearchword 実装計画

## 概要
お気に入りワード（`favorite_search_word_transaction`）を取得するエンドポイント。
getsearchword をベースにするが、以下の点が異なる:
- `favorite_search_word_transaction` には `search_count` が無いため「よく検索するワード（frequent）」は持たない
- recent/frequent の2分割はせず、**単一リスト**（`update_date` 降順・上限5件）を返す

## エンドポイント
- `GET /videomng/v1/favoritesearchword`（`ApiEndopoint.FAVORITE_SEARCH_WORD` 既存）
- ミドルウェア: `authMiddleware`

## レイヤー設計
- Controller: `GetFavoriteSearchWordController` — 認証ユーザーIDを取得し Service を1回呼んで結果を返す（レスポンスモデルは使わず配列を直接返却）
- Service: `GetFavoriteSearchWordService.getFavoriteSearchWord(frontUserIdModel)` — Repository へ委譲
- Repository: `favoriteSearchWordTransaction.findMany`（`select: {id, word}` / `where: {userId}` / `orderBy: {updateDate: 'desc'}` / `take: FAVORITE_SEARCH_WORD_FETCH_LIMIT`）

## 作成・変更ファイル
| ファイル | 操作 | 備考 |
|---|---|---|
| controller/GetFavoriteSearchWordController.ts | リネーム | GetSearchWordController から |
| service/GetFavoriteSearchWordService.ts | リネーム | 単一メソッド getFavoriteSearchWord |
| repository/GetFavoriteSearchWordRepositorys.ts | リネーム | DIコンテナ |
| repository/interface/GetFavoriteSearchWordInterface.ts | リネーム | frequent メソッド削除 |
| repository/concrete/GetFavoriteSearchWordRepositoryPostgres.ts | リネーム | 参照テーブルを favorite に、frequent 削除 |
| types/FavoriteSearchWordType.ts | リネーム | SearchWordType → FavoriteSearchWordType |
| const/GetFavoriteSearchWordConst.ts | リネーム | FAVORITE_SEARCH_WORD_FETCH_LIMIT = 5 |
| router/conf/RouteControllerList.ts | 変更 | コントローラ登録を追加 |

## タスク
- [x] ファイル・クラス・型・定数の命名を getfavoritesearchword 用に統一
- [x] Repository を favorite_search_word_transaction 参照に変更・frequent 削除
- [x] コメントを「お気に入りワード」に統一
- [x] RouteControllerList にコントローラ登録
- [x] tsc 型チェック通過
