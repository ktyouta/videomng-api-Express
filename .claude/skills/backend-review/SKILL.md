---
name: backend-review
description: |
  バックエンドのコード変更が完了した直後に、レイヤー設計・単一責務の観点でチェックを行う。

  以下のような場合に必ず呼び出す：
  - server/ 配下の Controller / Service / Repository / Entity を新規作成・修正したとき
  feature-impl / feature-modify / bug-fix / refactor を経由しない実装（plan.md ベースの手動実装等）でも、上記の条件を満たす変更を行った場合は必ず実行すること。

  以下の場合は使用しない：
  - 調査・説明・設計相談のみの場合
version: 1.0.0
---

# Backend Review Skill

## Overview

バックエンド実装後に、レイヤー設計・単一責務の違反パターンをチェックする。

**呼び出し条件（必須）**
- `server/` 配下の Controller / Service / Repository / Entity を新規作成・修正したとき
- feature-impl / feature-modify / bug-fix / refactor を経由しない手動実装でも、上記条件を満たす変更を行った場合は必ず実行すること

**対象外**
- 調査・説明・設計相談のみの場合

---

## Check Instructions

### Controller 単一責務
- Controller（`RouteController` を継承したクラス）内にビジネスロジック・データ変換処理が直書きされていないか
- `doExecute` 内の処理の流れが上から順に読めるか（Service 呼び出しの順序でエンドポイントの処理概要が理解できるか）
- `getRouteSettingModel()` がルーティング定義（HTTPメソッド・エンドポイント・ミドルウェア）のみを返しているか
- パスパラメータ・クエリ・ボディのバリデーション（Zod の `safeParse`）結果を確認せずに後続処理に進んでいないか
- レスポンスが `ApiResponse.create(res, status, message, data)` で統一されているか（直接 `res.json()` / `res.send()` を呼んでいないか）

### Service メソッド設計
- Controller から呼ばれる処理単位でメソッドに切り出されているか
- DB に触れない純粋なビジネスロジック（パスワード検証など）もメソッドとして定義されているか
- Controller が単一の `service.xxx()` 呼び出しで完結していないか確認する
  - アンチパターン: `service.checkin()` 1つがデータ取得・エンティティ構築・分岐・DB操作をすべて担っている
  - 正しいパターン: 取得・登録・更新の処理単位でメソッドを分割し、Controller の呼び出し順でフローが読める
- ロジックを含まない処理が Service メソッドになっていないか
  - ロジックの例（例示であって網羅ではない）: 条件分岐・ループ・計算・DB アクセス
  - アンチパターン: 内部で単に `new XxxEntity(...)` するだけのメソッドを Service に定義している
  - 正しいパターン: ロジックを含まない単純な構築・変換は Controller で直接行う

### フォルダ・ファイル構成
- `server/<機能名>/` 単位でフォルダが切られているか（機能名は既存の命名パターン（動詞+名詞の連結、小文字）に沿っているか。例: `getfolder`, `createfavoritevideo`）
- Controller が `<操作><対象>Controller.ts`（例: `GetFolderController.ts`）の命名になっているか
- Entity が `<操作種別><対象>Entity.ts`（例: `SelectFolderEntity.ts`）の命名になっているか
- Repository が `interface/` に `<対象>Interface.ts`、`concrete/` に `<対象>RepositoryPostgres.ts`（または実装方式を表す名前）の対で存在するか
- Service が `<対象>Service.ts` の命名になっているか
- 既存の類似機能フォルダと構成パターンが一致しているか（迷ったら近い既存機能を Read して比較する）

### コーディング規約
- ユーティリティ関数（日付変換・文字列変換等）を Service / Controller 内に直接定義していないか
  - 実装前に `server/util/` の既存関数と重複がないか確認すること
  - 複数ファイルで同じ関数が定義されている場合は `server/util/` に集約する
- `if` 文が1行でも中括弧 `{ }` を省略していないか。また処理が1行でも `{ return; }` のように同一行に収めず、改行して記述されているか
- 非 null アサーション（`!`）を使っていないか
  - アンチパターン: `req.userInfo!.frontUserIdModel` / `map.get(key)!` など `.get()` 系メソッド全般
  - 正しいパターン: ガード節（`if (!x) { ... }`）で明示的に処理する
- メソッド名にパラメータ情報（`ById`・`ByName` 等）が含まれていないか（複数パラメータで識別が必要な場合は除く）
- クラス・メソッドに `@param` / `@returns` を含む複数行 JSDoc 形式のコメントがあるか（既存コードの慣習）
- マジックナンバーが直接記述されていないか（名前付き定数に切り出すこと。定数は `common/const/` に集約する）
- `ApiResponse.create()` の `message` が意味のない固定文言のままになっていないか（エンドポイントごとに日本語で処理結果を表すメッセージを返すこと）
- ドメイン値オブジェクト（`FolderIdModel` 等）が存在する対象を `string` / `number` のまま直接受け渡ししていないか

### Repository 単一操作
- Repository の1メソッドが複数の異なる DB 操作（無関係な複数テーブルへのSELECT/INSERT/UPDATE）を1メソッドに詰め込んでいないか
- テーブル操作は Repository に集約されているか（Service・Controller に Prisma（`PrismaClientInstance`）の直接呼び出しが混入していないか）
- `interface/` と `concrete/` が対で存在し、DI コンテナ（`RepositoryType` をキーにした `Xxxs.ts`）経由で取得しているか
- `$queryRawUnsafe` を使う場合、SQL 文字列にユーザー入力を直接埋め込まず、プレースホルダ（`$1`, `$2`...）でパラメータ化されているか（resource-authz-review・security-expert とも重複するがここでも確認する）

---

## Constraints

- 複数の DB 操作をアトミックに実行する必要がある場合、Prisma のトランザクション（`prisma.$transaction([...])` または対話型トランザクション）を使う。個別に `await` を重ねて疑似的にまとめない
- 既存機能との構造の一貫性を優先する。新しいパターンを導入する場合は design-proposal で複数案を検討してから提案する

---

## Procedure

1. 変更されたバックエンドファイルを確認する
2. Controller / Service / Repository / Entity のレイヤーを特定する
3. 各チェック項目を照合する
4. 以下の形式で報告する

---

## Output Format

違反がある場合：

```
## Backend Review 結果

### 違反あり
- **ファイル**: [ファイルパス:行番号]
- **違反内容**: 具体的な問題
- **修正方針**: 修正の方向性
```

違反がない場合：

```
## Backend Review 結果

チェック完了。問題なし。
```
