# 開発ワークフロー

このドキュメントは、Ringuaプロジェクトの完全な開発ワークフローを説明します。詳細なプロセス、ベストプラクティス、コマンドリファレンスを含みます。

## 概要

このプロジェクトは厳格なブランチ保護ルールと包括的なIssue追跡を持つ**GitHub Flow**に従います。

### ブランチ保護ルール
- **`main`ブランチに直接プッシュ禁止**
- **すべての変更はプルリクエスト経由必須**
- **フィーチャーブランチは`main`から作成**

## 完全な開発プロセス

### 1. Issue作成
常にGitHub Issueの作成から開始：

```bash
# ラベル付きで新しいIssueを作成 (優先度必須)
gh issue create --title "日本語でのIssueタイトル" --body "Issue説明" --label "priority: high,bug,ui"

# 既存のIssueをリスト表示
gh issue list

# Issue詳細を表示
gh issue view <issue-number>
```

### 2. TODOリスト作成
TodoWriteツールを使ってIssueを実行可能なタスクに分解：

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

### 3. ブランチ作成と開発
Issueから直接フィーチャーブランチを作成：

```bash
# Issueからブランチを作成して開発開始
gh issue develop <issue-number>

# これによりIssueにちなんだ名前のブランチが自動作成される
```

### 4. 開発作業
- 進捗に応じてTODOタスクステータスを更新 (pending → in_progress → completed)
- 日本語で説明的なメッセージで定期的にコミット
- conventional commitsフォーマットに従う：
  ```
  type(scope): 日本語での説明
  
  🤖 Generated with [Claude Code](https://claude.ai/code)
  
  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

### 5. 変更をプッシュ
```bash
# オリジンにプッシュ
git push origin <branch-name>
```

### 6. プルリクエスト作成
適切なラベルとIssue自動クローズテンプレートでPRを作成：

```bash
# ラベル付きでプルリクエストを作成 (優先度必須)
gh pr create --title "日本語でのPRタイトル" --body "PR説明" --label "priority: medium,enhancement,api"
```

#### プルリクエストテンプレート
適切なラベル付きIssue自動クローズテンプレートを常に使用：
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

### 7. コードレビュープロセス
- チームが実装をレビュー
- TODOタスクを使ってフィードバックに体系的に対応
- 必要に応じてラベルを更新（`needs-review`、`needs-testing`等を追加）

### 8. CHANGELOGとバージョン管理
レビュー承認後、マージ前に：

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

### Fixed
- バグ修正の説明を日本語で ([#131](https://github.com/owner/repo/issues/131), [PR#132](https://github.com/owner/repo/pull/132))
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

### 9. 最終コミットとプッシュ
```bash
# CHANGELOGとバージョン更新をコミット
git add CHANGELOG.md package.json
git commit -m "docs: CHANGELOGとバージョン更新

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 最終変更をプッシュ
git push origin <branch-name>
```

### 10. マージ
```bash
# プルリクエストをマージ
gh pr merge <pr-number>

# またはマージせずにクローズ（ブランチは自動削除）
gh pr close <pr-number> --delete-branch
```

## ブランチ命名規則
- **機能**: `feature/description` (例: `feature/clipboard-translation`)
- **バグ修正**: `fix/description` (例: `fix/memory-leak`)
- **ドキュメント**: `docs/description` (例: `docs/api-specification`)
- **リファクタリング**: `refactor/description` (例: `refactor/database-layer`)

## 言語要件
- **すべてのIssue、PR、コミットメッセージは日本語で記述**
- **コードコメントとドキュメントはファイルの言語に従う**（英語ドキュメントは英語、日本語ドキュメントは日本語）

## GitHub CLIコマンドリファレンス

### Issue管理
```bash
# 新しいIssueを作成
gh issue create --title "日本語でのIssueタイトル" --body "Issue説明"

# ラベル付きでIssueを作成 (優先度必須)
gh issue create --title "タイトル" --body "説明" --label "priority: high,bug,ui"

# Issueリストを表示
gh issue list

# Issue詳細を表示
gh issue view <issue-number>

