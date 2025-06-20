# CLAUDE.ja.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code) にガイダンスを提供します。

> **注意**: このファイルには英語版 `CLAUDE.md` があります。このファイルを更新する際は、両方のバージョンを同期してください。

## プロジェクト概要

これはReact、TypeScript、RustでビルドされたTauriデスクトップアプリケーションです。アプリケーションは以下を使用しています：
- **フロントエンド**: Webフロントエンド用のReact with Vite（TypeScript）
- **ルーティング**: データローディング機能付きクライアントサイドナビゲーション用のReact Router v7（データモード）
- **バックエンド**: ネイティブデスクトップ機能用のRust with Tauri
- **パッケージマネージャー**: pnpm（ワークスペース設定済み）

## アーキテクチャ

- `src/` - Reactフロントエンドコード（TypeScript）
  - `src/routes.tsx` - React Routerのルート定義
  - `src/pages/` - データローダー付きルートコンポーネント
  - `src/main.tsx` - Router設定を含むアプリケーションエントリーポイント
- `src-tauri/` - Rustバックエンドコード
  - `src-tauri/src/lib.rs` - メインのTauriコマンドとアプリケーション設定
  - `src-tauri/tauri.conf.json` - Tauri設定
- フロントエンドはTauriの`invoke()` APIを介してRustバックエンドと通信
- クライアントサイドルーティングは`createBrowserRouter`とデータローダーを使用してReact Router v7で処理

## 共通コマンド

### 開発
```bash
# 開発サーバーを開始（フロントエンドとTauriの両方を実行）
pnpm tauri dev

# フロントエンドのみの開発サーバーを開始
pnpm dev

# アプリケーションをビルド
pnpm build

# ビルドされたフロントエンドをプレビュー
pnpm preview
```

### Tauri固有のコマンド
```bash
# 配布用のTauriアプリケーションをビルド
pnpm tauri build

# Tauriアイコンを生成
pnpm tauri icon

# Tauri情報を表示
pnpm tauri info
```

### TypeScript
```bash
# 型チェック
pnpm tsc --noEmit
```

### Rust（src-tauriディレクトリから）
```bash
# Rustコードをチェック
cargo check

# Rustテストを実行
cargo test

# Rustコードをフォーマット
cargo fmt
```

## Context7 MCP 統合

このプロジェクトはContext7 MCP（Model Context Protocol）が統合されており、コードベースで使用されているライブラリとフレームワークの最新ドキュメントを提供します。

### Context7 MCPとは？
Context7は、現在のバージョン固有のドキュメントとコード例をAIのコンテキストウィンドウに動的に取得するMCPサーバーです。これにより、古いまたは幻覚的なコード提案を防ぐことができます。

### Context7の使用方法
特定のライブラリやフレームワークについてヘルプを求める際、ライブラリ名を言及することで最新のドキュメントを要求できます。Context7は自動的に：
1. 参照されているライブラリを識別（例：Tauri、React、Vite）
2. 最新バージョンのドキュメントを取得
3. 関連コンテンツをAIのコンテキストに注入
4. 現在の正確なコード例を提供

### このプロジェクトでサポートされているライブラリ
- **Tauri** - デスクトップアプリケーションフレームワーク
- **React** - フロントエンドライブラリ
- **React Router** - データローディング機能付きクライアントサイドルーティング
- **Vite** - ビルドツールと開発サーバー
- **TypeScript** - JavaScriptの型システム
- **Rust** - システムプログラミング言語

これにより、コード提案と例は常に最新でプロジェクトで使用されているバージョンと互換性があることが保証されます。

## React Router v7 データモード

このプロジェクトは、データローディングやアクションなどの高度な機能を有効にするReact Router v7のデータモードを使用しています。

### キーコンセプト
- **データモード**: ルートは`createBrowserRouter`を使用してReactレンダリングの外側で設定されます
- **ローダー**: ルートコンポーネントがレンダリングされる前にデータを取得するために実行される関数
- **データローディング**: クライアント上でのサーバーサイドスタイルのデータローディングパターン

### ルート構造
ルートは`RouteObject`型を使用して`src/routes.tsx`で定義されます：
```typescript
{
  path: "/about",
  Component: About,
  loader: aboutLoader,  // データローディング関数
}
```

### 新しいルートの追加
1. `src/pages/`にルートコンポーネントを作成
2. データ取得用の`loader`関数をエクスポート
3. `src/routes.tsx`にルート設定を追加

## 重要なファイル

- `src-tauri/tauri.conf.json` - ウィンドウ設定、ビルドコマンド、セキュリティポリシーを含むTauriアプリ設定
- `src/App.tsx` - Tauriコマンド呼び出しとナビゲーションを実演するメインReactコンポーネント
- `src/main.tsx` - React Router設定を含むアプリケーションエントリーポイント
- `src/routes.tsx` - React Routerのルート定義と設定
- `src/pages/` - データローダー付きルートコンポーネント
- `src-tauri/src/lib.rs` - Tauriコマンド定義とアプリ初期化