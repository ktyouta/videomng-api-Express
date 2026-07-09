# skill-overlap-check 期待出力例

## ケース1: 良い例（OK・部分重複）

### 状況
「Prisma の生SQLがちゃんとパラメータ化されているかだけをチェックするSkillを作りたい」という依頼を受けた。

### 期待出力

```
## Skill Overlap Check 結果

### 目的
- Prisma の $queryRaw / $queryRawUnsafe のパラメータ化漏れ（SQLインジェクション観点）のみを検出したい

### 既存スキルとの照合
- backend-review: Repository の単一操作性・命名規約と合わせて「パラメータ化されているか」の項目が既に存在する（部分重複）
- resource-authz-review: WHERE句のuserIdフィルタ文脈でパラメータ化の確認をしている（部分重複）
- security-expert（agent）: SQLインジェクションの観点で同種のチェックを担っている（部分重複）

### 判定
- 部分重複。新規スキルとして独立させるほどの単一責務ではなく、既存3箇所のチェック項目に「文字列結合の有無」を明示的に追記する方が適切

### 推奨アクション
- 新規作成しない
- backend-review・resource-authz-review の該当項目に「テンプレートリテラルへの直接埋め込みがないか」を追記する
```

## ケース2: 悪い例（NG）

### 状況
同じ依頼に対して以下のように回答した場合、このスキルの違反となる。

```
新しく sql-param-review という Skill を作りましょう。
```

### 何が違反か
- 既存スキル（backend-review・resource-authz-review・security-expert）の確認を一切行っていない
- 重複の可能性を検討せずに新規作成を即決している
