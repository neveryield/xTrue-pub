/**
 * 预置种子数据 — 20 用户 + 50+ 帖子 + 评论 + 打分。
 * 每次页面刷新重新执行，保证 mock 数据一致。
 *
 * 子品类 key 与 constants.ts SUBCATEGORIES 严格对齐，确保：
 * - Leisure 的子品类过滤 (subcategory=key) 正确命中
 * - Dining/Media/Other 的关键词搜索 (keyword=label) 能在 title 中匹配
 */

import { store, clearStore } from "./store"
import { createMockUser, createMockPost, createMockComment, createMockScore, createMockSession } from "./factories"
import type { MockUser, MockPost, MockComment, MockScore } from "./store"

// ── 辅助 ──

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function postImage(postIndex: number, imgIndex: number): string {
  const w = [800, 1024, 1200, 800][imgIndex % 4]
  const h = [600, 768, 900, 800][imgIndex % 4]
  return `https://picsum.photos/seed/xT_${postIndex}_${imgIndex}/${w}/${h}`
}

const NICKNAMES = [
  "林间小筑", "深海鲸落", "北方的风", "江南烟雨客", "边城故事",
  "七里香的夏天", "小满未满", "山海行者", "追光的蜗牛", "暮云春树",
  "星野回声", "半盏流年", "风居住的街道", "稻香老农", "冰山上的来客",
  "枕书眠月", "三杯两盏", "远山淡影", "且听风吟", "云深不知处",
]

const BIOS = [
  "爱吃爱玩爱分享的普通人",
  "用文字记录生活中的每一次感动",
  "生如逆旅，一苇以航",
  "认真吃饭，认真生活 🍜",
  "前互联网大厂产品经理，现在gap中",
  null,
  "世界那么大，我要去看看 ✈️",
  "咖啡重度爱好者 | 业余摄影师",
  null,
  "做真实的自己，写真诚的评价",
]

// ═══════════════════════════════════════════
// 帖子数据 — subcategory 使用 constants.ts 中的 key
// 标题中包含中文 label 关键词，确保 keyword 搜索也能命中
// ═══════════════════════════════════════════

