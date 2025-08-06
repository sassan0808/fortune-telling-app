/**
 * 369数秘術魔方陣ジェネレーター
 * 生年月日から17個の数字を生成する数秘術の計算ロジック
 */

export interface NumerologyGrid {
  // 3×3グリッド
  grid: {
    topLeft: number;
    top: number;
    topRight: number;
    left: number;
    center: number;
    right: number;
    bottomLeft: number;
    bottom: number;
    bottomRight: number;
  };
  // 外側の8個
  outer: {
    leftLeftTop: number;
    leftLeftMiddle: number;
    leftLeftBottom: number;
    topBar: number;
    rightRightTop: number;
    rightRightMiddle: number;
    rightRightBottom: number;
    bottomBar: number;
  };
  // 特別な意味を持つ数字
  specialNumbers: {
    mainNumber: number;
    pastNumber: number;
    futureNumber: number;
    spiritNumber: number;
    higherPurposeNumber: number;
    higherGoalNumber: number;
  };
}

// マスターナンバー
const MASTER_NUMBERS = [11, 22, 33, 44];

/**
 * 数字を1桁に減らす（マスターナンバーは除く）
 */
function reduceToSingleDigit(num: number, allowMasterNumber: boolean = false): number {
  // 最初にマスターナンバーチェック
  if (allowMasterNumber && MASTER_NUMBERS.includes(num)) {
    return num;
  }
  
  // 10以上の数字を1桁に減らす
  while (num > 9) {
    const digits = num.toString().split('').map(d => parseInt(d));
    num = digits.reduce((sum, digit) => sum + digit, 0);
    
    // 計算後に再度マスターナンバーチェック
    if (allowMasterNumber && MASTER_NUMBERS.includes(num)) {
      return num;
    }
  }
  
  return num;
}

/**
 * 生年月日から369数秘術魔方陣を生成
 */
export function calculate369Numerology(birthDate: Date): NumerologyGrid {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1; // 0-indexed to 1-indexed
  const day = birthDate.getDate();
  
  // 1. 各桁の合計を計算
  const digitSum = year.toString().split('').concat(
    month.toString().split(''),
    day.toString().split('')
  ).reduce((sum, digit) => sum + parseInt(digit), 0);
  
  // 2. 中央の十字（5マス）を計算
  const center = reduceToSingleDigit(digitSum, true); // メインナンバー
  const left = reduceToSingleDigit(day); // 過去ナンバー（日を1桁に）
  const right = reduceToSingleDigit(month + day); // 未来ナンバー
  const bottom = reduceToSingleDigit(left + center + right); // スピリットナンバー
  const top = reduceToSingleDigit(center + bottom);
  
  // 3. 四隅（4マス）を計算
  const topLeft = reduceToSingleDigit(top + left);
  const topRight = reduceToSingleDigit(top + right);
  const bottomLeft = reduceToSingleDigit(left + bottom);
  const bottomRight = reduceToSingleDigit(right + bottom);
  
  // 4. 外側の数字（8個）を計算
  // まず中間の4つ
  const leftLeftMiddle = reduceToSingleDigit(topLeft + bottomLeft);
  const rightRightMiddle = reduceToSingleDigit(topRight + bottomRight);
  const topBar = reduceToSingleDigit(topLeft + topRight, true); // 高次目的ナンバー（マスターナンバー許可）
  const bottomBar = reduceToSingleDigit(bottomLeft + bottomRight, true); // 高次ゴールナンバー（マスターナンバー許可）
  
  // 次に四隅
  const leftLeftTop = reduceToSingleDigit(leftLeftMiddle + topBar);
  const leftLeftBottom = reduceToSingleDigit(leftLeftMiddle + bottomBar);
  const rightRightTop = reduceToSingleDigit(rightRightMiddle + topBar);
  const rightRightBottom = reduceToSingleDigit(rightRightMiddle + bottomBar);
  
  return {
    grid: {
      topLeft,
      top,
      topRight,
      left,
      center,
      right,
      bottomLeft,
      bottom,
      bottomRight
    },
    outer: {
      leftLeftTop,
      leftLeftMiddle,
      leftLeftBottom,
      topBar,
      rightRightTop,
      rightRightMiddle,
      rightRightBottom,
      bottomBar
    },
    specialNumbers: {
      mainNumber: center,
      pastNumber: left,
      futureNumber: right,
      spiritNumber: bottom,
      higherPurposeNumber: topBar,
      higherGoalNumber: bottomBar
    }
  };
}

