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

// 免費授權通用美食示意照（Pexels，依料理類型分類，非店家實際照片）
const CUISINE_PHOTOS = {
  sushi: "https://images.pexels.com/photos/31393431/pexels-photo-31393431.jpeg?auto=compress&cs=tinysrgb&w=800",
  grilled: "https://images.pexels.com/photos/18936008/pexels-photo-18936008.jpeg?auto=compress&cs=tinysrgb&w=800",
  skewers: "https://images.pexels.com/photos/31249644/pexels-photo-31249644.jpeg?auto=compress&cs=tinysrgb&w=800",
  ramen: "https://images.pexels.com/photos/4223948/pexels-photo-4223948.jpeg?auto=compress&cs=tinysrgb&w=800",
  kaiseki: "https://images.pexels.com/photos/15837551/pexels-photo-15837551.jpeg?auto=compress&cs=tinysrgb&w=800",
  hall: "https://images.pexels.com/photos/1366594/pexels-photo-1366594.jpeg?auto=compress&cs=tinysrgb&w=800",
  french: "https://images.pexels.com/photos/20380436/pexels-photo-20380436.jpeg?auto=compress&cs=tinysrgb&w=800",
};

const FOOD_LODGING = [
  { id: "f3", name: "錨屋商務旅館", region: "kanto", type: "住宿", cost: 3200, desc: "鄰近車站的平價商務旅館。（範例文字）" },
  { id: "f4", name: "京町家民宿", region: "kansai", type: "住宿", cost: 4200, desc: "改建自傳統町家的和風民宿。（範例文字）" },
  { id: "f7", name: "運河畔溫泉旅館", region: "hokkaido", type: "住宿", cost: 6800, desc: "可一邊泡湯一邊欣賞運河夜景。（範例文字）" },
  { id: "f8", name: "海景度假飯店", region: "okinawa", type: "住宿", cost: 5200, desc: "步行可達海灘的度假型飯店。（範例文字）" },
  { id: "f9", name: "すし酒場さしす なんばウォーク店", region: "kansai", type: "美食", cost: 3000, desc: "🍣 立食壽司酒場，12/6 心齋橋晚餐候選。", map: "https://maps.app.goo.gl/k4CQa3JcPUibjGK98", photo: CUISINE_PHOTOS.sushi },
  { id: "f10", name: "Gyutan Charcoal Grilled YOSHIJI（心齋橋店）", region: "kansai", type: "美食", cost: 4500, desc: "🥩 炭火烤牛舌專門店，12/8 日本橋晚餐候選。", map: "https://maps.app.goo.gl/hCta7roMFWSjHHsP8", photo: CUISINE_PHOTOS.grilled },
  { id: "f11", name: "炭火燒肉 大歡（東心齋橋）", region: "kansai", type: "美食", cost: 7800, desc: "🥩 國產黑毛和牛喝到飽套餐，約 6,800–8,800 日圓／人，12/8 日本橋晚餐候選。", map: "https://tabelog.com/tw/osaka/A2701/A270201/27100447/", photo: CUISINE_PHOTOS.grilled },
  { id: "f12", name: "BATTEN YOKATO AMERIKAMURA（博多串焼き）", region: "kansai", type: "美食", cost: 3000, desc: "🍢 美國村居酒屋，博多串燒，12/10 難波晚餐候選。", map: "https://maps.app.goo.gl/ebhKwpfgNvwtneaKA", photo: CUISINE_PHOTOS.skewers },
  { id: "f13", name: "黑船 DOTONBORI KUROFUNE", region: "kansai", type: "美食", cost: 3500, desc: "🍣 道頓堀迴轉壽司，現切生魚片秀，12/10 難波晚餐候選。", map: "https://www.google.com/maps/search/?api=1&query=%E9%BB%91%E8%88%B9%20DOTONBORI%20KUROFUNE", photo: CUISINE_PHOTOS.sushi },
  { id: "f14", name: "Time Out Market Osaka", region: "kansai", type: "美食", cost: 2500, desc: "🍽️ Grand Green Osaka 南館，多間廚房任選，和牛／披薩／壽司／拉麵，梅田備選餐廳（12/7 晚餐已改訂赤白小酒館）。", map: "https://www.google.com/maps/search/?api=1&query=Time%20Out%20Market%20Osaka", photo: CUISINE_PHOTOS.hall },
  { id: "f15", name: "浪速割烹 昇", region: "kansai", type: "美食", cost: 15000, desc: "🍱 日本料理割烹，近梅田站，梅田備選餐廳（12/7 晚餐已改訂赤白小酒館），建議先訂位。", map: "https://www.google.com/maps/search/?api=1&query=%E6%B5%AA%E9%80%9F%E5%89%B2%E7%83%B9%20%E6%98%87%20%E5%A4%A7%E9%98%AA", photo: CUISINE_PHOTOS.kaiseki },
  { id: "f18", name: "串カツ いっとく 新世界", region: "kansai", type: "美食", cost: 2000, desc: "🍢 在地人推薦，平價串炸，一支 90 日圓起，12/9 新世界晚餐候選。", map: "https://www.google.com/maps/search/?api=1&query=%E4%B8%B2%E3%82%AB%E3%83%84%20%E3%81%84%E3%81%A3%E3%81%A8%E3%81%8F%20%E6%96%B0%E4%B8%96%E7%95%8C", photo: CUISINE_PHOTOS.skewers },
  { id: "f20", name: "無鐵砲 大阪店", region: "kansai", type: "美食", cost: 1200, desc: "🍜 豚骨拉麵，Google 評分 3.9，12/9 新世界晚餐候選。", map: "https://maps.app.goo.gl/3SvXo5mePt3mHdZP8", photo: CUISINE_PHOTOS.ramen },
  { id: "f23", name: "赤白 小酒館", region: "kansai", type: "美食", cost: 3999, desc: "🥐 KITTE大阪4F 法式料理／葡萄酒酒吧，Tabelog 3.49（1282 則評論），與JR大阪站直通，12/7 梅田晚餐已確定。", map: "https://tabelog.com/tw/osaka/A2701/A270101/27143614/", photo: CUISINE_PHOTOS.french },
];