const DINING_POSTS: MockPost[] = [
  // hotpot
  { ...createMockPost({ category: "dining", subcategory: "hotpot", created_at: daysAgo(3), updated_at: daysAgo(3) }),
    title: "重庆老灶火锅 — 排队两小时也值得的深夜沸腾",
    content: `<p>上周五加班到九点，同事说"走，去吃点热乎的"，于是直奔望京这家重庆老灶。</p>
<p>九点四十到店，门口还在排长队……等了快一个半小时才吃上。但！第一口毛肚下去，所有等待都值了——<strong>脆、嫩、鲜，七上八下刚刚好</strong>。</p>
<p><strong>锅底</strong>：点的九宫格，牛油味非常正。中辣已经够劲，不能吃辣的慎选特辣。</p>
<p><strong>必点菜</strong>：</p>
<ul><li>鲜毛肚 — 脆爽到令人感动</li><li>鹅肠 — 处理得很干净，涮8秒刚好</li><li>老肉片 — 肥瘦相间，入口即化</li><li>贡菜 — 清甜脆口，解腻神器</li></ul>
<p>环境就是典型的市井老火锅风格，嘈杂但有烟火气。服务阿姨嗓门大但很热情。</p>
<p><strong>人均 130</strong>，对于这个品质来说性价比不错。唯一扣分项：排队太久，建议工作日早点去。</p>` },
  // barbecue
  { ...createMockPost({ category: "dining", subcategory: "barbecue", created_at: daysAgo(2), updated_at: daysAgo(2) }),
    title: "望京这家韩式烤肉 — 炭火烧烤带来的极致肉食体验",
    content: `<p>朋友推荐了一家藏在写字楼二层的烧烤店，主打炭火直烤，肉的品质出乎意料地好。</p>
<p><strong>必点</strong>：厚切牛舌 — 在炭火上烤到表面微焦、内里粉嫩，蘸一点海盐就足够。猪五花 — 肥瘦比例完美，烤到金黄焦脆，配上生菜和蒜片，一口气能吃三盘。</p>
<p>他们家的小菜也很讲究，泡菜是自家腌的，不是那种工厂货。海鲜葱饼外酥里嫩，蘸酱汁绝了。</p>
<p>环境是工业风装修，排烟做得很好，吃完身上没什么味道。服务员会帮忙烤肉，火候掌握得很专业。</p>
<p><strong>人均 180</strong>，性价比尚可。建议提前预约，周末晚上基本满座。</p>` },
  // buffet
  { ...createMockPost({ category: "dining", subcategory: "buffet", created_at: daysAgo(5), updated_at: daysAgo(5) }),
    title: "五星酒店海鲜自助餐 — 300块能吃到回本吗？实测来了",
    content: `<p>某洲际酒店的海鲜自助一直躺在收藏夹里，上周趁着纪念日终于去拔草了。周末晚餐 ¥328/人。</p>
<p><strong>海鲜区</strong>：波士顿龙虾每人半只（限量），新鲜度不错。生蚝是现开的，个头中等但很鲜甜。三文鱼刺身厚切，油脂分布均匀。</p>
<p><strong>热菜区</strong>：烤羊排是全场最佳，外焦里嫩。牛排可以选熟度，厨师现场煎。中式热菜一般，感觉是凑数的。</p>
<p><strong>甜品区</strong>：惊艳！提拉米苏和焦糖布丁都是酒店饼房现做的，不是供应商的冷冻货。巧克力喷泉旁边有新鲜草莓和棉花糖。</p>
<p><strong>回本计算</strong>：吃了半只龙虾(≈¥80) + 8只生蚝(≈¥120) + 刺身若干(≈¥60) + 羊排牛排(≈¥80) = ¥340，勉强回本。</p>
<p>结论：<strong>适合纪念日和请客，日常吃性价比一般。甜品比海鲜更值得期待。</strong></p>` },
  // chinese
  { ...createMockPost({ category: "dining", subcategory: "chinese", created_at: daysAgo(12), updated_at: daysAgo(11) }),
    title: "西安回民街的羊肉泡馍 — 二十年的中餐老味道",
    content: `<p>去西安出差，当地朋友带去的，说是他从小吃到大的店。</p>
<p>这家泡馍的吃法是<strong>自己掰馍</strong>，服务员端上一只大碗和两个白吉馍，你得耐着性子掰成黄豆粒大小。朋友说掰得越细，汤越入味。我掰了快二十分钟，手指尖都酸了。</p>
<p>掰好之后服务员端去后厨浇汤，端回来的那一刻——<strong>羊汤的鲜香混合着花椒和芫荽的气息扑面而来</strong>。</p>
<p>汤色奶白，羊肉软烂，馍粒吸饱了汤汁但依然有嚼劲。配上一碟糖蒜和油泼辣子，一口下去，整个人都暖和了。</p>
<p>环境就是街边小店，塑料凳、折叠桌，但味道秒杀很多大饭店。老西安说：好的泡馍不在装修，在那一锅老汤。</p>
<p><strong>人均 35，这家店让我对西安的好感度直接拉满。</strong></p>` },
  // western
  { ...createMockPost({ category: "dining", subcategory: "western", created_at: daysAgo(9), updated_at: daysAgo(9) }),
    title: "国贸这家法式小馆 — 不用飞巴黎也能吃到的地道西餐",
    content: `<p>在国贸三期B1发现了一家低调的法式bistro，老板是在巴黎蓝带学成回来的90后。</p>
<p>前菜点了法式洋葱汤，上面焗烤的Gruyere芝士拉丝半米长，汤底是牛骨熬了8小时的，鲜得让人想把碗舔干净。</p>
<p>主菜是油封鸭腿 — 鸭皮酥脆到轻轻一碰就裂开，鸭肉用叉子就能撕开。配的烤小土豆吸收了鸭油，比我吃过的大多数薯条都好吃。</p>
<p>甜品是焦糖布丁，表面焦糖脆壳用勺子背一敲就裂，下面的蛋奶冻丝滑得像在吃云朵。</p>
<p>环境是暖色调的复古法式装修，座位不多但很温馨。服务生对每道菜的食材来源和做法都能说清楚，体验加分。</p>
<p><strong>人均 280</strong>。适合约会和姐妹聚会，一个人来坐在吧台也很惬意。</p>` },
  // japanese
  { ...createMockPost({ category: "dining", subcategory: "japanese", created_at: daysAgo(7), updated_at: daysAgo(6) }),
    title: "三里屯这家Omakase — 让我重新理解了日料的「季节感」",
    content: `<p>朋友生日定了这家，人均800的Omakase，本来觉得有点贵，吃完觉得物有所值。</p>
<p>前菜是<strong>萤乌贼配柚子味噌</strong>，乌贼的鲜甜和柚子的清香在嘴里化开，瞬间打开了味蕾。</p>
<p>8贯寿司中最惊艳的三贯：</p>
<ul><li>金枪鱼大腩 — 入口即化，油脂在舌尖铺开的瞬间让人失语</li><li>海胆军舰 — 北海道的马粪海胆，甜度惊人</li><li>星鳗 — 刷了秘制酱汁，软糯不腥</li></ul>
<p>师傅会根据你的节奏调整上菜速度，每次捏完都会解释鱼的产地和当季特点。整个体验就像在看一场安静的料理表演。</p>
<p>不足：环境略小，隔壁桌说话听得一清二楚。且只接受预约，walkin是不可能的。</p>
<p>总评：<strong>适合重要纪念日，需要提前一周以上预约</strong>。</p>` },
  // korean
  { ...createMockPost({ category: "dining", subcategory: "korean", created_at: daysAgo(4), updated_at: daysAgo(4) }),
    title: "五道口这家韩餐小馆 — 炸鸡配啤酒的快乐你想象不到",
    content: `<p>五道口作为北京的"韩国城"，好吃的韩餐遍地都是。但这家藏在小区里的家庭式韩餐馆，是我吃过最正宗的。</p>
<p><strong>炸鸡</strong>：点了原味和甜辣双拼。外皮酥脆到咬下去有"咔嚓"声，里面的鸡肉却嫩得出汁。甜辣酱不是那种工业糖精味，而是真正用韩国辣酱调的。配的腌萝卜酸甜解腻，完美搭配。</p>
<p><strong>部队锅</strong>：份量大到吓人，两个人根本吃不完。午餐肉、火腿、年糕、拉面、芝士——看起来乱七八糟，但煮在一起就是有一种让人停不下筷子的魔力。</p>
<p>老板娘是韩国人，中文不太流利但很热情。店里一直在放K-POP，电视里播的是韩国综艺。</p>
<p><strong>人均 90</strong>。强烈推荐炸鸡+啤酒的搭配，周五晚上的完美组合。</p>` },
  // cafe
  { ...createMockPost({ category: "dining", subcategory: "cafe", created_at: daysAgo(1), updated_at: daysAgo(1) }),
    title: "藏在胡同深处的独立咖啡馆 — 手冲爱好者的咖啡天堂",
    content: `<p>上周日意外发现的一家店，藏在五道营胡同深处，门脸小到如果不是特意找绝对会错过。</p>
<p>一进门就是<strong>一整面墙的咖啡豆</strong>，从埃塞俄比亚到巴拿马瑰夏，少说有二十几种单品豆。老板是个戴眼镜的80后，聊了两句就知道是真正热爱咖啡的人。</p>
<p>点了一杯埃塞古吉水洗，老板当着我的面磨豆、温杯、手冲。第一口：<strong>花香炸裂，柑橘酸质明亮，尾韵是干净的蜂蜜甜</strong>。喝到室温后，茶感开始浮现，层次非常丰富。</p>
<p>还试了他们家的提拉米苏，马斯卡彭很新鲜，咖啡酒的比例恰到好处，不会太湿也不会太干。</p>
<p>环境是暖木色调，有猫，有书，有阳光。适合一个人来发呆或者带电脑工作（有wifi且不限时）。</p>
<p><strong>人均 55</strong>。要说缺点就是座位少，下午两点以后基本满座。</p>` },
  // dessert
  { ...createMockPost({ category: "dining", subcategory: "dessert", created_at: daysAgo(6), updated_at: daysAgo(6) }),
    title: "上海这家法式甜品店 — 每一道甜品都是一件艺术品",
    content: `<p>在法租界闲逛时无意中拐进了这家小店，门面不起眼，但橱窗里展示的甜品让人移不开眼。</p>
<p>点了招牌的<strong>茉莉花慕斯</strong>：外形是一朵含苞待放的茉莉花，用勺子切开后里面有荔枝果肉夹心和抹茶海绵蛋糕底。花香、果香、茶香层层递进，甜度控制得刚刚好——不腻，是亚洲人喜欢的甜度。</p>
<p>朋友点的<strong>柚子巧克力塔</strong>也值得推荐：黑巧克力的苦和柚子的酸碰撞出一种高级的味觉体验，塔皮的黄油香让整道甜品有了扎实的底味。</p>
<p>环境是极简的白+原木色，每张桌子上都有鲜花。唯一的缺点是价格偏高——<strong>一道甜品 ¥88-128</strong>，但考虑到用料和出品，可以接受。</p>
<p>适合下午茶和姐妹聚会。拍照非常出片。</p>` },
  // snack
  { ...createMockPost({ category: "dining", subcategory: "snack", created_at: daysAgo(5), updated_at: daysAgo(5) }),
    title: "周末去了趟三源里菜市场 — 北京小吃食材的宝藏之地",
    content: `<p>如果你在北京且喜欢做饭，一定要去一趟三源里。这个菜市场不大，但<strong>进口食材的密度可能是全北京最高的</strong>，也是寻访各地小吃原料的好去处。</p>
<p>随便逛一圈看到的：澳洲和牛、西班牙火腿、法国生蚝、意大利黑醋、日本清酒、东南亚香料……应有尽有。很多西餐厅的厨师也在这里采购。</p>
<p>重点推荐几个摊位：</p>
<ul><li>入口左手边的奶酪摊 — 种类多且可以试吃，老板懂行</li><li>中间的香料店 — 藏红花、肉豆蔻、小茴香，都是整粒卖的</li><li>最里面的海鲜摊 — 三文鱼很新鲜，可以现场处理</li></ul>
<p>价格不算便宜，但品质对得起。我买了半斤帕尔玛火腿（¥68）、一瓶意大利黑醋（¥45）、两颗牛油果（¥15），回家做了个沙拉，幸福感爆棚。</p>
<p>建议<strong>上午十点前去</strong>，人少且货全。周末下午人挤人。</p>` },
]

