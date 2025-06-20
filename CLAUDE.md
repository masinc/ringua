# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code) にガイダンスを提供します。

## ドキュメントファイル

このプロジェクトは日本語で包括的なドキュメントを管理しています。これらのファイルを扱う際は、最適なClaude Code統合のために**常に@参照を使用**してください。

### 利用可能なドキュメント

- **プロジェクト概要**: [@README.md](/README.md)
- **アプリケーション仕様書**: [@docs/specification.md](/docs/specification.md)
- **技術アーキテクチャ**: [@docs/architecture.md](/docs/architecture.md)
- **開発ワークフロー**: [@docs/development-workflow.md](/docs/development-workflow.md)

### ドキュメントを参照すべきタイミング

#### 作業開始前に読むべき
- **[@README.md](/README.md)**: プロジェクト概要、セットアップ手順、基本理解のため
- **[@docs/specification.md](/docs/specification.md)**: 新機能実装、UI変更、ユーザー向け機能開発前
- **[@docs/architecture.md](/docs/architecture.md)**: アーキテクチャ決定、新サービス追加、コアシステムリファクタリング前

#### 開発中に読むべき
- **[@docs/specification.md](/docs/specification.md)**: 機能要件、ユーザーフロー、データモデルが不明な場合
- **[@docs/architecture.md](/docs/architecture.md)**: データベース操作、API統合、コンポーネント間通信実装時

#### ドキュメントを更新すべきタイミング
- **[@README.md](/README.md)**: 新しい依存関係追加、セットアップ手順変更、プロジェクト構造変更時
- **[@docs/specification.md](/docs/specification.md)**: 機能追加・変更、ユーザーインターフェース変更、データ要件変更時
- **[@docs/architecture.md](/docs/architecture.md)**: 新サービス追加、データベーススキーマ変更、API統合変更時

### ドキュメント同期ルール

1. **プロンプトで@参照を使用**（例："[@docs/specification.md](/docs/specification.md) によるとユーザーフローは..."）
2. **既存機能について質問する前に関連ドキュメントを読む**
3. **重要な変更実装後は即座にドキュメントを更新**

## プロジェクト概要

**Ringua** - クリップボード統合機能付きAI翻訳デスクトップアプリケーション。詳細は [@README.md](/README.md) を参照。

**主要技術**: Tauri + React + TypeScript + Rust + React Router v7 データモード + SQLite

## 開発ワークフロー

このプロジェクトは厳格なブランチ保護ルールを持つ**GitHub Flow**に従います。

> **📋 詳細ワークフロー**: 完全な開発プロセスは [@docs/development-workflow.md](/docs/development-workflow.md) を参照

### コアプロセス (クイックリファレンス)
1. **Issue作成**: `gh issue create --title "日本語タイトル" --label "priority: medium"`
2. **TODOリスト作成**: TodoWriteツールでIssueをタスクに分解
3. **ブランチ作成**: `gh issue develop <issue-number>`
4. **TODOで作業**: タスクステータス更新 (pending → in_progress → completed)
5. **PR作成**: `gh pr create --label "priority: medium"`
6. **CHANGELOG更新**: レビュー承認後、マージ前
7. **マージ**: `gh pr merge <pr-number>`

### 重要ルール
- **`main`ブランチに直接プッシュ禁止**
- **すべての変更はプルリクエスト経由必須**
- **必ずGitHub Issue作成から開始**
- **タスク管理にTodoWrite/TodoReadを使用**
- **CHANGELOG.mdにIssue/PR参照を更新**
- **すべてのIssue、PR、コミットは日本語**

### ラベル付与ルール
- **タイプ**: bug, enhancement, documentation (該当する場合)
- **エリア**: ui, api, core (該当する場合)
- **優先度**: priority: high/medium/low (必須)

### 簡略化されたエリアラベル
- **ui**: ユーザーインターフェース、画面、操作性
- **api**: AIモデル連携、API呼び出し、翻訳機能
- **core**: データベース、設定、ファイル処理、セキュリティ

### TODOタスク管理
作業進捗を追跡するため、常にTODOシステムを使用:

#### TODOタスクとして追加すべき内容
- **開発ワークフロー**: Issue作成、ブランチ作成、コミット、PR作成、CHANGELOG更新（レビュー承認後）
- **機能実装**: 機能を具体的なコーディングタスクに分解
- **ドキュメント更新**: コード変更に伴うドキュメント更新が必要な場合
- **テストタスク**: 単体テスト、統合テスト、手動テスト
- **コードレビュー項目**: レビューフィードバックを体系的に対応
- **リファクタリング手順**: コード構造改善時
- **バグ調査**: 再現手順と修正のステップ

#### TODOベストプラクティス
- **TodoWriteから開始**: 最初に包括的なタスクリストを作成
- **ステータスを頻繁に更新**: 開始時にin_progress、完了時にcompletedにマーク
- **一度に一つのタスクをin_progress**: 単一タスクに集中
- **TodoReadを定期的に使用**: 進捗と次のステップを確認
- **タスクを即座に完了**: 完了をバッチ処理せず、終了時にすぐマーク

