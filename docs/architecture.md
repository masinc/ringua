# Ringua - Technical Architecture

## 1. System Overview

Ringua follows a desktop-first architecture built on the Tauri framework, combining a React frontend with a Rust backend for optimal performance and native OS integration.

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                         │
│                    (React + TypeScript)                        │
├─────────────────────────────────────────────────────────────────┤
│                      Application Logic                         │
│                         (Tauri Core)                           │
├─────────────────────────────────────────────────────────────────┤
│                      Backend Services                          │
│                         (Rust)                                 │
├─────────────────────────────────────────────────────────────────┤
│           Local Storage              │      External APIs       │
│          (SQLite DB)                 │    (AI Translation)      │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Frontend Architecture (React + TypeScript)

### 2.1 Component Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Input, etc.)
│   ├── translation/     # Translation-specific components
│   ├── history/         # History management components
│   └── settings/        # Configuration components
├── pages/               # Route-level components
│   ├── Home.tsx         # Main translation interface
│   ├── History.tsx      # Translation history view
│   └── Settings.tsx     # Application settings
├── hooks/               # Custom React hooks
│   ├── useTranslation.ts    # Translation logic
│   ├── useClipboard.ts      # Clipboard integration
│   ├── useDatabase.ts       # Database operations
│   └── useSettings.ts       # Settings management
├── types/               # TypeScript definitions
│   ├── translation.ts   # Translation-related types
│   ├── models.ts        # AI model definitions
│   └── database.ts      # Database schema types
├── utils/               # Utility functions
│   ├── api.ts           # API client utilities
│   ├── validation.ts    # Input validation
│   └── formatters.ts    # Text formatting helpers
└── stores/              # State management
    ├── translationStore.ts  # Translation state
    ├── settingsStore.ts     # Application settings
    └── historyStore.ts      # History management
```

### 2.2 State Management Pattern
Using React Context + Reducers for state management:

```typescript
// Translation Context
interface TranslationState {
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  selectedModel: string;
  isTranslating: boolean;
  error: string | null;
}

// Settings Context
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

### 2.3 React Router v7 Data Mode
```typescript
// Route definitions with data loaders
export const routes: RouteObject[] = [
  {
    path: "/",
    Component: Home,
    loader: homeLoader, // Preload recent translations
  },
  {
    path: "/history",
    Component: History,
    loader: historyLoader, // Paginated history data
  },
  {
    path: "/settings",
    Component: Settings,
    loader: settingsLoader, // Current configuration
  },
];
```

## 3. Backend Architecture (Rust)

### 3.1 Tauri Command Structure
```rust
// src-tauri/src/commands/
mod translation;  // Translation-related commands
mod database;     // Database operations
mod clipboard;    // Clipboard integration
mod settings;     // Configuration management

// Main command exports
pub use translation::*;
pub use database::*;
pub use clipboard::*;
pub use settings::*;
```

### 3.2 Core Services

#### Translation Service
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
    // Implementation
}
```

#### Database Service
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

#### Clipboard Service
```rust
#[tauri::command]
pub async fn get_clipboard_text() -> Result<String, String>;

#[tauri::command]
pub async fn set_clipboard_text(text: String) -> Result<(), String>;

#[tauri::command]
pub async fn watch_clipboard() -> Result<(), String>;
```

## 4. Database Architecture (SQLite)

### 4.1 Schema Design
```sql
-- Translations table with full-text search
CREATE TABLE translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_text TEXT NOT NULL,
    target_text TEXT NOT NULL,
    source_language TEXT NOT NULL,
    target_language TEXT NOT NULL,
    ai_model TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_favorite BOOLEAN DEFAULT FALSE,
    
    -- Full-text search index
    UNIQUE(source_text, target_text, source_language, target_language)
);

CREATE VIRTUAL TABLE translations_fts USING fts5(
    source_text, 
    target_text, 
    content='translations'
);

-- API configurations with encryption
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

-- User preferences
CREATE TABLE user_preferences (
    key TEXT PRIMARY KEY,
    value TEXT,
    value_type TEXT CHECK(value_type IN ('string', 'number', 'boolean', 'json')),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Language pairs and statistics
CREATE TABLE language_stats (
    source_language TEXT,
    target_language TEXT,
    usage_count INTEGER DEFAULT 1,
    last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (source_language, target_language)
);
```

### 4.2 Migration System
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

## 5. AI Model Integration

### 5.1 Provider Trait
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

### 5.2 Provider Implementations
```rust
// OpenAI GPT Provider
pub struct OpenAIProvider {
    client: OpenAIClient,
    config: OpenAIConfig,
}

// Claude Provider
pub struct ClaudeProvider {
    client: ClaudeClient,
    config: ClaudeConfig,
}

// Gemini Provider
pub struct GeminiProvider {
    client: GeminiClient,
    config: GeminiConfig,
}
```

### 5.3 Request/Response Types
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

## 6. Security Architecture

### 6.1 API Key Management
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

### 6.2 Data Encryption
```rust
pub struct Encryption {
    cipher: ChaCha20Poly1305,
}

impl Encryption {
    pub fn encrypt(&self, data: &[u8]) -> Result<Vec<u8>, EncryptionError>;
    pub fn decrypt(&self, encrypted: &[u8]) -> Result<Vec<u8>, EncryptionError>;
}
```

## 7. Performance Considerations

### 7.1 Frontend Optimization
- React.memo for expensive components
- useMemo/useCallback for heavy computations
- Virtual scrolling for large history lists
- Debounced input for real-time features

### 7.2 Backend Optimization
- Connection pooling for database
- Async/await throughout for non-blocking operations
- Caching frequently accessed data
- Batch database operations

### 7.3 Database Optimization
```sql
-- Indexes for common queries
CREATE INDEX idx_translations_created_at ON translations(created_at DESC);
CREATE INDEX idx_translations_languages ON translations(source_language, target_language);
CREATE INDEX idx_translations_model ON translations(ai_model);
CREATE INDEX idx_translations_favorite ON translations(is_favorite, created_at DESC);
```

## 8. Error Handling Strategy

### 8.1 Error Types
```rust
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] DatabaseError),
    
    #[error("Translation provider error: {0}")]
    Provider(#[from] ProviderError),
    
    #[error("Configuration error: {0}")]
    Config(#[from] ConfigError),
    
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
}
```

### 8.2 Error Recovery
- Automatic retry with exponential backoff
- Fallback to alternative providers
- Graceful degradation of features
- User-friendly error messages

## 9. Testing Strategy

### 9.1 Frontend Testing
- Unit tests with Jest/Vitest
- Component testing with React Testing Library
- Integration tests for user workflows
- E2E tests with Playwright

### 9.2 Backend Testing
- Unit tests for individual functions
- Integration tests for database operations
- Mock testing for external APIs
- Property-based testing for complex logic

## 10. Deployment Architecture

### 10.1 Build Process
```bash
# Frontend build
pnpm build

# Tauri build for multiple platforms
pnpm tauri build --target x86_64-pc-windows-msvc
pnpm tauri build --target x86_64-apple-darwin
pnpm tauri build --target x86_64-unknown-linux-gnu
```

### 10.2 Distribution
- GitHub Releases for automatic updates
- Code signing for security
- Platform-specific installers
- Auto-updater integration