const MEDIA_POSTS: MockPost[] = [
  // movie
  { ...createMockPost({ category: "media", subcategory: "movie", created_at: daysAgo(2), updated_at: daysAgo(2) }),
    title: "《沙丘3》前瞻 — 从小说到电影，保罗的弥赛亚之路将走向何方？",
    content: `<p>二刷了《沙丘2》之后，忍不住去翻了原著第三部《沙丘之子》和第四部《沙丘神帝》。牛蛙导演已经确认第三部将改编《沙丘弥赛亚》，这里聊聊时间线和可能的改编。</p>
<p><strong>时间线</strong>：弥赛亚的故事发生在第一部结尾的12年后。保罗已经以Muad'Dib之名统治帝国，圣战席卷了整个已知宇宙，死亡人数以十亿计。保罗本人被困在预言和权力的牢笼中。</p>
<p><strong>关键情节（含原著剧透）</strong>：</p>
<ul><li>针对保罗的密谋集团形成，包括特莱拉人、宇航公会、贝尼·杰瑟里特和伊如兰公主</li><li>特莱拉人送来了邓肯·艾达荷的克隆体 — 海特</li><li>契尼的命运将成为故事的情感核心（电影已做伏笔）</li></ul>
<p>牛蛙在第二部已经对原著做了不少改编（契尼的戏份大幅增加），相信第三部会给这个角色一个更丰满的弧光。</p>
<p><strong>个人预测</strong>：第三部会更像政治惊悚片而非史诗冒险，节奏会更慢，但深度更深。期待2027年。</p>` },
  // tv_series
  { ...createMockPost({ category: "media", subcategory: "tv_series", created_at: daysAgo(4), updated_at: daysAgo(4) }),
    title: "国产悬疑电视剧的又一次突破 —《漫长的季节》值得9.4分吗？",
    content: `<p>花了一个周末刷完12集，只能说——<strong>辛爽导演是天才</strong>。</p>
<p>这部剧表面是悬疑推理（谁杀了沈默？），内里却是<strong>时代碾压个体的悲剧史诗</strong>。三条时间线切换的手法在国产剧中很少见，但这里处理得非常成熟，每一条线的情感浓度都拉满。</p>
<p><strong>表演方面</strong>：</p>
<ul><li>范伟演的王响简直封神——一个被时代抛弃的老工人，固执、善良又让人心疼</li><li>秦昊的龚彪是中年底层的真实写照，大肚腩和吹牛皮的背后是深深的无力感</li><li>李庚希的沈默是近年国产剧中最复杂的年轻女性角色之一</li></ul>
<p>摄影和配乐也很讲究。东北的秋天被拍得又美又冷，每一帧都像油画。片尾曲《再回首》响起的时候，眼泪根本止不住。</p>
<p>扣0.1分是因为中间两集节奏略拖。但瑕不掩瑜，<strong>这确实是今年最好的国产电视剧</strong>。</p>` },
  // music
  { ...createMockPost({ category: "media", subcategory: "music", created_at: daysAgo(6), updated_at: daysAgo(5) }),
    title: "为什么City Pop音乐在40年后重新流行？从山下达郎到蒸汽波",
    content: `<p>最近Spotify和Apple Music的推荐里突然出现了大量City Pop歌单，从山下达郎到竹内玛莉亚，从杏里到角松敏生。为什么这种1980年代的日本流行音乐会在40年后重新征服全球听众？</p>
<p><strong>音乐特性</strong>：City Pop的标志性声音——funky的贝斯线、紧实的鼓点、华丽的合成器和英文夹杂的日语歌词——营造出一种<strong>「都市夜生活的浪漫感」</strong>。它既复古又未来，既日式又西化。</p>
<p><strong>蒸汽波的推波助澜</strong>：2010年代蒸汽波（Vaporwave）的兴起，大量采样了City Pop的片段（最著名的就是Macintosh Plus采样了竹内玛莉亚的《Plastic Love》），让新一代听众反向追溯到了源头。</p>
<p><strong>时代情绪</strong>：1980年代的日本经济泡沫期和当下有一种奇怪的共鸣——都是物质丰富但精神焦虑的时代。City Pop里的乐观和浪漫成了逃避现实的出口。</p>
<p><strong>入门推荐</strong>：山下达郎《Ride On Time》、竹内玛莉亚《Plastic Love》、杏里《Last Summer Whisper》、角松敏生《Summer Babe》。</p>` },
  // short_drama
  { ...createMockPost({ category: "media", subcategory: "short_drama", created_at: daysAgo(3), updated_at: daysAgo(3) }),
    title: "微短剧到底是不是「文化垃圾」？我对短剧的看法变了",
    content: `<p>之前对微短剧的态度是鄙夷的——「60秒一集的爽剧，能有什么营养？」直到做这一行的朋友给我看了几个数据：日活用户过亿，头部作品充值过千万。</p>
<p>抱着研究心态看了几部，感受很复杂：</p>
<p><strong>不值得辩护的部分</strong>：大多数确实粗制滥造。剧情逻辑经不起推敲（重生后靠背彩票号码暴富……），表演夸张，价值观经常很可疑（「龙王的赘婿」被打脸再打回去的套路）。</p>
<p><strong>但不可否认的创新</strong>：短剧用极致的叙事效率解决了传统长剧的信息密度问题。三秒一个反转，一分钟一个高潮——这是把「短视频+网文+电视剧」的基因做了融合。</p>
<p>就像当年的网络文学一样，短剧可能是中国独有的叙事样式创新。粗糙、油腻、但生命力旺盛。</p>
<p>我现在的态度：<strong>不鄙视，但也不推荐。存在即合理。</strong></p>` },
  // video
  { ...createMockPost({ category: "media", subcategory: "video", created_at: daysAgo(1), updated_at: daysAgo(1) }),
    title: "《黑神话：悟空》游戏视频通关感想 — 不只是中国第一款3A",
    content: `<p>47小时，全成就（除了那几个要刷几百只怪的）。手柄放下那一刻，眼眶有点湿。通关后又在B站看了不少攻略视频和二创，体验更丰富了。</p>
<p><strong>画面表现</strong>：UE5的Nanite和Lumen不是噱头。第一章黑风山的竹林光影、第二章黄风岭的沙漠风暴、第四章盘丝洞的诡异氛围，每一章都是一场视觉盛宴。尤其是BOSS战的场景设计，完全超越了「国产游戏」的刻板印象。</p>
<p><strong>战斗系统</strong>：棍法的三种架势切换 + 定身术 + 变身 + 法宝，深度足够但上手不难。个人最爱戳棍势，长距离追击和破招非常爽快。个别BOSS的设计确实「宫崎英高附体」，但胜利后的成就感是实打实的。</p>
<p><strong>剧情</strong>：对原著的改编大胆但尊重精神内核。主题从取经变成了「齐天大圣是否应该向体制低头」（为了过审，这其实是一个很勇敢的命题）。多结局设计让二周目有了意义。</p>
<p><strong>不足</strong>：空气墙确实多，地图指引偶尔迷路，后期小怪换皮略明显。但这些在整体的震撼面前都不算什么。</p>
<p>打分：<strong>92/100</strong>。国产单机的里程碑，推荐给所有热爱游戏和视频内容创作的人。</p>` },
  // music
  { ...createMockPost({ category: "media", subcategory: "music", created_at: daysAgo(11), updated_at: daysAgo(11) }),
    title: "推荐几个我每周必听的音乐播客 — 通勤路上的精神食粮",
    content: `<p>搬到了离公司更远的地方之后，每天通勤要两个小时。播客和音乐成了救命的陪伴。分享几个私藏的节目：</p>
<ul><li><strong>《故事FM》</strong>：普通人讲述自己的真实故事。第687期「我在富士康跳楼的同事」听完之后沉默了很久。不煽情，不评判，只是记录。这就是真实的力量。</li><li><strong>《随机波动》</strong>：三位女性媒体人的对谈节目。视角独特，比如她们聊《芭比》不是聊电影本身，而是聊「被允许的愤怒」——一针见血。</li><li><strong>《文化有限》</strong>：三个好朋友聊书。即使你没读过那本书也能听得很开心。</li><li><strong>《不合时宜》</strong>：关注社会议题的深度对话。有时会有些沉重，但高质量的讨论本身就很难得。</li></ul>
<p>通勤时间从煎熬变成了期待。好的音乐和播客就像朋友在身边聊天。</p>` },
  // movie (bonus)
  { ...createMockPost({ category: "media", subcategory: "movie", created_at: daysAgo(18), updated_at: daysAgo(17) }),
    title: "《地球脉动3》— 一部应该被装进时间胶囊的自然纪录片电影",
    content: `<p>BBC自然历史部再一次证明了，<strong>地球上最震撼的视觉奇观不在电影院，而在自然界</strong>。</p>
<p>第一集的「海岸」篇章：海鬣蜥幼崽在出生后第一时间要逃离游蛇群的追捕——这场追逐戏的紧张程度秒杀大部分动作片。大卫·爱登堡老爷子的声音在97岁依然如此稳健，是本片的灵魂。</p>
<p><strong>技术进步</strong>：团队用了新一代微型无人机和8K摄影机，让你可以跟着飞鸟一起翱翔，跟着海豚在浪花中穿梭。有一个镜头是无人机穿过鲸鱼喷出的水雾——这种沉浸感是前两季无法想象的。</p>
<p>但每一集最后都会告诉你这些栖息地正在以多快的速度消失。看完之后除了震撼，更多的是<strong>愧疚和紧迫感</strong>。</p>
<p>建议关掉手机、调暗灯光、用最大的屏幕观看。这是对这部作品应有的尊重。</p>` },
  // tv_series (bonus)
  { ...createMockPost({ category: "media", subcategory: "tv_series", created_at: daysAgo(9), updated_at: daysAgo(9) }),
    title: "读完了《百年孤独》— 期待这部小说能拍成电视剧",
    content: `<p>花了两个月读完了马尔克斯的这本巨著。读完之后呆坐了半个小时，感觉需要一个族谱、一瓶威士忌和一个拥抱。听说Netflix已经买下了改编权，如果能拍成电视剧一定很震撼。</p>
<p><strong>名字是最大的敌人</strong>：奥雷里亚诺、何塞·阿尔卡蒂奥、阿玛兰塔·乌苏拉……马尔克斯故意让七代人用重复的名字，仿佛在说：<strong>布恩迪亚家族的命运就是不断重复自己的悲剧</strong>。</p>
<p><strong>魔幻现实主义的本质</strong>：不是「魔法发生在现实世界」那么简单。而是把最荒诞的事用最平静的口吻讲出来——美人蕾梅黛丝升天、雨下了四年十一个月、一个男人被绑在栗树上直到死……当你以为自己在读神话时，你会发现马孔多的历史其实就是拉丁美洲的历史。</p>
<p><strong>最震撼的片段</strong>：最后奥雷里亚诺破译羊皮卷的瞬间，意识到「家族的第一个人被捆在树上，最后一个人正被蚂蚁吃掉」——这是文学史上最完美的闭环结局之一。</p>
<p>这是一本<strong>需要耐心和酒</strong>的书。但一旦进入马孔多，你就会明白为什么它能成为世界文学史上不可超越的高峰。期待电视剧改编！</p>` },
]

