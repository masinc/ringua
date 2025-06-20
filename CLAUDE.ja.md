# CLAUDE.ja.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code) にガイダンスを提供します。

> **注意**: このファイルには英語版 `CLAUDE.md` があります。このファイルを更新する際は、両方のバージョンを同期してください。

## ドキュメントファイル

このプロジェクトは英語と日本語の両方で包括的なドキュメントを管理しています。これらのファイルを扱う際は、最適なClaude Code統合のために**常に@参照を使用**してください。

### 利用可能なドキュメント

- **プロジェクト概要**: `@README.md` / `@README.ja.md`
- **アプリケーション仕様書**: `@docs/specification.md` / `@docs/specification.ja.md`  
- **技術アーキテクチャ**: `@docs/architecture.md` / `@docs/architecture.ja.md`

### ドキュメントを参照すべきタイミング

#### 作業開始前に読むべき
- **@README.md**: プロジェクト概要、セットアップ手順、基本理解のため
- **@docs/specification.md**: 新機能実装、UI変更、ユーザー向け機能開発前
- **@docs/architecture.md**: アーキテクチャ決定、新サービス追加、コアシステムリファクタリング前

#### 開発中に読むべき
- **@docs/specification.md**: 機能要件、ユーザーフロー、データモデルが不明な場合
- **@docs/architecture.md**: データベース操作、API統合、コンポーネント間通信実装時

#### ドキュメントを更新すべきタイミング
- **@README.md**: 新しい依存関係追加、セットアップ手順変更、プロジェクト構造変更時
- **@docs/specification.md**: 機能追加・変更、ユーザーインターフェース変更、データ要件変更時
- **@docs/architecture.md**: 新サービス追加、データベーススキーマ変更、API統合変更時

### ドキュメント同期ルール

1. **ドキュメント変更時は必ず両言語版を更新**
2. **プロンプトで@参照を使用**（例："@docs/specification.md によるとユーザーフローは..."）
3. **既存機能について質問する前に関連ドキュメントを読む**
4. **重要な変更実装後は即座にドキュメントを更新**

## プロジェクト概要

**Ringua** - クリップボード統合機能付きAI翻訳デスクトップアプリケーション。詳細は `@README.ja.md` を参照。

**主要技術**: Tauri + React + TypeScript + Rust + React Router v7 データモード + SQLite

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

**重要**: このプロジェクトはReact Router v7の**データモード**を使用（宣言的モードではない）。

ルートは`createBrowserRouter`とデータローダーを使用。詳細なルーティングパターンは `@docs/architecture.ja.md` を参照。

### 簡単なルート追加
1. `src/pages/`に`loader`関数付きコンポーネントを作成
2. `src/routes.tsx`に追加

## 主要開発ファイル

- `src/routes.tsx` - React Routerルート定義
- `src/main.tsx` - Router設定付きアプリケーションエントリーポイント
- `src-tauri/src/lib.rs` - Tauriコマンド定義
- `src-tauri/tauri.conf.json` - Tauri設定