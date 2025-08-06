#!/bin/bash

echo "🔮 占い機能プロジェクト Mac セットアップ"
echo "================================================"

# Node.jsのバージョンチェック
if ! command -v node &> /dev/null; then
    echo "❌ Node.jsがインストールされていません"
    echo "   以下のコマンドでインストールしてください："
    echo "   brew install node"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js バージョン: $NODE_VERSION"

# npmのバージョンチェック
NPM_VERSION=$(npm -v)
echo "✅ npm バージョン: $NPM_VERSION"

# 依存関係のインストール
echo ""
echo "📦 依存関係をインストール中..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ 依存関係のインストール完了"
else
    echo "❌ 依存関係のインストールに失敗しました"
    exit 1
fi

# .env.localファイルの確認と作成
if [ ! -f ".env.local" ]; then
    echo ""
    echo "📝 環境変数ファイルを作成中..."
    cp .env.example .env.local
    echo "✅ .env.local ファイルを作成しました"
    echo "   必要に応じてGemini APIキーを設定してください"
else
    echo "✅ .env.local ファイルが既に存在します"
fi

echo ""
echo "🚀 セットアップ完了！"
echo "   以下のコマンドで開発サーバーを起動できます："
echo "   npm run dev"
echo ""
echo "   ブラウザで以下のURLにアクセスしてください："
echo "   - http://localhost:3000/uranai (花占い)"
echo "   - http://localhost:3000/advanced-fortune (369数秘術)"