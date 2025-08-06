/**
 * 60通りの花性格診断（12花 × 5特性）
 */

export interface FlowerFortune {
  flower: {
    type: FlowerType;
    name: string;
    emoji: string;
  };
  trait: TraitType;
  personality: FlowerPersonality;
  traits: string[];
  description: string;
  luck: {
    love: number;
    money: number;
    career: number;
  };
}

export interface FlowerPersonality {
  title: string;
  basicCharacter: string;
  strengths: string[];
  weaknesses: string[];
  loveStyle: string;
  workStyle: string;
  communication: string;
  advice: string;
  compatibleFlowers: string[];
  emoji: string;
}

export type FlowerType = 
  | 'sakura' | 'sunflower' | 'rose' | 'lotus' 
  | 'lily' | 'lavender' | 'camellia' | 'peony'
  | 'jasmine' | 'iris' | 'dahlia' | 'cosmos';

export type TraitType = 'passionate' | 'gentle' | 'elegant' | 'wild' | 'mystic';

const flowerNames: Record<FlowerType, string> = {
  sakura: '桜',
  sunflower: 'ひまわり',
  rose: '薔薇',
  lotus: '蓮',
  lily: '百合',
  lavender: 'ラベンダー',
  camellia: '椿',
  peony: '牡丹',
  jasmine: 'ジャスミン',
  iris: 'アイリス',
  dahlia: 'ダリア',
  cosmos: 'コスモス'
};

const traitNames: Record<TraitType, string> = {
  passionate: '情熱的な',
  gentle: '優しい',
  elegant: '上品な',
  wild: '自由な',
  mystic: '神秘的な'
};

const flowerEmojis: Record<FlowerType, string> = {
  sakura: '🌸',
  sunflower: '🌻',
  rose: '🌹',
  lotus: '🪷',
  lily: '🤍',
  lavender: '💜',
  camellia: '🌺',
  peony: '🌷',
  jasmine: '🤍',
  iris: '💙',
  dahlia: '🌼',
  cosmos: '🌸'
};

/**
 * 生年月日から花と特性を計算
 */
export function calculateFlowerFortune(birthDate: Date): FlowerFortune {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  // 花の計算（12種類）
  const flowerIndex = (year + month + day) % 12;
  const flowers: FlowerType[] = [
    'sakura', 'sunflower', 'rose', 'lotus',
    'lily', 'lavender', 'camellia', 'peony',
    'jasmine', 'iris', 'dahlia', 'cosmos'
  ];
  const flowerType = flowers[flowerIndex];
  
  // 特性の計算（5種類）
  const traitIndex = (year * month + day) % 5;
  const traits: TraitType[] = ['passionate', 'gentle', 'elegant', 'wild', 'mystic'];
  const trait = traits[traitIndex];
  
  const personality = getFlowerPersonality(flowerType, trait);
  
  // 運勢計算
  const luck = {
    love: Math.floor((year + month * 2 + day * 3) % 5) + 1,
    money: Math.floor((year * 2 + month + day * 2) % 5) + 1,
    career: Math.floor((year + month * 3 + day) % 5) + 1
  };
  
  // 特性リスト
  const traitsArray = personality.strengths.slice(0, 3);
  
  return {
    flower: {
      type: flowerType,
      name: flowerNames[flowerType],
      emoji: flowerEmojis[flowerType]
    },
    trait,
    personality,
    traits: traitsArray,
    description: personality.basicCharacter,
    luck
  };
}

/**
 * 花と特性から性格分析を取得
 */
function getFlowerPersonality(flower: FlowerType, trait: TraitType): FlowerPersonality {
  const basePersonalities = getBaseFlowerPersonalities();
  const traitModifiers = getTraitModifiers();
  
  const base = basePersonalities[flower];
  const modifier = traitModifiers[trait];
  
  return {
    title: `${traitNames[trait]}${flowerNames[flower]}`,
    basicCharacter: `${base.basicCharacter} ${modifier.characterModifier}`,
    strengths: [...base.strengths, modifier.additionalStrength],
    weaknesses: [...base.weaknesses, modifier.additionalWeakness],
    loveStyle: `${base.loveStyle} ${modifier.loveModifier}`,
    workStyle: `${base.workStyle} ${modifier.workModifier}`,
    communication: `${base.communication} ${modifier.communicationModifier}`,
    advice: `${base.advice} ${modifier.advice}`,
    compatibleFlowers: base.compatibleFlowers,
    emoji: flowerEmojis[flower]
  };
}

/**
 * 基本花の性格
 */