const LEISURE_POSTS: MockPost[] = [
  // travel
  { ...createMockPost({ category: "leisure", subcategory: "travel", created_at: daysAgo(8), updated_at: daysAgo(8) }),
    title: "大理旅居一个月 — 旅游景点消费清单 + 避坑指南",
    content: `<p>被「去有风的地方」洗脑之后，真的去大理住了一个月。现实和电视剧差多远？来看看。</p>
<p><strong>消费清单（一个月总计约 ¥8500）</strong>：</p>
<ul><li>住宿：古城外客栈长租 ¥2500/月（淡季价格，独立卫浴）</li><li>吃饭：早餐米线¥10 + 午餐¥25 + 晚餐¥35 ≈ 月¥2100</li><li>交通：租电动车月租¥400，偶尔打车¥200</li><li>咖啡/酒/社交：约¥1500</li><li>周边游（沙溪、喜洲、双廊）：约¥800</li><li>杂项（防晒、洗衣、水果等）：约¥1000</li></ul>
<p><strong>高光时刻</strong>：在洱海生态廊道骑行，左边苍山右边洱海，风吹在脸上，那一刻觉得人生值得。</p>
<p><strong>坑</strong>：旺季住宿翻倍，千万不要7-8月去。另外很多「网红打卡点」实际就是农民房里摆了几盆多肉。</p>
<p>总结：<strong>适合想放慢节奏的人，不适合想要「玩遍景点」的游客</strong>。会再去的。</p>` },
  // theme_park
  { ...createMockPost({ category: "leisure", subcategory: "theme_park", created_at: daysAgo(5), updated_at: daysAgo(5) }),
    title: "环球影城主题乐园一日游 — 不买优速通怎么玩回本？",
    content: `<p>北京环球影城开了这么久终于去了！周五请了一天假，没买优速通（¥500太贵了），纯靠规划和运气，刷了7个项目+看了2场秀。</p>
<p><strong>攻略要点</strong>：</p>
<ul><li>7:30到大门口排队，8:30开门直接冲哈利波特禁忌之旅（这个时候排队只要20分钟，下午会排到120分钟）</li><li>变形金刚火种源争夺战 — 4D效果非常震撼，比哈利波特还刺激</li><li>霸天虎过山车 — 弹射起步，失重感强烈，胆小慎入</li><li>功夫熊猫区 — 适合休息和拍照，项目偏亲子向</li></ul>
<p>午饭在三个扫帚餐厅吃的，烤鸡排骨套餐 ¥88，味道还行但份量不大。黄油啤酒 ¥50，就是奶油苏打水，拍照好看但味道一般。</p>
<p>花车巡游下午5点开始，提前15分钟去占位置。晚上的灯光秀在霍格沃茨城堡，非常震撼，一定要看到最后。</p>
<p><strong>总花费：门票¥528 + 餐饮¥150 + 停车¥100 = ¥778。值得！</strong></p>` },
  // exhibition
  { ...createMockPost({ category: "leisure", subcategory: "exhibition", created_at: daysAgo(5), updated_at: daysAgo(5) }),
    title: "看了浦美「卡拉瓦乔与巴洛克奇迹」展览 — 有被震撼到",
    content: `<p>浦东美术馆这次的特展质量非常高。虽然卡拉瓦乔的真迹只来了5幅，但加上他同时代和受他影响的画家作品，整体呈现了巴洛克艺术的完整面貌。</p>
<p>卡拉瓦乔的《捧水果篮的男孩》就在眼前不到一米的地方——<strong>那个葡萄上的光泽，四百年前的油彩至今还在发光</strong>。他标志性的「酒窖光线法」（chiaroscuro）在真迹面前才能真正理解：不是简单的明暗对比，而是让光线本身成为叙事的一部分。</p>
<p>另一个亮点是看到了真蒂莱斯基（Artemisia Gentileschi）的作品。作为卡拉瓦乔最重要的追随者之一，也是巴洛克时期最杰出的女性画家。她的《朱迪斯斩杀荷罗孚尼》充满了令人不安的力量感。</p>
<p>展陈设计也很用心，每个展厅的光线强度是严格控制的（因为油画对光敏感）。</p>
<p><strong>票价¥200略贵，但值得</strong>。建议工作日去，人少可以慢慢看。展期到8月底。</p>` },
  // concert
  { ...createMockPost({ category: "leisure", subcategory: "concert", created_at: daysAgo(14), updated_at: daysAgo(13) }),
    title: "Livehouse演唱会指南：北京最好的小型演出场地排名",
    content: `<p>在北京看了五六年现场演出和演唱会，大大小小的Livehouse去过十几家。主观排名如下：</p>
<ol><li><strong>疆进酒</strong>：音效最好，声场设计专业。站哪里都能听清楚。缺点是位置远（在西四），且周边没有好吃的。8.5/10</li><li><strong>乐空间</strong>：东四胡同里，文化地标。场地虽小但氛围一级棒。缺点是夏天像蒸桑拿且调音偶尔翻车。8/10</li><li><strong>MAO Livehouse</strong>：老字号，场地最大。适合大牌乐队。缺点是音响偏炸，前排耳朵受罪。7.5/10</li><li><strong>DDC</strong>：日坛附近，偏爵士/世界音乐。环境精致，适合坐下来安静听。缺点是不太适合站着嗨的演出。7.5/10</li><li><strong>School</strong>：酒吧+Livehouse，摇滚乐手聚集地。场地最小但最有地下感。Joyside就是从这里走出来的。7/10</li></ol>
<p>Tips：提前在秀动/大麦买票比现场便宜20-30%。带耳塞！尤其是前排，保护听力永远是第一位的。</p>` },
  // hotel
  { ...createMockPost({ category: "leisure", subcategory: "hotel", created_at: daysAgo(22), updated_at: daysAgo(22) }),
    title: "京郊民宿酒店实测 — 金海湖周边度假酒店两日体验",
    content: `<p>周末想找个近郊的酒店民宿好好躺两天，选了金海湖附近一家新开的温泉度假酒店。</p>
<p><strong>房型</strong>：订了湖景大床房，带私汤。房间约60㎡，落地窗直接对着金海湖，早上醒来窗帘一拉就能看到湖面晨雾——这个view值回一半房费。</p>
<p><strong>温泉</strong>：私汤在阳台上，水温可以自己调节。公共温泉区有四个不同温度的池子，还有桑拿房。人不多，基本包场。</p>
<p><strong>餐饮</strong>：酒店餐厅主打农家菜，铁锅炖鱼很扎实。早餐是中西自助，品种不算多但品质不错。附近开车10分钟有几家农家院也值得尝试。</p>
<p><strong>周边</strong>：金海湖可以划船（¥80/小时），湖边有骑行道。开车30分钟到蓟州大峡谷，适合轻度徒步。</p>
<p><strong>价格</strong>：周末¥1280/晚含早+私汤，性价比不错。建议提前一周以上订，湖景房很抢手。</p>` },
  // board_game
  { ...createMockPost({ category: "leisure", subcategory: "board_game", created_at: daysAgo(10), updated_at: daysAgo(10) }),
    title: "剧本杀/桌游入门指南 — 从社恐到DM的进阶之路",
    content: `<p>作为一个曾经重度社恐的人，入坑剧本杀两年，现在已经可以带新手朋友玩了。分享一下入门经验。</p>
<p><strong>剧本杀推荐（新手友好）</strong>：</p>
<ul><li>《来电》— 欢乐机制本，没有推凶压力，适合第一次玩</li><li>《告别诗》— 情感本天花板之一，准备好纸巾</li><li>《病娇男孩的精分日记》— 微恐推理，氛围感拉满但不会太吓人</li></ul>
<p><strong>桌游推荐</strong>：</p>
<ul><li>《卡坦岛》— 入门经典，规则简单但策略深度足够</li><li>《阿瓦隆》— 聚会神器，5-10人都能玩，比狼人杀更有逻辑性</li><li>《展翅翱翔》— 画风绝美，养鸟模拟器，女生也很喜欢</li></ul>
<p><strong>避坑</strong>：不要一上来就玩硬核推理本（七八个小时真的会累死）。不要找拼车，陌生人的节奏和风格很难匹配。</p>
<p>推荐北京几家环境好的店：熊猫精舍（中关村）、推手（望京）、星局（三里屯）。</p>` },
  // escape_room
  { ...createMockPost({ category: "leisure", subcategory: "escape_room", created_at: daysAgo(16), updated_at: daysAgo(15) }),
    title: "密室逃脱天花板 — 沉浸式剧场「不眠之夜」级别的体验",
    content: `<p>上周体验了一家新开的沉浸式密室逃脱，不是传统的小黑屋找密码，而是1200㎡的实景剧场。NPC全程陪同，剧情分支取决于你的选择。</p>
<p><strong>主题</strong>：「第七精神病院」— 你们是一群来面试的医生，需要在3小时内找出医院隐藏的秘密。有轻度追逐环节（NPC不会真的碰到你），氛围偏悬疑而非恐怖。</p>
<p><strong>亮点</strong>：</p>
<ul><li>场景还原度极高，手术室、病房、档案室每个空间都细节满满</li><li>NPC的即兴表演能力很强，会根据你的反应调整互动方式</li><li>多结局设计，我们打出了"良知觉醒"结局（据说只有30%的组能打到）</li></ul>
<p><strong>不足</strong>：价格偏贵（¥328/人），且有人数要求（4-8人）。部分机关灵敏度不够，按了两次没反应有点出戏。</p>
<p>总体来说是目前玩过最好的密室逃脱之一，推荐给喜欢沉浸式体验的朋友。</p>` },
  // esports
  { ...createMockPost({ category: "leisure", subcategory: "esports", created_at: daysAgo(12), updated_at: daysAgo(11) }),
    title: "电竞馆体验报告 — 从网吧到专业电竞，这一代人的娱乐进化",
    content: `<p>朋友生日组了个局，去了一家新开的专业电竞馆。和印象中的网吧完全不是一个概念。</p>
<p><strong>设备</strong>：全场240Hz显示器 + RTX4070 + 专业电竞椅。键盘是Cherry MX轴体的定制款，鼠标可以选型号。耳机是HyperX的降噪款，隔音效果很好。</p>
<p><strong>环境</strong>：分区设计——普通区（¥35/h）、竞技区（¥55/h、5v5对战）、VIP包间（¥120/h、可以关灯开氛围灯）。整体装修是赛博朋克风，蓝紫调灯光，墙上挂着各种电竞战队的队服。</p>
<p>我们六个人打了三小时LOL和两小时CS2。竞技区的5v5对战体验非常好，队友坐在一排，沟通不需要开麦。输了的请客去吃烧烤。</p>
<p><strong>消费</strong>：六个人五小时人均¥180，包含饮品畅饮。比去KTV划算且有趣。</p>
<p>电竞正在从「宅男的爱好」变成主流社交方式，这种专业电竞馆是很好的尝试。</p>` },
]