### CHANGELOG管理
[Keep a Changelog](https://keepachangelog.com/)フォーマットに従って`CHANGELOG.md`でプロジェクト履歴を管理:

#### CHANGELOGを更新するタイミング
- **レビュー承認後**: コードレビュー完了後にCHANGELOG.mdとバージョンを更新
- **マージ前**: PRマージ前の最終ステップ
- **重要な変更毎**: 新機能、バグ修正、破壊的変更、非推奨化
- **両方の参照を含める**: 常にIssueとPR番号の完全URLを含める
- **バージョン連携**: package.jsonバージョンとCHANGELOGを同時に更新
- **バージョン戦略**: 修正はPATCH、機能追加はMINOR、開発中はMAJOR避ける

#### CHANGELOGフォーマット
```markdown
# Changelog

## [Unreleased]
### Added
- 新機能の説明を日本語で ([#123](https://github.com/owner/repo/issues/123), [PR#124](https://github.com/owner/repo/pull/124))

### Changed
- 変更された機能の説明を日本語で ([#125](https://github.com/owner/repo/issues/125), [PR#126](https://github.com/owner/repo/pull/126))

### Deprecated
- 非推奨となった機能の説明を日本語で ([#127](https://github.com/owner/repo/issues/127), [PR#128](https://github.com/owner/repo/pull/128))

### Removed
- 削除された機能の説明を日本語で ([#129](https://github.com/owner/repo/issues/129), [PR#130](https://github.com/owner/repo/pull/130))

### Fixed
- バグ修正の説明を日本語で ([#131](https://github.com/owner/repo/issues/131), [PR#132](https://github.com/owner/repo/pull/132))

### Security
- セキュリティ改善の説明を日本語で ([#133](https://github.com/owner/repo/issues/133), [PR#134](https://github.com/owner/repo/pull/134))

## [1.0.0] - 2024-01-01
### Added
- 初回リリース ([#1](https://github.com/owner/repo/issues/1), [PR#2](https://github.com/owner/repo/pull/2))
```

#### CHANGELOGベストプラクティス
- **日本語で記述**: 一貫性のためすべてのエントリは日本語
- **ユーザー視点の説明**: 技術的詳細ではなく、ユーザーへの影響を説明
- **参照を必ず含める**: すべてのエントリにIssueとPRの完全URLリンクを含める
- **参照フォーマット**: `([#Issue番号](URL), [PR#PR番号](URL))` 形式を使用
- **時系列順**: 最新の変更を上部に配置
- **Unreleased セクション**: 今後の変更用に常に[Unreleased]セクションを維持
- **完全なトレーサビリティ**: すべての変更がIssueとPRまで遡れることを保証
- **レビュー後更新**: レビュー承認後、マージ前にCHANGELOGとバージョンを更新
- **セマンティックバージョニング**: package.jsonバージョン更新時はsemverに従う
- **バージョン増分**: バグ修正はPATCH (0.0.x)、新機能はMINOR (0.x.0) を使用
- **メジャーバージョン制限**: 開発フェーズ中はMAJORバージョン (x.0.0) を増分しない

### ブランチ命名規則
- **機能**: `feature/description` (例: `feature/clipboard-translation`)
- **バグ修正**: `fix/description` (例: `fix/memory-leak`)
- **ドキュメント**: `docs/description` (例: `docs/api-specification`)
- **リファクタリング**: `refactor/description` (例: `refactor/database-layer`)

### 言語要件
- **すべてのIssue、PR、コミットメッセージは日本語で記述**
- **コードコメントとドキュメントは日本語で記述**

### コミットメッセージ形式
conventional commitsフォーマットを**日本語**で:
```
type(scope): 日本語での説明

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### プルリクエストテンプレート
適切なラベル付きIssue自動クローズテンプレートを使用:
```markdown
## 概要
この PR の変更内容を日本語で説明

## 関連 Issue
Closes #[Issue番号]

## 変更内容
- 変更点1
- 変更点2

## テスト
- [ ] 動作確認済み
- [ ] 型チェック通過
- [ ] ビルド成功

## ラベル
- 適切なタイプラベル (bug/enhancement/documentation)
- 必要に応じて管理ラベル追加

🤖 Generated with [Claude Code](https://claude.ai/code)
```

## GitHub CLIコマンド (クイックリファレンス)

> **📋 完全コマンドリファレンス**: [@docs/development-workflow.md](/docs/development-workflow.md) で完全なコマンドドキュメントを参照

### 基本コマンド
```bash
# ラベル付きIssue作成 (優先度必須)
gh issue create --title "日本語タイトル" --label "priority: high,bug,ui"

# Issueからブランチ作成
gh issue develop <issue-number>

# ラベル付きPR作成 (優先度必須)
gh pr create --title "日本語タイトル" --label "priority: medium,enhancement,api"

# PRマージ
gh pr merge <pr-number>

# PRクローズとブランチ削除
gh pr close <pr-number> --delete-branch
```

### リポジトリ操作
```bash
# リポジトリ情報を表示
gh repo view
```

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

ルートは`createBrowserRouter`とデータローダーを使用。詳細なルーティングパターンは [@docs/architecture.md](/docs/architecture.md) を参照。

### 簡単なルート追加
1. `src/pages/`に`loader`関数付きコンポーネントを作成
2. `src/routes.tsx`に追加

## 主要開発ファイル

- `src/routes.tsx` - React Routerルート定義
- `src/main.tsx` - Router設定付きアプリケーションエントリーポイント
- `src-tauri/src/lib.rs` - Tauriコマンド定義
- `src-tauri/tauri.conf.json` - Tauri設定