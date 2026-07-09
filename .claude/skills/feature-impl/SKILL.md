---
name: feature-impl
description: |
  新機能の実装を設計から完了まで一貫して進める。

  以下のような場合に使用する：
  - 「〇〇機能を実装したい」
  - 「〇〇を作りたい」
  - 「〇〇を追加して」

  以下の場合は使用しない：
  - バグ修正（bug-fix を使う）
  - 調査・説明のみの場合
version: 1.0.0
---

# Feature Implementation Skill

## Overview

新機能の実装を、設計 → 確認 → 実装 → レビュー → 仕様突き合わせ の順で一貫して進める。
途中でユーザー確認を挟み、誤った方向に進まないようにする。

このプロジェクトはバックエンド専用の REST API（フロントエンドを持たない）である。フロントエンド実装・RPC関連の手順は存在しない。

---

## Steps

### Step 0: plan.md の確認

実装を開始する前に `docs/` 配下に対象機能の `plan.md` が存在するか確認する。

- 存在する場合: feature-resume を実行し、再開ポイントを特定してから当該ステップへジャンプする
- 存在しない場合: Step 1 から通常通り進める

---

### Step 1: 設計分解

feature-breakdown を実行し、機能をレイヤーごとのタスクに分解する。

---

### Step 2: 設計書を出力

分解した設計を `docs/[機能名]/plan.md` に出力する。
既存ファイルがある場合は上書きせず、ユーザーに確認する。

---

### Step 3: ユーザー確認（設計・ファイル構成）

impl-planner を実行し、設計内容・作成ファイル一覧・フォルダ構成チェックをまとめてユーザーに提示する。

```
## 設計確認

### エンドポイント
- ...

### レイヤーごとの実装内容
- Controller: ...
- Service メソッド: ...
- Repository メソッド: ...

### 作成・変更ファイル一覧

| ファイルパス | レイヤー | 操作 |
|---|---|---|
| server/xxx/controller/XxxController.ts | Controller | 新規 |
| server/xxx/service/XxxService.ts | Service | 新規 |
| server/xxx/repository/interface/XxxInterface.ts | Repository | 新規 |
| server/xxx/repository/concrete/XxxRepositoryPostgres.ts | Repository | 新規 |
| ... | ... | ... |

新規ユーティリティファイル・共有ファイルを作成する場合は、以下も明示する：

| ファイルパス | 責務 | export するもの |
|---|---|---|
| ... | ... | ... |

### 仕様要件チェック（docs/[機能名]/spec.md 準拠）
docs/[機能名]/spec.md が存在する場合のみ実施する。

- spec.md から要件項目を抽出したか
- 全ての要件項目が設計（エンドポイント・Service・Repository）に反映されているか

### フォルダ構成チェック（既存パターン準拠）
- `server/<機能名>/` 単位でフォルダが切られているか
- Repository が `interface/` + `concrete/` の対で存在するか
- Controller が `RouteController` を継承しているか

### バックエンド設計チェック
- Service メソッドが 1操作1メソッドになっているか（複数の DB アクセス・分岐・計算を1メソッドに詰め込んでいないか）
- Controller の呼び出し順序でフローが読めるか
- 実装に必要な全 ID 型・値型に対応するドメイン値オブジェクトが存在するか確認したか
- 認証が必要なエンドポイントに `authMiddleware` を含めたか
- リソース所有者チェック（パスパラメータの ID と認証済みユーザーの突き合わせ）が必要か検討したか

問題がなければ実装に進みます。よろしいですか？
```

ユーザーの OK を得てから次へ進む。

---

### Step 4: 実装

Step 3 の実装計画に沿って実装する。

実装時に以下を必ず守る：

- 非 null アサーション（`!`）を安易に使わない
  - `req.userInfo!` のような書き方は避け、必要ならガード節（`if (!x) { ... }`）で対処する
- レスポンスは `ApiResponse.create(res, status, message, data)` で統一する

#### 【必須・ブロッキング】schema.prisma を変更した場合のDBマイグレーション

`prisma/schema.prisma` に変更を加えた場合、コード実装を完了した後に以下を**必ずこの順で**実行する：

1. `npx prisma migrate dev --name <変更内容>` を実行する
2. 生成された `prisma/migrations/<timestamp>_<name>/migration.sql` の内容が期待通りか確認する
3. 確認できたら Step 5 に進む

**このステップを完了しない限り Step 5 に進んではならない。**

以下は**絶対禁止**：
- `prisma/migrations/` 配下のファイルを手動で新規作成・編集すること（`migrate dev` の代替にはならない）
- `migrate dev` の実行をスキップして「SQL 手書きで済ませる」こと