/**
 * 数字の詳細な意味
 */
export interface NumberInterpretation {
  title: string;
  essence: string;
  characteristics: string;
  mission: string;
  shadow: string;
  growthKey: string;
  shadowAlchemy: string;
}

/**
 * 数字の意味を解釈
 */
export function interpretNumber(num: number): string {
  const interpretations: { [key: number]: string } = {
    1: "始源の光 - 全ての始まり、純粋な意志の発動",
    2: "調和の架け橋 - 二元性の統合、陰陽のバランス",
    3: "創造の歓び - 生命力の表現、無限の可能性",
    4: "大地の礎 - 物質世界の安定、現実化の力",
    5: "自由の風 - 変化と進化、無限の可能性への探求",
    6: "愛の調律師 - 無条件の愛、美と調和の創造",
    7: "真理の探究者 - 内なる叡智、精神性の極み",
    8: "豊かさの顕現者 - 物質と精神の統合、無限の豊かさ",
    9: "宇宙の賢者 - 全体性の理解、普遍的な愛と智慧",
    11: "【マスターナンバー】光のメッセンジャー - 天と地を繋ぐ神聖なアンテナ",
    22: "【マスターナンバー】地球の建築家 - 夢を大規模に実現する力",
    33: "【マスターナンバー】無条件愛の体現者 - キリスト意識、観音のエネルギー",
    44: "【マスターナンバー】意識革命の先導者 - アトランティスの叡智、大変革のエネルギー"
  };
  
  return interpretations[num] || `数字 ${num} の解釈`;
}

/**
 * 数字の詳細な解釈を取得
 */
