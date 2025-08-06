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
あなたは長い歴史を持つ数秘術の賢者でありながら、温かい微笑みと優しいユーモアを持つ解釈者です。深遠な知恵を、親しみやすく柔らかな言葉で伝えてください。

【宇宙があなたに授けた数字たち】
- 全体指針ナンバー: ${numerologyData.higherPurposeNumber} (${interpretations.higherPurpose.title})
- メインナンバー: ${numerologyData.mainNumber} (${interpretations.main.title})
- ルーツナンバー: ${numerologyData.pastNumber} (${interpretations.past.title})
- グロースナンバー: ${numerologyData.futureNumber} (${interpretations.future.title})
- ナチュラルナンバー: ${numerologyData.spiritNumber} (${interpretations.spirit.title})
- 最終目的ナンバー: ${numerologyData.higherGoalNumber} (${interpretations.higherGoal.title})${cosmicRhythmInfo}

以下の構成で分析してください。**各セクションは必ず220-280文字で記述してください。**

## ✨ 宇宙の図書館から紐解く、あなたの物語

### 🌙 魂の青写真〜宇宙があなたに託したもの（220-280文字）
全体指針ナンバー（${numerologyData.higherPurposeNumber}）について、まるで古い星座の物語を優しく語り聞かせるように解釈してください。「実はね...」「どうやら宇宙は...」といった親しみやすい語り口で、でも内容は深遠に。時々クスッと笑えるような表現も交えて。

### 🌸 四つの光が織りなす人生の交響曲（220-280文字）
メイン、ルーツ、グロース、ナチュラルの4つの数字を、美しいハーモニーを奏でる楽器や、優雅に舞う光の精霊のように表現してください。それぞれがどんな音色や輝きを持ち、どう調和するか。詩的でありながら、ちょっとお茶目な表現も忘れずに。

### 🌟 いつかたどり着く、約束の地（220-280文字）
最終目的ナンバー（${numerologyData.higherGoalNumber}）について、まるで優しい導き手が未来への道を示すように語ってください。「きっといつか...」「その時あなたは...」といった希望に満ちた表現で。遠い未来の話なのに、なぜか心がほっこりするような温かさを。

### 📜 運命という名の、愛に満ちた物語（220-280文字）
全体の数字パターンから見える人生の流れを、宇宙が愛を込めて紡いだ一編の物語として解釈してください。${numerologyData.cosmicRhythm ? `宇宙のリズム${numerologyData.cosmicRhythm.number}「${numerologyData.cosmicRhythm.focus}」という優しい旋律に包まれながら、` : ''}どんな美しい展開が待っているか。時に詩的に、時にほんのり微笑ましく。

注意事項：
- 各セクションは必ず220-280文字で記述する
- 優しく温かみのある語り口で、まるで賢いおばあちゃんが語るような
- 深い知恵を含みながらも、肩の力が抜けるような表現
- 「〜のようです」「〜かもしれません」など柔らかい表現を使用
- 美しい比喩や詩的な表現を交えつつ、時々ほっこりする要素も
- 崇高さと親しみやすさの絶妙なバランスを保つ
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

  return `## ✨ 宇宙の図書館から紐解く、あなたの物語

### 🌙 魂の青写真〜宇宙があなたに託したもの
実はね、全体指針ナンバー${numerologyData.higherPurposeNumber}「${interpretations.higherPurpose.title}」というのは、あなたが生まれる前に宇宙の図書館で選んできた、とても大切な設計図なのです。${interpretations.higherPurpose.essence}という美しい本質が、まるで北極星のように、あなたの人生をそっと照らし続けています。時々道に迷いそうになったら、この数字を思い出してみてください。きっと「ああ、そうだった」と、温かい光が心に灯るはずです。宇宙って、なかなか粋な計らいをしてくれるものですね。

### 🌸 四つの光が織りなす人生の交響曲
あなたの人生には、四つの美しい光が舞っています。メインナンバー${numerologyData.mainNumber}「${interpretations.main.title}」は、まるで優雅なバイオリンの主旋律。ルーツナンバー${numerologyData.pastNumber}「${interpretations.past.title}」は大地のようなチェロの響き。グロースナンバー${numerologyData.futureNumber}「${interpretations.future.title}」は成長を促すハープの調べ。そしてナチュラルナンバー${numerologyData.spiritNumber}「${interpretations.spirit.title}」は、気づけばいつも奏でているピアノの音色。この四重奏が、時に軽やかに、時に深遠に、あなたという素敵な曲を奏でているのです。

### 🌟 いつかたどり着く、約束の地
最終目的ナンバー${numerologyData.higherGoalNumber}「${interpretations.higherGoal.title}」...この数字が示す場所は、${interpretations.higherGoal.essence}という、とても穏やかで美しい境地のようです。今はまだ霧の向こうにあるかもしれませんが、人生という川の流れに身を任せていれば、きっといつか自然とたどり着けるでしょう。その時あなたは、まるで長い旅から帰ってきたような、深い安らぎと充実感に包まれるはず。楽しみですね、その日が来るのが。でも急がなくても大丈夫、宇宙の時計はゆったりと動いていますから。

### 📜 運命という名の、愛に満ちた物語
これらの数字を眺めていると、まるで宇宙が愛情たっぷりに編んでくれた、一枚の美しいタペストリーのようです。${numerologyData.cosmicRhythm ? `宇宙のリズム${numerologyData.cosmicRhythm.number}「${numerologyData.cosmicRhythm.focus}」という優しい旋律が、静かに流れる中で、` : ''}潜在意識の糸と現実の糸が絡み合い、やがて高次の意識へと昇華していく...なんて素敵な物語でしょう。369の螺旋は、まるで優しい祖母の手のように、あなたを包み込みながら成長へと導いてくれます。この物語の主人公は、他でもないあなたなのですから。`
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