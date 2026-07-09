# horizontal-scope 期待出力例

## ケース1: 良い例（OK）

### 状況
「削除済みレコード（deleteFlg = '1'）を除外する WHERE 条件を GetFolder の Repository に追加する」実装を始める前に調査した。

### 期待出力

```
## 水平展開対象ファイル一覧

### 変更パターン
- 既存 Repository の SELECT 系 SQL に deleteFlg 除外条件を追加するパターン

### 対象ファイル

| ファイルパス | 理由 |
|---|---|
| server/getfolderlist/repository/concrete/*.ts | 同じ folder_master を SELECT しており、同様の条件漏れの可能性がある |
| server/updatefolder/repository/concrete/*.ts | UPDATE 対象の絞り込みにも deleteFlg 除外が必要な可能性がある |

### 新規作成が必要と思われるもの
- なし（既存ファイルの修正のみ）
```

## ケース2: 悪い例（NG）

### 状況
同じ依頼に対して以下のように回答した場合、このスキルの違反となる。

```
GetFolder のRepositoryだけ直せば大丈夫です。
```

### 何が違反か
- 同種の SELECT/UPDATE を行っている他の Repository が調査されていない
- 「確信があるものだけ」の原則を守らず、調査自体を省略している
