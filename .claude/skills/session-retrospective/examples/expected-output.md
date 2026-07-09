# session-retrospective 期待出力例

## ケース1: 良い例（OK・パターンあり）

### 状況
feature-impl でエンドポイントを実装したが、ユーザーから「Repositoryの中でPrismaのクエリビルダと生SQLが混在していて統一されていない」と2回指摘された。

### 期待出力

```
## Session Retrospective

### 検出パターン

1. **Repository内でのDBアクセス手段の不統一**
   - 発生: 2回（生SQL/クエリビルダ混在の指摘）
   - 対象Skill: backend-review
   - 提案: 「1機能内でPrismaのクエリビルダとgenerateRaw系を混在させない」チェック項目を追加

### Phase突合結果
- backend-review は実行されていたが、DBアクセス手段の統一性は Check Instructions に含まれていなかった（記載漏れ）

### 次のアクション
- skill-gap-detector を実行し、backend-review への追記を正式に提案する
```

## ケース2: 悪い例（NG）

### 状況
パターンが1回しか観測されていない、または再現性が確認できない状況。

### 期待出力（何もしないのが正解）

```
（出力なし）
```

### 補足
- 1回限りの判断ミスや「おそらく」レベルの推測しかない場合は、無理に提案を出さない。これがこのスキルの正しい振る舞い。
