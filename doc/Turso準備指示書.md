# Turso準備指示書

## 概要
- ローカルのSQLiteデータベースをTurso（SQLite互換のクラウドDB）に移行する
- Vercelデプロイ用のクラウドデータベースを準備する
- 既存のデータを移行する手順も含む

## 前提条件
- Tursoアカウント
- ローカルでSQLiteデータベースが動作している
- プロジェクトがGitHubにプッシュ済み

## 手順

### 1. Tursoアカウントの準備
1. [Turso](https://turso.tech)にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントでログイン
4. 認証を完了

### 2. Turso CLIのインストール
```bash
# macOS
brew install tursodatabase/tap/turso

# または直接ダウンロード
curl -sSfL https://get.tur.so/install.sh | bash
```

### 3. Tursoにログイン
```bash
turso auth login
```
- ブラウザが開くので、Tursoアカウントでログイン
- 認証トークンをコピーしてターミナルに貼り付け

### 4. データベースの作成
```bash
# データベースを作成
turso db create honoimanani-timeline

# データベースのURLを取得
turso db show honoimanani-timeline --url

# 認証トークンを取得
turso auth token
```

### 5. ローカルデータの移行
```bash
# ローカルのSQLiteファイルをTursoにアップロード
turso db shell honoimanani-timeline < src/schema.sql

# または、既存のデータベースファイルを直接アップロード
turso db restore honoimanani-timeline --from timeline.db
```

### 6. データベースの確認
```bash
# データベースに接続して確認
turso db shell honoimanani-timeline

# SQLiteコマンドで確認
.tables
SELECT COUNT(*) FROM posts;
.quit
```

### 7. 環境変数の設定
Vercelの環境変数に以下を設定：
- `TURSO_DATABASE_URL`: `libsql://honoimanani-timeline-xxxxx.turso.io`
- `TURSO_AUTH_TOKEN`: 認証トークン

## コードの調整

### 1. 依存関係の追加
```bash
npm install @libsql/client
```

### 2. データベース接続の変更
`src/database.js`を以下のように変更：

```javascript
const { createClient } = require('@libsql/client');

// 環境変数から接続情報を取得
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Tursoクライアントを作成
const client = createClient({
  url: url,
  authToken: authToken
});

// 既存のSQLiteコードをTurso用に調整
// ... (詳細なコードは別途提供)
```

### 3. 環境変数の設定
`.env.local`ファイルを作成（ローカル開発用）：
```
TURSO_DATABASE_URL=libsql://honoimanani-timeline-xxxxx.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## データ移行の詳細手順

### 1. スキーマのエクスポート
```bash
# ローカルのSQLiteからスキーマをエクスポート
sqlite3 timeline.db .schema > schema.sql
```

### 2. データのエクスポート
```bash
# データをCSV形式でエクスポート
sqlite3 timeline.db -header -csv "SELECT * FROM posts;" > posts.csv
```

### 3. Tursoへのインポート
```bash
# スキーマをTursoに適用
turso db shell honoimanani-timeline < schema.sql

# データをインポート（必要に応じて）
turso db shell honoimanani-timeline
.mode csv
.import posts.csv posts
.quit
```

## トラブルシューティング

### よくある問題
1. **認証エラー**: `turso auth login`を再実行
2. **接続エラー**: 環境変数が正しく設定されているか確認
3. **データ移行エラー**: スキーマとデータの形式を確認

### ログの確認
```bash
# Tursoのログを確認
turso db logs honoimanani-timeline
```

## セキュリティ設定

### 1. データベースのアクセス制御
```bash
# データベースのアクセス権限を設定
turso db tokens create honoimanani-timeline --expiration 24h
```

### 2. 環境変数の保護
- 本番環境ではVercelの環境変数を使用
- ローカル開発時のみ`.env.local`を使用

## 次のステップ
1. Vercel準備説明書.mdに従ってVercelを設定
2. 環境変数をVercelに設定
3. デプロイして動作確認
4. 本番環境でデータベースの動作を確認

## 参考リンク
- [Turso公式ドキュメント](https://docs.turso.tech/)
- [LibSQLクライアント](https://docs.turso.tech/libsql/client-access/)
