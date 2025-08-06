'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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

  const calculateNumerology = () => {
    setLoading(true);
    setAiAnalysis(''); // AI分析をリセット
    try {
      const date = new Date(birthYear, birthMonth - 1, birthDay); // monthは0ベースなので-1
      const result = calculate369Numerology(date);
      const check = check369Law(result);
      
      setNumerologyResult(result);
      setLawCheck(check);
    } catch (error) {
      console.error('Error calculating numerology:', error);
    } finally {
      setLoading(false);
    }
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

  const renderNumber = (num: number, label?: string, isSpecial?: boolean) => (
    <div className={`flex flex-col items-center justify-center p-2 ${isSpecial ? 'bg-purple-100 dark:bg-purple-900/30' : ''}`}>
      <span className={`text-2xl font-bold ${isSpecial ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}`}>
        {num}
      </span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">369数秘</h1>
      
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">生年月日を入力</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">年</label>
                <select
                  value={birthYear}
                  onChange={(e) => setBirthYear(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Array.from({ length: 200 }, (_, i) => {
                    const year = 2025 - i;
                    return (
                      <option key={year} value={year}>
                        {year}年
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">月</label>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    return (
                      <option key={month} value={month}>
                        {month}月
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">日</label>
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                           focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    return (
                      <option key={day} value={day}>
                        {day}日
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={calculateNumerology}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                {loading ? '計算中...' : '占う'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {numerologyResult && (
        <>
          {/* 宿命と運命についての説明 */}
          <Card className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🌟</span>
                あなたの解釈が、あなたの答え
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                  生年月日から導かれる数秘術は「宿命」を表します。
                  生まれた日を変えることはできません。
                  でも、その宿命をどう解釈し、どう生きるかは、あなた次第です。
                </p>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                  <p className="font-semibold mb-2 text-indigo-700 dark:text-indigo-300">
                    大切なのは...
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">✓</span>
                      <span>「この数字だから、こうなる」という固定的な考えに縛られないこと</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">✓</span>
                      <span>占いに人生を決められるのではなく、人生を豊かにする手段として活用すること</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-500 mr-2">✓</span>
                      <span>あなたが感じたもの、しっくりきたものが、あなたにとっての正解</span>
                    </li>
                  </ul>
                </div>
                <p className="text-center font-semibold text-purple-700 dark:text-purple-300">
                  どんな解釈でもいい。<br/>
                  あなたの心に響いた部分を大切に、自分らしい人生の羅針盤として使ってください。
                </p>
              </div>
            </div>
          </Card>

          <Card className="mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-center">あなたの数秘術魔方陣</h2>
              
              {/* 魔方陣の表示 */}
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-7 gap-1">
                  {/* 最上段 - 全体指針 */}
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="border-2 border-purple-300 dark:border-purple-600 rounded">
                    {renderNumber(numerologyResult.outer.topBar)}
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                  
                  {/* 外角上段 */}
                  <div></div>
                  <div className="border border-gray-300 dark:border-gray-600 rounded opacity-70">
                    {renderNumber(numerologyResult.outer.leftLeftTop)}
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="border border-gray-300 dark:border-gray-600 rounded opacity-70">
                    {renderNumber(numerologyResult.outer.rightRightTop)}
                  </div>
                  <div></div>
                  
                  {/* 3x3グリッド上段 */}
                  <div></div>
                  <div></div>
                  <div className="border-2 border-blue-300 dark:border-blue-600 rounded">
                    {renderNumber(numerologyResult.grid.topLeft)}
                  </div>
                  <div className="border-2 border-blue-300 dark:border-blue-600 rounded">
                    {renderNumber(numerologyResult.grid.top)}
                  </div>
                  <div className="border-2 border-blue-300 dark:border-blue-600 rounded">
                    {renderNumber(numerologyResult.grid.topRight)}
                  </div>
                  <div></div>
                  <div></div>
                  
                  {/* 3x3グリッド中段と外側中央 */}
                  <div className="border border-gray-300 dark:border-gray-600 rounded opacity-70">
                    {renderNumber(numerologyResult.outer.leftLeftMiddle)}
                  </div>
                  <div></div>
                  <div className="border-2 border-blue-300 dark:border-blue-600 rounded">
                    {renderNumber(numerologyResult.grid.left, 'ルーツ', true)}
                  </div>
                  <div className="border-4 border-red-400 dark:border-red-500 rounded bg-red-50 dark:bg-red-900/20">
                    {renderNumber(numerologyResult.grid.center, 'メイン', true)}
                  </div>
                  <div className="border-2 border-blue-300 dark:border-blue-600 rounded">
                    {renderNumber(numerologyResult.grid.right, 'グロース', true)}
                  </div>
                  <div></div>
                  <div className="border border-gray-300 dark:border-gray-600 rounded opacity-70">
                    {renderNumber(numerologyResult.outer.rightRightMiddle)}
                  </div>
                  
                  {/* 3x3グリッド下段 */}
                  <div></div>
                  <div></div>
                  <div className="border-2 border-blue-300 dark:border-blue-600 rounded">
                    {renderNumber(numerologyResult.grid.bottomLeft)}
                  </div>
                  <div className="border-2 border-blue-300 dark:border-blue-600 rounded">
                    {renderNumber(numerologyResult.grid.bottom, 'ナチュラル', true)}
                  </div>
                  <div className="border-2 border-blue-300 dark:border-blue-600 rounded">
                    {renderNumber(numerologyResult.grid.bottomRight)}
                  </div>
                  <div></div>
                  <div></div>
                  
                  {/* 外角下段 */}
                  <div></div>
                  <div className="border border-gray-300 dark:border-gray-600 rounded opacity-70">
                    {renderNumber(numerologyResult.outer.leftLeftBottom)}
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="border border-gray-300 dark:border-gray-600 rounded opacity-70">
                    {renderNumber(numerologyResult.outer.rightRightBottom)}
                  </div>
                  <div></div>
                  
                  {/* 最下段 - 最終的な到達点 */}
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="border-2 border-purple-300 dark:border-purple-600 rounded">
                    {renderNumber(numerologyResult.outer.bottomBar)}
                  </div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </Card>

          {/* 特別な数字の解釈 */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-center">あなたの数字の詳細な意味</h2>
            
            {/* 数字の比喩説明 */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="text-2xl mr-2">🌱</span>
                  数字の関係性について
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="flex items-start">
                      <span className="text-lg mr-2">🌟</span>
                      <span><strong className="text-purple-600 dark:text-purple-400">全体指針ナンバー</strong>：潜在意識レベルでの方向性。人生の大きなテーマとなる精神的指針</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-lg mr-2">🌸</span>
                      <span><strong className="text-red-600 dark:text-red-400">メインナンバー（花）</strong>：あなたの本質が開花した姿。人生で最も輝く部分</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-lg mr-2">🌱</span>
                      <span><strong className="text-blue-600 dark:text-blue-400">グロースナンバー（栄養）</strong>：成長のために必要な要素。これを取り入れることで開花する</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-start">
                      <span className="text-lg mr-2">🪨</span>
                      <span><strong className="text-blue-600 dark:text-blue-400">ルーツナンバー（土）</strong>：あなたの基盤となる力。根っこを支える大地のような存在</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-lg mr-2">✨</span>
                      <span><strong className="text-green-600 dark:text-green-400">ナチュラルナンバー</strong>：意識しなくても自然と出てくる特性。あなたらしさの源泉</span>
                    </p>
                    <p className="flex items-start">
                      <span className="text-lg mr-2">🎯</span>
                      <span><strong className="text-purple-600 dark:text-purple-400">最終目的ナンバー</strong>：人生を重ねる中で自然とこの要素の方向性へ向かっていく。最終的な成長の向かい先</span>
                    </p>
                  </div>
                </div>
                
                {/* 読み解き方のコツ */}
                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <span className="text-lg mr-2">📍</span>
                    数字の配置から読み解く2つのコツ
                  </h4>
                  
                  {/* コツ① */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                    <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                      <span className="text-sm mr-2">✨</span>
                      コツ① 中心と外側で見る「現実と情報の世界」
                    </h5>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p><strong className="text-blue-600 dark:text-blue-400">中心に近いほど → 物質的・現実的なエネルギー</strong></p>
                      <p className="ml-4">メインナンバー（中央）、ルーツ・グロース・ナチュラル：日常生活で発揮される具体的な力</p>
                      <p><strong className="text-indigo-600 dark:text-indigo-400">外側にいくほど → 情報的・精神的なエネルギー</strong></p>
                      <p className="ml-4">全体指針・最終目的：潜在意識レベルでの使命、まだ表面化していない可能性</p>
                    </div>
                  </div>
                  
                  {/* コツ② */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                    <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center">
                      <span className="text-sm mr-2">📍</span>
                      コツ② 縦の流れで見る「精神→物質→精神」の成長サイクル
                    </h5>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <div className="flex items-center">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold mr-2">🌟 上部：</span>
                        <span>全体指針ナンバー（精神的出発点）- 潜在意識レベルでの方向性</span>
                      </div>
                      <div className="text-center text-purple-400">⬇️</div>
                      <div className="flex items-center">
                        <span className="text-red-600 dark:text-red-400 font-semibold mr-2">🌸 中央部：</span>
                        <span>メイン・ルーツ・グロース・ナチュラル（物質的実践）- 現実世界での体現</span>
                      </div>
                      <div className="text-center text-purple-400">⬇️</div>
                      <div className="flex items-center">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold mr-2">🎯 下部：</span>
                        <span>最終目的ナンバー（精神的到達点）- 人生の最終ゴール</span>
                      </div>
                      <p className="mt-2 italic text-gray-600 dark:text-gray-400">
                        潜在的な方向性を自覚し → 実生活での実践を重ね → より高次の目的へと成長していく、人生そのものの螺旋的な成長プロセス
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg border border-pink-200 dark:border-pink-700">
                  <h4 className="font-semibold text-pink-700 dark:text-pink-300 mb-2 flex items-center">
                    <span className="text-lg mr-2">🌱→🌸</span>
                    心音ジャーナルとの素敵な繋がり
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    この数秘術の関係性は、心音ジャーナルの「種から花へ」の成長システムと美しく連動しています。
                    日記を書くことで心の種に水をやり（日々の感情を大切にする）、
                    ルーツナンバーという土台に根を張り、グロースナンバーの栄養を取り入れながら、
                    メインナンバーの花が自然と咲いていく。
                    それは一度咲いて終わりではなく、季節ごとに違う表情を見せながら、
                    あなたらしさを様々な形で表現し続ける、心の庭での永遠の旅なのです。
                  </p>
                </div>
              </div>
            </Card>
            
            {/* メインナンバー */}
            {(() => {
              const mainInterp = getDetailedInterpretation(numerologyResult.specialNumbers.mainNumber);
              return (
                <Card className="border-2 border-red-200 dark:border-red-800">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl font-bold text-red-600 dark:text-red-400 mr-4">
                        {numerologyResult.specialNumbers.mainNumber}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                          メインナンバー（花）：{mainInterp.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{mainInterp.essence}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">特性</p>
                        <p className="text-gray-700 dark:text-gray-300">{mainInterp.characteristics}</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">使命</p>
                        <p className="text-gray-700 dark:text-gray-300">{mainInterp.mission}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">影の側面</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{mainInterp.shadow}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">成長の鍵 - 影を光に変える感性の錬金術</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{mainInterp.growthKey}</p>
                        {mainInterp.shadowAlchemy && (
                          <div className="mt-2 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded">
                            <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">影の側面は可能性の裏返し</p>
                            <div className="text-xs text-purple-600 dark:text-purple-400 space-y-1">
                              {mainInterp.shadowAlchemy.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                              ))}
                            </div>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 italic">
                              影の部分を才能として捉え、光を充てることで、陰陽の統合が生まれます。
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })()}
            
            {/* その他の重要な数字 */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { num: numerologyResult.specialNumbers.pastNumber, label: "ルーツナンバー（土）", colorClasses: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-blue-600 dark:text-blue-400 text-blue-800 dark:text-blue-200" },
                { num: numerologyResult.specialNumbers.futureNumber, label: "グロースナンバー（栄養）", colorClasses: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-blue-600 dark:text-blue-400 text-blue-800 dark:text-blue-200" },
                { num: numerologyResult.specialNumbers.spiritNumber, label: "ナチュラルナンバー", colorClasses: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-green-600 dark:text-green-400 text-green-800 dark:text-green-200" },
                { num: numerologyResult.specialNumbers.higherPurposeNumber, label: "全体指針ナンバー", colorClasses: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-purple-600 dark:text-purple-400 text-purple-800 dark:text-purple-200" },
                { num: numerologyResult.specialNumbers.higherGoalNumber, label: "最終目的ナンバー", colorClasses: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-purple-600 dark:text-purple-400 text-purple-800 dark:text-purple-200" }
              ].map(({ num, label, colorClasses }) => {
                const interp = getDetailedInterpretation(num);
                const [bgClass, textClass1, textClass2, textClass3] = colorClasses.split(' ').filter((_, i) => i % 2 === 0);
                const [, darkBgClass, darkTextClass1, darkTextClass2, darkTextClass3] = colorClasses.split(' ').filter((_, i) => i % 2 === 1);
                
                return (
                  <Card key={label} className="overflow-hidden">
                    <div className={`p-4 ${bgClass} ${darkBgClass}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${textClass1} ${darkTextClass1}`}>
                          {label}
                        </h4>
                        <span className={`text-2xl font-bold ${textClass2} ${darkTextClass2}`}>
                          {num}
                        </span>
                      </div>
                      <p className={`text-lg font-semibold ${textClass3} ${darkTextClass3} mb-1`}>
                        {interp.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {interp.essence}
                      </p>
                      <div className="space-y-2">
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">使命</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{interp.mission}</p>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">影の側面</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{interp.shadow}</p>
                        </div>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded p-2">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">成長の鍵 - 影を光に変える感性の錬金術</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{interp.growthKey}</p>
                          {interp.shadowAlchemy && (
                            <div className="mt-2 p-2 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded">
                              <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">影の側面は可能性の裏返し</p>
                              <div className="text-xs text-purple-600 dark:text-purple-400 space-y-1">
                                {interp.shadowAlchemy.split('\n').map((line, index) => (
                                  <p key={index}>{line}</p>
                                ))}
                              </div>
                              <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 italic">
                                影の部分を才能として捉え、光を充てることで、陰陽の統合が生まれます。
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* 369の法則チェック */}
          {lawCheck && (
            <>
              <Card className="mb-8 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">🌌 宇宙のリズムエネルギー</h2>
                  <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-blue-900/30 rounded-lg p-6 relative">
                    <div className="absolute top-0 right-0 opacity-10">
                      <span className="text-9xl">{lawCheck.cosmicRhythm.number}</span>
                    </div>
                    
                    <div className="relative z-10">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        全体指針（{numerologyResult.specialNumbers.higherPurposeNumber}）+ 最終目的（{numerologyResult.specialNumbers.higherGoalNumber}）= 
                        <span className="text-4xl font-bold ml-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                          {lawCheck.cosmicRhythm.number}
                        </span>
                      </p>
                      
                      <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-5 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                          ✨ {lawCheck.cosmicRhythm.action}
                        </h3>
                        
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                          <span className="text-2xl mr-2">🎯</span>
                          {lawCheck.cosmicRhythm.focus}
                        </p>
                        
                        <div className="space-y-4">
                          <div className="prose prose-purple dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                              {lawCheck.cosmicRhythm.description}
                            </p>
                          </div>
                          
                          {/* 地球での使命 */}
                          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-4">
                            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                              <span className="text-xl mr-2">🌟</span>
                              日常での実践方法
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {lawCheck.cosmicRhythm.earthMission}
                            </p>
                          </div>
                          
                          {/* 起点の説明 */}
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                            <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center">
                              <span className="text-xl mr-2">🔑</span>
                              あなたらしい生き方への糸口
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {lawCheck.cosmicRhythm.startingPoint}
                            </p>
                          </div>
                          
                          {/* 注意点 */}
                          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700">
                            <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center">
                              <span className="text-xl mr-2">⚠️</span>
                              バランスを保つための注意点
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {lawCheck.cosmicRhythm.caution}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-purple-200/50 dark:border-purple-700/50">
                      <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                        ※ どの人も高次元に達すると3・6・9の数値しか出なくなります。
                        これは宇宙が拡大するときのリズムのエネルギーであり、あなたの意識の進化の方向性を示しています。
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">369の法則</h2>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      外側8つの数字の合計: <span className="font-bold">{lawCheck.outerSum}</span>
                      {lawCheck.outerSum === 9 && <span className="text-green-600 dark:text-green-400 ml-2">✓ 9になっています</span>}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      対角の和: {lawCheck.diagonalSums.join(', ')}
                    </p>
                    <p className={`font-semibold ${lawCheck.isValid ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {lawCheck.isValid ? '✨ 369の法則が成立しています！' : '369の法則は部分的に成立しています'}
                    </p>
                  </div>
                </div>
              </Card>
              
              {/* AI分析セクション */}
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center">
                      <span className="text-2xl mr-2">🤖</span>
                      AI的解釈（参考程度）
                    </h2>
                    <button
                      onClick={generateAIAnalysis}
                      disabled={aiAnalysisLoading}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                    >
                      {aiAnalysisLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          分析中...
                        </div>
                      ) : aiAnalysis ? '再分析' : 'AI分析を生成'}
                    </button>
                  </div>
                  
                  {aiAnalysis ? (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                      <div className="prose prose-sm max-w-none dark:prose-invert prose-purple">
                        <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                          {aiAnalysis}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-2">🔮</div>
                      <p>「AI分析を生成」ボタンを押すと、<br/>あなたの数秘を総合的に分析します</p>
                      <p className="text-xs mt-2 text-gray-400">※ AIによる解釈は参考程度にお楽しみください</p>
                    </div>
                  )}
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}