const FREE_POSTS: MockPost[] = [
  // discussion
  { ...createMockPost({ category: "free", subcategory: "discussion", created_at: daysAgo(3), updated_at: daysAgo(3) }),
    title: "大家觉得「真实评价」在这个时代还重要吗？来讨论",
    content: `<p>最近在思考一个问题：当小某书上的每一条「种草」背后都有商业利益，当某宝的好评大部分是刷的，当某众点评的五星基本都是做活动换的——<strong>「真实评价」是不是已经变成了奢侈品</strong>？</p>
<p>我自己的体验：上周在某书上看到一家「宝藏日料」，到店发现是预制菜加热的，人均还300+。但那条笔记有2000多个赞。同行的朋友说：「现在的推荐90%都是广告，习惯了。」</p>
<p>但说真的，<strong>当所有人都习惯了虚假，真实本身就变成了竞争力</strong>。如果有一个地方，你能确定每条评价都是真人认真写的，哪怕数量少一些，价值是不是反而更高？</p>
<p>这也是我愿意在xTrue上花时间写评价的原因——找到同样在乎「真实」的人。</p>
<p>你们怎么看？欢迎讨论。</p>` },
  // tree_hole
  { ...createMockPost({ category: "free", subcategory: "tree_hole", created_at: daysAgo(0), updated_at: daysAgo(0) }),
    title: "今天在地铁上看到一个人在看我的主页 — 树洞碎碎念",
    content: `<p>通勤路上，旁边的人在看手机，我余光扫到屏幕……那个头像怎么这么眼熟？</p>
<p>结果是<strong>我自己的主页</strong>。感觉像是被偷窥了一样（虽然明明是我的公开信息），但在地铁这个场景下突然看到自己在对方的屏幕上，有一种奇怪的叠加感。</p>
<p>我默默把手机亮度调低了，假装在看窗外。他刷了几分钟就退出去了，应该只是随机刷到的。</p>
<p>互联网真小。发在这里当树洞了，现实中不知道跟谁说。</p>` },
  // discussion
  { ...createMockPost({ category: "free", subcategory: "discussion", created_at: daysAgo(6), updated_at: daysAgo(6) }),
    title: "被ChatGPT取代的前夜 — 一个内容创作者的真实焦虑讨论",
    content: `<p>我做了五年内容创作，写过公众号、做过视频脚本、接过商业文案。最近用了几次ChatGPT之后，说实话，怕了。</p>
<p>不是怕AI写得比我好——目前它还做不到。我怕的是<strong>90%的甲方根本分辨不出「好内容」和「AI生成的内容」的区别</strong>。当客户只是需要「一篇SEO友好的1500字文章」，AI一分钟搞定，我可能要花半天——我的半天值多少钱？</p>
<p>但冷静下来想，AI取代的是<strong>「模板化写作」</strong>，不是创作本身。那些需要独特视角、个人经验、情感共鸣的内容——比如一篇真正打动人的餐厅评价，或者一段让人读了想哭的旅行故事——AI目前还写不出来。</p>
<p>所以方向是清晰的：要么提供<strong>AI做不到的东西</strong>（真实经验、深度思考、个人风格），要么学会用AI提高效率（把它当工具而不是对手）。</p>
<p>还在焦虑，但也在想办法。共勉。</p>` },
  // voting
  { ...createMockPost({ category: "free", subcategory: "voting", created_at: daysAgo(2), updated_at: daysAgo(2) }),
    title: "【投票】周末「特种兵式」打卡和「躺平式」微度假，你选哪个？",
    content: `<p>最近和朋友的两种周末模式产生了分歧。他是典型的「特种兵」——周六早上6点出发，一天跑四个景点，晚上赶最后一班高铁回来。我更喜欢「躺平式」——睡到自然醒，找个安静的地方发呆。</p>
<p>各有各的道理：</p>
<p><strong>特种兵式</strong>：适合精力旺盛的人。在有限时间里「最大化体验密度」，两天能玩别人一周的内容。而且回来后确实有很多故事可讲。缺点是累——周一上班比周五还累。</p>
<p><strong>躺平式</strong>：更适合我这种社畜。一周的疲劳需要通过「什么都不做」来恢复。在酒店阳台晒太阳、去茶馆坐一下午、或者干脆在家看剧，都算微度假。缺点是经常被问「你周末去哪了？」，回答「在家」显得很不精彩。</p>
<p>其实本质是大家对「休息」的定义不同。有人通过新鲜体验来充电，有人通过彻底放空来充电。没有对错，<strong>找到适合自己的节奏最重要。</strong></p>
<p>来投票吧！你是特种兵派还是躺平派？</p>` },
  // other
  { ...createMockPost({ category: "free", subcategory: "other", created_at: daysAgo(4), updated_at: daysAgo(4) }),
    title: "用完了今年最后一瓶防晒 — 推荐一下今年的空瓶",
    content: `<p>这一年用完了6瓶防晒，把好用的和难用的都说一下：</p>
<p><strong>回购系列</strong>：</p>
<ul><li>安耐晒金瓶 — 户外必备，军训级防晒力。但肤感略油，日常通勤有点大材小用</li><li>EltaMD UV Clear — 敏感肌友好，透明质酸保湿不粘腻。日常通勤最佳</li><li>理肤泉大哥大 — 今年升级版肤感好了很多，性价比之王</li></ul>
<p><strong>踩雷系列</strong>：</p>
<ul><li>某韩国品牌的水感防晒 — 涂完像在脸上涂了胶水，假滑到不行</li><li>某国货防晒喷雾 — 喷出来是白的液体，完全抹不开</li></ul>
<p>总结：<strong>防晒不是越贵越好，找到适合自己肤质的才是关键。</strong> 敏感肌选物理防晒（氧化锌/二氧化钛），油皮选清爽型化学防晒，干皮选带保湿成分的。</p>` },
  // tree_hole
  { ...createMockPost({ category: "free", subcategory: "tree_hole", created_at: daysAgo(7), updated_at: daysAgo(6) }),
    title: "深夜失眠想到一个创业点子，有没有人做过？在这里树洞一下",
    content: `<p>凌晨两点睡不着，越想越兴奋：做一个<strong>「反向点评」</strong>平台。</p>
<p>现在的点评都是消费者评商家，为什么不反过来？商家也可以评消费者。比如：</p>
<ul><li>「这位客人点单很专业，问的问题都在点上」</li><li>「这个食客对火候的理解比我们厨师还深」</li></ul>
<p>类似一个「食客/用户的资质认证」系统。认真的消费者可以积累自己的食客分，高分的食客去餐厅可能获得更好的服务。</p>
<p>我知道很多餐厅老板私下其实也希望服务懂行的客人。厨师花几个小时准备一道菜，如果吃的人真的懂得欣赏，那种满足感是额外的。</p>
<p>好了，明天醒来可能会觉得这是一个很蠢的想法。但先在树洞里记下来。</p>` },
]

