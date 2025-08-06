// 数秘術計算ロジック

export interface NumerologyResult {
  lifePathNumber: number
  soulNumber: number
  destinyNumber: number
  personalityNumber: number
  maturityNumber: number
  interpretation: {
    lifePath: string
    soul: string
    destiny: string
    personality: string
    maturity: string
  }
}

// ライフパスナンバー（生年月日から計算）
export function calculateLifePathNumber(birthDate: Date): number {
  const year = birthDate.getFullYear()
  const month = birthDate.getMonth() + 1
  const day = birthDate.getDate()
  
  // 各桁を足し合わせる
  let sum = reduceToSingleDigit(year) + reduceToSingleDigit(month) + reduceToSingleDigit(day)
  
  // マスターナンバー（11, 22, 33）は残す
  if (sum === 11 || sum === 22 || sum === 33) {
    return sum
  }
  
  return reduceToSingleDigit(sum)
}

// ソウルナンバー（母音から計算）
export function calculateSoulNumber(name: string): number {
  const vowels = ['A', 'E', 'I', 'O', 'U', 'あ', 'い', 'う', 'え', 'お', 'ア', 'イ', 'ウ', 'エ', 'オ']
  const nameUpper = name.toUpperCase()
  let sum = 0
  
  for (const char of nameUpper) {
    if (vowels.includes(char)) {
      sum += getCharacterValue(char)
    }
  }
  
  // 名前から母音が見つからない場合は、全文字の合計値を使用
  if (sum === 0 && name.length > 0) {
    for (const char of name) {
      sum += getCharacterValue(char)
    }
    sum = Math.floor(sum / 2) // 母音のみの効果を模擬
  }
  
  return sum > 0 ? reduceToSingleDigit(sum) : 1
}

// デスティニーナンバー（フルネームから計算）
export function calculateDestinyNumber(fullName: string): number {
  const cleanName = fullName.replace(/[\s\u3000]/g, '') // スペースと全角スペースを除去
  let sum = 0
  
  for (const char of cleanName) {
    sum += getCharacterValue(char)
  }
  
  return sum > 0 ? reduceToSingleDigit(sum) : 1
}

// パーソナリティナンバー（子音から計算）
export function calculatePersonalityNumber(name: string): number {
  const vowels = ['A', 'E', 'I', 'O', 'U', 'あ', 'い', 'う', 'え', 'お', 'ア', 'イ', 'ウ', 'エ', 'オ']
  const nameUpper = name.toUpperCase()
  let sum = 0
  
  for (const char of nameUpper) {
    if (!vowels.includes(char) && /[A-Z\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(char)) {
      sum += getCharacterValue(char)
    }
  }
  
  // 子音が見つからない場合は、全文字の合計値から母音分を引く
  if (sum === 0 && name.length > 0) {
    for (const char of name) {
      if (!vowels.includes(char.toUpperCase())) {
        sum += getCharacterValue(char)
      }
    }
    
    // それでも0の場合は全文字の半分の値を使用
    if (sum === 0) {
      for (const char of name) {
        sum += getCharacterValue(char)
      }
      sum = Math.floor(sum / 2)
    }
  }
  
  return sum > 0 ? reduceToSingleDigit(sum) : 1
}

// マチュリティナンバー（ライフパス + デスティニー）
export function calculateMaturityNumber(lifePathNumber: number, destinyNumber: number): number {
  const sum = lifePathNumber + destinyNumber
  return reduceToSingleDigit(sum)
}

// 数字を単一桁に減らす（マスターナンバーは除く）
function reduceToSingleDigit(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    const digits = num.toString().split('').map(d => parseInt(d));
    num = digits.reduce((acc, digit) => acc + digit, 0);
  }
  return num;
}

// 文字を数値に変換
function getCharacterValue(char: string): number {
  // 英文字のマッピング
  const englishMap: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  }
  
  // 日本語文字は文字コードを利用して数値化
  if (englishMap[char]) {
    return englishMap[char]
  }
  
  // ひらがな・カタカナ・漢字の場合は文字コードを利用
  const charCode = char.charCodeAt(0)
  
  // ひらがな (U+3040-U+309F)
  if (charCode >= 0x3040 && charCode <= 0x309F) {
    return ((charCode - 0x3040) % 9) + 1
  }
  
  // カタカナ (U+30A0-U+30FF)
  if (charCode >= 0x30A0 && charCode <= 0x30FF) {
    return ((charCode - 0x30A0) % 9) + 1
  }
  
  // 漢字 (U+4E00-U+9FAF)
  if (charCode >= 0x4E00 && charCode <= 0x9FAF) {
    return ((charCode - 0x4E00) % 9) + 1
  }
  
  // その他の文字は文字コードを9で割った余り+1
  return (charCode % 9) + 1
}