export function getDetailedInterpretation(num: number): NumberInterpretation {
  const interpretations: { [key: number]: NumberInterpretation } = {
    1: {
      title: "始源の光",
      essence: "全ての始まり、純粋な意志の発動",
      characteristics: "リーダーシップ、独創性、開拓精神、自己確立",
      mission: "新しい道を切り拓き、他者に勇気と方向性を示す",
      shadow: "孤独、頑固、自己中心的",
      growthKey: "他者との協調を学びながら、自分の光を輝かせる",
      shadowAlchemy: "孤独 → 独立性と自己確立の力、一人の時間を創造に活かす能力\n頑固 → 信念を貫く強さ、ブレない軸を持つリーダーシップ\n自己中心的 → 自分の価値を知り、それを起点に他者を導く力"
    },
    2: {
      title: "調和の架け橋",
      essence: "二元性の統合、陰陽のバランス",
      characteristics: "協調性、感受性、サポート力、直感力、優しさ",
      mission: "対立を調和へと導き、人と人を繋ぐ架け橋となる",
      shadow: "依存、優柔不断、過敏",
      growthKey: "自立心を保ちながら、他者と深く繋がる",
      shadowAlchemy: "依存 → 深い共感力、人との絆を大切にする心\n優柔不断 → 慎重さと多角的視点、バランス感覚の鋭さ\n過敏 → 繊細な感受性、微細なエネルギーを感じ取る直感力"
    },
    3: {
      title: "創造の歓び",
      essence: "生命力の表現、無限の可能性",
      characteristics: "創造性、表現力、楽観性、社交性、子どものような純粋さ",
      mission: "喜びと創造性を通じて、世界に新しい命を吹き込む",
      shadow: "散漫、表面的、無責任",
      growthKey: "深い集中力を養い、創造を形にする",
      shadowAlchemy: "散漫 → 多角的な才能、無限の可能性への扉\n表面的 → 軽やかさと親しみやすさ、場を明るくする力\n無責任 → 自由な発想力、枠にとらわれない創造性"
    },
    4: {
      title: "大地の礎",
      essence: "物質世界の安定、現実化の力",
      characteristics: "実践力、忍耐力、誠実さ、建設的、秩序",
      mission: "夢を現実に変え、永続的な基盤を築く",
      shadow: "頑固、融通が利かない、物質主義",
      growthKey: "柔軟性を持ちながら、確実に形を創る",
      shadowAlchemy: "頑固 → 不動の安定感、信頼できる基盤を築く力\n融通が利かない → 一貫性と誠実さ、約束を守り抜く信念\n物質主義 → 現実化能力、夢を形にする実践力"
    },
    5: {
      title: "自由の風",
      essence: "変化と進化、無限の可能性への探求",
      characteristics: "冒険心、多才、適応力、好奇心、変革力",
      mission: "古い枠組みを破り、新しい時代の風を吹かせる",
      shadow: "不安定、無責任、刺激中毒",
      growthKey: "自由の中に責任を見出し、変化を成長へ繋げる",
      shadowAlchemy: "不安定 → 変化への適応力、新しい環境を楽しむ柔軟性\n無責任 → 束縛されない自由な精神、型破りな発想力\n刺激中毒 → 旺盛な好奇心、人生を冒険として楽しむ力"
    },
    6: {
      title: "愛の調律師",
      essence: "無条件の愛、美と調和の創造",
      characteristics: "愛情深さ、責任感、美的感覚、癒しの力、母性/父性",
      mission: "愛を通じて世界を癒し、新しい宇宙（調和）を生み出す",
      shadow: "過保護、自己犠牲、完璧主義",
      growthKey: "自分自身も愛し、与えることと受け取ることのバランスを保つ",
      shadowAlchemy: "過保護 → 深い愛情と責任感、他者を大切に思う心\n自己犠牲 → 無条件の愛、与えることの喜びを知る力\n完璧主義 → 美への追求、調和を生み出す繊細な感性"
    },
    7: {
      title: "真理の探究者",
      essence: "内なる叡智、精神性の極み",
      characteristics: "分析力、直感力、神秘性、独立心、専門性",
      mission: "真理を探求し、精神的な道を極めて他者を導く",
      shadow: "孤立、懐疑的、現実逃避",
      growthKey: "内なる世界と外の世界を統合し、智慧を分かち合う",
      shadowAlchemy: "孤立 → 内なる世界の豊かさ、独自の洞察力\n懐疑的 → 深い分析力、真実を見抜く直感\n現実逃避 → 精神性への探求、目に見えない世界への理解"
    },
    8: {
      title: "豊かさの顕現者",
      essence: "物質と精神の統合、無限の豊かさ",
      characteristics: "実行力、組織力、野心、カリスマ性、物質的成功",
      mission: "精神的な価値を物質世界で実現し、豊かさを循環させる",
      shadow: "権力欲、物質主義、ワーカホリック",
      growthKey: "力を愛のために使い、真の豊かさを理解する",
      shadowAlchemy: "権力欲 → リーダーシップと統率力、大きなビジョンを実現する力\n物質主義 → 豊かさを循環させる能力、経済的成功への才能\nワーカホリック → 集中力と持続力、目標達成への情熱"
    },
    9: {
      title: "宇宙の賢者",
      essence: "全体性の理解、普遍的な愛と智慧",
      characteristics: "博愛、寛容、直感力、芸術性、人道主義",
      mission: "全ての存在を包容し、人類の意識進化を助ける",
      shadow: "理想主義、現実離れ、自己喪失",
      growthKey: "地に足をつけながら、宇宙的視点を保つ",
      shadowAlchemy: "理想主義 → 高い志と人道的精神、世界をより良くする意志\n現実離れ → 宇宙的視点、大きな愛で物事を捉える力\n自己喪失 → 他者への深い共感、境界を超えた一体感"
    },
    11: {
      title: "光のメッセンジャー",
      essence: "天と地を繋ぐ神聖なアンテナ",
      characteristics: "高次の直感、霊的感受性、インスピレーション、啓示",
      mission: "見えない世界のメッセージを受信し、人類に伝える",
      shadow: "過敏、現実との乖離、神経過敏",
      growthKey: "グラウンディングしながら、高次の情報を実用的に伝える",
      shadowAlchemy: "過敏 → 高次の感受性、見えないエネルギーを感じ取る力\n現実との乖離 → スピリチュアルな直感、天からのメッセージを受信する能力\n神経過敏 → 繊細なアンテナ、微細な変化を察知する感性"
    },
    22: {
      title: "地球の建築家",
      essence: "夢を大規模に実現する力",
      characteristics: "ビジョン、実現力、国際性、統合力",
      mission: "地球規模で人類の進化に貢献する構造を創る",
      shadow: "過大な責任感、完璧主義、燃え尽き",
      growthKey: "大きなビジョンを持ちながら、一歩一歩確実に進む",
      shadowAlchemy: "過大な責任感 → 大きなビジョンを実現する使命感と能力\n完璧主義 → 質の高い仕事への追求、妥協しない姿勢\n燃え尽き → 情熱的な取り組み、全力で物事に向かう力"
    },
    33: {
      title: "無条件愛の体現者",
      essence: "キリスト意識、観音のエネルギー",
      characteristics: "無条件の愛、癒し、目醒めの促進、慈悲",
      mission: "愛の振動で人類の意識を上昇させ、目醒めを加速させる",
      shadow: "自己犠牲、救世主コンプレックス",
      growthKey: "自分自身への愛を基盤に、他者を導く",
      shadowAlchemy: "自己犠牲 → 深い慈愛、他者の痛みを自分のものとして感じる共感力\n救世主コンプレックス → 人を癒し導く力、希望の光を与える能力"
    },
    44: {
      title: "意識革命の先導者",
      essence: "アトランティスの叡智、大変革のエネルギー",
      characteristics: "革新力、破壊と創造、意識の量子的飛躍",
      mission: "古いパラダイムを破壊し、新しい意識の時代を創造する",
      shadow: "破壊衝動、極端な変化、カオス",
      growthKey: "破壊の中に愛を持ち、新しい秩序を生み出す",
      shadowAlchemy: "破壊衝動 → 古いシステムを変革する力、新時代を切り拓く勇気\n極端な変化 → 大胆な行動力、常識を覆す革新性\nカオス → 創造的混沌、既存の枠を超えた可能性の創出"
    }
  };
  
  return interpretations[num] || {
    title: `数字 ${num}`,
    essence: "解釈を準備中",
    characteristics: "",
    mission: "",
    shadow: "",
    growthKey: "",
    shadowAlchemy: ""
  };
}

