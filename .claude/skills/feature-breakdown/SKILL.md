---
name: feature-breakdown
description: |
  新機能の実装タスクをレイヤーごとに分解し、
  依存関係を考慮した実装順序を整理する。

  以下のような場合に使用する：
  - 実装計画・タスク分解だけを先に確認したいとき
  - 何から着手すべきか順序を整理したいとき
  - 実装の抜け・順序ミスを防ぎたいとき

  以下の場合は使用しない：
  - バグ修正（影響範囲は horizontal-scope を使う）
  - 調査・説明のみの場合
  - 設計から実装まで一貫して進める場合（→ feature-impl を使う）

  主なトリガーワード：
  - 「タスク分解だけしてほしい」
  - 「実装計画だけ先に見たい」
  - 「何から着手すべきか確認したい」
  - 「実装順序を整理したい」
  - 「タスクを洗い出してほしい」
version: 1.0.0
---

# Feature Breakdown Skill

## Overview

新機能の実装タスクを洗い出し、依存関係を考慮した順序で一覧提示する。

「何をどの順番で実装するか」を明確にすることが目的。

---

## Instructions

### Step 1: 機能の概要を把握する

実装する機能の以下を確認する：

- 何をするか（リクエスト・レスポンス・データ変化）
- Prisma スキーマの変更が必要か
- 新エンドポイントが必要か
- 認証・リソース所有者チェックが必要か

---

### Step 2: タスクを洗い出す

以下のレイヤーごとにタスクを列挙する。

- Prisma スキーマ変更（`prisma/schema.prisma`）
- マイグレーション生成（`npx prisma migrate dev`）
- ドメイン値オブジェクト（`internaldata/**/properties/` または機能フォルダの `model/`）
- バリデーションスキーマ（Zod、`schema/`）
- Entity（Repository への引き渡しパラメータオブジェクト）
- Repository interface
- Repository concrete（`PrismaClientInstance` 経由の DB アクセス）
- Service（ビジネスロジック）
- Controller（`RouteController` 継承、`getRouteSettingModel()`）
- `server/router/conf/ApiEndpoint.ts` へのエンドポイント登録
- テスト

---

### Step 3: 依存関係を整理して順序を決める

以下の原則で順序を決める：

1. **Prisma スキーマ → ドメイン層 → Repository → Service → Controller → ルーティング** の順が基本
2. Repository 内では **interface → concrete** の順
3. テストは各レイヤーの実装直後に行う
4. 複数エンドポイントに影響する共通処理（`internaldata/` の Repository・値オブジェクト）は最初に着手する

---

### Step 4: 結果を出力する

examples/expected-output.md の形式で提示する。

---

## Constraints

- 実装は行わない（計画作成のみ）
- 不要なタスクは含めない（機能に関係するものだけ列挙する）
- 各タスクには依存する前提タスクを明記する
- コンテキストに既出のプランがあっても、必ず Step 4 まで完走して完全な出力を行う
