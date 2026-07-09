# horizontal-gap-check 期待出力例

## ケース1: 良い例（OK・漏れあり）

### 状況
GetFolder の Repository にだけ deleteFlg 除外条件を追加して実装完了と報告された。

### 期待出力

```
## Horizontal Gap Check 結果

### 変更済みファイル
- server/getfolder/repository/concrete/GetFolderRepositoryPostgres.ts

### 漏れの可能性があるファイル
- server/getfolderlist/repository/concrete/*.ts: 同じ folder_master を SELECT しているが deleteFlg 除外条件が未確認
- server/updatefolder/repository/concrete/*.ts: UPDATE 対象の絞り込みで同様の条件が必要な可能性

### 推奨対応
- 上記2ファイルの WHERE 句を確認し、必要であれば同様の修正を行う
```

## ケース2: 悪い例（NG）

### 状況
同じ状況で以下のように回答した場合、このスキルの違反となる。

```
実装完了しています。問題ありません。
```

### 何が違反か
- 変更されたファイル以外への影響が全く確認されていない
- 「漏れなし」と判断する根拠が示されていない
