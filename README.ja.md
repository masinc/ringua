# Ringua

**Ringua** は複数のAIモデルを活用したデスクトップ翻訳アプリケーションです。名前は「lingua」（ラテン語で言語）の「l」を「r」に置き換えたもので、AI翻訳による言語の変換を象徴しています。

## 機能

- 🖱️ **クリップボード翻訳**: クリップボードのコンテンツをシームレスに翻訳
- 🤖 **複数のAIモデル**: GPT、Claude、Gemini、DeepSeekなどをサポート
- 🔑 **API持ち込み**: 最大限のコントロールとプライバシーのために独自のAPIキーを使用
- 🌍 **多言語サポート**: 複数の言語間での翻訳
- 📝 **翻訳履歴**: 翻訳履歴をローカルに保存・管理
- 🖥️ **デスクトップネイティブ**: 最適なパフォーマンスとネイティブエクスペリエンスのためにTauriで構築

## サポートするAIモデル

- **OpenAI GPT** (GPT-3.5, GPT-4, GPT-4o)
- **Anthropic Claude** (Claude 3 ファミリー)
- **Google Gemini**
- **DeepSeek**
- その他のモデルも近日追加予定...

## 前提条件

- Node.js (v18以降)
- Rust (最新安定版)
- pnpm パッケージマネージャー

## 開発環境のセットアップ

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/your-username/ringua.git
   cd ringua
   ```

2. **依存関係をインストール**
   ```bash
   pnpm install
   ```

3. **開発サーバーを開始**
   ```bash
   pnpm tauri dev
   ```

## プロダクション用ビルド

```bash
# アプリケーションをビルド
pnpm tauri build
```

ビルドされたアプリケーションは `src-tauri/target/release/` に配置されます。

## プロジェクト構造

```
ringua/
├── src/                    # React フロントエンド
│   ├── pages/             # データローダー付きルートコンポーネント
│   ├── components/        # 再利用可能なUIコンポーネント
│   ├── hooks/            # カスタムReactフック
│   ├── utils/            # ユーティリティ関数
│   ├── types/            # TypeScript型定義
│   ├── routes.tsx        # React Routerルート定義
│   └── main.tsx          # アプリケーションエントリーポイント
├── src-tauri/             # Rust バックエンド
│   ├── src/              # Rustソースコード
│   └── tauri.conf.json   # Tauri設定
└── docs/                  # ドキュメント
```

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **ルーティング**: React Router v7 (データモード)
- **バックエンド**: Rust + Tauri
- **データベース**: SQLite (翻訳履歴用)
- **パッケージマネージャー**: pnpm

## 設定

1. **APIキー**: アプリケーション設定でAIモデルのAPIキーを設定
2. **デフォルト言語**: 希望するソースとターゲット言語を設定
3. **モデル設定**: 異なる用途に応じて希望するAIモデルを選択

## コントリビューション

1. リポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 推奨IDE設定

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)