'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { calculateFlowerFortune, type FlowerFortune } from '@/lib/spiritual/flower-fortune';

export default function UranaiPage() {
  const { setFlowerFortuneResult } = useStore();
  const router = useRouter();
  const [birthYear, setBirthYear] = useState(1990);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [flowerFortune, setFlowerFortune] = useState<FlowerFortune | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateFlower = () => {
    setLoading(true);
    try {
      const date = new Date(birthYear, birthMonth - 1, birthDay);
      const fortune = calculateFlowerFortune(date);
      setFlowerFortune(fortune);
      setFlowerFortuneResult(fortune);
    } catch (error) {
      console.error('Error calculating flower fortune:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTraitGradient = (trait: string) => {
    const gradients: Record<string, string> = {
      passionate: 'from-red-500 to-pink-500',
      gentle: 'from-blue-500 to-cyan-500',
      elegant: 'from-purple-500 to-indigo-500',
      wild: 'from-green-500 to-emerald-500',
      mystic: 'from-violet-500 to-purple-500'
    };
    return gradients[trait] || 'from-gray-500 to-slate-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900 dark:via-pink-900 dark:to-indigo-900">
      <div className="container mobile-padding py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* ヘッダー */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl font-bold gradient-text">
              🔮 占い
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              花占いと369数秘術で、あなたの運命と可能性を探求しましょう
            </p>
            
            {/* 占いタブ */}
            <div className="flex justify-center gap-4 mb-6">
              <button className="px-6 py-3 rounded-full font-medium transition-all bg-pink-500 text-white shadow-lg">
                🌸 花占い
              </button>
              <button
                onClick={() => router.push('/advanced-fortune')}
                className="px-6 py-3 rounded-full font-medium transition-all relative bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:text-white"
              >
                🔯 369数秘術
                <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1">
                  Premium
                </Badge>
              </button>
            </div>
          </motion.div>

          {/* 花占いコンテンツ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  🌸 花占い - 60通りの花性格診断
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* 入力セクション */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">生年月日を入力</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">年</label>
                          <Input
                            type="number"
                            value={birthYear}
                            onChange={(e) => setBirthYear(parseInt(e.target.value))}
                            min={1900}
                            max={2030}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">月</label>
                          <Input
                            type="number"
                            value={birthMonth}
                            onChange={(e) => setBirthMonth(parseInt(e.target.value))}
                            min={1}
                            max={12}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">日</label>
                          <Input
                            type="number"
                            value={birthDay}
                            onChange={(e) => setBirthDay(parseInt(e.target.value))}
                            min={1}
                            max={31}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={calculateFlower}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      >
                        {loading ? '占い中...' : '🌸 花占いを実行'}
                      </Button>
                    </div>
                  </div>

                  {/* 結果セクション */}
                  <div>
                    {flowerFortune ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                      >
                        <div className="text-center">
                          <div className="text-6xl mb-4">{flowerFortune.flower.emoji}</div>
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                            {flowerFortune.flower.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {flowerFortune.personality.title}
                          </p>
                        </div>

                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-6">
                          <h4 className="font-semibold text-pink-800 dark:text-pink-200 mb-3">
                            あなたの特性:
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {flowerFortune.traits.map((trait, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getTraitGradient(trait)}`}
                              >
                                {trait}
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {(flowerFortune.personality as any).description || flowerFortune.personality.title}
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                            <div className="text-2xl mb-2">💕</div>
                            <div className="text-sm font-medium text-red-800 dark:text-red-200">恋愛運</div>
                            <div className="text-lg font-bold text-red-600 dark:text-red-400">{flowerFortune.luck.love}/5</div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <div className="text-2xl mb-2">💰</div>
                            <div className="text-sm font-medium text-green-800 dark:text-green-200">金運</div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">{flowerFortune.luck.money}/5</div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div className="text-2xl mb-2">💼</div>
                            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">仕事運</div>
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{flowerFortune.luck.career}/5</div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="text-6xl mb-4">🌸</div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          あなたの花を見つけましょう
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          生年月日を入力して、花占いを実行してください
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}