'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { calculate369Numerology, interpretNumber, check369Law, getDetailedInterpretation } from '@/lib/spiritual/numerology369';
import type { NumerologyGrid } from '@/lib/spiritual/numerology369';

export default function AdvancedFortunePage() {
  const [birthYear, setBirthYear] = useState(1990);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [numerologyResult, setNumerologyResult] = useState<NumerologyGrid | null>(null);
  const [lawCheck, setLawCheck] = useState<ReturnType<typeof check369Law> | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'meaning' | 'cosmic'>('grid');

  const calculateNumerology = () => {
    setLoading(true);
    setShowResult(false);
    setAiAnalysis('');
    
    setTimeout(() => {
      try {
        const date = new Date(birthYear, birthMonth - 1, birthDay);
        const result = calculate369Numerology(date);
        const check = check369Law(result);
        
        setNumerologyResult(result);
        setLawCheck(check);
        setShowResult(true);
      } catch (error) {
        console.error('Error calculating numerology:', error);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const generateAIAnalysis = async () => {
    if (!numerologyResult) return;
    
    setAiAnalysisLoading(true);
    try {
      const response = await fetch('/api/numerology-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainNumber: numerologyResult.specialNumbers.mainNumber,
          pastNumber: numerologyResult.specialNumbers.pastNumber,
          futureNumber: numerologyResult.specialNumbers.futureNumber,
          spiritNumber: numerologyResult.specialNumbers.spiritNumber,
          higherPurposeNumber: numerologyResult.specialNumbers.higherPurposeNumber,
          higherGoalNumber: numerologyResult.specialNumbers.higherGoalNumber,
          cosmicRhythm: lawCheck?.cosmicRhythm,
        }),
      });

      if (!response.ok) {
        throw new Error('AI分析の生成に失敗しました');
      }

      const data = await response.json();
      setAiAnalysis(data.analysis);
    } catch (error) {
      console.error('AI分析エラー:', error);
      setAiAnalysis('申し訳ございません。AI分析の生成中にエラーが発生しました。しばらく時間をおいて再度お試しください。');
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  const renderNumber = (num: number, label?: string, isSpecial?: boolean, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-10 h-10 text-lg',
      md: 'w-14 h-14 text-2xl',
      lg: 'w-20 h-20 text-3xl'
    };

    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative ${sizeClasses[size]} flex items-center justify-center`}
      >
        <div className={`absolute inset-0 ${isSpecial ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700'} rounded-2xl blur-xl`} />
        <div className={`relative ${sizeClasses[size]} flex flex-col items-center justify-center rounded-2xl border-2 ${
          isSpecial 
            ? 'border-purple-400 dark:border-purple-500 bg-gradient-to-br from-purple-100 via-white to-pink-100 dark:from-purple-900/40 dark:via-gray-900 dark:to-pink-900/40' 
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
        } shadow-lg backdrop-blur-sm`}>
          <span className={`font-bold ${
            isSpecial 
              ? 'bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent' 
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {num}
          </span>
          {label && (
            <span className="text-[8px] mt-1 text-gray-500 dark:text-gray-400 absolute -bottom-5 whitespace-nowrap">
              {label}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              369 NUMEROLOGY
            </span>
          </h1>
          <p className="text-gray-400 text-lg">宇宙のリズムに隠された、あなたの魂の暗号を解読する</p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-12 bg-gray-900/50 backdrop-blur-xl border-gray-800 shadow-2xl">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-100">生年月日を入力</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: birthYear, setter: setBirthYear, label: '年', max: 2025, min: 1826 },
                    { value: birthMonth, setter: setBirthMonth, label: '月', max: 12, min: 1 },
                    { value: birthDay, setter: setBirthDay, label: '日', max: 31, min: 1 }
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <label className="block text-sm font-medium mb-2 text-gray-300">{item.label}</label>
                      <select
                        value={item.value}
                        onChange={(e) => item.setter(parseInt(e.target.value))}
                        className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 hover:bg-gray-800/70"
                      >
                        {Array.from({ length: item.max - item.min + 1 }, (_, i) => {
                          const value = item.label === '年' ? item.max - i : item.min + i;
                          return (
                            <option key={value} value={value}>
                              {value}{item.label}
                            </option>
                          );
                        })}
                      </select>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button 
                    onClick={calculateNumerology}
                    disabled={loading}
                    className="relative px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>解析中...</span>
                      </div>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <span>運命を解読する</span>
                        <span className="text-xl">→</span>
                      </span>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {showResult && numerologyResult && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Tab Navigation */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-1 border border-gray-800">
                  {[
                    { id: 'grid', label: '魔方陣', icon: '🔮' },
                    { id: 'meaning', label: '数字の意味', icon: '✨' },
                    { id: 'cosmic', label: '宇宙のリズム', icon: '🌌' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'grid' && (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="mb-8 bg-gray-900/50 backdrop-blur-xl border-gray-800">
                      <div className="p-8">
                        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          あなたの数秘術魔方陣
                        </h2>
                        
                        {/* Enhanced Grid Display */}
                        <div className="max-w-2xl mx-auto">
                          <div className="grid grid-cols-7 gap-3 place-items-center">
                            {/* Top */}
                            <div className="col-span-7 mb-4">
                              {renderNumber(numerologyResult.outer.topBar, '全体指針', true, 'lg')}
                            </div>
                            
                            {/* Upper outer corners */}
                            <div />
                            <div className="opacity-60">
                              {renderNumber(numerologyResult.outer.leftLeftTop, '', false, 'sm')}
                            </div>
                            <div className="col-span-3" />
                            <div className="opacity-60">
                              {renderNumber(numerologyResult.outer.rightRightTop, '', false, 'sm')}
                            </div>
                            <div />
                            
                            {/* Main 3x3 grid top row */}
                            <div />
                            <div />
                            {renderNumber(numerologyResult.grid.topLeft)}
                            {renderNumber(numerologyResult.grid.top)}
                            {renderNumber(numerologyResult.grid.topRight)}
                            <div />
                            <div />
                            
                            {/* Main 3x3 grid middle row */}
                            <div className="opacity-60">
                              {renderNumber(numerologyResult.outer.leftLeftMiddle, '', false, 'sm')}
                            </div>
                            <div />
                            {renderNumber(numerologyResult.grid.left, 'ルーツ', true)}
                            <div className="transform scale-125">
                              {renderNumber(numerologyResult.grid.center, 'メイン', true, 'lg')}
                            </div>
                            {renderNumber(numerologyResult.grid.right, 'グロース', true)}
                            <div />
                            <div className="opacity-60">
                              {renderNumber(numerologyResult.outer.rightRightMiddle, '', false, 'sm')}
                            </div>
                            
                            {/* Main 3x3 grid bottom row */}
                            <div />
                            <div />
                            {renderNumber(numerologyResult.grid.bottomLeft)}
                            {renderNumber(numerologyResult.grid.bottom, 'ナチュラル', true)}
                            {renderNumber(numerologyResult.grid.bottomRight)}
                            <div />
                            <div />
                            
                            {/* Lower outer corners */}
                            <div />
                            <div className="opacity-60">
                              {renderNumber(numerologyResult.outer.leftLeftBottom, '', false, 'sm')}
                            </div>
                            <div className="col-span-3" />
                            <div className="opacity-60">
                              {renderNumber(numerologyResult.outer.rightRightBottom, '', false, 'sm')}
                            </div>
                            <div />
                            
                            {/* Bottom */}
                            <div className="col-span-7 mt-4">
                              {renderNumber(numerologyResult.outer.bottomBar, '最終目的', true, 'lg')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'meaning' && (
                  <motion.div
                    key="meaning"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="space-y-6">
                      {/* Main Number Card */}
                      {(() => {
                        const mainInterp = getDetailedInterpretation(numerologyResult.specialNumbers.mainNumber);
                        return (
                          <Card className="bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-purple-900/30 backdrop-blur-xl border-purple-800/50">
                            <div className="p-8">
                              <div className="flex items-center mb-6">
                                <motion.div
                                  initial={{ rotate: 0 }}
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                  className="relative w-24 h-24 mr-6"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50" />
                                  <div className="relative w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white">
                                      {numerologyResult.specialNumbers.mainNumber}
                                    </span>
                                  </div>
                                </motion.div>
                                <div className="flex-1">
                                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                    メインナンバー：{mainInterp.title}
                                  </h3>
                                  <p className="text-gray-300">{mainInterp.essence}</p>
                                </div>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
                                  <h4 className="font-semibold text-purple-400 mb-2">特性</h4>
                                  <p className="text-gray-300 text-sm">{mainInterp.characteristics}</p>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm">
                                  <h4 className="font-semibold text-pink-400 mb-2">使命</h4>
                                  <p className="text-gray-300 text-sm">{mainInterp.mission}</p>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm md:col-span-2">
                                  <h4 className="font-semibold text-yellow-400 mb-2">成長の鍵</h4>
                                  <p className="text-gray-300 text-sm">{mainInterp.growthKey}</p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })()}

                      {/* Other Numbers Grid */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { num: numerologyResult.specialNumbers.pastNumber, label: "ルーツナンバー", color: "blue" },
                          { num: numerologyResult.specialNumbers.futureNumber, label: "グロースナンバー", color: "green" },
                          { num: numerologyResult.specialNumbers.spiritNumber, label: "ナチュラルナンバー", color: "teal" },
                          { num: numerologyResult.specialNumbers.higherPurposeNumber, label: "全体指針ナンバー", color: "indigo" }
                        ].map(({ num, label, color }) => {
                          const interp = getDetailedInterpretation(num);
                          return (
                            <Card key={label} className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-gray-700 transition-all duration-200">
                              <div className="p-6">
                                <div className="flex items-center mb-4">
                                  <div className={`w-16 h-16 bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 rounded-xl flex items-center justify-center mr-4`}>
                                    <span className={`text-2xl font-bold text-${color}-400`}>
                                      {num}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className={`font-semibold text-${color}-400`}>{label}</h4>
                                    <p className="text-lg font-medium text-gray-200">{interp.title}</p>
                                  </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-3">{interp.essence}</p>
                                <div className="space-y-2">
                                  <div className="text-xs">
                                    <span className="text-gray-500">使命: </span>
                                    <span className="text-gray-300">{interp.mission}</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'cosmic' && lawCheck && (
                  <motion.div
                    key="cosmic"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 backdrop-blur-xl border-purple-800/50">
                      <div className="p-8">
                        <div className="text-center mb-8">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="inline-block"
                          >
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 animate-pulse" />
                              <div className="relative w-32 h-32 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-5xl font-bold text-white">
                                  {lawCheck.cosmicRhythm.number}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                          <h2 className="text-4xl font-bold mt-6 mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                            {lawCheck.cosmicRhythm.action}
                          </h2>
                          <p className="text-xl text-gray-300">{lawCheck.cosmicRhythm.focus}</p>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
                            <p className="text-gray-300 leading-relaxed text-lg">
                              {lawCheck.cosmicRhythm.description}
                            </p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="bg-gradient-to-br from-blue-900/30 to-green-900/30 rounded-xl p-6 border border-blue-800/50"
                            >
                              <h4 className="font-bold text-blue-400 mb-3 flex items-center">
                                <span className="text-2xl mr-2">🌟</span>
                                日常での実践
                              </h4>
                              <p className="text-gray-300">{lawCheck.cosmicRhythm.earthMission}</p>
                            </motion.div>

                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-800/50"
                            >
                              <h4 className="font-bold text-purple-400 mb-3 flex items-center">
                                <span className="text-2xl mr-2">🔑</span>
                                生き方への糸口
                              </h4>
                              <p className="text-gray-300">{lawCheck.cosmicRhythm.startingPoint}</p>
                            </motion.div>
                          </div>

                          <div className="bg-amber-900/20 rounded-xl p-6 border border-amber-800/50">
                            <h4 className="font-bold text-amber-400 mb-3 flex items-center">
                              <span className="text-2xl mr-2">⚡</span>
                              バランスの注意点
                            </h4>
                            <p className="text-gray-300">{lawCheck.cosmicRhythm.caution}</p>
                          </div>
                        </div>

                        {/* AI Analysis Section */}
                        <div className="mt-8 pt-8 border-t border-gray-800">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-semibold text-gray-200">
                              AI解析
                            </h3>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={generateAIAnalysis}
                              disabled={aiAnalysisLoading}
                              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg disabled:opacity-50 transition-all duration-200"
                            >
                              {aiAnalysisLoading ? (
                                <div className="flex items-center">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  解析中...
                                </div>
                              ) : aiAnalysis ? '再解析' : 'AI解析を開始'}
                            </motion.button>
                          </div>

                          <AnimatePresence>
                            {aiAnalysis && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl p-6 border border-indigo-800/50"
                              >
                                <div className="prose prose-invert max-w-none">
                                  <div className="whitespace-pre-line text-gray-300">
                                    {aiAnalysis}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}