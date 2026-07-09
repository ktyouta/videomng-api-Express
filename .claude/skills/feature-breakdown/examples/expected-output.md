# feature-breakdown 期待出力例

## ケース1: 良い例（OK）

### 状況
「フォルダにお気に入り動画を一括で追加できるエンドポイントが欲しい」という依頼を受けた。

### 期待出力

```
## 実装タスク分解

### 機能概要
- 指定フォルダに複数の動画IDをまとめて追加するエンドポイントを新設する
- Prisma スキーマの変更は不要（既存の FavoriteVideoTransaction / FolderMaster を利用）

### タスク一覧

1. ドメイン値オブジェクトの確認（folder-share-videos の FolderIdModel 等が流用できるか確認）
2. バリデーションスキーマ（schema/）: フォルダID・動画ID配列を検証する Zod スキーマ
3. Entity: フォルダID・動画ID配列・認証済みユーザーIDを保持する Entity
4. Repository interface: 一括登録メソッドのシグネチャ定義
5. Repository concrete: PrismaClientInstance 経由でのバルクINSERT実装
6. Service: バリデーション済みデータをRepositoryに渡す
7. Controller: RouteController を継承し getRouteSettingModel() で POST エンドポイントを定義
8. server/router/conf/ApiEndpoint.ts へのエンドポイント登録
9. テスト（テストランナー導入後）

### 依存関係と順序
- 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 の順（前段が確定しないと後段の型が決まらないため）
- 4と2は並行して着手可能（互いに依存しない）
```

## ケース2: 悪い例（NG）

### 状況
同じ依頼に対して以下のように回答した場合、このスキルの違反となる。

```
Controller と Service と Repository を作ればいいと思います。
```

### 何が違反か
- レイヤーごとの具体的なタスクに分解されていない
- 依存関係・実装順序が示されていない
- Step 4（結果の出力形式）に沿っていない