トリガー・関数など Prisma のマイグレーションで表現しにくい変更は `sql/` 配下に追加し、適用手順をユーザーに明示する。

#### 【型チェック】実装完了後に型エラーがないか確認する

`npx tsc --noEmit` を実行し、型エラーが 0 件になってから次の Step に進む。

---

### Step 5: レビュー実行

backend-review を実行する。

---

### Step 6: ユーザー確認

以下の形式で出力し、ユーザーの確認を得る。

```
## 実装完了

### 変更ファイル
- [ファイルパス]: 追加・変更の概要

### 実装内容サマリー
- エンドポイント: ...
- Service メソッド: ...
- Repository メソッド: ...

### backend-review 結果
- 問題なし / 違反あり（詳細）

確認できたら実装を続けます。よろしいですか？
```

ユーザーの OK を得てから次へ進む。

**注意**: この時点では plan.md の更新を行わない。spec-review（Step 8）通過後の Step 9 で実施する。

---

### Step 7: 追加レビュー実行

以下のレビューを実行する（該当する場合のみ）：

- architecture-review（必須）
- comments-review（必須）
- performance-check（以下の**全てに**該当しない場合のみスキップ可。迷ったら実行する）
  - Service にループ内 DB アクセスがない
  - 独立した複数の非同期処理が `Promise.all` 化されている
- resource-authz-review（認証が必要なエンドポイントの場合は必須）
- db-naming-review（Prisma スキーマを変更した場合は必須）

**NG が検出された場合**: 各レビュー内で NG を修正し、Step 7 の末尾に以下を記録する：
```
NG 累計: [n] 件 → Step 10 で skill-gap-detector を必ず実行すること
```
NG が 0 件の場合は何も記録しない。

---

### Step 8: 仕様突き合わせ

spec-review を実行する（`docs/[機能名]/spec.md` が存在する場合のみ）。

---

### Step 9: plan.md 更新

> **実行前確認**（`[x]` に変更する前に以下を満たすこと）:
> - Step 7 で NG が検出されていた場合、修正が完了しているか
> - Step 8 spec-review の「未実装」「仕様と異なる実装」が 0 件か
>
> 未達の項目がある場合は `[x?]`（仮マーク）にとどめ、解消後に `[x]` に変更する。

`docs/[機能名]/plan.md` を Read し、今回実装したタスクに対応する行を特定して更新する。

- 実装完了したタスクの `[ ]` を `[x]` に変更する
- 設計議論を経て実装内容が当初の計画から変わった場合は、タスク説明も実態に合わせて修正する
- plan.md が存在しない場合はスキップする

---

### Step 10: NG 対応

**NG が 1 件でもある場合は必須**（修正済みでも実行すること）

「NG」の定義（以下のいずれかを含む場合）:
- Step 5: backend-review「違反あり」
- Step 7: architecture-review / comments-review / performance-check / resource-authz-review / db-naming-review のいずれかで「違反あり」
- Step 8: spec-review の「未実装」または「仕様と異なる実装」（スコープ縮小による意図的な差分も NG としてカウントする）

上記の NG があった場合、修正した後であっても skill-gap-detector を実行し、
既存 skill の検出漏れを特定して修正提案を行う。

NG がゼロ件だった場合はスキップしてよい。

---

### Step 11: session-retrospective 実行

> **実行前チェックゲート** — 以下を確認してから session-retrospective を実行すること：
>
> - Step 5・7・8 での NG 件数: ___ 件
> - NG が 0 件 → そのまま続行
> - NG が 1 件以上 → `skill-gap-detector` を実行済みか？　未実行の場合は Step 10 に戻る

全ステップ完了後に session-retrospective を実行する。

---

## Constraints

- 各 Step は順番通りに実行する（並行実行しない）
- 機能の規模にかかわらず Step 2 の plan.md 作成を省略しない（「小さい機能だから不要」と判断しない）
- ユーザー確認（Step 3・6）では必ずユーザーの明示的な OK を得てから次に進む
- Step 9 の plan.md 更新は spec-review 通過後に行う（NG 残存状態で `[x]` にしない）
- エラーや NG を無視して次のステップに進まない
- 指示にない機能を実装に追加しない
- schema.prisma を変更した場合は必ず `npx prisma migrate dev` を実行する。`prisma/migrations/` を手動作成しない
- コーディング規約・チェック項目の追加は skill ファイルにのみ行う。skill で対応できる内容を CLAUDE.md に追記しない