// ライフパスナンバーの解釈
export function interpretLifePathNumber(number: number): string {
  const interpretations: Record<number, string> = {
    1: 'リーダーシップと独立心を持つ開拓者。新しい道を切り開く運命',
    2: '協調性と感受性を持つ調和の使者。人と人をつなぐ架け橋',
    3: '創造性と表現力に富む芸術家。喜びと楽しさを世界に広める',
    4: '堅実で信頼される建設者。確かな基盤を築き上げる',
    5: '自由と冒険を愛する探求者。変化と成長を通じて学ぶ',
    6: '愛と責任感を持つ養育者。家族や共同体に奉仕する',
    7: '内省と精神性を重視する探究者。真理と知恵を追求',
    8: '物質と精神のバランスを保つ達成者。大きな成功を収める',
    9: '普遍的な愛を持つ人道主義者。世界に貢献する使命',
    11: '直感力と霊性を持つメッセンジャー。高次の意識を伝える',
    22: '大きなビジョンを実現するマスタービルダー。世界を変革する',
    33: '無条件の愛を体現するマスターティーチャー。人類を導く'
  }
  
  return interpretations[number] || '特別な使命を持つユニークなタイプ'
}

// ソウルナンバーの解釈
export function interpretSoulNumber(number: number): string {
  const interpretations: Record<number, string> = {
    1: '独立と自己実現を心から望む。自分の力で道を切り開きたい',
    2: '深い絆と調和を求める。誰かと共に歩むことで幸せを感じる',
    3: '自己表現と創造性を渇望。内なる芸術家が表現を求めている',
    4: '安定と秩序を必要とする。確かなものを築き上げたい',
    5: '自由と冒険を切望。新しい経験を通じて成長したい',
    6: '愛と奉仕に喜びを見出す。大切な人を守り育てたい',
    7: '真理と知恵を探求したい。内なる世界を深く理解したい',
    8: '成功と達成を強く願う。自分の力を証明したい',
    9: '世界への貢献を望む。より大きな目的のために生きたい'
  }
  
  return interpretations[number] || '深い内面的な欲求を持つ'
}

// デスティニーナンバーの解釈
export function interpretDestinyNumber(number: number): string {
  const interpretations: Record<number, string> = {
    1: '革新的なリーダーとして組織や社会を導く運命',
    2: '協力と調和を通じて平和な世界を築く使命',
    3: '創造性と表現力で人々に喜びをもたらす役割',
    4: '安定した基盤を築き、秩序ある社会に貢献',
    5: '自由と変化を通じて新しい価値観を広める',
    6: '愛と奉仕の精神で家族や共同体を支える',
    7: '知恵と洞察力で人類の精神的成長に貢献',
    8: '物質と精神のバランスを保ち大きな成果を達成',
    9: '人道主義的な活動で世界平和に貢献する使命'
  }
  
  return interpretations[number] || '特別な社会的使命を持つ'
}

// パーソナリティナンバーの解釈
export function interpretPersonalityNumber(number: number): string {
  const interpretations: Record<number, string> = {
    1: '自信に満ち、リーダーシップのある印象を与える',
    2: '優しく協調的で、人を安心させる雰囲気',
    3: '明るく創造的で、人を楽しませる魅力的な人',
    4: '信頼できて堅実、責任感のある印象',
    5: '自由で冒険的、エネルギッシュな魅力',
    6: '温かく思いやりがあり、母性的・父性的な印象',
    7: '神秘的で知的、深い洞察力を感じさせる',
    8: '成功者の風格があり、威厳と実力を感じさせる',
    9: '慈悲深く包容力があり、人道的な魅力'
  }
  
  return interpretations[number] || '独特で魅力的な印象を持つ'
}

