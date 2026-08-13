# createfavoritesearchword 実装計画

## 概要
お気に入りワード（`favorite_search_word_transaction`）を登録するエンドポイント。
※ 当初 `server/createsearchword` フォルダに実装されていたが、フォルダ名誤りのため `createfavoritesearchword` へ移動した。

## エンドポイント
- `POST /videomng/v1/favoritesearchword`（`ApiEndopoint.FAVORITE_SEARCH_WORD`）
- ミドルウェア: `authMiddleware`

## 仕様
- リクエストボディ `{ word: string }`（Zod: 1文字以上）
- 登録済みお気に入りワードを取得し、以下を判定:
  - 重複（同一 word が既存）→ 409 CONFLICT で「既に登録されているお気に入りワードです。」
  - 登録上限（`FAVORITE_SEARCH_WORD_REGISTRATION_LIMIT = 5`）到達 → 409 CONFLICT で「最大5件まで登録可能です。」
  - いずれも該当なし → `favorite_search_word_transaction` に登録
- 書き込みは単一 insert のためトランザクションは使わない（重複は unique(userId, word) 制約が最終防御）

## レイヤー
- Controller: バリデーション → 値オブジェクト構築 → tx 内で重複/上限判定 → Service.insert
- Service: `getFavoriteSearchWord`（判定用取得）/ `insertFavoriteSearchWord`（Entity構築＋insert）
- Repository: `getFavoriteSearchWord`（findMany）/ `insert`（create, tx）
- Entity: `CreateFavoriteSearchWordEntity`（FrontUserIdModel + FavoriteSearchWord）

## タスク
- [x] フォルダを createfavoritesearchword へ移動
- [x] Interface に insert 追加
- [x] Service.insertFavoriteSearchWord 実装
- [x] Controller 完成（バリデーション・重複409・上限・登録）
- [x] 定数を登録上限の意味に改名
- [x] RouteControllerList 登録
- [x] tsc 通過
