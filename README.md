# いまなにしてる？タイムラインアプリ

Canva AIで作成されたフロントエンドを、Node.js + SQLiteを使った本格的なWebアプリケーションに移行したプロジェクトです。

## 概要

- **目的**: 100人程度で1ヶ月間使用するタイムラインアプリのUI/UX検証
- **技術スタック**: Node.js 24, Express.js, sqlite3
- **データベース**: SQLite（ローカル開発用）
- **デプロイ予定**: Vercel（将来的に）

## 機能

- ✅ 名前入力によるログイン（クッキーで保持）
- ✅ 50文字以内の投稿機能
- ✅ タイムライン表示（最新1000件）
- ✅ 3秒おきの自動更新（ポーリング）
- ✅ ログアウト機能
- ✅ レスポンシブデザイン

## ローカル開発環境のセットアップ

### 前提条件

- Node.js 24以上
- npm または yarn

### インストール

1. 依存関係をインストール:
```bash
npm install
```

2. サーバーを起動:
```bash
npm start
```

3. ブラウザでアクセス:
```
http://localhost:3000
```

### 開発モード

ファイルの変更を監視して自動再起動する場合:
```bash
npm run dev
```

## プロジェクト構造

```
src/
├── server.js          # Express.jsサーバー
├── database.js        # SQLiteデータベース設定
└── index.html         # フロントエンド（HTML/CSS/JS）

timeline.db            # SQLiteデータベースファイル（自動生成）
package.json           # プロジェクト設定
README.md             # このファイル
```

## API エンドポイント

### 投稿関連

- `POST /api/posts` - 新しい投稿を作成
- `GET /api/posts` - 最新の投稿を取得（最新1000件）
- `GET /api/posts/after/:id` - 特定のID以降の投稿を取得（ポーリング用）
- `GET /api/posts/count` - 投稿数を取得

### その他

- `GET /api/health` - ヘルスチェック
- `GET /` - メインアプリケーション

## データベーススキーマ

### posts テーブル

| カラム名 | 型 | 説明 |
|---------|----|----|
| id | INTEGER PRIMARY KEY | 投稿ID（自動採番） |
| author | TEXT NOT NULL | 投稿者名 |
| content | TEXT NOT NULL | 投稿内容（最大50文字） |
| timestamp | DATETIME | 投稿日時 |
| created_at | DATETIME | 作成日時 |

## サーバーの管理

### 起動
```bash
npm start
```

### 停止
- `Ctrl + C` でグレースフルシャットダウン

### 再起動
1. サーバーを停止（`Ctrl + C`）
2. 再度起動（`npm start`）

### ログの確認
サーバーコンソールに以下の情報が表示されます：
- サーバー起動メッセージ
- API リクエストのエラーログ
- データベースエラー

## トラブルシューティング

### よくある問題

1. **ポートが使用中**
   - エラー: `EADDRINUSE: address already in use :::3000`
   - 解決: 他のプロセスがポート3000を使用している可能性があります。`lsof -ti:3000 | xargs kill -9` でプロセスを終了

2. **データベースエラー**
   - エラー: `SQLITE_CANTOPEN`
   - 解決: `src/` ディレクトリの書き込み権限を確認

3. **依存関係のエラー**
   - エラー: `MODULE_NOT_FOUND`
   - 解決: `npm install` を再実行

### ログの確認

サーバーコンソールで以下の情報を確認できます：
- サーバー起動状況
- API リクエストの処理状況
- エラーメッセージ

## 本番環境への移行

将来的にVercelにデプロイする際の考慮事項：

1. **データベース**: SQLiteからPostgreSQL等のクラウドデータベースに移行
2. **環境変数**: データベース接続情報等を環境変数で管理
3. **静的ファイル**: `src/` ディレクトリをVercelのルートに設定

## ライセンス

MIT License
