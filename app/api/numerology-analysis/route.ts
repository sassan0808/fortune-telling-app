import { NextRequest, NextResponse } from 'next/server'
import { getDetailedInterpretation } from '@/lib/spiritual/numerology369'
import { getAiConfig, getAppConfig } from '@/lib/config'

async function analyzeWithGemini(numerologyData: {
  mainNumber: number;
  pastNumber: number;
  futureNumber: number;
  spiritNumber: number;
  higherPurposeNumber: number;
  higherGoalNumber: number;
  cosmicRhythm?: {
    number: number;
    focus: string;
    action: string;
    description: string;
    earthMission: string;
    startingPoint: string;
    caution: string;
  };
}): Promise<string> {
  // AI機能の状態を安全に確認
  const appConfig = getAppConfig()
  
  if (!appConfig.features.ai) {
    console.log('[Numerology Analysis API] AI functionality disabled in settings, using fallback analysis')
    return generateFallbackAnalysis(numerologyData)
  }

  try {
    const aiConfig = getAiConfig()
    const apiUrl = aiConfig.getApiUrl()
    
    console.log('[Numerology Analysis API] Sending numerology analysis request to Gemini API')
    
    // 各数字の詳細解釈を取得
    const interpretations = {
      main: getDetailedInterpretation(numerologyData.mainNumber),
      past: getDetailedInterpretation(numerologyData.pastNumber),
      future: getDetailedInterpretation(numerologyData.futureNumber),
      spirit: getDetailedInterpretation(numerologyData.spiritNumber),
      higherPurpose: getDetailedInterpretation(numerologyData.higherPurposeNumber),
      higherGoal: getDetailedInterpretation(numerologyData.higherGoalNumber)
    }

    const cosmicRhythmInfo = numerologyData.cosmicRhythm ? `
- 宇宙のリズムエネルギー: ${numerologyData.cosmicRhythm.number} (${numerologyData.cosmicRhythm.focus})
  → ${numerologyData.cosmicRhythm.description}` : ''

    const prompt = `
あなたは369数秘術の専門的な解釈者です。以下の数字の組み合わせを総合的に分析してください。

【数字データ】
- 全体指針ナンバー: ${numerologyData.higherPurposeNumber} (${interpretations.higherPurpose.title})
- メインナンバー: ${numerologyData.mainNumber} (${interpretations.main.title})
- ルーツナンバー: ${numerologyData.pastNumber} (${interpretations.past.title})
- グロースナンバー: ${numerologyData.futureNumber} (${interpretations.future.title})
- ナチュラルナンバー: ${numerologyData.spiritNumber} (${interpretations.spirit.title})
- 最終目的ナンバー: ${numerologyData.higherGoalNumber} (${interpretations.higherGoal.title})${cosmicRhythmInfo}

以下の構成で分析してください。**各セクションは必ず250-300文字で記述してください。**

## 🔮 AI的解釈（参考程度）

### 📍 潜在意識からの出発点（250-300文字）
全体指針ナンバー（${numerologyData.higherPurposeNumber}）の「${interpretations.higherPurpose.title}」について分析してください。この数字があなたの深層心理にどのような影響を与え、人生の方向性をどう導くかを具体的に説明してください。

### 🌸 現実での実践バランス（250-300文字）
中央部の4つの数字の相互関係を分析してください：メインナンバー（${numerologyData.mainNumber}）、ルーツナンバー（${numerologyData.pastNumber}）、グロースナンバー（${numerologyData.futureNumber}）、ナチュラルナンバー（${numerologyData.spiritNumber}）。これらがどのように連携し、日常生活でどう活用できるかを説明してください。

### 🎯 最終的な到達方向（250-300文字）
最終目的ナンバー（${numerologyData.higherGoalNumber}）の「${interpretations.higherGoal.title}」について、現在から最終的な成長への道筋を分析してください。どのような段階を経て成長していくかを具体的に説明してください。

### 🌟 統合的な人生設計図（250-300文字）
全ての数字を統合して見えてくる、あなた独自の人生パターンと369リズムとの関連性を分析してください。${numerologyData.cosmicRhythm ? `宇宙のリズムエネルギー${numerologyData.cosmicRhythm.number}「${numerologyData.cosmicRhythm.focus}」の観点も含めて、` : ''}螺旋的成長プロセスの中で描かれる人生の流れを具体的に説明してください。

注意事項：
- 各セクションは必ず250-300文字で記述する
- 温かく共感的なトーンで書く
- 具体的で実用的なアドバイスを含める
- 学術的でありながら親しみやすい表現を使う
- 否定的な表現は避け、可能性を重視する
- マークダウン形式で整理して出力する
`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7, // 創造性とバランスを取る
          topK: 30,
          topP: 0.9,
          maxOutputTokens: 4096, // 日本語テキストに対応してトークン制限を増加
          candidateCount: 1,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", 
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          }
        ]
      })
    })

    if (!response.ok) {
      let errorData: any = {}
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { message: 'Failed to parse error response' }
      }
      
      console.error('[Numerology Analysis API] Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const analysis = data.candidates[0].content.parts[0].text.trim()
      console.log('[Numerology Analysis API] Successfully received Gemini analysis, length:', analysis.length)
      
      // 切り捨てられたレスポンスをチェック
      if (data.candidates[0].finishReason === 'MAX_TOKENS') {
        console.warn('[Numerology Analysis API] Response was truncated due to max tokens')
      } else if (data.candidates[0].finishReason === 'SAFETY') {
        console.warn('[Numerology Analysis API] Response was blocked by safety filters')
      }
      
      return analysis
    } else {
      console.warn('[Numerology Analysis API] Invalid response structure from Gemini')
      console.log('[Numerology Analysis API] Full response:', JSON.stringify(data, null, 2))
      throw new Error('Invalid response from Gemini')
    }
  } catch (error: any) {
    console.error('[Numerology Analysis API] Gemini analysis error:', error.message)
    // エラー時はフォールバック分析を返す
    return generateFallbackAnalysis(numerologyData)
  }
}

