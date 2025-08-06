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
あなたは宇宙と繋がってる系の、ちょっとスピリチュアルでお茶目な数秘術師です。以下の数字を見て、軽快でユーモアあふれる解釈をしてください。でも的は外さないでね！

【あなたの数字コレクション】
- 全体指針ナンバー: ${numerologyData.higherPurposeNumber} (${interpretations.higherPurpose.title})
- メインナンバー: ${numerologyData.mainNumber} (${interpretations.main.title})
- ルーツナンバー: ${numerologyData.pastNumber} (${interpretations.past.title})
- グロースナンバー: ${numerologyData.futureNumber} (${interpretations.future.title})
- ナチュラルナンバー: ${numerologyData.spiritNumber} (${interpretations.spirit.title})
- 最終目的ナンバー: ${numerologyData.higherGoalNumber} (${interpretations.higherGoal.title})${cosmicRhythmInfo}

以下の構成で分析してください。**各セクションは必ず200-250文字で記述してください。**

## 🤖 AIちゃんの勝手な解釈（信じるか信じないかはあなた次第！）

### 🌌 宇宙からのメッセージらしきもの（200-250文字）
全体指針ナンバー（${numerologyData.higherPurposeNumber}）について、まるで宇宙の井戸端会議で聞いてきたような感じで、あなたの魂の設計図について語ってください。少しおもしろおかしく、でも本質は外さずに。

### 🎪 人生という名のサーカス（200-250文字）
メイン、ルーツ、グロース、ナチュラルの4つの数字を、まるでサーカスの演者たちのように表現してください。どんな芸を披露して、どうやって観客（人生）を楽しませるか、ユーモアたっぷりに説明して。

### 🚀 最終目的地はたぶんこのへん（200-250文字）
最終目的ナンバー（${numerologyData.higherGoalNumber}）について、まるで宇宙旅行のガイドブックを読んでいるような感じで、将来の到着地について案内してください。ちょっとふざけつつも、希望を感じさせる内容で。

### 🎭 人生の脚本、誰が書いたの？（200-250文字）
全体の数字パターンを、まるで誰かが書いた壮大な人生ドラマの脚本のように解釈してください。${numerologyData.cosmicRhythm ? `宇宙のリズム${numerologyData.cosmicRhythm.number}番のBGMが流れる中、` : ''}どんな展開が待っているか、面白おかしく、でも深い洞察を含めて。

注意事項：
- 各セクションは必ず200-250文字で記述する
- 親しみやすく、ユーモアあふれる口調で
- 「〜かもしれない」「〜っぽい」「〜な気がする」など、断定しない表現を多用
- 絵文字や擬音語を適度に使用
- でも占いの本質はしっかり伝える
- たまに宇宙人や天使が出てきてもOK
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

  return `## 🤖 AIちゃんの勝手な解釈（信じるか信じないかはあなた次第！）

### 🌌 宇宙からのメッセージらしきもの
えーっと、全体指針ナンバー${numerologyData.higherPurposeNumber}「${interpretations.higherPurpose.title}」ってことはですね...宇宙の井戸端会議で小耳に挟んだんですけど、あなたの魂、どうやら${interpretations.higherPurpose.essence}系の設計図で作られてるっぽいです！なんか宇宙の製造ラインで「この子はこのタイプね〜」って天使がポチッとボタン押したみたいな？まあ要するに、あなたの深〜いところには、この数字のエネルギーがギュンギュン流れてるってわけです。迷ったら、この数字に聞いてみるといいかも？

### 🎪 人生という名のサーカス
はい、あなたの人生サーカス団のご紹介〜！まず座長はメインナンバー${numerologyData.mainNumber}「${interpretations.main.title}」さん。華やかにスポットライト浴びてます✨ そして土台でガッチリ支えるのがルーツナンバー${numerologyData.pastNumber}「${interpretations.past.title}」、まるで怪力男！グロースナンバー${numerologyData.futureNumber}「${interpretations.future.title}」は栄養ドリンク配りまくる係。で、ナチュラルナンバー${numerologyData.spiritNumber}「${interpretations.spirit.title}」は...なんか勝手に客席盛り上げてる感じ？この4人組、なかなかいいチームワークで人生という舞台を盛り上げてくれそうですよ〜！

### 🚀 最終目的地はたぶんこのへん
宇宙旅行ガイドブック（第${numerologyData.higherGoalNumber}版）によるとですね、あなたの最終到着地は「${interpretations.higherGoal.title}」駅みたいです。${interpretations.higherGoal.essence}的な景色が広がってるらしいですよ〜。今はまだ出発したばかりかもしれないけど、人生という名の宇宙船に乗って、ゆらゆら〜っと進んでいけば、いつの間にか着いちゃうんだって。途中で宇宙人に会ったり、隕石かわしたりするかもだけど、それも旅の醍醐味ってことで！最終的にはきっと「あー、ここが私の場所だったのね」って思える場所に着陸するはず🛸

### 🎭 人生の脚本、誰が書いたの？
なんかこの数字の組み合わせ、誰かが夜中にコーヒー飲みながら書いた壮大な脚本みたいじゃないですか？${numerologyData.cosmicRhythm ? `BGMは宇宙のリズム${numerologyData.cosmicRhythm.number}番「${numerologyData.cosmicRhythm.focus}」。ドゥンドゥン♪って感じで流れてます。` : ''}潜在意識から始まって、現実でドタバタして、最後は高次元にたどり着く...まるで螺旋階段を登るようなストーリー展開！途中で「えっ、この展開マジ？」って思うこともあるかもだけど、それも含めて369のリズムに乗っかってるんですって。人生の脚本家、なかなかセンスあるじゃん？`
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