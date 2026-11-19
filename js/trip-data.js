// 「我的行程」手冊資料，整理自使用者提供的 Google Sheet（行程仍在規劃中，部分欄位待確認）
// 狀態 st: ok=已確認／已購, warn=待確認／待預訂／待填, info=規劃中

const TRIP_INFO = {
  title: "大阪・京都・奈良 6 日",
  range: "12/6（日） – 12/11（五）",
  pax: "2 人",
};

// 住宿／道頓堀的完整地址，與 Google Maps 上顯示的名稱一致，避免座標反查到錯誤地點
const HOTEL_ADDR = "大阪住一黑門2號店 日本〒542-0073 Osaka, Chuo Ward, Nipponbashi, 2 Chome−1−19";
const DOTONBORI_ADDR = "道頓堀 日本〒542-0071 Osaka, Chuo Ward, Dōtonbori, 1 Chome";

const TRIP_DAYS = [
  {
    date: "12/6", w: "日", region: "大阪", title: "大阪抵達",
    img: "images/spots/dotonbori.jpg",
    imgAlt: "道頓堀夜景",
    imgCredit: "圖片：Kang-min Liu（CC BY 2.0）／<a href=\"https://commons.wikimedia.org/wiki/File:%E5%8A%9B%E3%82%92%E5%90%88%E3%82%8F%E3%81%9B%E3%82%88%E3%81%86%E6%97%A5%E6%9C%AC_2014_%E5%A4%A7%E9%98%AA_(12206068196).jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>",
    rows: [
      { tm: "13:10", t: "抵達關西機場 T1｜AK170", d: "小港國際機場（KHH）09:00 起飛，關西機場（KIX）第一航廈 13:10 落地", tr: "南海電鐵／JR 至大阪市區", note: "亞洲航空 AK170，訂位代號 PDINPM；飛行時間約 3 小時 10 分，機型空中巴士 A320，經濟艙，無免費託運行李（已加購 20 公斤）", st: "ok", geo: "関西国際空港, 日本" },
      { tm: "15:30–16:30（估）", t: "入住", d: "14:30 左右搭車前往大阪，入住 Apartment Hotel 11 Kuromon 2（住一 黑門2号店）", tr: "步行／地鐵", note: "地址：〒542-0073 大阪市中央区日本橋2-1-19", st: "ok", geo: HOTEL_ADDR },
      { tm: "16:30–18:00", t: "大阪城公園・天守閣", d: "護城河散步、天守閣參觀（視體力決定是否登閣）", tr: "地鐵谷町線，約 15–20 分", note: "由原 12/7 移至此日；12/6 日落約 16:47，天守閣最後入館約 16:00–16:30，到場時天色已暗，恐來不及登閣，建議以護城河外圍夜景散步為主", st: "warn", geo: "大阪城公園, 日本", photo: "images/spots/osaka-castle.jpg", photoAlt: "大阪城天守閣", photoCredit: "圖片：663highland（CC BY-SA 3.0）／<a href=\"https://commons.wikimedia.org/wiki/File:Osaka_Castle_02bs3200.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "18:30–19:30", t: "心齋橋晚餐", d: "章魚燒、晚餐候選：<a href=\"https://maps.app.goo.gl/k4CQa3JcPUibjGK98\" target=\"_blank\" rel=\"noopener\">🍣 すし酒場さしす なんばウォーク店（Sushi Sakaba Sashisu）</a>", tr: "地鐵，約 15–20 分", note: "抵達日不要排太滿，餐廳尚未訂位；由大阪城先回市區用餐", st: "warn", geo: "心斎橋, 日本" },
      { tm: "19:30–20:00", t: "道頓堀夜景・御堂筋彩燈散步", d: "免費的聖誕限定點燈，順路看道頓堀夜景", tr: "步行", note: "免費景點，晚餐後順路散步", st: "info", geo: DOTONBORI_ADDR, photo: "images/spots/dotonbori.jpg", photoAlt: "道頓堀夜景", photoCredit: "圖片：Kang-min Liu（CC BY 2.0）／<a href=\"https://commons.wikimedia.org/wiki/File:%E5%8A%9B%E3%82%92%E5%90%88%E3%82%8F%E3%81%9B%E3%82%88%E3%81%86%E6%97%A5%E6%9C%AC_2014_%E5%A4%A7%E9%98%AA_(12206068196).jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
    ],
    mapStops: [
      { name: "關西機場", lat: 34.4347, lng: 135.2441, q: "関西国際空港, 日本" },
      { name: "住宿（日本橋）", lat: 34.6627, lng: 135.5064, q: HOTEL_ADDR },
      { name: "大阪城公園・天守閣", lat: 34.6873, lng: 135.5262, q: "大阪城公園, 日本" },
      { name: "心齋橋晚餐", lat: 34.6723, lng: 135.5012, q: "心斎橋, 日本" },
      { name: "道頓堀・御堂筋", lat: 34.6687, lng: 135.5013, q: DOTONBORI_ADDR },
    ],
  },
  {
    date: "12/7", w: "一", region: "箕面・大阪", title: "箕面瀑布・梅田中之島",
    mapOrigin: HOTEL_ADDR,
    img: "images/spots/osaka-castle.jpg",
    imgAlt: "大阪城天守閣",
    imgCredit: "圖片：663highland（CC BY-SA 3.0）／<a href=\"https://commons.wikimedia.org/wiki/File:Osaka_Castle_02bs3200.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>",
    rows: [
      { tm: "08:30–10:00", t: "大阪→箕面站", d: "阪急電車轉乘", tr: "電車", note: "依住宿站點估算", st: "info", geo: "箕面駅, 日本" },
      { tm: "10:00–13:00", t: "箕面瀑布健行", d: "森林溪流步道往返，約 2–3 小時", tr: "步行", note: "出發前查步道開放及天氣", st: "info", geo: "箕面大滝, 日本", photo: "images/spots/minoh-falls.jpg", photoAlt: "箕面瀑布", photoCredit: "圖片：Kanchi1979（CC BY-SA 4.0）／<a href=\"https://commons.wikimedia.org/wiki/File:JP-Osaka-Minoo-Minootaki_-Over-View.JPG\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "13:00–14:30", t: "午餐・返回市區", d: "箕面或梅田用餐", tr: "電車", note: "安排休息", st: "info", geo: "梅田, 日本" },
      { tm: "14:30–16:30", t: "梅田・中之島散策", d: "梅田スカイビル展望台／中之島公園・美術館周邊散步，視體力彈性安排", tr: "步行／電車", note: "箕面瀑布返回後安排這段；大阪城 Illuminage 已移除，不需趕路", st: "info", geo: "中之島公園, 日本", photo: "images/spots/umeda-sky.jpg", photoAlt: "梅田スカイビル", photoCredit: "圖片：FlyingToaster（CC BY 3.0）／<a href=\"https://commons.wikimedia.org/wiki/File:Base_of_the_Umeda_Sky_Building.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "17:00–18:30", t: "梅田晚餐", d: "晚餐候選：<a href=\"https://www.google.com/maps/search/?api=1&query=Time%20Out%20Market%20Osaka\" target=\"_blank\" rel=\"noopener\">🍽️ Time Out Market Osaka（Grand Green Osaka 南館，多間廚房任選，和牛／披薩／壽司／拉麵）</a>、<a href=\"https://www.google.com/maps/search/?api=1&query=%E6%B5%AA%E9%80%9F%E5%89%B2%E7%83%B9%20%E6%98%87%20%E5%A4%A7%E9%98%AA\" target=\"_blank\" rel=\"noopener\">🍱 浪速割烹 昇（日本料理割烹，近梅田站，建議先訂位）</a>", tr: "步行", note: "原堺筋晚餐／Illuminage 行程已取消；餐廳待挑選", st: "warn", geo: "梅田, 日本" },
      { tm: "19:00", t: "返回飯店・休息", d: "簡單休息，為明日奈良行程保留體力", tr: "電車／地鐵", note: "", st: "info", geo: HOTEL_ADDR },
    ],
    mapStops: [
      { name: "箕面站", lat: 34.8322, lng: 135.4697, q: "箕面駅, 日本" },
      { name: "箕面瀑布", lat: 34.8494, lng: 135.4694, q: "箕面大滝, 日本" },
      { name: "梅田スカイビル", lat: 34.7055, lng: 135.4906, q: "梅田スカイビル, 日本" },
      { name: "中之島公園", lat: 34.6937, lng: 135.4998, q: "中之島公園, 日本" },
      { name: "住宿（日本橋）", lat: 34.6627, lng: 135.5064, q: HOTEL_ADDR },
    ],
  },
  {
    date: "12/8", w: "二", region: "大阪", title: "日本環球影城",
    mapOrigin: HOTEL_ADDR,
    rows: [
      { tm: "07:00–07:30", t: "前往日本環球影城", d: "JR 至 Universal City，建議 7:00–7:30 抵園", tr: "電車", note: "搭 JR 夢咲線直達環球城站，出站步行就到，不建議搭計程車", st: "info", geo: "ユニバーサルシティ駅, 日本" },
      { tm: "08:00（開園）", t: "入園・App 搶整理券", d: "一入園立刻用官方 App 預約超級任天堂世界「咚奇剛的瘋狂礦車」「庫巴的挑戰書」整理券", tr: "步行", note: "熱門新設施，建議開園前就排隊準備衝第一波，手腳要快", st: "warn" },
      { tm: "08:30–10:30", t: "咚奇剛的瘋狂礦車・庫巴的挑戰書", d: "超級任天堂世界咚奇剛礦山新園區雙設施，依整理券時段前後安排拍照、逛園區造景", tr: "步行", note: "依實際整理券時段彈性調整順序", st: "warn" },
      { tm: "10:30–11:00", t: "小小兵一起合照", d: "小小兵樂園格魯家周邊拍照", tr: "步行", note: "", st: "info" },
      { tm: "11:00–11:30", t: "霍格華茲城堡・活米村", d: "魔法世界入口造景，城堡外觀與活米村老街散策", tr: "步行", note: "", st: "info" },
      { tm: "11:30–13:00", t: "哈利波特禁忌之旅・鷹馬的飛行", d: "依現場排隊時間安排兩項設施先後順序", tr: "步行", note: "禁忌之旅排隊通常較長，建議優先安排", st: "warn" },
      { tm: "13:00–14:00", t: "三根掃帚午餐", d: "活米村裡的英式餐館，體驗魔法世界用餐氛圍", tr: "步行", note: "用餐時段人潮較多，可提早或延後避開尖峰", st: "warn" },
      { tm: "14:00–14:30", t: "蜂蜜公爵", d: "魔法糖果、奶油啤酒周邊伴手禮", tr: "步行", note: "", st: "info" },
      { tm: "14:30–15:30", t: "侏羅紀公園・乘船遊", d: "侏羅紀公園區域乘船遊，有機會被水花濺濕", tr: "步行", note: "建議自備輕便雨衣", st: "info" },
      { tm: "15:30–16:00", t: "史努比", d: "環球奇境史努比劇場及周邊拍照", tr: "步行", note: "", st: "info" },
      { tm: "16:00–16:40", t: "名偵探柯南4-D現場表演秀～星空的寶石", d: "紐約區室內 4D 劇場表演秀", tr: "步行", note: "建議提前入場卡位，實際場次以當日時刻表為準", st: "warn" },
      { tm: "16:40–17:10", t: "水世界", d: "特技、爆破與煙火的現場演出，約 20 分鐘", tr: "步行", note: "開演前 20–30 分鐘入場卡位較佳，實際場次以當日時刻表為準", st: "warn" },
      { tm: "17:10–18:00", t: "好萊塢區域・環球妖魔鬼怪搖滾樂表演秀", d: "好萊塢區逛街，觀賞經典怪物角色搖滾歌舞秀", tr: "步行", note: "實際場次以當日時刻表為準", st: "warn" },
      { tm: "18:00–19:30", t: "自由活動・聖誕燈光", d: "園區聖誕裝飾與燈光，傍晚後氣氛最佳", tr: "步行", note: "可依當日表演時刻表彈性調整", st: "info" },
      { tm: "晚上", t: "日本橋晚餐・返回飯店", d: "晚餐候選：<a href=\"https://maps.app.goo.gl/hCta7roMFWSjHHsP8\" target=\"_blank\" rel=\"noopener\">🥩 Gyutan Charcoal Grilled YOSHIJI 心齋橋店（炭火烤牛舌，約¥4,500）</a>、<a href=\"https://tabelog.com/tw/osaka/A2701/A270201/27100447/\" target=\"_blank\" rel=\"noopener\">🥩 炭火燒肉 大歡 東心齋橋（和牛喝到飽，約¥7,800）</a>", tr: "JR／步行", note: "USJ 回程較晚，心齋橋兩間步行約 15–20 分", st: "warn" },
    ],
    mapStops: [
      { name: "Universal City 駅", lat: 34.6658, lng: 135.4330, q: "ユニバーサルシティ駅, 日本" },
      { name: "日本環球影城", lat: 34.6654, lng: 135.4323, q: "ユニバーサル・スタジオ・ジャパン, 日本" },
      { name: "住宿（日本橋）", lat: 34.6627, lng: 135.5064, q: HOTEL_ADDR },
    ],
    tips: {
      heading: "環球影城攻略筆記",
      sections: [
        {
          h: "建議動線",
          items: [
            "白天刷馬利歐、哈利波特、好夢乘車遊 → 下午吃限定點心、跟角色互動 → 傍晚拍霍格莫德聖誕場景 → 晚上留時間看燈光秀",
          ],
        },
        {
          h: "避坑提醒",
          items: [
            "不要四五點就離開！USJ 聖誕精華都在夜間",
            "留意包場日：11/13、11/20、11/27 等，一般遊客可能提早閉園、部分設施暫停，買票務必避開",
            "大阪晚上超冷，風很強，外套、圍巾、暖暖包記得帶",
            "Joy of Lights 投屏一定要提前抽選，現場不能報名",
          ],
        },
        {
          h: "入園節奏",
          items: [
            "盡量錯峰出遊，或是一開園就衝進去",
            "先玩最熱門的大設施，再慢慢玩小項目",
            "沒排到的熱門設施，可以等到閉園前一小時再過去，人會少很多",
          ],
        },
        {
          h: "10 條避坑守則",
          items: [
            "開園第一時間衝熱門設施，等候只要 5–20 分鐘",
            "安檢超嚴，自拍桿、玻璃水杯、小板凳、自熱食品一律不能帶",
            "帶塑膠水瓶即可，園區飲水機超多，玻璃杯禁止入園",
            "第一批入園先搶任天堂整理券，直奔瑪利歐卡丁車；太晚進場就先飛天翼龍，哈利波特留到閉園前一小時",
            "霍格華茲夜間燈光秀不是每天都有，先看當日時刻表；最佳觀賞點：湖邊草坪、三把掃帚露台、鷹馬飛行出口",
            "飛天翼龍膽小慎玩！懸掛雲霄飛車失重感很強，起風就會臨時停駛，建議最後再玩",
            "魔法袍不用買，可以租借，拍完歸還超省錢",
            "設施臨時故障別死等，找工作人員，有機會拿到補償快速券",
            "必玩排序：瑪利歐卡丁車 → 飛天翼龍 → 侏羅紀乘船遊 → 哈利波特禁忌之旅 → 鷹馬飛行（看夕陽）",
            "不走回頭路路線：任天堂世界 → 侏羅紀 → 哈利波特 → 小小兵 → 好萊塢區",
          ],
        },
        {
          h: "人少秘境拍照點",
          items: [
            "入口大地球：一早拍，人少光線柔和",
            "霍格華茲湖邊：拍城堡倒影超美",
            "鷹馬入口小路：下午三四點黃金光，背影超有氛圍",
            "任天堂問號管道旁：遠離人潮，拍出遊戲畫面感",
            "小小兵格魯家門口：黃色背景超好拍",
          ],
        },
        {
          h: "最佳遊玩路線（照順序衝不繞路）",
          items: [
            "進園直奔任天堂，別停留拍照，趕緊預約瑪利歐整理券，晚了就沒囉",
            "① 超級任天堂世界：瑪利歐卡丁車、耀西冒險、咚奇剛礦山車",
            "② 哈利波特：禁忌之旅、鷹馬飛行",
            "③ 環球奇境：旋轉茶杯、旋轉木馬（親子首選）",
            "④ 好萊塢：好萊塢美夢雲霄飛車，反向更刺激",
            "⑤ 紐約區：柯南 4D 真人秀，動漫迷必看",
            "⑥ 小小兵：調皮鬧劇乘車遊",
            "⑦ 侏儸紀：飛天翼龍＋乘船遊（自備雨衣）",
            "⑧ 水世界：20 分鐘特技煙火秀，記得抓時間",
            "⑨ 親善村：大白鯊乘船遊",
          ],
        },
        {
          h: "省錢／免排隊秘訣",
          items: [
            "任天堂捷徑：約 7 點抵園，頂門進場有機會不用抽整理券，爆園期也適用",
            "淡季不用買快速通！善用單人通道，一天玩遍熱門項目",
            "購票優惠：一日票送 2000 日圓消費券；雙人票同享 2000 日圓券，CP 值很高；每晚 8 點搶一送一，還能疊加折價券",
          ],
        },
      ],
    },
  },
  {
    date: "12/9", w: "三", region: "奈良", title: "奈良公園・東大寺",
    mapOrigin: HOTEL_ADDR,
    img: "images/spots/todaiji.jpg",
    imgAlt: "東大寺大佛殿",
    imgCredit: "圖片：663highland（CC BY-SA 3.0）／<a href=\"https://commons.wikimedia.org/wiki/File:Daibutsu-den_in_Todaiji_Nara02bs3200.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>",
    rows: [
      { tm: "08:30–10:00", t: "大阪→近鐵奈良", d: "近鐵電車", tr: "電車", note: "難波出發較方便", st: "info", geo: "近鉄奈良駅, 日本" },
      { tm: "10:00–12:30", t: "奈良公園・東大寺", d: "鹿群、古蹟與公園步道", tr: "電車", note: "留意鹿群與餵食規範", st: "info", geo: "東大寺, 日本", photo: "images/spots/todaiji.jpg", photoAlt: "東大寺大佛殿", photoCredit: "圖片：663highland（CC BY-SA 3.0）／<a href=\"https://commons.wikimedia.org/wiki/File:Daibutsu-den_in_Todaiji_Nara02bs3200.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "12:30–14:00", t: "奈良午餐", d: "柿葉壽司／日式定食", tr: "步行", note: "自由選擇", st: "info", geo: "奈良町, 日本" },
      { tm: "14:00–16:00", t: "奈良町散步", d: "老街、咖啡廳", tr: "步行", note: "不趕行程", st: "info", geo: "奈良町, 日本", photo: "images/spots/naramachi.jpg", photoAlt: "奈良町老街", photoCredit: "圖片：Amagase（CC BY-SA 2.5）／<a href=\"https://commons.wikimedia.org/wiki/File:Fabric_shop_in_Nara.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "17:00–18:30", t: "通天閣・新世界晚餐", d: "新世界晚餐候選：<a href=\"https://www.google.com/maps/search/?api=1&query=%E4%B8%B2%E3%82%AB%E3%83%84%20%E3%81%84%E3%81%A3%E3%81%A8%E3%81%8F%20%E6%96%B0%E4%B8%96%E7%95%8C\" target=\"_blank\" rel=\"noopener\">🍢 串カツ いっとく 新世界（在地人推薦，平價串炸，一支 90 日圓起）</a>、<a href=\"https://maps.app.goo.gl/3SvXo5mePt3mHdZP8\" target=\"_blank\" rel=\"noopener\">🍜 無鐵砲 大阪店（豚骨拉麵，Google 評分 3.9）</a>", tr: "近鐵／地鐵", note: "累的話可直接回飯店；餐廳待挑選", st: "warn", geo: "通天閣, 日本", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Shinsekai_-_Shinsekai34.jpg", photoAlt: "通天閣與新世界", photoCredit: "圖片：lumoplank（CC0）／<a href=\"https://commons.wikimedia.org/wiki/File:Shinsekai_-_Shinsekai34.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "19:00–20:00", t: "天王寺 Tenshiba 聖誕市集", d: "免費入場的聖誕市集，逛完直接返回飯店休息", tr: "步行", note: "免費景點，順路就去看看", st: "info", geo: "てんしば, 日本", photo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Illuminated_Tenn%C5%8Dji_Park_and_Abeno_Harukas%2C_November_2015%2C_Osaka.jpg", photoAlt: "天王寺公園聖誕點燈", photoCredit: "圖片：Laitche（CC BY-SA 4.0）／<a href=\"https://commons.wikimedia.org/wiki/File:Illuminated_Tenn%C5%8Dji_Park_and_Abeno_Harukas,_November_2015,_Osaka.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
    ],
    mapStops: [
      { name: "近鐵奈良駅", lat: 34.6851, lng: 135.8049, q: "近鉄奈良駅, 日本" },
      { name: "奈良公園・東大寺", lat: 34.6889, lng: 135.8398, q: "東大寺, 日本" },
      { name: "奈良町", lat: 34.6782, lng: 135.8303, q: "奈良町, 日本" },
      { name: "通天閣・新世界", lat: 34.6523, lng: 135.5064, q: "通天閣, 日本" },
      { name: "天王寺 Tenshiba", lat: 34.6465, lng: 135.5143, q: "てんしば, 日本" },
    ],
  },
  {
    date: "12/10", w: "四", region: "京都", title: "東山・祇園",
    mapOrigin: HOTEL_ADDR,
    rows: [
      { tm: "08:00–09:30", t: "大阪→清水寺", d: "JR 至京都站，轉巴士（100／206 號）至五条坂或清水道", tr: "電車／巴士", note: "第一次來京都的經典路線，不去嵐山，整天集中在東山一帶", st: "info", geo: "京都駅, 日本" },
      { tm: "09:30–11:30", t: "清水寺參拜", d: "本堂、音羽之瀧，可遠眺京都市景", tr: "步行", note: "人多時建議一開放就進場", st: "info", geo: "清水寺, 日本", photo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/At_Kyoto_2024_485.jpg", photoAlt: "清水寺", photoCredit: "圖片：Mike Peel（CC BY-SA 4.0）／<a href=\"https://commons.wikimedia.org/wiki/File:At_Kyoto_2024_485.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "11:30–12:30", t: "二年坂・三年坂散策", d: "石板老街、京都風小物與伴手禮店", tr: "步行", note: "從清水寺一路下坡走到八坂神社", st: "info", geo: "二年坂, 日本", photo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Gion_-_Nineizaka_%28Ninenzaka%29%2C_Kyoto%2C_Japan_%2848923272228%29.jpg", photoAlt: "二年坂", photoCredit: "圖片：Domenico Convertini（CC BY-SA 2.0）／<a href=\"https://commons.wikimedia.org/wiki/File:Gion_-_Nineizaka_(Ninenzaka),_Kyoto,_Japan_(48923272228).jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "12:30–13:30", t: "午餐", d: "二年坂或八坂神社周邊，京都風定食／抹茶甜點候選", tr: "步行", note: "餐廳待挑選", st: "warn", geo: "二年坂, 日本" },
      { tm: "13:30–14:30", t: "八坂神社參拜", d: "祇園入口的神社，朱紅色西門樓為代表景", tr: "步行", note: "二年坂走下來剛好接上", st: "info", geo: "八坂神社, 日本", photo: "https://upload.wikimedia.org/wikipedia/commons/8/86/Nishiromon_Gate%2C_Yasaka_Shrine%2C_Kyoto%2C_West_view_20190416_1.jpg", photoAlt: "八坂神社西樓門", photoCredit: "圖片：DXR（CC BY-SA 4.0）／<a href=\"https://commons.wikimedia.org/wiki/File:Nishiromon_Gate,_Yasaka_Shrine,_Kyoto,_West_view_20190416_1.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "14:30–16:00", t: "祇園散策", d: "花見小路、巽橋，傳統茶屋建築街區", tr: "步行", note: "留意拍照禮儀，私有巷弄不可進入", st: "info", geo: "祇園 花見小路, 日本", photo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/20111023_Gion2.jpg", photoAlt: "祇園花見小路", photoCredit: "圖片：Rainer Haeßner（CC BY-SA 3.0）／<a href=\"https://commons.wikimedia.org/wiki/File:20111023_Gion2.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "16:00–17:00", t: "鴨川畔散步", d: "四條大橋周邊河岸，傍晚景色", tr: "步行", note: "從祇園走到鴨川約 10 分", st: "info", geo: "四条大橋, 日本", photo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/2015-10-15_Kamo_River.jpg", photoAlt: "鴨川", photoCredit: "圖片：John Gillespie（CC BY-SA 2.0）／<a href=\"https://commons.wikimedia.org/wiki/File:2015-10-15_Kamo_River.jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "17:00–18:30", t: "返回大阪", d: "京阪／JR 轉乘，不在京都吃晚餐，回大阪再用餐", tr: "電車", note: "避免過晚回飯店", st: "info", geo: "京都駅, 日本" },
      { tm: "18:30–20:00", t: "難波晚餐", d: "晚餐候選：<a href=\"https://maps.app.goo.gl/ebhKwpfgNvwtneaKA\" target=\"_blank\" rel=\"noopener\">🍢 BATTEN YOKATO AMERIKAMURA（美國村博多串燒）</a>、<a href=\"https://www.google.com/maps/search/?api=1&query=%E9%BB%91%E8%88%B9%20DOTONBORI%20KUROFUNE\" target=\"_blank\" rel=\"noopener\">🍣 黑船 DOTONBORI KUROFUNE（道頓堀迴轉壽司，現切生魚片秀）</a>", tr: "步行／地鐵", note: "回大阪後再用餐，餐廳待挑選", st: "warn", geo: "難波, 日本" },
    ],
    mapStops: [
      { name: "京都站", lat: 34.9858, lng: 135.7588, q: "京都駅, 日本" },
      { name: "清水寺", lat: 34.9949, lng: 135.7850, q: "清水寺, 日本" },
      { name: "二年坂・三年坂", lat: 34.9975, lng: 135.7795, q: "二年坂, 日本" },
      { name: "八坂神社", lat: 35.0037, lng: 135.7786, q: "八坂神社, 日本" },
      { name: "祇園・花見小路", lat: 35.0034, lng: 135.7756, q: "祇園 花見小路, 日本" },
      { name: "鴨川・四條大橋", lat: 35.0037, lng: 135.7699, q: "四条大橋, 日本" },
    ],
  },
  {
    date: "12/11", w: "五", region: "大阪", title: "市場早餐・返程",
    mapOrigin: HOTEL_ADDR,
    rows: [
      { tm: "08:00–10:00", t: "木津市場", d: "早餐、逛市場", tr: "步行／地鐵", note: "市場營業時間需確認", st: "warn", geo: "木津卸売市場, 日本", photo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Osaka_Kizu_Wholesale_Market_%2840473538664%29.jpg", photoAlt: "木津市場", photoCredit: "圖片：m-louis（CC BY-SA 2.0）／<a href=\"https://commons.wikimedia.org/wiki/File:Osaka_Kizu_Wholesale_Market_(40473538664).jpg\" target=\"_blank\" rel=\"noopener\">Wikimedia Commons</a>" },
      { tm: "10:00", t: "飯店退房", d: "Apartment Hotel 11 Kuromon 2（住一 黑門2号店）退房", tr: "步行", note: "", st: "info", geo: HOTEL_ADDR },
      { tm: "10:30–13:30", t: "前往關西機場・報到", d: "南海電鐵／JR 至關西機場，預留國際線報到與安檢時間", tr: "南海電鐵／JR", note: "AK171 第一航廈起飛，國際線建議提早 2–3 小時報到", st: "info", geo: "関西国際空港, 日本" },
      { tm: "14:10", t: "搭乘 AK171 返回高雄", d: "關西機場（KIX）第一航廈 14:10 起飛，預計 16:30 抵達小港國際機場（KHH）國際航廈", tr: "", note: "亞洲航空 AK171，訂位代號 PDINPM；飛行時間約 3 小時 20 分", st: "ok", geo: "関西国際空港, 日本" },
    ],
    mapStops: [
      { name: "木津市場", lat: 34.6571, lng: 135.5004, q: "木津卸売市場, 日本" },
      { name: "關西機場", lat: 34.4347, lng: 135.2441, q: "関西国際空港, 日本" },
    ],
  },
];

const TRIP_ROUTES = [
  { route: "關西機場→難波", mode: "南海電鐵", time: "約 40–60 分鐘", note: "依車種與飯店位置調整" },
  { route: "大阪→箕面", mode: "阪急", time: "約 45–75 分鐘", note: "從梅田轉乘" },
  { route: "大阪難波→近鐵奈良", mode: "近鐵", time: "約 40–50 分鐘", note: "依車種" },
  { route: "近鐵奈良→新世界", mode: "近鐵＋地鐵", time: "約 55–75 分鐘", note: "依路線" },
  { route: "大阪→日本環球影城", mode: "JR", time: "約 20–45 分鐘", note: "依住宿位置" },
  { route: "大阪→清水寺", mode: "JR＋巴士", time: "約 60–90 分鐘", note: "京都站轉巴士，尖峰時段較擠" },
  { route: "祇園／河原町→大阪", mode: "京阪／JR", time: "約 45–60 分鐘", note: "依車種" },
  { route: "大阪→關西機場", mode: "南海／JR", time: "約 40–70 分鐘", note: "預留報到時間" },
];

const TRIP_BUDGET = [
  { item: "機票", qty: "2 人", st: "ok", label: "已購" },
  { item: "住宿", qty: "5 晚（Apartment Hotel 11 Kuromon 2）", st: "warn", label: "金額待確認" },
  { item: "日本環球影城門票", qty: "2 人", st: "warn", label: "待填" },
  { item: "日本環球影城快速通關", qty: "2 人／可選", st: "warn", label: "待填" },
  { item: "機場交通", qty: "2 人來回", st: "warn", label: "待填" },
  { item: "市區與跨城交通", qty: "2 人", st: "warn", label: "待填" },
  { item: "餐飲", qty: "6 天／2 人", st: "warn", label: "待填" },
  { item: "其他門票", qty: "2 人", st: "warn", label: "待填" },
  { item: "購物與備用金", qty: "2 人", st: "warn", label: "待填" },
];

const TRIP_PACKING = [
  "護照正本（效期 6 個月以上）＋ 影本",
  "機票／訂房確認單（紙本或手機截圖）",
  "日幣現金＋一張可海外提款的卡",
  "交通系 IC 卡（Suica／ICOCA）或現金備用",
  "轉接頭與行動電源",
  "保暖外套（12 月日本偏涼，早晚溫差大）",
  "輕便雨具",
  "常備藥品",
  "環球影城／奈良公園走路多，穿好走的鞋",
  "少量零食與水，方便行程中移動時補充",
];