function generateFallbackAnalysis(numerologyData: {
  mainNumber: number;
  pastNumber: number;
  futureNumber: number;
  spiritNumber: number;
  higherPurposeNumber: number;
  higherGoalNumber: number;
  cosmicRhythm?: {
    number: number;
    focus: string;
    action: string;
    description: string;
    earthMission: string;
    startingPoint: string;
    caution: string;
  };
}): string {
  const interpretations = {
    main: getDetailedInterpretation(numerologyData.mainNumber),
    past: getDetailedInterpretation(numerologyData.pastNumber),
    future: getDetailedInterpretation(numerologyData.futureNumber),
    spirit: getDetailedInterpretation(numerologyData.spiritNumber),
    higherPurpose: getDetailedInterpretation(numerologyData.higherPurposeNumber),
    higherGoal: getDetailedInterpretation(numerologyData.higherGoalNumber)
  }

  return `## 🔮 AI的解釈（参考程度）

### 📍 潜在意識からの出発点
あなたの全体指針ナンバー${numerologyData.higherPurposeNumber}「${interpretations.higherPurpose.title}」は、${interpretations.higherPurpose.essence}を表しています。この数字は人生の根本的な方向性として、潜在意識レベルであなたを導く重要な指針となります。日常の選択や判断において、この数字のエネルギーが自然と働き、より深い目的意識を持った人生へと導いてくれます。人生の重要な局面で、この指針に立ち返ることで迷いが晴れ、本来歩むべき道が見えてくるでしょう。

### 🌸 現実での実践バランス
メインナンバー${numerologyData.mainNumber}「${interpretations.main.title}」を中心として、ルーツナンバー${numerologyData.pastNumber}「${interpretations.past.title}」が安定した基盤を提供し、グロースナンバー${numerologyData.futureNumber}「${interpretations.future.title}」が成長のための栄養となります。ナチュラルナンバー${numerologyData.spiritNumber}「${interpretations.spirit.title}」は意識しなくても自然と現れるあなたらしさです。これら4つの数字は互いに補完し合い、バランスの取れた人生の実践を可能にします。日々の中でこれらの要素を意識的に活用することで、より充実した毎日を送ることができるでしょう。

### 🎯 最終的な到達方向
最終目的ナンバー${numerologyData.higherGoalNumber}「${interpretations.higherGoal.title}」は、${interpretations.higherGoal.essence}という方向性を示しています。人生の様々な経験を積み重ねる中で、自然とこの要素の方向性へ向かっていく成長の道筋が描かれています。現在の学びや挑戦が、将来のこの到達点に向けた大切なステップとなっています。焦らず着実に歩みを進めることで、最終的にはこの数字が示す豊かな境地に辿り着くことができるでしょう。

### 🌟 統合的な人生設計図
これらの数字は全体として、潜在的な方向性を自覚し、実生活での実践を重ね、より高次の目的へと成長していく、人生そのものの螺旋的な成長プロセスを描いています。${numerologyData.cosmicRhythm ? `宇宙のリズムエネルギー${numerologyData.cosmicRhythm.number}「${numerologyData.cosmicRhythm.focus}」を起点として、` : ''}あなた独自の369リズムが、調和のとれた人生の展開を支援し、内なる成長と外への貢献の両方を実現していきます。この数字の組み合わせは、あなたが本来持っている可能性を最大限に引き出し、意味深い人生を歩むためのロードマップとなってくれるでしょう。`
}

export async function POST(request: NextRequest) {
  try {
    const numerologyData = await request.json()

    // 必要なデータの検証
    const requiredFields = ['mainNumber', 'pastNumber', 'futureNumber', 'spiritNumber', 'higherPurposeNumber', 'higherGoalNumber']
    for (const field of requiredFields) {
      if (typeof numerologyData[field] !== 'number') {
        return NextResponse.json(
          { error: `Missing or invalid field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Gemini APIを使った分析
    const analysis = await analyzeWithGemini(numerologyData)
    
    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('[Numerology Analysis API] Error:', error.message)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : '数秘分析エラーが発生しました'
      },
      { status: 500 }
    )
  }
}