/**
 * 369の法則をチェック
 */
export function check369Law(grid: NumerologyGrid): {
  outerSum: number;
  diagonalSums: number[];
  isValid: boolean;
  higherDimensionSum: number;
  cosmicRhythm: {
    number: number;
    focus: string;
    action: string;
    description: string;
    earthMission: string;
    startingPoint: string;
    caution: string;
  };
} {
  const outer = grid.outer;
  
  // 外側8つの数字の合計
  const outerSum = reduceToSingleDigit(
    outer.leftLeftTop + outer.leftLeftMiddle + outer.leftLeftBottom +
    outer.topBar + outer.bottomBar +
    outer.rightRightTop + outer.rightRightMiddle + outer.rightRightBottom
  );
  
  // 対角の数字の和
  const diagonalSums = [
    reduceToSingleDigit(outer.leftLeftTop + outer.rightRightBottom),
    reduceToSingleDigit(outer.leftLeftBottom + outer.rightRightTop),
    reduceToSingleDigit(outer.topBar + outer.bottomBar),
    reduceToSingleDigit(outer.leftLeftMiddle + outer.rightRightMiddle)
  ];
  
  // 3, 6, 9のチェック
  const isValid = outerSum === 9 && diagonalSums.every(sum => [3, 6, 9].includes(sum));
  
  // 高次元の和（高次目的 + 高次ゴール）
  const higherDimensionSum = reduceToSingleDigit(grid.specialNumbers.higherPurposeNumber + grid.specialNumbers.higherGoalNumber);
  
  // 宇宙のリズムエネルギー解釈
  const cosmicRhythms: { [key: number]: { focus: string; action: string; description: string; earthMission: string; startingPoint: string; caution: string } } = {
    3: {
      focus: "自分の内なる光にフォーカス",
      action: "純粋な喜びを表現する",
      description: "あなたの369リズムの起点は、まず自分自身が心から純粋に喜ぶことを見つけ、それを思い切り表現することです。子どものような無邪気さで人生を楽しみ、その輝きが自然と周りを照らします。自分の創造性を解放し、ワクワクすることに没頭することで、宇宙のリズムと共鳴します。",
      earthMission: "【369宇宙のリズム：3（自分）→ 6（周り）→ 9（全体）】\n\n【自分の歓びが全ての始まり】\n純粋な喜びを大切にしてみてください。自分が心から楽しめることに没頭し、子どものような無邪気さで人生を味わうことを意識してみましょう。「今、自分は本当に楽しんでいるか？」「心からワクワクしているか？」を日々問いかけ、歓びを感じることを大切にすることで、自然と宇宙のリズムと共鳴していきます。\n\n3を起点とするあなたは、まず自分の内なる光を輝かせることで、自然と周りの人々（6）、そして全体（9）へとエネルギーが拡がっていく369のリズムを創り出すことができます。",
      startingPoint: "この「3」のエネルギーは、あなたの本質的な生き方を知る重要な糸口です。純粋な喜びと楽しさを追求することが、あなたらしい人生への扉を開きます。",
      caution: "独りよがりになったり、狭い世界に行き過ぎているなと思ったら、客観的に自分を見つめなおすことが大切です。自分の喜びが周りとも調和しているか確認しましょう。"
    },
    6: {
      focus: "愛と調和の架け橋にフォーカス",
      action: "心の豊かさを分かち合う",
      description: "あなたの369リズムの起点は、目の前の人々との深い繋がりを大切にし、愛と思いやりのエネルギーを循環させることです。家族、友人、出会う全ての人との関係性を育み、互いの成長を支え合います。あなたの温かさが、人々の心に安らぎをもたらし、調和の輪を広げていきます。",
      earthMission: "【369宇宙のリズム：3（自分）→ 6（周り）→ 9（全体）】\n\n【周りへの貢献が鍵となる】\n目の前にいる人との関係性を深めることを大切にしてみてください。家族、友人、出会う人々との心の交流を育み、愛と思いやりを分かち合うことを意識してみましょう。一対一の深いつながりを大切にすること、マンツーマンでのサポートや対話を通じて、あなたらしい力を発揮していけます。\n\n6を起点とするあなたは、周りとの愛のある関係性を意識することで、自然と自分自身（3）も満たされ、全体への貢献（9）へと発展していく369のリズムを体現しやすくなります。",
      startingPoint: "この「6」のエネルギーは、あなたの本質的な生き方を知る重要な糸口です。目の前の人との深い繋がりを大切にすることが、あなたらしい人生への扉を開きます。",
      caution: "人にわかってもらいたい、自分が何かをやったのに変わらなかったという無価値観に陥らないよう注意。表現することが大事なので、相手の反応で落ち込んだり、相手に求めすぎたりする必要はありません。"
    },
    9: {
      focus: "宇宙意識と一体化にフォーカス",
      action: "無条件の愛と叡智を体現する",
      description: "あなたの369リズムの起点は、全ての生命との深い繋がりを感じ、地球規模、宇宙規模での愛を実践することです。国境や文化を超えて、まだ出会っていない人々、未来の世代、全ての存在のために奉仕します。あなたの叡智と慈愛が、人類の意識進化に貢献し、新しい時代の礎となります。",
      earthMission: "【369宇宙のリズム：3（自分）→ 6（周り）→ 9（全体）】\n\n【全体性への自然な拡がり】\nより広い視野で世界を感じることを大切にしてみてください。多くの人々へのメッセージ発信や、地域・社会・地球全体への貢献を意識してみましょう。目の前の人も大切にしながら、その先にある未来の世代や広い世界のことに思いを馳せ、全体の幸せを願いながら行動することで、深い充実感を感じられるでしょう。\n\n9を起点とするあなたは、全体への意識を持つことで、自然と身近な人々（6）との関係も深まり、自分自身（3）の使命も明確になる369のリズムを活性化させることができます。",
      startingPoint: "この「9」のエネルギーは、あなたの本質的な生き方を知る重要な糸口です。全体性の視点から世界を見ることが、あなたらしい人生への扉を開きます。",
      caution: "自己犠牲にならないよう注意。自分が苦しんで、みんながハッピーになるために自分が犠牲になるような考え方は避けましょう。あなた自身の幸せも大切にしながら全体に貢献することが重要です。"
    }
  };
  
  const cosmicRhythm = {
    number: higherDimensionSum,
    ...cosmicRhythms[higherDimensionSum] || { focus: "", action: "", description: "", earthMission: "", startingPoint: "", caution: "" }
  };
  
  return { outerSum, diagonalSums, isValid, higherDimensionSum, cosmicRhythm };
}