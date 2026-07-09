---
name: resource-authz-review
description: |
  バックエンドのコード変更が完了した直後に、リソース認可の観点でチェックを行う。
  「認証済みユーザーが自分以外のリソースにアクセス・操作できる穴」を検出する。

  以下のような場合に必ず呼び出す：
  - server/ 配下の Controller / Service / Repository を新規作成・修正したとき（authMiddleware を使うエンドポイント）

  以下の場合は使用しない：
  - 調査・説明・設計相談のみの場合
version: 1.0.0
---

# Resource Authorization Review Skill

## Overview

バックエンド実装後に、リソース認可の違反パターンをチェックする。

「認証済みユーザーが自分以外のリソースにアクセス・操作できる穴」を検出することが目的。

---

## Check Instructions

### パスパラメータの userId と認証済み userId の照合

- Controller でパスパラメータに `userId` に相当する ID を受け取る場合、`req.userInfo.frontUserIdModel`（`AuthenticatedRequest` から取得できる認証済みユーザーID）との一致確認があるか
- 一致確認なしに Repository に渡している場合、他ユーザーのリソースを操作できる

### リソース ID パスパラメータの所有者確認

- `userId` 以外のリソース ID（`folderId`・`videoId` 等）をパスパラメータで受け取る場合、そのリソースが認証済みユーザーに属しているかを確認しているか
- 確認方法（いずれか）:
  - Repository の SQL の WHERE 句に `user_id = $n` 等、認証済みユーザーIDによる絞り込みを含める（推奨）
  - 取得後に所有者と `req.userInfo.frontUserIdModel` を比較し、不一致なら 401/403/404 相当のエラーを返す
- リソース ID のみで取得（userId フィルタなし）は他ユーザーのリソースを操作できる

### Repository に渡す userId の出所

- SELECT / UPDATE / DELETE に使う userId は必ず `req.userInfo.frontUserIdModel` 経由で来ているか
- パスパラメータやリクエストボディの userId を照合なしで Repository・Entity に渡していないか

### Repository の WHERE 句に userId フィルタが存在するか

- 生SQL（`$queryRaw` / `$queryRawUnsafe`）の SELECT / UPDATE / DELETE の WHERE 句に、認証済みユーザーIDによる絞り込みが含まれているか
- userId フィルタがない場合、全ユーザーのデータにアクセス・操作できる
- WHERE 句のパラメータがプレースホルダ（`$1`, `$2`...）経由で渡されているか（文字列結合で埋め込んでいないか。これは injection の観点でもある）

---

## Procedure

1. 変更されたバックエンドファイルを確認する
2. `authMiddleware` が適用されているエンドポイントのみを対象とする（公開エンドポイントは対象外）
3. 各チェック項目を照合する
4. 以下の形式で報告する

---

## Output Format

違反がある場合：

```
## Resource Authorization Review 結果

### 違反あり
- **ファイル**: [ファイルパス:行番号]
- **違反内容**: 具体的な問題
- **修正方針**: 修正の方向性
```

違反がない場合：

```
## Resource Authorization Review 結果

チェック完了。問題なし。
```
