# deletefavoritesearchword 実装計画

## 概要
お気に入りワード（`favorite_search_word_transaction`）を1件削除するエンドポイント。
`deletesearchword` と同一構造で、対象テーブル・エンドポイント・値オブジェクトのみ異なる。

## エンドポイント
- `DELETE /videomng/v1/favoritesearchword/:id`（`ApiEndopoint.FAVORITE_SEARCH_WORD_ID` 既存）+ `authMiddleware`
- トランザクションは使用しない（単一 delete）

## 仕様
- `:id` を Zod 検証（数値・正）→ 失敗は 422
- `FavoriteSearchWordId` 値オブジェクトに変換
- **所有者スコープ**: `favoriteSearchWordTransaction.deleteMany({ where: { id, userId } })`
- 削除件数 0 → 404「対象のお気に入りワードが存在しません。」／1 → 200「お気に入りワードを削除しました。」

## 作成ファイル
| ファイル | 操作 |
|---|---|
| internaldata/favoritesearchwordtransaction/properties/FavoriteSearchWordId.ts | 新規（値オブジェクト） |
| deletefavoritesearchword/controller/DeleteFavoriteSearchWordController.ts | 新規 |
| deletefavoritesearchword/schema/PathParamSchema.ts | 新規 |
| deletefavoritesearchword/service/DeleteFavoriteSearchWordService.ts | 新規 |
| deletefavoritesearchword/repository/{DI,interface,concrete} | 新規 |
| router/conf/RouteControllerList.ts | 変更（登録追加） |

## タスク
- [x] FavoriteSearchWordId 値オブジェクト
- [x] PathParamSchema
- [x] Repository deleteMany（所有者スコープ）
- [x] Service / Controller
- [x] RouteControllerList 登録
- [x] tsc 通過
