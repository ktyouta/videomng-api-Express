---
name: db-naming-review
description: |
  DBテーブル設計・Prisma スキーマ定義を行った直後に、既存の命名規則の遵守を確認する。

  以下のような場合に必ず呼び出す：
  - Prisma スキーマ（prisma/schema.prisma）でモデルを新規作成・修正したとき
  - ER図・データモデルを設計・提案するとき
  - マイグレーションを生成・レビューするとき

  以下の場合は使用しない：
  - テーブル定義を含まないバックエンド変更
  - 調査・説明のみの場合
version: 1.0.0
---

# DB Naming Review Skill

## Overview

DBテーブル名・共通カラムが、このプロジェクトの既存の命名規則に従っているかチェックする。

このプロジェクトの命名規則は独自に定めるものではなく、`prisma/schema.prisma` に既に存在する慣習を根拠とする。新規モデルを追加・レビューする際は、必ず既存モデル定義を Read してから照合すること。

---

## 既存の命名規則（prisma/schema.prisma より）

| データ種別 | サフィックス | 例 |
|---|---|---|
| マスターデータ（変更頻度が低い参照データ） | `Master` | `FrontUserLoginMaster`, `FrontUserInfoMaster`, `FolderMaster` |
| トランザクションデータ（業務上発生するイベント・履歴） | `Transaction` | `FavoriteVideoTransaction`, `FavoriteVideoCommentTransaction` |

- Prisma のモデル名は PascalCase、実テーブル名は `@@map("snake_case")` でスネークケースにマッピングする（例: `FrontUserLoginMaster` → `@@map("front_user_login_master")`）
- カラムも Prisma 側は camelCase、実カラム名は `@map("snake_case")` でマッピングする

---

## 共通カラム規約（既存モデルより）

多くのテーブルに以下のカラムが存在する。新規テーブルでも踏襲する。

```prisma
createDate  DateTime @db.Timestamptz @map("create_date")
updateDate  DateTime @db.Timestamptz @map("update_date")
deleteFlg   String   @db.Char(1)     @map("delete_flg")
```

- `deleteFlg` は boolean ではなく `Char(1)` の `"0"`（未削除）/ `"1"`（削除済み）で表現する（`common/const/CommonConst.ts` の `FLG.OFF` / `FLG.ON` を使う）
- `createDate` / `updateDate` は `DateTime @db.Timestamptz` で保持する

---

## Check Instructions

- モデル名に `Master` または `Transaction` サフィックスが付いているか
- データ種別に対して正しいサフィックスが選ばれているか
  - 参照・設定データ → `Master`
  - 記録・履歴・イベントデータ → `Transaction`
- サフィックスなしのモデル名が残っていないか（`TestConnection` のような例外的な既存モデルは対象外）
- `createDate` / `updateDate` / `deleteFlg` の3カラムが既存の型・マッピング規約通りに含まれているか
- `@@map` / `@map` によるスネークケースへのマッピングが漏れていないか

---

## Procedure

1. 変更・追加されたモデル定義（`prisma/schema.prisma`）を確認する
2. 既存の類似モデル（同じ `Master` / `Transaction` 系統）と比較する
3. 各モデル名をチェック項目と照合する
4. 以下の形式で報告する

---

## Output Format

違反がある場合：

```
## DB Naming Review 結果

### 違反あり
- **モデル名**: [現在の名前]
- **問題**: サフィックスがない / 種別に合わないサフィックス / 共通カラム不足 / マッピング漏れ
- **修正案**: [修正内容]
```

違反がない場合：

```
## DB Naming Review 結果

チェック完了。命名規則・共通カラムに問題なし。
```
