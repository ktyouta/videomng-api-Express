---
name: performance-check
description: |
  実装完了後に、計算量・並列化の観点でチェックを行う。

  以下のような場合に必ず使用する：
  - 自分（Claude）が feature-impl / feature-modify の実装を完了した直後

  以下の場合は使用しない：
  - 調査・説明・設計相談のみの場合
version: 1.0.0
---

# Performance Check Skill

## Overview

実装後に、計算量の悪化・並列化漏れがないかチェックする。

チェック対象：Controller / Service / Repository

---

## Check Instructions

### N+1 クエリ
- ループ内（`for` / `forEach` / `map` 等）で Repository メソッド（Prisma への問い合わせ）を呼び出していないか
  - NG: `for (const id of ids) { await repo.find(id); }`
  - OK: `WHERE ... IN (...)` でまとめて取得する、または Prisma の `findMany` に配列条件を渡す

### 逐次 await の並列化
- 独立した複数の `await` が逐次実行になっていないか
  - NG: `const a = await fetchA(); const b = await fetchB();`（A と B が独立している場合）
  - OK: `const [a, b] = await Promise.all([fetchA(), fetchB()]);`
- 複数の DB 操作が逐次実行になっていないか（アトミック性が必要なら `prisma.$transaction([...])`、不要なら `Promise.all` で並列化できないか）

### 計算量
- ループ内でループ・`find` / `filter` を呼んでいないか（O(n²) 以上になっていないか）
  - NG: `items.map(item => list.find(x => x.id === item.id))`
  - OK: Map に変換して O(1) アクセス

---

## Procedure

1. 変更されたファイルを確認する
2. 各チェック項目を照合する
3. 以下の形式で報告する

---

## Output Format

問題がある場合：

```
## Performance Check 結果

### 問題あり
- **ファイル**: [ファイルパス:行番号]
- **問題内容**: 具体的な問題（N+1 / 逐次 await / O(n²) 等）
- **修正方針**: Promise.all / IN句でまとめる / Map 変換 等
```

問題がない場合：

```
## Performance Check 結果

チェック完了。問題なし。
```
