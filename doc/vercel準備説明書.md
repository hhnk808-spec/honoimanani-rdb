# Vercel準備説明書

## 概要
- ローカルで動作しているNode.js/SQLiteアプリをVercelにデプロイする
- GitHubと連携してmainブランチの自動デプロイを設定する
- CLIは使用せず、Web UIで設定を行う

## 前提条件
- GitHubアカウント
- Vercelアカウント
- プロジェクトがGitHubリポジトリにプッシュ済み

## 手順

### 1. Vercelアカウントの準備
1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントでログイン
4. GitHubの認証を許可

### 2. プロジェクトのインポート
1. Vercelダッシュボードで「New Project」をクリック
2. GitHubリポジトリから「honoimanani-rdb」を選択
3. 「Import」をクリック

### 3. プロジェクト設定
1. **Project Name**: `honoimanani-rdb`（または任意の名前）
2. **Framework Preset**: `Other`
3. **Root Directory**: `./`（デフォルト）
4. **Build Command**: `npm run build`（後で設定）
5. **Output Directory**: `./`（デフォルト）
6. **Install Command**: `npm install`

### 4. 環境変数の設定
1. 「Environment Variables」セクションに移動
2. 以下の環境変数を追加：
   - `TURSO_DATABASE_URL`: TursoのデータベースURL（後で設定）
   - `TURSO_AUTH_TOKEN`: Tursoの認証トークン（後で設定）
   - `NODE_ENV`: `production`

### 5. ビルド設定の調整
1. **Build Command**: `npm run build` → `npm install && npm run build`
2. **Output Directory**: `./` → `./src`（静的ファイルの場所）

### 6. デプロイ設定
1. 「Deploy」をクリック
2. 初回デプロイが開始される
3. デプロイ完了まで待機（通常2-3分）

### 7. 自動デプロイの確認
1. デプロイ完了後、提供されたURLでアクセス
2. GitHubのmainブランチに変更をプッシュ
3. Vercelで自動デプロイが開始されることを確認

## 注意事項

### ファイル構造の調整が必要
- `src/`ディレクトリをVercelのルートに設定
- `package.json`の`main`を`src/server.js`に変更
- 静的ファイルの配信設定を調整

### 環境変数の管理
- 本番環境用のTursoデータベースURLを設定
- セキュリティ上、環境変数はVercelの管理画面で設定

### ドメイン設定
- デフォルトで`プロジェクト名.vercel.app`のURLが提供される
- カスタムドメインも設定可能

## トラブルシューティング

### よくある問題
1. **ビルドエラー**: `package.json`の依存関係を確認
2. **環境変数エラー**: Tursoの設定が完了しているか確認
3. **静的ファイルエラー**: ファイルパスを確認

### ログの確認
1. Vercelダッシュボードで「Functions」タブを確認
2. エラーログを確認して問題を特定

## 次のステップ
1. Turso準備指示書.mdに従ってTursoを設定
2. 環境変数を更新
3. 再デプロイして動作確認
