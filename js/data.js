// 景點與美食/住宿資料（暫為範例文字，待正式文案提供後更換）
// region 對應 planner.html 地圖上的標示點座標（見 REGIONS）

const REGIONS = {
  hokkaido: { name: "北海道", x: 78, y: 8 },
  tohoku: { name: "東北", x: 72, y: 26 },
  kanto: { name: "關東（東京）", x: 66, y: 42 },
  chubu: { name: "中部（名古屋）", x: 54, y: 46 },
  kansai: { name: "關西（大阪／京都）", x: 46, y: 54 },
  chugoku: { name: "中國（廣島）", x: 30, y: 58 },
  shikoku: { name: "四國", x: 34, y: 68 },
  kyushu: { name: "九州（福岡）", x: 18, y: 76 },
  okinawa: { name: "沖繩", x: 14, y: 94 },
};

const ATTRACTIONS = [
  { id: "a1", name: "淺草寺", region: "kanto", category: "文化", cost: 0, desc: "東京最具代表性的古老寺院，雷門與仲見世通是必訪亮點。" },
  { id: "a2", name: "東京晴空塔", region: "kanto", category: "夜景", cost: 2100, desc: "居高眺望東京市區，夜晚點燈後氣氛絕佳。" },
  { id: "a3", name: "明治神宮", region: "kanto", category: "自然", cost: 0, desc: "市中心的靜謐森林神社，適合散步與參拜。" },
  { id: "a4", name: "伏見稻荷大社", region: "kansai", category: "文化", cost: 0, desc: "千本鳥居的經典景象，京都必訪地標之一。" },
  { id: "a5", name: "清水寺", region: "kansai", category: "文化", cost: 400, desc: "京都代表性木構寺院，可遠眺京都市景。" },
  { id: "a6", name: "大阪城", region: "kansai", category: "文化", cost: 600, desc: "大阪歷史象徵，周邊公園適合賞花野餐。" },
  { id: "a7", name: "道頓堀", region: "kansai", category: "購物", cost: 0, desc: "大阪最熱鬧的美食與招牌聚集地。" },
  { id: "a8", name: "名古屋城", region: "chubu", category: "文化", cost: 500, desc: "金鯱聞名的城堡，周邊庭園值得一遊。" },
  { id: "a9", name: "廣島和平紀念公園", region: "chugoku", category: "文化", cost: 0, desc: "紀念歷史、傳遞和平訊息的重要景點。" },
  { id: "a10", name: "福岡塔", region: "kyushu", category: "夜景", cost: 800, desc: "九州地標，俯瞰博多灣海岸線。" },
  { id: "a11", name: "小樽運河", region: "hokkaido", category: "自然", cost: 0, desc: "北海道浪漫運河夜景，散步拍照首選。" },
  { id: "a12", name: "美麗海水族館", region: "okinawa", category: "自然", cost: 1880, desc: "沖繩人氣水族館，巨大水槽鯨鯊近距離欣賞。" },
];

const FOOD_LODGING = [
  { id: "f1", name: "一番拉麵 本店", region: "kanto", type: "美食", cost: 1200, desc: "濃厚豚骨湯頭的人氣排隊名店。（範例文字）" },
  { id: "f2", name: "築地場外市場海鮮丼", region: "kanto", type: "美食", cost: 2500, desc: "新鮮海鮮丼飯與各式小吃攤。（範例文字）" },
  { id: "f3", name: "錨屋商務旅館", region: "kanto", type: "住宿", cost: 3200, desc: "鄰近車站的平價商務旅館。（範例文字）" },
  { id: "f4", name: "京町家民宿", region: "kansai", type: "住宿", cost: 4200, desc: "改建自傳統町家的和風民宿。（範例文字）" },
  { id: "f5", name: "大阪燒專門店", region: "kansai", type: "美食", cost: 1100, desc: "道頓堀巷弄內的在地人氣大阪燒。（範例文字）" },
  { id: "f6", name: "博多一口餃子屋台", region: "kyushu", type: "美食", cost: 900, desc: "福岡屋台文化代表，道地博多風味。（範例文字）" },
  { id: "f7", name: "運河畔溫泉旅館", region: "hokkaido", type: "住宿", cost: 6800, desc: "可一邊泡湯一邊欣賞運河夜景。（範例文字）" },
  { id: "f8", name: "海景度假飯店", region: "okinawa", type: "住宿", cost: 5200, desc: "步行可達海灘的度假型飯店。（範例文字）" },
  { id: "f9", name: "すし酒場さしす なんばウォーク店", region: "kansai", type: "美食", cost: 3000, desc: "立食壽司酒場，12/6 晚餐候選（目前行程已排入）。", map: "https://maps.app.goo.gl/k4CQa3JcPUibjGK98" },
  { id: "f10", name: "Gyutan Charcoal Grilled YOSHIJI（心齋橋店）", region: "kansai", type: "美食", cost: 4500, desc: "炭火烤牛舌專門店，燒肉晚餐候選之一，尚未排入行程。", map: "https://maps.app.goo.gl/hCta7roMFWSjHHsP8" },
  { id: "f11", name: "炭火燒肉 大歡（東心齋橋）", region: "kansai", type: "美食", cost: 7800, desc: "國產黑毛和牛喝到飽套餐，約 6,800–8,800 日圓／人，燒肉晚餐候選之一，尚未排入行程。", map: "https://tabelog.com/tw/osaka/A2701/A270201/27100447/" },
  { id: "f12", name: "BATTEN YOKATO AMERIKAMURA（博多串焼き）", region: "kansai", type: "美食", cost: 3000, desc: "美國村居酒屋，博多串燒，Google 評分 4.0（596 則評論），尚未排入行程。", map: "https://maps.app.goo.gl/ebhKwpfgNvwtneaKA" },
];
