# deletesearchword 実装計画

## 概要
検索実績（`search_word_transaction`）を1件削除するエンドポイント。

## エンドポイント
- `DELETE /videomng/v1/searchword/:id`（`ApiEndopoint.SEARCH_WORD_ID` 既存）
- ミドルウェア: `authMiddleware`
- トランザクションは使用しない（単一 delete）

## 仕様
- パスパラメータ `:id` を Zod で検証（数値・正）
- **所有者スコープ**: `deleteMany({ where: { id, userId } })` で認証ユーザー自身のレコードのみ削除（他ユーザーの検索実績を消せないようにする）
- 削除件数 0 件（存在しない or 他人のID）→ **404**「対象の検索実績が存在しません。」（id の存在有無を漏らさない）
- `:id` は Zod 検証後、`SearchWordId` 値オブジェクトに変換（既存の削除系と同じ慣習）

## レイヤー
- Controller: パスパラメータ検証 → Service 呼び出し → 結果に応じてレスポンス
- Service: `deleteSearchWord(frontUserIdModel, searchWordId)` → Repository へ委譲
- Repository: `deleteMany({ where: { id, userId } })`（ORM、tx なし）、削除件数を返す

## 作成ファイル
| ファイル | 操作 |
|---|---|
| controller/DeleteSearchWordController.ts | 新規 |
| schema/PathParamSchema.ts | 新規 |
| service/DeleteSearchWordService.ts | 新規 |
| repository/DeleteSearchWordRepositorys.ts | 新規 |
| repository/interface/DeleteSearchWordRepositoryInterface.ts | 新規 |
| repository/concrete/DeleteSearchWordRepositoryPostgres.ts | 新規 |
| router/conf/RouteControllerList.ts | 変更（登録追加） |

## タスク
- [x] SearchWordId 値オブジェクト作成
- [x] パスパラメータ Zod スキーマ
- [x] Repository deleteMany（所有者スコープ）
- [x] Service / Controller
- [x] RouteControllerList 登録
- [x] tsc 通過
