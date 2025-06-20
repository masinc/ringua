# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.3] - 2025-06-20

### Added
- バージョンアップ時のCargo.lock更新手順を開発ワークフローに追加 ([#5](https://github.com/masinc/ringua/issues/5), [PR#6](https://github.com/masinc/ringua/pull/6))

## [0.1.2] - 2025-06-20

### Changed
- CLAUDE.mdを重要ルールのみに簡素化し詳細内容を参照ドキュメントに移行 ([#3](https://github.com/masinc/ringua/issues/3), [PR#4](https://github.com/masinc/ringua/pull/4))
- GitHub CLI コマンドに--checkoutと--baseオプションを追加 ([#3](https://github.com/masinc/ringua/issues/3), [PR#4](https://github.com/masinc/ringua/pull/4))

### Added
- Context7 MCP統合詳細をdocs/architecture.mdに追加 ([#3](https://github.com/masinc/ringua/issues/3), [PR#4](https://github.com/masinc/ringua/pull/4))
- TODOタスク詳細例とベストプラクティスをdocs/development-workflow.mdに追加 ([#3](https://github.com/masinc/ringua/issues/3), [PR#4](https://github.com/masinc/ringua/pull/4))

## [0.1.1] - 2025-06-20

### Added
- 簡素化されたGitHubラベルシステム（ui/api/core、優先度必須）([#1](https://github.com/masinc/ringua/issues/1), [PR#2](https://github.com/masinc/ringua/pull/2))

### Changed
- ドキュメントを日本語版のみに統合し、英語版を削除 ([#1](https://github.com/masinc/ringua/issues/1), [PR#2](https://github.com/masinc/ringua/pull/2))
- @参照をMarkdownリンク形式[@filename](/path)に変更 ([#1](https://github.com/masinc/ringua/issues/1), [PR#2](https://github.com/masinc/ringua/pull/2))
- TODOタスクに開発ワークフローステップを追加 ([#1](https://github.com/masinc/ringua/issues/1), [PR#2](https://github.com/masinc/ringua/pull/2))

## [0.1.0] - 2024-06-20

### Added
- 初回プロジェクト作成 (手動作成, 手動作成)
- Tauri + React + TypeScript + Rust 基本構成 (手動作成, 手動作成)

---

## CHANGELOG記述ルール

今後のエントリは以下の形式で記述してください：

```markdown
- 変更内容の説明を日本語で ([#Issue番号](https://github.com/owner/repo/issues/番号), [PR#PR番号](https://github.com/owner/repo/pull/番号))
```

例：
```markdown
- クリップボード翻訳機能を追加 ([#123](https://github.com/masinc/ringua/issues/123), [PR#124](https://github.com/masinc/ringua/pull/124))
```