// マチュリティナンバーの解釈
export function interpretMaturityNumber(number: number): string {
  const interpretations: Record<number, string> = {
    1: '人生後半に独立したリーダーシップを発揮',
    2: '成熟期に調和と協力の才能が開花',
    3: '後半生で創造性と表現力が最高潮に',
    4: '人生経験を活かした堅実な成果を築く',
    5: '自由な発想で新しい分野を開拓',
    6: '愛と奉仕の精神で多くの人を導く',
    7: '深い知恵と洞察力で精神的指導者に',
    8: '物質的・精神的成功の両方を達成',
    9: '人類への貢献で大きな遺産を残す'
  }
  
  return interpretations[number] || '人生後半に特別な才能が開花'
}

// 五行バランスの計算
export interface FiveElementsBalance {
  wood: number   // 木
  fire: number   // 火
  earth: number  // 土
  metal: number  // 金
  water: number  // 水
  dominantElement: string
  lackingElement: string
}

export function calculateFiveElementsBalance(birthDate: Date, entries: any[]): FiveElementsBalance {
  const month = birthDate.getMonth() + 1
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
  
  // 生まれ月による基本要素
  if (month >= 2 && month <= 4) elements.wood += 30      // 春：木
  else if (month >= 5 && month <= 7) elements.fire += 30 // 夏：火
  else if (month >= 8 && month <= 10) elements.metal += 30 // 秋：金
  else elements.water += 30                                // 冬：水
  
  // 日記の内容から要素を分析
  entries.forEach(entry => {
    const content = entry.content.toLowerCase()
    if (content.includes('成長') || content.includes('新しい')) elements.wood += 5
    if (content.includes('情熱') || content.includes('エネルギー')) elements.fire += 5
    if (content.includes('安定') || content.includes('バランス')) elements.earth += 5
    if (content.includes('整理') || content.includes('完璧')) elements.metal += 5
    if (content.includes('流れ') || content.includes('柔軟')) elements.water += 5
  })
  
  // 正規化
  const total = Object.values(elements).reduce((a, b) => a + b, 0)
  Object.keys(elements).forEach(key => {
    elements[key as keyof typeof elements] = Math.round((elements[key as keyof typeof elements] / total) * 100)
  })
  
  // 最も強い要素と弱い要素を特定
  const sortedElements = Object.entries(elements).sort((a, b) => b[1] - a[1])
  
  return {
    ...elements,
    dominantElement: sortedElements[0][0],
    lackingElement: sortedElements[sortedElements.length - 1][0]
  }
}

// 今日の運勢計算
export interface DailyFortune {
  overallLuck: number // 1-10
  loveLuck: number
  workLuck: number
  healthLuck: number
  luckyColor: string
  luckyNumber: number
  advice: string
  warningTime: string
}

export function calculateDailyFortune(lifePathNumber: number, date: Date): DailyFortune {
  // 日付とライフパスナンバーから運勢を計算
  const dayNumber = date.getDate()
  const monthNumber = date.getMonth() + 1
  const seed = (lifePathNumber + dayNumber + monthNumber) % 10 + 1
  
  const colors = ['赤', '青', '黄', '緑', '紫', '白', 'ピンク', 'オレンジ', '金', '銀']
  const warningTimes = ['早朝', '午前中', '昼頃', '午後', '夕方', '夜']
  
  return {
    overallLuck: seed,
    loveLuck: ((seed + 3) % 10) + 1,
    workLuck: ((seed + 5) % 10) + 1,
    healthLuck: ((seed + 7) % 10) + 1,
    luckyColor: colors[seed - 1],
    luckyNumber: (seed * lifePathNumber) % 9 + 1,
    advice: generateDailyAdvice(seed, lifePathNumber),
    warningTime: warningTimes[(seed + dayNumber) % warningTimes.length]
  }
}

function generateDailyAdvice(luck: number, lifePathNumber: number): string {
  if (luck >= 8) {
    return '絶好調！今日は大きなチャンスが訪れそう。積極的に行動しましょう'
  } else if (luck >= 6) {
    return '良い流れが来ています。普段通りの行動で幸運を引き寄せられます'
  } else if (luck >= 4) {
    return '落ち着いて過ごすのが吉。無理をせず、自分のペースを大切に'
  } else {
    return '慎重に行動する日。新しいことより、今あるものを大切にしましょう'
  }
}