'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900 dark:via-pink-900 dark:to-indigo-900">
      <div className="container mobile-padding py-16">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold gradient-text mb-4">
              🔮 占い機能
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              あなたの運命と可能性を探求しましょう
            </p>
          </motion.div>

          {/* 機能カード */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/uranai">
                <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                      🌸
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-pink-600 dark:text-pink-400">
                      花占い
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      60通りの花性格診断
                    </p>
                    <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                      <li>• 生年月日から花と性格を診断</li>
                      <li>• 恋愛運・金運・仕事運を表示</li>
                      <li>• あなたの特性を発見</li>
                    </ul>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/advanced-fortune">
                <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <div className="text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                      🔯
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
                      369数秘術
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      宇宙のリズムエネルギー分析
                    </p>
                    <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-1">
                      <li>• 数秘術魔方陣を生成</li>
                      <li>• AI分析による詳細な解釈</li>
                      <li>• 人生設計図を描く</li>
                    </ul>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </div>

          {/* 説明セクション */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <Card className="p-8">
              <h3 className="text-xl font-bold mb-4">占いについて</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                これらの占いは、自己理解と内省のきっかけとして提供されています。<br />
                結果に縛られることなく、あなたの心に響いた部分を大切に、<br />
                自分らしい人生の羅針盤として活用してください。
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}