function getBaseFlowerPersonalities(): Record<FlowerType, Omit<FlowerPersonality, 'title' | 'emoji'>> {
  return {
    sakura: {
      basicCharacter: '一期一会の美しさを大切にする、繊細で心優しい人。短い時間でも深い印象を残す。',
      strengths: ['美意識', '繊細さ', '瞬間を大切にする心'],
      weaknesses: ['移り気', '短期集中型'],
      loveStyle: '儚い美しさに惹かれ、ロマンチックな瞬間を大切にする。',
      workStyle: '短期集中で美しい成果を生み出す。季節感やタイミングを重視。',
      communication: '上品で詩的な表現を好む。',
      advice: '長期的な視点も大切にすると、より深い関係が築けます。',
      compatibleFlowers: ['コスモス', '百合', '椿']
    },
    sunflower: {
      basicCharacter: '太陽のように明るく、周りの人を元気にする力を持つ。いつも前向きで希望に満ちている。',
      strengths: ['明るさ', '前向きさ', '活力'],
      weaknesses: ['単純', '深く考えない傾向'],
      loveStyle: 'ストレートで分かりやすい愛情表現。相手を明るく照らす。',
      workStyle: 'チームのムードメーカー。困難な状況でも希望を見出す。',
      communication: 'ストレートで分かりやすい表現。',
      advice: '時には静かに物事を深く考える時間も大切です。',
      compatibleFlowers: ['ダリア', 'ひまわり', 'コスモス']
    },
    rose: {
      basicCharacter: '高貴で美しく、強い意志を持つ。愛と美への深い理解がある。',
      strengths: ['美意識', '気品', '強い意志'],
      weaknesses: ['プライドの高さ', 'とげとげしさ'],
      loveStyle: '深く情熱的な愛。相手に対して高い理想を持つ。',
      workStyle: '完璧主義で質の高い仕事をする。リーダーシップもある。',
      communication: '上品で気品のある話し方。',
      advice: '時には肩の力を抜いて、自然体でいることも大切です。',
      compatibleFlowers: ['牡丹', '椿', 'アイリス']
    },
    lotus: {
      basicCharacter: '泥の中から美しく咲く、清浄で崇高な心を持つ。どんな環境でも自分らしさを保つ。',
      strengths: ['清浄さ', '精神性', '環境適応力'],
      weaknesses: ['理想主義', '現実離れ'],
      loveStyle: '精神的な繋がりを重視。純粋で清らかな愛を求める。',
      workStyle: '困難な環境でも美しい成果を生み出す。精神性を重視。',
      communication: '深い洞察に基づいた話し方。',
      advice: '現実的な側面も大切にバランスを取りましょう。',
      compatibleFlowers: ['ジャスミン', 'アイリス', 'ラベンダー']
    },
    lily: {
      basicCharacter: '純粋で清楚、上品な美しさを持つ。内面の美しさを大切にする。',
      strengths: ['純粋さ', '上品さ', '内面の美しさ'],
      weaknesses: ['完璧主義', '自分に厳しすぎる'],
      loveStyle: '純粋で誠実な愛。相手の内面を大切にする。',
      workStyle: '丁寧で質の高い仕事。周りからの信頼も厚い。',
      communication: '上品で控えめな話し方。',
      advice: '完璧を求めすぎず、自分らしさも大切にしましょう。',
      compatibleFlowers: ['桜', '椿', 'ジャスミン']
    },
    lavender: {
      basicCharacter: '穏やかで癒し系。周りの人を安らかな気持ちにさせる優しい人。',
      strengths: ['癒し力', '穏やかさ', '共感力'],
      weaknesses: ['消極性', '自己主張の弱さ'],
      loveStyle: 'ゆっくりと時間をかけて関係を深める。安らぎを与える存在。',
      workStyle: '人間関係を大切にし、和やかな環境作りが得意。',
      communication: '穏やかで優しい話し方。',
      advice: 'もう少し自分の意見を積極的に表現してみましょう。',
      compatibleFlowers: ['蓮', 'コスモス', 'ジャスミン']
    },
    camellia: {
      basicCharacter: '凛とした美しさと強さを持つ。冬の寒さにも負けない芯の強さがある。',
      strengths: ['意志の強さ', '美しさ', '忍耐力'],
      weaknesses: ['頑固さ', '融通の利かなさ'],
      loveStyle: '一途で深い愛。困難があっても相手を支え続ける。',
      workStyle: '困難な状況でも粘り強く取り組む。責任感が強い。',
      communication: 'はっきりとした芯のある話し方。',
      advice: '時には柔軟性を持って、相手に合わせることも大切です。',
      compatibleFlowers: ['薔薇', '牡丹', '百合']
    },
    peony: {
      basicCharacter: '豪華で華やか、存在感のある魅力的な人。自然とリーダーになることが多い。',
      strengths: ['華やかさ', 'リーダーシップ', '存在感'],
      weaknesses: ['目立ちたがり', '派手好き'],
      loveStyle: '華やかで情熱的な愛。相手を楽しませることが得意。',
      workStyle: 'チームの中心として活躍。大きなプロジェクトを成功に導く。',
      communication: '華やかで印象的な話し方。',
      advice: '時には控えめな美しさも大切にしてみましょう。',
      compatibleFlowers: ['薔薇', '椿', 'ダリア']
    },
    jasmine: {
      basicCharacter: '夜に香る神秘的な美しさを持つ。深い精神性と優雅さを兼ね備えている。',
      strengths: ['神秘性', '優雅さ', '深い精神性'],
      weaknesses: ['神秘的すぎる', '近寄りがたさ'],
      loveStyle: '深く神秘的な愛。相手の魂に触れるような関係を求める。',
      workStyle: '直感と洞察力を活かした仕事。芸術的センスもある。',
      communication: '神秘的で含みのある話し方。',
      advice: 'もう少し親しみやすさも表現してみましょう。',
      compatibleFlowers: ['蓮', '百合', 'アイリス']
    },
    iris: {
      basicCharacter: '知的で洞察力があり、深い思考力を持つ。メッセンジャーのような役割を担うことが多い。',
      strengths: ['知性', '洞察力', 'コミュニケーション力'],
      weaknesses: ['考えすぎる', '行動力不足'],
      loveStyle: '知的な会話を重視。心の交流を大切にする。',
      workStyle: '分析力を活かし、問題解決に長けている。橋渡し役も得意。',
      communication: '知的で論理的な話し方。',
      advice: '時には直感で行動することも大切です。',
      compatibleFlowers: ['薔薇', '蓮', 'ジャスミン']
    },
    dahlia: {
      basicCharacter: '多様性と個性を大切にする。様々な色や形を持つように、豊かな表現力がある。',
      strengths: ['多様性', '表現力', '個性'],
      weaknesses: ['一貫性の欠如', '迷いやすさ'],
      loveStyle: '多彩な愛の表現。相手に合わせて様々な顔を見せる。',
      workStyle: 'クリエイティブな分野で才能を発揮。多角的な視点を持つ。',
      communication: '豊かな表現力で相手に合わせた話し方。',
      advice: '自分の核となる部分を大切にしながら多様性を活かしましょう。',
      compatibleFlowers: ['ひまわり', '牡丹', 'コスモス']
    },
    cosmos: {
      basicCharacter: '宇宙のような広がりを持つ、穏やかで包容力のある人。シンプルな美しさが魅力。',
      strengths: ['包容力', 'シンプルさ', '穏やかさ'],
      weaknesses: ['地味', '存在感の薄さ'],
      loveStyle: 'さりげなく相手を包み込む愛。控えめだが深い愛情。',
      workStyle: 'サポート役として力を発揮。全体の調和を大切にする。',
      communication: 'シンプルで心に響く話し方。',
      advice: 'もう少し自分の魅力をアピールすることも大切です。',
      compatibleFlowers: ['桜', 'ひまわり', 'ラベンダー']
    }
  };
}