# Issueからブランチを作成して開発開始
gh issue develop <issue-number>
```

### プルリクエスト管理
```bash
# プルリクエストを作成
gh pr create --title "日本語でのPRタイトル" --body "PR説明"

# ラベル付きでPRを作成 (優先度必須)
gh pr create --title "タイトル" --body "説明" --label "priority: medium,enhancement,api"

# プルリクエストリストを表示
gh pr list

# プルリクエスト詳細を表示
gh pr view <pr-number>

# プルリクエストをマージ
gh pr merge <pr-number>

# プルリクエストをクローズしてブランチも削除
gh pr close <pr-number> --delete-branch
```

### ラベル管理
```bash
# 全ラベルを一覧表示
gh label list

# Issueにラベルを追加
gh issue edit <issue-number> --add-label "ラベル名"

# プルリクエストにラベルを追加
gh pr edit <pr-number> --add-label "ラベル名"

# Issueからラベルを削除
gh issue edit <issue-number> --remove-label "ラベル名"
```

### リポジトリ操作
```bash
# リポジトリ情報を表示
gh repo view
```

## GitHubラベルシステム

ラベルシステムの詳細については、[@CLAUDE.md](/CLAUDE.md)の**GitHubラベルの使用方法**セクションを参照してください。

### クイックリファレンス
- **タイプ**: bug/enhancement/documentation (該当する場合)
- **エリア**: ui/api/core (該当する場合)
- **優先度**: priority: high/medium/low (必須)
- **ワークフロー**: needs-review/needs-testing/blocked (該当する場合)

### エリアラベルの使い分け
- **ui**: ユーザーインターフェース、デザイン、操作性の問題
- **api**: AIモデル連携、翻訳機能、外部APIの問題
- **core**: データベース、設定、ファイル処理、セキュリティの問題

## テストと品質保証

### PR作成前
- [ ] 型チェック実行: `pnpm tsc --noEmit`
- [ ] テスト実行: `cargo test` (src-tauriディレクトリから)
- [ ] Rustコードチェック: `cargo check`
- [ ] Rustコードフォーマット: `cargo fmt`
- [ ] アプリケーションビルド: `pnpm build`
- [ ] 変更の手動テスト

### レビュー中
- [ ] すべてのレビューフィードバックに対応
- [ ] レビュー項目のTODOタスクを更新
- [ ] 新機能のテストを追加
- [ ] 必要に応じてドキュメントを更新

### マージ前
- [ ] すべてのテストが通過
- [ ] CHANGELOG更新済み
- [ ] バージョン増分済み
- [ ] 最終手動テスト完了

## 緊急時手順

### ホットフィックスプロセス
本番環境の重要なバグに対して：

1. `priority: high`ラベル付きでホットフィックスIssueを作成
2. `main`からホットフィックスブランチ作成: `git checkout -b hotfix/critical-bug-name`
3. 最小限の変更でIssueを修正
4. 通常のPRプロセスに従うがレビューを迅速化
5. マージ後即座にデプロイ

### ロールバックプロセス
マージ後に問題が発見された場合：

1. ロールバックIssueを作成
2. リバートPRを作成: `git revert <commit-hash>`
3. 迅速レビュープロセスに従う
4. ロールバックを即座にデプロイ

## 自動化とツール

### GitHub Actions
- PR作成時の自動ラベル適用
- プッシュ時の自動テスト
- CHANGELOG検証
- バージョン一貫性チェック

### VS Code統合
- Issue/PR管理用のGitHub CLI拡張機能を使用
- 共通コマンド用タスクランナーを設定
- Tauri開発用デバッグを設定

## トラブルシューティング

### よくある問題
- **ブランチ保護**: 直接プッシュではなくPRを使用していることを確認
- **ラベル不足**: Issue/PRに必要なタイプラベルを追加
- **CHANGELOGフォーマット**: 完全URLでの正確なフォーマットに従う
- **バージョン競合**: セマンティックバージョニングルールに従っていることを確認

### ヘルプの取得
- 明確化が必要な場合は`question`ラベルを使用
- 複雑な技術的問題には`help wanted`ラベルを使用
- 技術的ガイダンスは[@docs/architecture.md](/docs/architecture.md)を参照
- 機能要件は[@docs/specification.md](/docs/specification.md)を確認