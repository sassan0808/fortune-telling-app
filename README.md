# 占い機能

心の種プロジェクトから切り出された占い機能です。

## 機能概要

### 1. 花占い (uranai)
- 60通りの花性格診断
- 生年月日から花と性格を診断
- 恋愛運・金運・仕事運を表示

### 2. 369数秘術 (advanced-fortune)
- 生年月日から数秘術魔方陣を生成
- 宇宙のリズムエネルギー分析
- AI分析機能（Gemini API使用）

## ディレクトリ構造

```
fortune-telling/
├── app/
│   ├── uranai/              # 花占いページ
│   ├── advanced-fortune/    # 369数秘術ページ
│   └── api/
│       └── numerology-analysis/  # AI分析API
├── lib/
│   ├── spiritual/           # 占いロジック
│   │   ├── flower-fortune.ts    # 花占いロジック
│   │   ├── numerology.ts        # 基本数秘術
│   │   └── numerology369.ts     # 369数秘術
│   ├── config/              # 設定関連
│   ├── store.ts            # 状態管理
│   └── utils.ts            # ユーティリティ
└── components/
    └── ui/                  # UIコンポーネント
```

## 使用方法

このフォルダは独立した占い機能として、Next.jsプロジェクトに組み込むことができます。

### 必要な依存関係

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0",
    "framer-motion": "^10.0.0",
    "zustand": "^4.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

### セットアップ

1. このフォルダをNext.jsプロジェクトにコピー
2. 必要な依存関係をインストール
3. `/uranai`と`/advanced-fortune`のルートにアクセス

### 環境変数（AI分析機能を使用する場合）

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## 🍎 Mac での再構築手順

### 前提条件
- macOS 10.15 以上
- Homebrew がインストールされていること
- ターミナルを使用できること

### 1. 必要なツールのインストール

```bash
# Node.js のインストール
brew install node

# Git のインストール（未インストールの場合）
brew install git

# 任意: VS Code のインストール
brew install --cask visual-studio-code
```

### 2. プロジェクトのセットアップ

```bash
# プロジェクトフォルダに移動
cd /path/to/fortune-telling

# セットアップスクリプトを実行（自動セットアップ）
chmod +x setup-mac.sh
./setup-mac.sh

# または手動セットアップ
npm install
cp .env.example .env.local
```

### 3. 開発サーバーの起動

```bash
# 開発サーバー起動
npm run dev

# ブラウザで確認
open http://localhost:3000
```

### 4. 本番ビルド（必要に応じて）

```bash
# 本番用ビルド
npm run build

# 本番サーバー起動
npm start
```

### 5. AI機能の設定（オプション）

AI分析機能を使用する場合：

1. Google AI Studio で Gemini API キーを取得
2. `.env.local` ファイルを編集：

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key
```

### トラブルシューティング

#### Node.js バージョンエラー
```bash
node --version  # v18.0.0 以上が必要
npm --version   # v8.0.0 以上が必要
```

#### パッケージインストールエラー
```bash
# npm キャッシュをクリア
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### ポートが使用中のエラー
```bash
# ポート3000を使用しているプロセスを確認
lsof -ti:3000
# プロセスを終了
kill -9 $(lsof -ti:3000)
```

## 注意事項

- 元のプロジェクトの認証機能は含まれていません
- UIコンポーネントはTailwind CSSを使用しています  
- AI分析機能はオプションです（環境変数が設定されていない場合はフォールバック分析を使用）
- Mac 環境での動作を想定して設定ファイルを最適化済み