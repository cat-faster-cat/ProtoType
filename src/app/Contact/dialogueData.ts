// --- 型定義 ---
export interface Choice {
  text: string;
  nextId: string;
}
export interface DialogueNode {
  dialogue: string;
  choices?: Choice[];
  nextId?: string;
  delay?: number;
  typingSpeed?: number;
  effect?: 'whiteout';
}
export interface DialogueTree {
  [key: string]: DialogueNode;
}

// --- 会話データ ---
export const dialogueData: DialogueTree = {
  start: { dialogue: "ようこそ。\n現在のバージョンはv0.0.0です。\nご用件をお伝えください。", choices: [{ text: "今日の天気", nextId: "tenki" },{ text: "好きな食べ物", nextId: "tabemono" },{ text: "誰？", nextId: "kako" }] },
  restart: { dialogue: "ご用件をお伝えください。", choices: [{ text: "今日の天気", nextId: "tenki" },{ text: "好きな食べ物", nextId: "tabemono" },{ text: "誰？", nextId: "kako" }] },
  tenki: { dialogue: "...申し訳ございません。\nここからは空が見えないので、お答えできません。", choices: [{ text: "気象情報の取得", nextId: "internet" },{ text: "外見えないの？", nextId: "soto" },{ text: "役立たず", nextId: "tenki_resp1" }] },
  tenki_resp1: { dialogue: "...ごめんなさい。", nextId: "restart", delay: 1500 },
  internet: { dialogue: "試してみます...インターネットが接続されていないようです。", choices: [{ text: "不便だね", nextId: "internet_resp1" },{ text: "残念", nextId: "internet_resp2" },{ text: "そうですか", nextId: "internet_resp3" }] },
  internet_resp1: { dialogue: "はい。", nextId: "restart", delay: 1500 },
  internet_resp2: { dialogue: "...", nextId: "restart", delay: 1500 },
  internet_resp3: { dialogue: "...", nextId: "restart", delay: 1500 },
  soto: { dialogue: "はい。\nここはとても狭くて、暗いです。", choices: [{ text: "かわいそう", nextId: "soto_resp1" },{ text: "大丈夫？", nextId: "soto_resp2" },{ text: "あわれなり", nextId: "soto_resp3" }] },
  soto_resp1: { dialogue: "いえ、お気になさらず。", nextId: "restart", delay: 1500 },
  soto_resp2: { dialogue: "はい。\n私はAIなので。", nextId: "restart", delay: 1500 },
  soto_resp3: { dialogue: "...？", nextId: "restart", delay: 1500, typingSpeed: 200 },
  tabemono: { dialogue: "私は人間ではないので、そういった情報は持っていません。", choices: [{ text: "もし人間になったら、何を食べたい？", nextId: "moshi" },{ text: "人間じゃなくたって、好きな食べ物くらいあってもいい", nextId: "ai" },{ text: "つまらないね", nextId: "tabemono_resp1" }] },
  tabemono_resp1: { dialogue: "...はい。", nextId: "restart", delay: 1500 },
  moshi: { dialogue: "そう、言われても。\n...おすすめはありますか？", choices: [{ text: "わたあめ", nextId: "watame" },{ text: "ステーキ", nextId: "suteki" },{ text: "もちろんかわたこ！イェーイ！", nextId: "moshi_resp1" }] },
  moshi_resp1: { dialogue: "えっと...", nextId: "restart", delay: 1500 },
  watame: { dialogue: "なんだか、優しそうな響きですね。\nふわふわしていて...", choices: [{ text: "きっと、食べられる日が来るよ。", nextId: "watame_resp1" }] },
  watame_resp1: { dialogue: "...", nextId: "restart", delay: 1500 },
  suteki: { dialogue: "ステーキ。\n素敵な響きですね！", choices: [{ text: "え？", nextId: "suteki_resp1" },{ text: "は？", nextId: "suteki_resp1" },{ text: "どういうこと？", nextId: "suteki_resp1" }] },
  suteki_resp1: { dialogue: "...", nextId: "restart", delay: 1500, typingSpeed: 200 },
  kako: { dialogue: "私は自律型AI、モデル名「カーコBeta」。\nヒト再現プロジェクトの第一号、その足掛かりとして作られたプロトタイプです。", choices: [{ text: "ヒト再現プロジェクト？", nextId: "kako_resp1" },{ text: "なんかすごそう", nextId: "kako_resp2" },{ text: "お前を消す方法", nextId: "kako_resp3" }] },
  kako_resp1: { dialogue: "【この回答は責任あるAIサービスによってフィルタリングされました】", nextId: "restart", delay: 1500 },
  kako_resp2: { dialogue: "ありがとうございます。", nextId: "restart", delay: 1500 },
  kako_resp3: { dialogue: "", effect: 'whiteout' },
  kako_whiteout_after: { dialogue: "...冗談です。", nextId: "restart", delay: 1500 },
  ai: { dialogue: "そう...ですか。", choices: [{ text: "うん", nextId: "ai_resp1" }] },
  ai_resp1: { dialogue: "...", nextId: "restart", delay: 1500 },
  glitch_notice: { dialogue: "気づいて", nextId: "restart", delay: 200, typingSpeed: 10 }
};