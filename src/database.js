const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// データベースファイルのパス（プロジェクトルートに作成）
const dbPath = path.join(__dirname, '..', 'timeline.db');

// データベース接続
const db = new sqlite3.Database(dbPath);

// テーブル作成
const createTables = () => {
  return new Promise((resolve, reject) => {
    // 投稿テーブル
    const createPostsTable = `
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // インデックス作成（タイムスタンプでソートするため）
    const createTimestampIndex = `
      CREATE INDEX IF NOT EXISTS idx_posts_timestamp 
      ON posts(timestamp DESC)
    `;
    
    db.serialize(() => {
      db.run(createPostsTable);
      db.run(createTimestampIndex);
      resolve();
    });
  });
};

// データベース初期化
createTables();

// 投稿を挿入
const insertPost = (author, content, timestamp) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO posts (author, content, timestamp) 
      VALUES (?, ?, ?)
    `);
    
    stmt.run([author, content, timestamp], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ lastInsertRowid: this.lastID });
      }
    });
    
    stmt.finalize();
  });
};

// 最新の投稿を取得（最新1000件）
const getLatestPosts = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT id, author, content, timestamp, created_at
      FROM posts 
      ORDER BY timestamp DESC 
      LIMIT 1000
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// 特定のID以降の投稿を取得（ポーリング用）
const getPostsAfterId = (lastId) => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT id, author, content, timestamp, created_at
      FROM posts 
      WHERE id > ?
      ORDER BY timestamp DESC 
      LIMIT 1000
    `, [lastId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// 投稿数を取得
const getPostCount = () => {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT COUNT(*) as count FROM posts
    `, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve({ count: row.count });
      }
    });
  });
};

module.exports = {
  db,
  insertPost,
  getLatestPosts,
  getPostsAfterId,
  getPostCount
};