/**
 * 特性修飾子
 */
function getTraitModifiers(): Record<TraitType, {
  characterModifier: string;
  additionalStrength: string;
  additionalWeakness: string;
  loveModifier: string;
  workModifier: string;
  communicationModifier: string;
  advice: string;
}> {
  return {
    passionate: {
      characterModifier: '情熱的で熱いエネルギーに満ちている。',
      additionalStrength: '情熱',
      additionalWeakness: '熱くなりすぎる',
      loveModifier: 'より情熱的で積極的な愛を表現する。',
      workModifier: '熱意を持って取り組み、周りを巻き込む力がある。',
      communicationModifier: '熱のこもった説得力のある話し方。',
      advice: '情熱をコントロールして、冷静さも大切にしましょう。'
    },
    gentle: {
      characterModifier: '優しく穏やかで、周りを包み込むような温かさがある。',
      additionalStrength: '優しさ',
      additionalWeakness: '優柔不断',
      loveModifier: 'じっくりと時間をかけて相手を大切にする。',
      workModifier: '協調性を重視し、チームワークを大切にする。',
      communicationModifier: '優しく相手を思いやる話し方。',
      advice: 'もう少し自分の意見をはっきりと表現してみましょう。'
    },
    elegant: {
      characterModifier: '上品で洗練された美しさを持つ。',
      additionalStrength: '上品さ',
      additionalWeakness: '近寄りがたさ',
      loveModifier: '洗練された美しい愛の表現をする。',
      workModifier: '質の高い仕事で周りから尊敬される。',
      communicationModifier: '上品で洗練された話し方。',
      advice: '時には親しみやすさも大切にしてみましょう。'
    },
    wild: {
      characterModifier: '自由奔放で型にはまらない魅力がある。',
      additionalStrength: '自由さ',
      additionalWeakness: '型破りすぎる',
      loveModifier: '束縛されない自由な愛を求める。',
      workModifier: '既成概念にとらわれない新しいアプローチを得意とする。',
      communicationModifier: '自由で型にはまらない表現をする。',
      advice: '時には周りとの調和も考えてみましょう。'
    },
    mystic: {
      characterModifier: '神秘的で不思議な魅力を持つ。',
      additionalStrength: '神秘性',
      additionalWeakness: '理解されにくい',
      loveModifier: '深いスピリチュアルな繋がりを求める。',
      workModifier: '直感と洞察力を活かした独創的な仕事をする。',
      communicationModifier: '神秘的で含みのある表現をする。',
      advice: '現実的な側面も大切にバランスを取りましょう。'
    }
  };
}

/**
 * 花名を取得
 */
export function getFlowerName(flower: FlowerType): string {
  return flowerNames[flower];
}

/**
 * 特性名を取得
 */
export function getTraitName(trait: TraitType): string {
  return traitNames[trait];
}