const OTHER_POSTS: MockPost[] = [
  // phone
  { ...createMockPost({ category: "other", subcategory: "phone", created_at: daysAgo(1), updated_at: daysAgo(1) }),
    title: "主力手机从iPhone换到安卓一个月 — 我后悔了吗？",
    content: `<p>用了五年iPhone，上个月终于换了一台安卓旗舰。分享真实的转换体验。</p>
<p><strong>让我惊喜的</strong>：</p>
<ul><li>快充：从每天充电变成两天一充，20分钟充到80%——用过就回不去</li><li>信号：地铁和停车场终于有信号了，同样的路线iPhone常年1格</li><li>文件管理：直接拖拽MP3/PDF/电影，不用通过iTunes或iCloud</li><li>APK安装：不受App Store审核约束</li></ul>
<p><strong>让我想念iPhone的</strong>：</p>
<ul><li>AirDrop：和Mac/iPad传文件太方便了，安卓没有等效替代</li><li>iOS的动画细腻度：安卓的动画虽然快，但总觉得少了点什么</li><li>CarPlay比Android Auto好用一个档次</li><li>iMessage/FaceTime的家庭群聊无法迁移</li></ul>
<p>结论：<strong>不后悔，但也理解为什么很多人离不开iPhone</strong>。苹果赢在生态，安卓赢在自由。选哪个取决于你最在乎什么。</p>` },
  // computer
  { ...createMockPost({ category: "other", subcategory: "computer", created_at: daysAgo(7), updated_at: daysAgo(7) }),
    title: "M4 MacBook Pro 使用一个月 — 程序员的真实电脑评测",
    content: `<p>从Intel MBP升级到M4 Pro芯片，体验差别比我想象的大得多。</p>
<p><strong>性能</strong>：编译速度提升了3倍不止。以前clean build要3分钟的项目，现在40秒搞定。Docker也不卡了，同时跑5个容器毫无压力。</p>
<p><strong>续航</strong>：最大的惊喜。正常开发（VS Code + 浏览器20个标签 + Docker + Spotify）能用12-14小时。以前Intel版同样的场景最多4小时。现在出门不用带充电器了。</p>
<p><strong>缺点</strong>：</p>
<ul><li>价格：M4 Pro 32GB+1TB 版本 ¥21499，肉疼</li><li>兼容性：部分老软件还没适配ARM，需要用Rosetta转译</li><li>外接显示器：只支持两个外接屏幕（Pro版），Ultra才支持四个</li></ul>
<p>总结：<strong>如果还在用Intel Mac，升级到M系列是近几年最值的电脑投资。</strong></p>` },
  // audio
  { ...createMockPost({ category: "other", subcategory: "audio", created_at: daysAgo(10), updated_at: daysAgo(9) }),
    title: "入坑HiFi音频设备半年 — 分享一下我的耳机和播放器清单",
    content: `<p>半年前被同事安利了一副IE200，从此踏上了HiFi不归路。分享一下目前的设备清单和踩坑经验。</p>
<p><strong>当前设备</strong>：</p>
<ul><li>耳塞：森海塞尔 IE600 — 中高频非常华丽，适合听女声和弦乐</li><li>大耳：Hifiman Sundara — 平板振膜的天花板入门，需要耳放推</li><li>小尾巴：乐彼W2 — 推力够推大部分耳塞，出差必备</li><li>台机：拓品DX5 — 一体机省空间，解码+耳放一步到位</li></ul>
<p><strong>踩过的坑</strong>：</p>
<ul><li>换线提升有但有限，优先升级耳机本身</li><li>不要盲目追求平衡口，单端足够好听</li><li>音源比设备重要——320kbps MP3在万元设备上也是垃圾</li></ul>
<p>现在每天回家第一件事就是戴上耳机听一小时音乐，成了最好的放松方式。</p>` },
  // camera
  { ...createMockPost({ category: "other", subcategory: "camera", created_at: daysAgo(14), updated_at: daysAgo(14) }),
    title: "索尼A7C2相机+航拍无人机 — 旅行摄影的终极组合？",
    content: `<p>从手机拍照升级到全画幅微单+航拍无人机已经半年了，分享一下这套组合的实战体验。</p>
<p><strong>相机</strong>：索尼A7C2 + 腾龙28-200mm — 一镜走天下的旅行神组合。机身小巧到可以塞进日常背包，对焦速度和精度碾压同价位竞品。33MP像素足够后期裁切。</p>
<p><strong>无人机</strong>：DJI Mini 4 Pro — 249g免登记，画质出乎意料地好。竖拍模式适合发社交媒体，智能跟随功能让单人拍摄变得轻松。</p>
<p><strong>实战体验</strong>：</p>
<ul><li>云南旅拍7天，相机+一镜+无人机总共不到2kg</li><li>无人机的上帝视角拍洱海和苍山，效果碾压地面拍摄</li><li>相机的高感在古城夜景表现极好，ISO6400画面依然干净</li></ul>
<p><strong>不足</strong>：无人机在海拔3000m以上续航明显下降。相机屏幕在强光下不太看得清。</p>
<p>总结：对于旅行摄影来说，轻便比画质更重要。这套组合在重量和性能之间找到了很好的平衡。</p>` },
  // home_appliance
  { ...createMockPost({ category: "other", subcategory: "home_appliance", created_at: daysAgo(21), updated_at: daysAgo(20) }),
    title: "全屋家电选购指南 — 搬新家一年后的真实使用感受",
    content: `<p>装修完入住一年了，有些家电买对了，有些踩了坑。分享真实的使用感受。</p>
<p><strong>买对了的</strong>：</p>
<ul><li>洗烘一体机（松下）— 在北方可能觉得烘干没必要，但用过就回不去。浴巾烘完蓬松柔软，和晾干完全不是一个质感</li><li>扫地机器人（石头）— 每天自动打扫，家里的猫毛问题解决了80%。记得买带自动集尘的版本，否则每次倒尘盒很烦</li><li>即热式饮水机 — 不用烧水不用等，3秒出热水。泡茶冲咖啡都方便</li></ul>
<p><strong>踩坑的</strong>：</p>
<ul><li>智能冰箱带屏幕 — 除了增加耗电和售价之外没有任何实际用途。在冰箱上看视频？我为什么不用手机？</li><li>零冷水热水器 — 安装费¥2000+（要布回水管），效果一般，冬天还是要放十几秒才有热水</li></ul>
<p>总结：<strong>家电的核心是实用，不要为「智能」噱头买单。</strong></p>` },
  // kitchen
  { ...createMockPost({ category: "other", subcategory: "kitchen", created_at: daysAgo(15), updated_at: daysAgo(14) }),
    title: "厨房电器推荐 — 我家的五件高频使用小家电",
    content: `<p>住了一年之后，发现厨房里真正每天在用的电器就这几样。其他的要么吃灰，要么已经挂闲鱼了。</p>
<p><strong>高频使用（几乎每天）</strong>：</p>
<ol><li>空气炸锅（飞利浦）— 比烤箱快且省电，烤鸡翅、薯条、蔬菜都可以。复热外卖的炸物是隐藏神技</li><li>电饭煲（象印）— 贵的确实比便宜的好。IH加热的米饭颗粒分明，口感差别很明显</li><li>破壁机（九阳）— 早餐豆浆+晚餐浓汤，利用率超高。清洗一定要买带自清洁功能的</li></ol>
<p><strong>低频但值得</strong>：</p>
<ul><li>厨师机（KitchenAid）— 做面包和蛋糕必备，手揉真的太累了。但如果不是烘焙爱好者，会吃灰</li><li>真空封口机 — 周末备餐神器，冷冻食材不会氧化。¥100搞定</li></ul>
<p><strong>已经出掉的</strong>：酸奶机（用一次就懒得做了）、早餐机（难清洗）、煮蛋器（普通锅就能搞定）。</p>
<p>总结：<strong>厨房空间有限，只买使用频率高的电器。</strong></p>` },
  // car
  { ...createMockPost({ category: "other", subcategory: "car", created_at: daysAgo(18), updated_at: daysAgo(17) }),
    title: "试驾了五款纯电汽车 — 30万预算到底该选谁？",
    content: `<p>最近在考虑换电车，把市面上30万左右的纯电轿车和SUV都试了一遍。主观感受分享一下。</p>
<p><strong>Model Y 长续航</strong>：操控最好，底盘紧致，电耗最低。但内饰太简约了，悬挂偏硬，后排舒适性一般。适合喜欢驾驶的人。</p>
<p><strong>蔚来ET5T</strong>：外观最帅，换电体验独一档（3分钟满电出发）。NOMI很可爱，服务确实好。但续航打折比较严重，冬天高速可能只有标称的65%。</p>
<p><strong>极氪001</strong>：底盘综合素质最高（路特斯调校不是吹的），空间大。但车机偶尔卡顿，辅助驾驶还在追赶。</p>
<p><strong>小鹏G6</strong>：智驾最强，XNGP在高速和高架上基本可以放手。外观争议大，有些人觉得好看有些人觉得丑。</p>
<p><strong>理想L6</strong>：唯一的增程（虽然我倾向纯电），空间利用率极高，适合家庭。但三缸增程器的噪音在亏电状态下比较明显。</p>
<p>目前还没有做最终决定。建议想买车的朋友一定要亲自试驾，纸面参数和实际体验差距很大。</p>` },
  // sports
  { ...createMockPost({ category: "other", subcategory: "sports", created_at: daysAgo(3), updated_at: daysAgo(3) }),
    title: "坚持跑步半年 — 从500米气喘到10公里不费劲的运动户外心得",
    content: `<p>半年前被体检查出轻度脂肪肝之后，开始跑步。从第一个礼拜跑到500米就快吐了，到现在周末轻松跑10公里。分享一些真实的运动经验。</p>
<p><strong>新手最容易犯的错</strong>：一开始就跑太快。正确的节奏是<strong>「能一边跑一边完整说出一句话」</strong>的速度。如果跑的时候一句话说不出来，说明太快了。</p>
<p><strong>跑鞋</strong>：不一定非要最贵的。我第一双是迪卡侬¥199的入门款，跑了300公里才换。后来升级到亚瑟士Kayano，确实有提升但不是必须的。</p>
<p><strong>户外跑步vs跑步机</strong>：户外跑步消耗更多（有风阻和地形变化），而且对心理健康的帮助更大（阳光+自然景观）。跑步机的好处是不受天气影响且对膝盖更友好。</p>
<p><strong>最大的感受</strong>：跑步教会我的不是坚持，而是<strong>和自己的身体和解</strong>。不是每一天都状态好，接受慢的日子，享受快的日子。</p>
<p>现在脂肪肝消失了，体重掉了5公斤，精神状态好了很多。跑步是我做过的最正确的决定之一。</p>` },
  // beauty
  { ...createMockPost({ category: "other", subcategory: "beauty", created_at: daysAgo(13), updated_at: daysAgo(13) }),
    title: "成分党入门 — 美妆个护不用被柜姐忽悠，看这7个成分就够了",
    content: `<p>研究了护肤品成分半年之后才发现，以前花的90%的钱都是智商税。分享一下美妆个护的入门知识：</p>
<p><strong>必看的7个成分</strong>：</p>
<ul><li>视黄醇（Retinol）— 抗老黄金标准，但需建立耐受。从0.1%开始</li><li>烟酰胺（Niacinamide）— 控油+修护屏障，几乎人人适用</li><li>维生素C（Ascorbic Acid）— 抗氧化+提亮，早上用效果最好</li><li>水杨酸（Salicylic Acid）— 疏通毛孔，油痘皮神器</li><li>透明质酸（Hyaluronic Acid）— 补水但不锁水，需要叠加面霜</li><li>神经酰胺（Ceramide）— 屏障修复，敏感肌必备</li><li>壬二酸（Azelaic Acid）— 淡痘印+控油，温和且有效</li></ul>
<p><strong>最重要的原则</strong>：不是成分越贵越好，而是<strong>浓度和配方决定效果</strong>。一款¥50含5%烟酰胺的精华，可能比¥800含0.5%的效果好十倍。</p>
<p>另外，防晒是最好的护肤品。不用SPF30+的防晒，前面所有步骤都白搭。</p>` },
  // furniture
  { ...createMockPost({ category: "other", subcategory: "furniture", created_at: daysAgo(9), updated_at: daysAgo(8) }),
    title: "租房改造 — 3000块把空房间变成了「日系家居治愈小窝」",
    content: `<p>搬进新租的房子时，感觉像住进了医院——白墙、白瓷砖、白光灯。花了两个月和3000块，终于有了家的感觉。</p>
<p><strong>家居花费明细</strong>：</p>
<ul><li>暖色落地灯x2 + 台灯：¥300</li><li>大地色窗帘（遮光）：¥150</li><li>原木色置物架x3：¥200</li><li>大地毯（2mx3m）：¥350 — 这是改变最大的单品！</li><li>绿植x5（龟背竹、琴叶榕等）+ 花盆：¥250</li><li>装饰画/海报x4 + 画框：¥200</li><li>沙发巾 + 抱枕套x4：¥200</li><li>杂项（收纳盒、挂钩、LED灯带等）：¥350</li></ul>
<p><strong>核心原则</strong>：统一色调（米色+原木色+绿色），灯光用暖色（3000K-3500K），添加软材质（地毯、抱枕、窗帘）来中和硬装。</p>
<p>朋友来家里都说「这真的是租的房子吗」。其实只要花一点心思和不太多的钱，租房也可以住出归属感。</p>` },
]

