# Ringua - 技術アーキテクチャ

## 1. システム概要

Ringuaは、最適なパフォーマンスとネイティブOS統合のためにReactフロントエンドとRustバックエンドを組み合わせたTauriフレームワーク上に構築されたデスクトップファーストアーキテクチャに従います。

```
┌─────────────────────────────────────────────────────────────────┐
│                         ユーザーインターフェース                │
│                    (React + TypeScript)                        │
├─────────────────────────────────────────────────────────────────┤
│                      アプリケーションロジック                   │
│                         (Tauri Core)                           │
├─────────────────────────────────────────────────────────────────┤
│                      バックエンドサービス                       │
│                         (Rust)                                 │
├─────────────────────────────────────────────────────────────────┤
│           ローカルストレージ         │      外部API               │
│          (SQLite DB)                 │    (AI翻訳)               │
└─────────────────────────────────────────────────────────────────┘
```

## 2. フロントエンドアーキテクチャ (React + TypeScript)

### 2.1 コンポーネント構造
```
src/
├── components/           # 再利用可能なUIコンポーネント
│   ├── common/          # 汎用コンポーネント (Button, Input等)
│   ├── translation/     # 翻訳専用コンポーネント
│   ├── history/         # 履歴管理コンポーネント
│   └── settings/        # 設定コンポーネント
├── pages/               # ルートレベルコンポーネント
│   ├── Home.tsx         # メイン翻訳インターフェース
│   ├── History.tsx      # 翻訳履歴ビュー
│   └── Settings.tsx     # アプリケーション設定
├── hooks/               # カスタムReactフック
│   ├── useTranslation.ts    # 翻訳ロジック
│   ├── useClipboard.ts      # クリップボード統合
│   ├── useDatabase.ts       # データベース操作
│   └── useSettings.ts       # 設定管理
├── types/               # TypeScript定義
│   ├── translation.ts   # 翻訳関連の型
│   ├── models.ts        # AIモデル定義
│   └── database.ts      # データベーススキーマ型
├── utils/               # ユーティリティ関数
│   ├── api.ts           # APIクライアントユーティリティ
│   ├── validation.ts    # 入力検証
│   └── formatters.ts    # テキスト整形ヘルパー
└── stores/              # 状態管理
    ├── translationStore.ts  # 翻訳状態
    ├── settingsStore.ts     # アプリケーション設定
    └── historyStore.ts      # 履歴管理
```

### 2.2 状態管理パターン
状態管理にはReact Context + Reducersを使用:

```typescript
// 翻訳コンテキスト
interface TranslationState {
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  selectedModel: string;
  isTranslating: boolean;
  error: string | null;
}

// 設定コンテキスト
interface SettingsState {
  apiKeys: Record<string, string>;
  defaultLanguages: {
    source: string;
    target: string;
  };
  theme: 'light' | 'dark';
  shortcuts: Record<string, string>;
}
```

### 2.3 React Router v7 データモード
```typescript
// データローダー付きルート定義
export const routes: RouteObject[] = [
  {
    path: "/",
    Component: Home,
    loader: homeLoader, // 最近の翻訳をプリロード
  },
  {
    path: "/history",
    Component: History,
    loader: historyLoader, // ページネーション付き履歴データ
  },
  {
    path: "/settings",
    Component: Settings,
    loader: settingsLoader, // 現在の設定
  },
];
```

## 3. バックエンドアーキテクチャ (Rust)

### 3.1 Tauriコマンド構造
```rust
// src-tauri/src/commands/
mod translation;  // 翻訳関連コマンド
mod database;     // データベース操作
mod clipboard;    // クリップボード統合
mod settings;     // 設定管理

// メインコマンドエクスポート
pub use translation::*;
pub use database::*;
pub use clipboard::*;
pub use settings::*;
```

### 3.2 コアサービス

#### 翻訳サービス
```rust
pub struct TranslationService {
    providers: HashMap<String, Box<dyn TranslationProvider>>,
    db: Arc<Database>,
}

#[tauri::command]
pub async fn translate_text(
    text: String,
    source_lang: String,
    target_lang: String,
    model: String,
    state: tauri::State<'_, AppState>,
) -> Result<TranslationResult, String> {
    // 実装
}
```

#### データベースサービス
```rust
pub struct Database {
    connection: Arc<Mutex<Connection>>,
}

impl Database {
    pub async fn save_translation(&self, translation: Translation) -> Result<i64, DatabaseError>;
    pub async fn get_history(&self, limit: usize, offset: usize) -> Result<Vec<Translation>, DatabaseError>;
    pub async fn search_translations(&self, query: &str) -> Result<Vec<Translation>, DatabaseError>;
}
```

#### クリップボードサービス
```rust
#[tauri::command]
pub async fn get_clipboard_text() -> Result<String, String>;

#[tauri::command]
pub async fn set_clipboard_text(text: String) -> Result<(), String>;

#[tauri::command]
pub async fn watch_clipboard() -> Result<(), String>;
```

## 4. データベースアーキテクチャ (SQLite)

