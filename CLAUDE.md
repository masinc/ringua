# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code) にガイダンスを提供します。

## 🚨 絶対に忘れてはならない重要ルール

### mainブランチ保護
- **`main`ブランチに直接プッシュ禁止**
- **すべての変更はプルリクエスト経由必須**
- **必ずGitHub Issue作成から開始**

### 開発ワークフロー（8ステップ）
0. **作業前準備**: `git status` → `git pull origin main`
1. **Issue作成**: `gh issue create --title "日本語タイトル" --label "priority: medium"`
2. **TODOリスト作成**: TodoWriteツールでタスク分解
3. **ブランチ作成**: `gh issue develop <issue-number> --checkout`
4. **作業**: TODOステータス更新 (pending → in_progress → completed)
5. **PR作成**: `gh pr create --label "priority: medium"`
6. **CHANGELOG+バージョン更新**: レビュー承認後、マージ前（**package.json + Cargo.toml両方必須**）
7. **マージ**: `gh pr merge <pr-number> --squash --delete-branch`
8. **マージ後整理**: `git reset --hard origin/main`

### ラベル必須ルール
- **優先度**: priority: high/medium/low (**必須**)
- **エリア**: ui/api/core (該当する場合)
- **タイプ**: bug/enhancement/documentation (該当する場合)

### 言語要件
- **すべてのIssue、PR、コミットメッセージは日本語**
- **TODOタスクは常に作成・更新**

## 📋 参照ドキュメント

> **重要**: 詳細な手順やルールは以下のドキュメントを参照すること

- **プロジェクト概要**: [@README.md](/README.md)
- **アプリケーション仕様**: [@docs/specification.md](/docs/specification.md)
- **技術アーキテクチャ**: [@docs/architecture.md](/docs/architecture.md)
- **開発ワークフロー詳細**: [@docs/development-workflow.md](/docs/development-workflow.md)

### ドキュメント使用ルール
1. **作業前**: 関連ドキュメントを必ず読む
2. **参照時**: `[@filename](/path)` 形式で言及
3. **更新後**: 関連ドキュメントも即座に更新

## 🛠️ プロジェクト概要

**Ringua** - AI翻訳デスクトップアプリケーション  
**技術**: Tauri + React + TypeScript + Rust + SQLite

### React Router v7データモード
- `createBrowserRouter` + データローダー使用
- ルート追加: `src/pages/` → `src/routes.tsx`

## ⚡ クイックコマンド

```bash
# 開発開始
pnpm tauri dev

# 型チェック
pnpm tsc --noEmit

# ビルド
pnpm build

# Rust確認
cargo check  # src-tauriから
```

## 🔧 Context7 MCP統合

ライブラリ名言及で最新ドキュメント自動取得:
Tauri, React, React Router, Vite, TypeScript, Rust