// ── 汇总所有帖子 ──
const ALL_POSTS = [...DINING_POSTS, ...MEDIA_POSTS, ...LEISURE_POSTS, ...FREE_POSTS, ...OTHER_POSTS]

// ── 评论内容池 ──
const COMMENT_POOL = [
  "写得真好，被种草了！下次一定要去试试",
  "同感，我也去过这家，确实不错。补充一点：他们家的甜品也很惊喜",
  "作为一个业内人士，补充一下背景：这个领域近两年变化很快，lz提到的趋势确实在加速",
  "用心写评价的人太少了，赞一个",
  "写得客观中肯，不过我个人对XX的看法不太一样，可能是因为口味差异",
  "请问需要提前预约吗？还是直接去就行？",
  "看完想去！另外问一下人均大概多少？",
  "这个角度之前没想过，很有启发",
  "赞同。现在确实太多水军了，真实的评价太珍贵",
  "有些不同看法：我觉得lz过于乐观了，实际情况可能要复杂一些",
  "感谢分享！已收藏",
  "三个月前也去过一次，体验基本一致。补充：周末人多，建议工作日去",
  "作为一个当地人，lz写得非常准确了。欢迎再来！",
  "已加入清单！感谢这么详细的攻略",
  "写得很有意思。不过有一点想纠正：XXX其实是这样……",
  "看饿了，明天就去",
  "深度好文，值得反复读。尤其是关于XXX那段，说得太好了",
  "虽然没去过，但从lz的描述中仿佛看到了画面。期待更多这样的内容",
  "关注了。终于找到了一个认真写评价的人",
  "写的很真实，不吹不黑，就是这种态度",
  "有点想反驳第二点，不过整体同意你的判断",
  "楼主文笔真好，请问是做什么工作的？",
  "同款经历！我也是从XXX转过来的，感同身受",
  "其实还有一个隐藏的细节lz没提到：XXX。这是我当时最大的惊喜",
  "不太同意。我去了两次都很一般，可能品控不稳定？",
]