### 4.1 スキーマ設計
```sql
-- 全文検索付き翻訳テーブル
CREATE TABLE translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_text TEXT NOT NULL,
    target_text TEXT NOT NULL,
    source_language TEXT NOT NULL,
    target_language TEXT NOT NULL,
    ai_model TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_favorite BOOLEAN DEFAULT FALSE,
    
    -- 全文検索インデックス
    UNIQUE(source_text, target_text, source_language, target_language)
);

CREATE VIRTUAL TABLE translations_fts USING fts5(
    source_text, 
    target_text, 
    content='translations'
);

-- 暗号化されたAPI設定
CREATE TABLE api_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_name TEXT UNIQUE NOT NULL,
    encrypted_api_key BLOB,
    api_endpoint TEXT,
    is_enabled BOOLEAN DEFAULT TRUE,
    model_parameters JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ユーザー設定
CREATE TABLE user_preferences (
    key TEXT PRIMARY KEY,
    value TEXT,
    value_type TEXT CHECK(value_type IN ('string', 'number', 'boolean', 'json')),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 言語ペアと統計
CREATE TABLE language_stats (
    source_language TEXT,
    target_language TEXT,
    usage_count INTEGER DEFAULT 1,
    last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (source_language, target_language)
);
```

### 4.2 マイグレーションシステム
```rust
pub struct Migration {
    version: u32,
    description: String,
    up_sql: String,
    down_sql: String,
}

pub struct MigrationRunner {
    db: Arc<Database>,
    migrations: Vec<Migration>,
}
```

## 5. AIモデル統合

### 5.1 プロバイダートレイト
```rust
#[async_trait]
pub trait TranslationProvider: Send + Sync {
    async fn translate(
        &self,
        request: TranslationRequest,
    ) -> Result<TranslationResponse, ProviderError>;
    
    fn get_supported_languages(&self) -> Vec<Language>;
    fn get_model_info(&self) -> ModelInfo;
    fn validate_config(&self, config: &ModelConfig) -> Result<(), ConfigError>;
}
```

### 5.2 プロバイダー実装
```rust
// OpenAI GPTプロバイダー
pub struct OpenAIProvider {
    client: OpenAIClient,
    config: OpenAIConfig,
}

// Claudeプロバイダー
pub struct ClaudeProvider {
    client: ClaudeClient,
    config: ClaudeConfig,
}

// Geminiプロバイダー
pub struct GeminiProvider {
    client: GeminiClient,
    config: GeminiConfig,
}
```

### 5.3 リクエスト/レスポンス型
```rust
pub struct TranslationRequest {
    pub text: String,
    pub source_language: String,
    pub target_language: String,
    pub context: Option<String>,
    pub style: Option<TranslationStyle>,
}

pub struct TranslationResponse {
    pub translated_text: String,
    pub detected_language: Option<String>,
    pub confidence: Option<f32>,
    pub usage: Option<UsageStats>,
}
```

## 6. セキュリティアーキテクチャ

### 6.1 APIキー管理
```rust
pub struct SecureStorage {
    keyring: keyring::Entry,
}

impl SecureStorage {
    pub fn store_api_key(&self, model: &str, key: &str) -> Result<(), StorageError>;
    pub fn retrieve_api_key(&self, model: &str) -> Result<String, StorageError>;
    pub fn delete_api_key(&self, model: &str) -> Result<(), StorageError>;
}
```

### 6.2 データ暗号化
```rust
pub struct Encryption {
    cipher: ChaCha20Poly1305,
}

impl Encryption {
    pub fn encrypt(&self, data: &[u8]) -> Result<Vec<u8>, EncryptionError>;
    pub fn decrypt(&self, encrypted: &[u8]) -> Result<Vec<u8>, EncryptionError>;
}
```

## 7. パフォーマンス考慮事項

### 7.1 フロントエンド最適化
- 高コストコンポーネント用のReact.memo
- 重い計算処理のためのuseMemo/useCallback
- 大きな履歴リスト用の仮想スクロール
- リアルタイム機能のためのデバウンス入力

### 7.2 バックエンド最適化
- データベースのコネクションプーリング
- ノンブロッキング操作のための全体的なasync/await
- 頻繁にアクセスされるデータのキャッシュ
- バッチデータベース操作

### 7.3 データベース最適化
```sql
-- 一般的なクエリ用のインデックス
CREATE INDEX idx_translations_created_at ON translations(created_at DESC);
CREATE INDEX idx_translations_languages ON translations(source_language, target_language);
CREATE INDEX idx_translations_model ON translations(ai_model);
CREATE INDEX idx_translations_favorite ON translations(is_favorite, created_at DESC);
```

## 8. エラーハンドリング戦略

### 8.1 エラー型
```rust
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("データベースエラー: {0}")]
    Database(#[from] DatabaseError),
    
    #[error("翻訳プロバイダーエラー: {0}")]
    Provider(#[from] ProviderError),
    
    #[error("設定エラー: {0}")]
    Config(#[from] ConfigError),
    
    #[error("IOエラー: {0}")]
    Io(#[from] std::io::Error),
}
```

### 8.2 エラー回復
- 指数バックオフでの自動再試行
- 代替プロバイダーへのフォールバック
- 機能の段階的劣化
- ユーザーフレンドリーなエラーメッセージ

## 9. テスト戦略

### 9.1 フロントエンドテスト
- Jest/Vitestでの単体テスト
- React Testing Libraryでのコンポーネントテスト
- ユーザーワークフローの統合テスト
- PlaywrightでのE2Eテスト

### 9.2 バックエンドテスト
- 個別関数の単体テスト
- データベース操作の統合テスト
- 外部APIのモックテスト
- 複雑なロジックのプロパティベーステスト

## 10. デプロイメントアーキテクチャ

### 10.1 ビルドプロセス
```bash
# フロントエンドビルド
pnpm build

# 複数プラットフォーム用のTauriビルド
pnpm tauri build --target x86_64-pc-windows-msvc
pnpm tauri build --target x86_64-apple-darwin
pnpm tauri build --target x86_64-unknown-linux-gnu
```

### 10.2 配布
- 自動更新のためのGitHub Releases
- セキュリティのためのコード署名
- プラットフォーム固有のインストーラー
- 自動更新機能の統合