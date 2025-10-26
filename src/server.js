const express = require('express');
const cors = require('cors');
const path = require('path');
const { insertPost, getLatestPosts, getPostsAfterId, getPostCount } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ルートパスでindex.htmlを提供
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API エンドポイント

// 投稿を作成
app.post('/api/posts', async (req, res) => {
  try {
    const { author, content } = req.body;
    
    // バリデーション
    if (!author || !content) {
      return res.status(400).json({ error: 'Author and content are required' });
    }
    
    if (content.length > 50) {
      return res.status(400).json({ error: 'Content must be 50 characters or less' });
    }
    
    if (author.length > 20) {
      return res.status(400).json({ error: 'Author name must be 20 characters or less' });
    }
    
    // 投稿をデータベースに保存
    const timestamp = new Date().toISOString();
    const result = await insertPost(author, content, timestamp);
    
    res.json({
      id: result.lastInsertRowid,
      author,
      content,
      timestamp,
      success: true
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 最新の投稿を取得
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await getLatestPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 特定のID以降の投稿を取得（ポーリング用）
app.get('/api/posts/after/:id', async (req, res) => {
  try {
    const lastId = parseInt(req.params.id) || 0;
    const posts = await getPostsAfterId(lastId);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts after ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 投稿数を取得
app.get('/api/posts/count', async (req, res) => {
  try {
    const result = await getPostCount();
    res.json({ count: result.count });
  } catch (error) {
    console.error('Error fetching post count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
  console.log(`📊 ヘルスチェック: http://localhost:${PORT}/api/health`);
  console.log(`📝 タイムライン: http://localhost:${PORT}`);
});

// グレースフルシャットダウン
process.on('SIGINT', () => {
  console.log('\n🛑 サーバーを停止しています...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 サーバーを停止しています...');
  process.exit(0);
});