// ── 种子函数 ──

export function seed() {
  clearStore()

  // 1. 创建用户
  const users: MockUser[] = [
    // 管理员（显式凭据，可登录）
    createMockUser({ user_id: "1001", nickname: "管理员老蓝", user_level: 5, is_staff: true,
      phone_hash: "hash_phone_13900000101", username_norm: "admin_lan", password_hash: "Admin123!" }),
    createMockUser({ user_id: "1002", nickname: "审核员小夏", user_level: 5, is_staff: true,
      phone_hash: "hash_phone_13900000102", username_norm: "admin_xia", password_hash: "Admin123!" }),
    // 活跃发帖用户 (L5)
    createMockUser({ nickname: NICKNAMES[0], user_level: 5, bio: BIOS[0],
      phone_hash: "hash_phone_13900000205", username_norm: "demo_l5", password_hash: "Test1234!" }),
    createMockUser({ nickname: NICKNAMES[1], user_level: 5, bio: BIOS[1] }),
    createMockUser({ nickname: NICKNAMES[2], user_level: 5, bio: BIOS[2] }),
    createMockUser({ nickname: NICKNAMES[3], user_level: 5, bio: BIOS[3] }),
    createMockUser({ nickname: NICKNAMES[4], user_level: 5, bio: BIOS[4] }),
    createMockUser({ nickname: NICKNAMES[5], user_level: 5, bio: BIOS[5] }),
    // 中级用户 (L3-L4)
    createMockUser({ nickname: NICKNAMES[6], user_level: 4, bio: BIOS[6],
      phone_hash: "hash_phone_13900000204", username_norm: "demo_l4", password_hash: "Test1234!" }),
    createMockUser({ nickname: NICKNAMES[7], user_level: 3, bio: BIOS[7],
      phone_hash: "hash_phone_13900000203", username_norm: "demo_l3", password_hash: "Test1234!" }),
    createMockUser({ nickname: NICKNAMES[8], user_level: 3, bio: BIOS[8] }),
    createMockUser({ nickname: NICKNAMES[9], user_level: 4, bio: BIOS[9] }),
    createMockUser({ nickname: NICKNAMES[10], user_level: 3, bio: null }),
    createMockUser({ nickname: NICKNAMES[11], user_level: 3, bio: null }),
    // 普通用户 (L1-L2)
    createMockUser({ nickname: NICKNAMES[12], user_level: 1, bio: null,
      phone_hash: "hash_phone_13900000201", username_norm: "demo_l1", password_hash: "Test1234!" }),
    createMockUser({ nickname: NICKNAMES[13], user_level: 2, bio: null,
      phone_hash: "hash_phone_13900000202", username_norm: "demo_l2", password_hash: "Test1234!" }),
    createMockUser({ nickname: NICKNAMES[14], user_level: 1, bio: null }),
    createMockUser({ nickname: NICKNAMES[15], user_level: 2, bio: null }),
    createMockUser({ nickname: NICKNAMES[16], user_level: 1, bio: "刚注册，还在学习怎么写评价" }),
    createMockUser({ nickname: NICKNAMES[17], user_level: 2, bio: null }),
  ]

  for (const u of users) {
    store.users.set(u.user_id, u)
  }

  const posterIds = users.filter(u => u.user_level >= 5 || u.user_level >= 3).map(u => u.user_id)
  const allUserIds = users.map(u => u.user_id)
  const adminIds = ["1001", "1002"]

  // 为管理员创建 session
  for (const aid of adminIds) {
    store.sessions.set(aid, [createMockSession({ user_id: aid })])
  }

  // 2. 分配帖子作者 + 图片
  for (let i = 0; i < ALL_POSTS.length; i++) {
    const post = ALL_POSTS[i]
    post.author_id = posterIds[i % posterIds.length]

    const imgCount = 1 + Math.floor(Math.random() * 3)
    const images: string[] = []
    for (let j = 0; j < imgCount; j++) {
      images.push(postImage(i, j))
    }
    post.images = images

    store.posts.set(post.post_id, post)
  }

  // 3. 为每个帖子生成评论
  for (const post of ALL_POSTS) {
    const commentCount = 2 + Math.floor(Math.random() * 3)
    const postComments: MockComment[] = []

    for (let j = 0; j < commentCount; j++) {
      const authorId = allUserIds[Math.floor(Math.random() * allUserIds.length)]
      const content = COMMENT_POOL[Math.floor(Math.random() * COMMENT_POOL.length)]
      const comment = createMockComment({
        post_id: post.post_id,
        author_id: authorId,
        content,
        agree_count: Math.floor(Math.random() * 15),
        disagree_count: Math.floor(Math.random() * 3),
      })
      postComments.push(comment)
      store.comments.set(comment.comment_id, comment)
    }

    if (postComments.length >= 2 && Math.random() < 0.3) {
      const lastComment = postComments[postComments.length - 1]
      const quoteTarget = postComments[Math.floor(Math.random() * (postComments.length - 1))]
      lastComment.quote_comment_id = quoteTarget.comment_id
    }
  }

  // 4. 为每个帖子生成打分
  for (const post of ALL_POSTS) {
    const scoreCount = 3 + Math.floor(Math.random() * 6)
    const scorers = new Set<string>()
    const scores: MockScore[] = []

    for (let k = 0; k < scoreCount; k++) {
      let scorerId: string
      do {
        scorerId = allUserIds[Math.floor(Math.random() * allUserIds.length)]
      } while (scorers.has(scorerId))
      scorers.add(scorerId)

      scores.push(createMockScore(post.post_id, scorerId))
    }

    if (Math.random() < 0.5) {
      scores.push(createMockScore(post.post_id, post.author_id, 85 + Math.floor(Math.random() * 16)))
    }

    store.scores.set(post.post_id, scores)
  }

  // 5. 为部分用户添加收藏
  for (const userId of allUserIds.slice(0, 8)) {
    const favs = new Set<string>()
    const postIds = ALL_POSTS.filter(() => Math.random() < 0.15).map(p => p.post_id)
    for (const pid of postIds) favs.add(pid)
    store.favorites.set(userId, favs)
  }

  // 6. 为部分用户添加订阅
  for (const userId of allUserIds.slice(0, 6)) {
    const subs = new Set<string>()
    const targets = posterIds.filter(() => Math.random() < 0.2)
    for (const tid of targets) {
      if (tid !== userId) subs.add(tid)
    }
    store.subscriptions.set(userId, subs)
  }

  console.log(`[mock] Seeded: ${store.users.size} users, ${store.posts.size} posts, ${store.comments.size} comments`)
}
