// AI小游戏的网页版：直接搬运 ai-games/ 文件夹里的4个完整程序。
// 这里是真·交互式的：点"开始游戏"，程序问什么就在下面输入框回答什么，一步步自己探索怎么玩。
// 代码默认收起来，点"查看代码"才展开——先玩，好奇了再去看AI是怎么实现的。

const LEVELS = [
  {
    id: 1,
    icon: "🔢",
    title: "游戏1：AI 猜数字",
    explain: `
      <p>你心里想一个 1-100 的数字，别告诉AI。AI 每次猜一个数，你告诉它"大了"还是"小了"，
      它很快就能猜中——这就是"二分查找"，很多AI做决策时用的基本思路。</p>
      <p>AI猜完之后会反过来：它心里想一个数字，换你来猜。猜完对比一下双方各用了几次，
      就能直观感受到"每次都猜正中间"这个策略到底有多高效。</p>
      <p>点"开始游戏"，然后跟着提示一步步回答就行。</p>
    `,
    code: `import random


def ai_guess_number():
    print("请在心里想一个 1 到 100 之间的数字，别告诉我！")
    input("想好了按回车继续...")

    low, high = 1, 100
    guess_count = 0

    while low <= high:
        guess = (low + high) // 2
        guess_count += 1
        print(f"\\n第 {guess_count} 次猜测：{guess}")
        answer = input("这个数字是 (太大/太小/对了)？请输入 大/小/对：").strip()

        if answer == "对":
            print(f"\\n太棒了！AI 用了 {guess_count} 次就猜中了！")
            print("秘诀：每次都猜中间值，然后排除掉一半的可能性——")
            print("这叫'二分查找'，很多AI系统在做决策、搜索答案时都用类似的思路。")
            return guess_count
        elif answer == "大":
            high = guess - 1
        elif answer == "小":
            low = guess + 1
        else:
            print("请输入 大/小/对 哦")
            guess_count -= 1

    print("咦，好像数字不在范围内，是不是输错了？")
    return guess_count


def you_guess_number():
    secret = random.randint(1, 100)
    your_count = 0
    print("\\n换你来猜！AI 心里想好了一个 1 到 100 之间的数字，轮到你来猜它。")

    while True:
        raw = input("你猜（1-100之间的数字）：").strip()
        if not raw.isdigit():
            print("请输入一个数字哦")
            continue
        guess = int(raw)
        if guess < 1 or guess > 100:
            print("请输入 1-100 之间的数字")
            continue
        your_count += 1
        if guess == secret:
            print(f"\\n猜对了！你用了 {your_count} 次。")
            return your_count
        elif guess < secret:
            print("小了")
        else:
            print("大了")


ai_count = ai_guess_number()
your_count = you_guess_number()

print("\\n--- 对比一下 ---")
print(f"AI 猜你的数字用了 {ai_count} 次，你猜 AI 的数字用了 {your_count} 次。")
if your_count <= ai_count:
    print("你也用上了二分法的思路（每次都猜中间附近），效率跟AI差不多！")
else:
    print("提示：如果每次都猜'当前范围的正中间'，最多7次就能在1到100之间猜中任何数字——")
    print("这就是AI刚才用的策略，试试下次也用这个思路。")`,
    hint: `AI第一次总是猜(1+100)//2=50。如果你想的数比50小就回答"大"（意思是AI猜大了），比50大就回答"小"。
轮到你猜AI的数字时，也试试同样的技巧：每次都猜"当前范围的正中间"，最多7次就能猜中任何1-100之间的数。`,
    walkthrough: [
      { lines: [1, 1], note: `待会儿"反过来轮到你猜"这个环节，AI要偷偷想一个秘密数字，需要用到这个内置模块来随机抽。` },
      { lines: [4, 6], note: `定义AI猜你数字的逻辑——跟之前一样，先让你心里想好数字，input()只是等你按一下回车。` },
      { lines: [8, 9], note: `设定猜测范围的上下界，再记一下总共猜了几次——二分法的起点。` },
      { lines: [11, 15], note: `只要范围还没缩没了就继续猜：永远猜"当前范围的正中间"，计数+1，然后读你的反馈（"大"/"小"/"对"）。` },
      { lines: [17, 21], note: `猜中了：打印结果和"这就是二分法"的讲解，把猜了几次通过 return 带出去——待会儿要拿这个数字跟你自己猜的次数做对比。` },
      { lines: [22, 23], note: `你说AI猜大了，说明真正的数字比guess小，把上界收缩到guess-1。` },
      { lines: [24, 25], note: `同理，猜小了就把下界往上收缩。` },
      { lines: [26, 28], note: `如果你打的不是"大/小/对"这三个词，提示重新输入，同时把计数减回去——这一次不该算数。` },
      { lines: [30, 31], note: `理论上不该走到这里（1到100之间二分法一定能猜中），只是防御性地兜个底，同样把计数带出去。` },
      { lines: [34, 37], note: `定义"反过来"的逻辑：AI偷偷想一个1-100之间的秘密数字，不会让你看到，然后告诉你轮到你猜了。` },
      { lines: [39, 43], note: `一直问你猜多少，直到猜中为止；如果输入的不是数字，提示重新输入。` },
      { lines: [44, 47], note: `把文字转成数字，顺便检查是不是在1-100范围内，不在的话也提示重新输入。` },
      { lines: [48, 51], note: `每猜一次计数+1；猜中了就把总共猜了几次通过 return 带出去。` },
      { lines: [52, 55], note: `没猜中就告诉你是猜小了还是猜大了，你可以照着这个反馈调整下一次要猜的数字。` },
      { lines: [58, 59], note: `真正开始玩：先让AI猜你的数字，再反过来让你猜AI的数字，两边各用了几次都记下来。` },
      { lines: [61, 62], note: `把双方的次数摆出来对比。` },
      { lines: [63, 67], note: `如果你用的次数不比AI多，说明你也无意中用上了"猜正中间"这个二分法技巧；用得比AI多的话，直接把这个技巧点出来，方便你下次试试。` },
    ],
  },
  {
    id: 2,
    icon: "💬",
    title: "游戏2：简单聊天机器人",
    explain: `
      <p>跟一个"AI"聊天试试。它其实没有真的"理解"你说的话，只是在 <code>RULES</code>
      这个字典里找关键词匹配。早期的AI聊天机器人（还有很多简单客服机器人）就是这么工作的。</p>
      <p>连续两次它都没听懂（触发了兜底回复），它会主动请你教它一条新规则——
      告诉它关键词和你想要的回复，它当场就学会了。这不是真的"理解"，只是多记了一条规则。</p>
      <p>输入什么都行，输入包含"再见"两个字的内容就会结束对话。</p>
    `,
    code: `import random

# 规则表：关键词 -> 可能的回复（可以自己加更多规则！）
RULES = {
    "你好": ["你好呀！", "嗨，很高兴见到你！"],
    "名字": ["我是你自己写的AI聊天机器人，还没有名字，你来给我起一个？"],
    "AI": ["AI就是让电脑做出'像是会思考'的事情，其实很多时候是靠规则和数据。"],
    "无聊": ["要不要试试猜数字游戏？我觉得挺好玩的。"],
    "再见": ["下次再聊！"],
}

DEFAULT_REPLIES = [
    "嗯嗯，然后呢？",
    "这个我还不太懂，能换个说法吗？",
    "有意思，继续说说看。",
]


def get_reply(user_input):
    for keyword, replies in RULES.items():
        if keyword in user_input:
            return random.choice(replies)
    return random.choice(DEFAULT_REPLIES)


def learn_new_rule():
    print("机器人：我连续两次都没听懂……要不你教我一个规则？")
    keyword = input("你觉得哪个词是关键词（直接打这个词）：").strip()
    if not keyword:
        print("机器人：好吧，那先跳过，我们继续聊～")
        return False
    reply = input(f"以后看到含有'{keyword}'的话，你希望我怎么回：").strip()
    if not reply:
        print("机器人：好吧，那先跳过，我们继续聊～")
        return False
    RULES[keyword] = [reply]
    print(f"机器人：学会了！以后看到'{keyword}'我就会这样回你。")
    return True


def chat():
    print("聊天机器人已启动！连续两次没听懂的话，它会主动请你教一条新规则。输入'再见'结束聊天。\\n")
    miss_streak = 0
    taught_count = 0
    while True:
        user_input = input("你：")
        reply = get_reply(user_input)
        print(f"机器人：{reply}")
        if "再见" in user_input:
            break

        if reply in DEFAULT_REPLIES:
            miss_streak += 1
        else:
            miss_streak = 0

        if miss_streak >= 2:
            if learn_new_rule():
                taught_count += 1
            miss_streak = 0

    print(f"\\n这一局你教会了机器人 {taught_count} 条新规则。")
    print("提示：机器人根本不'理解'你说的话，只是在 RULES 这个字典里")
    print("找有没有匹配的关键词。刚才教它的规则也是这个原理——它没有真的学会'理解'，")
    print("只是多记了几条'看到这个词就这样回'的规则。")


chat()`,
    hint: `试试打"你好"、"你叫什么名字"、"AI"、"无聊"，看看会不会触发不一样的回复；再连续打两句它接不住的话（比如随便打几个不相关的字），看它会不会主动请你教规则；最后打"再见"结束。`,
    walkthrough: [
      { lines: [1, 1], note: `待会儿要从"多个可能的回复"里随机选一句，需要用到这个内置模块。` },
      { lines: [3, 10], note: `整个机器人的"知识库"：键是关键词，值是"看到这个词可能回复的话"（可以不止一句，随机挑一句，也可以自己加更多规则）。` },
      { lines: [12, 16], note: `如果你说的话一个关键词都没命中，就从这里随便回你一句，不会卡住答不上来——待会儿也会用这份列表判断"这次是不是没听懂"。` },
      { lines: [19, 23], note: `跟原来一样：逐个检查RULES里的每一个关键词，命中就随机挑一句回复；一个都没命中就返回默认回复。` },
      { lines: [26, 38], note: `新增的"教学"逻辑：先问关键词，再问希望听到这个关键词时怎么回复——两个都填了才真正写进RULES字典，返回True告诉外面"这次真的学会了一条"；随便一个没填就跳过，返回False。` },
      { lines: [41, 45], note: `定义整个对话流程，开场白提到了"连续两次没听懂会主动请教"这个新行为；miss_streak记连续没命中几次，taught_count记教会了几条新规则；然后无限循环，每一轮都等你打字。` },
      { lines: [46, 50], note: `读你的话、挑一句回复打印出来；说"再见"就跳出循环，结束整场对话。` },
      { lines: [52, 55], note: `判断刚才这句回复是不是从DEFAULT_REPLIES里选出来的——如果是，说明这次一个关键词都没命中，连续没命中的计数+1；命中过规则就清零，重新计数。` },
      { lines: [57, 60], note: `连续没命中够2次，就触发"教学"环节；真的教成功了（返回True）才把taught_count加1，然后不管教没教成功都把计数清零，避免teach完马上又立刻重复弹出来。` },
      { lines: [62, 65], note: `对话结束，报告这一局教会了几条规则，再次点明"这不是真的理解，只是多记了几条规则"这个核心道理——刚才教它的新规则也是同一个原理，不是它突然"变聪明"学会理解了。` },
      { lines: [68, 68], note: `真正开始运行整个对话，前面都只是定义。` },
    ],
  },
  {
    id: 3,
    icon: "✊",
    title: "游戏3：会学习的石头剪刀布",
    explain: `
      <p>这个AI只看你"最近5局"出的招数，猜你接下来最可能出哪个，然后专门克制它——不是记全部历史，
      是"最近的更重要"。多打几局，你会发现它越来越难赢；如果你中途突然换一种打法，也会发现AI没法
      马上跟上，得再攒够5局新数据才会调整过来。</p>
      <p>每次输入"石头"/"剪刀"/"布"出一拳，输入"退出"结束游戏。</p>
    `,
    code: `import random

CHOICES = ["石头", "剪刀", "布"]
BEATS = {"石头": "剪刀", "剪刀": "布", "布": "石头"}  # key 能赢 value
WINDOW_SIZE = 5  # 只看最近5局，而不是从头到尾全部历史


def counter_move(predicted):
    """算出能打败 predicted 的招数"""
    for move, loses_to in BEATS.items():
        if loses_to == predicted:
            return move
    return random.choice(CHOICES)


def most_common(moves):
    """数一下这份出拳记录里，哪个招数出现次数最多"""
    counts = {"石头": 0, "剪刀": 0, "布": 0}
    for move in moves:
        counts[move] += 1
    return max(counts, key=counts.get)


def play():
    recent_moves = []  # 只留最近WINDOW_SIZE局，模拟"最近的行为更重要"
    ai_score, you_score = 0, 0
    rounds = 0

    print(f"石头剪刀布！AI 会记住你最近 {WINDOW_SIZE} 局的出拳习惯来预测你。输入'退出'结束。\\n")

    while True:
        user_move = input("你出（石头/剪刀/布）：").strip()
        if user_move == "退出":
            break
        if user_move not in CHOICES:
            print("请输入 石头/剪刀/布 哦")
            continue

        rounds += 1

        # 数据不够WINDOW_SIZE局之前，AI还没法预测，就随便出
        if len(recent_moves) < WINDOW_SIZE:
            ai_move = random.choice(CHOICES)
        else:
            predicted = most_common(recent_moves)
            ai_move = counter_move(predicted)

        recent_moves.append(user_move)
        if len(recent_moves) > WINDOW_SIZE:
            recent_moves.pop(0)  # 只留最近WINDOW_SIZE局，太老的记录直接丢掉

        print(f"AI出：{ai_move}")

        if user_move == ai_move:
            print("平局！")
        elif BEATS[user_move] == ai_move:
            print("你赢了！")
            you_score += 1
        else:
            print("AI赢了！")
            ai_score += 1

        print(f"比分——你：{you_score}  AI：{ai_score}\\n")

    print(f"\\n你最近 {len(recent_moves)} 局的出拳：{recent_moves}")
    print(f"发现了吗？AI 只看你'最近 {WINDOW_SIZE} 局'出过什么，不是从头到尾的全部历史——")
    print("这样即使你中途改变习惯，AI也能跟着调整过来，而不是被你很久以前的老习惯拖着走。")
    print("这就是'从数据中学习规律'的简单例子——真实的AI用的数据量更大，方法更复杂，但思路是相通的。")
    if rounds > 0:
        print("__GAME_OUTCOME__:WIN" if you_score >= ai_score else "__GAME_OUTCOME__:LOSE")


play()`,
    hint: `攒够5局之前AI是瞎猜的，从第6局开始才会用"最近5局"预测。想赢AI，就连续出好几次同一个招数，等它开始预测之后，突然换一种打法，观察它要几局才会跟上。`,
    walkthrough: [
      { lines: [1, 1], note: `导入random模块——AI在没攒够数据的时候要随便出拳，得靠它来"掷骰子"。` },
      { lines: [3, 5], note: `所有合法的出拳选项，"谁克制谁"的规则，再加一个新常量WINDOW_SIZE：只往前数最近5局，不是全部历史。` },
      { lines: [8, 13], note: `"反推"逻辑不变：如果预测你会出剪刀，就要找"谁能赢剪刀"——遍历BEATS字典，找到"值等于剪刀"的那一项，它的键就是答案。` },
      { lines: [16, 21], note: `新增的小工具：数一下一份出拳记录（不管是全部历史还是最近几局）里，石头/剪刀/布各出现了几次，返回出现最多的那个——这是"预测"的核心计算，抽出来单独写是因为待会儿要专门喂给它"最近5局"这一小份数据。` },
      { lines: [24, 29], note: `把整局游戏的逻辑都装进这个函数里；recent_moves改成一个列表（不再是累加总数的字典），只留最近的记录；开场白也改成提示"最近5局"。` },
      { lines: [31, 37], note: `每一轮先问你出什么，退出/容错跟原来一样。` },
      { lines: [39, 46], note: `记一下打了第几轮；数据攒够WINDOW_SIZE局之前AI还没法预测就随便出，攒够了就用"最近5局"算出预测，再找能克制它的招数。` },
      { lines: [48, 50], note: `"滑动窗口"的核心：把这一轮你出的招数加进recent_moves，但只留最近WINDOW_SIZE条——超过了就把最老的一条丢掉，这样AI永远只根据"最近的行为"预测，不会被很久以前的老习惯拖着走。` },
      { lines: [52, 52], note: `把AI这一轮出的招数打印出来，让你马上能对比输赢。` },
      { lines: [54, 63], note: `用最开始定义的BEATS规则判断这一轮到底是谁赢，更新比分，每一轮结束都亮一下比分。` },
      { lines: [65, 68], note: `游戏结束后亮出"最近几局"的记录（不再是全部历史的总数统计），点明AI这次靠的是"看最近的行为"，好处是你中途换打法它也能跟着调整，不会被老习惯拖着走。` },
      { lines: [69, 70], note: `打完至少1局才判断输赢：你的分数不低于AI就算赢，打印一个只有代码自己认识的"暗号"，页面看到这个暗号才会放庆祝的礼花——真的打赢了才庆祝，不是随便跑完代码就庆祝。` },
      { lines: [73, 73], note: `前面全是定义，这一行才是真正开始跑游戏的地方。` },
    ],
  },
  {
    id: 4,
    icon: "🧠",
    title: "游戏4：迷你神经元",
    explain: `
      <p>这是简化到极致的"神经网络"——一个神经元，通过不断对比"猜的答案"和"正确答案"，
      一点点调整权重，学会判断 AND / OR 逻辑。这是ChatGPT这类AI底层原理的最简版本。</p>
      <p>输入 <code>1</code> 训练 AND 逻辑，输入 <code>2</code> 训练 OR 逻辑，输入 <code>3</code>
      挑战一下：训练 XOR 逻辑。权重是随机初始化的，每次训练过程可能不完全一样，这是正常的——
      但XOR不管练多少轮都学不会，这不是运气问题，是单个神经元数学上的天花板。</p>
    `,
    code: `import random

# 训练数据：AND 逻辑（两个都是1，结果才是1）
TRAINING_DATA_AND = [
    ([0, 0], 0),
    ([0, 1], 0),
    ([1, 0], 0),
    ([1, 1], 1),
]

# 训练数据：OR 逻辑（只要有一个是1，结果就是1）
TRAINING_DATA_OR = [
    ([0, 0], 0),
    ([0, 1], 1),
    ([1, 0], 1),
    ([1, 1], 1),
]

# 训练数据：XOR 逻辑（两个不一样才是1，一样就是0）——待会儿会看到，这个逻辑
# 单个神经元无论怎么训练都学不会，这不是bug，是数学上真的不可能。
TRAINING_DATA_XOR = [
    ([0, 0], 0),
    ([0, 1], 1),
    ([1, 0], 1),
    ([1, 1], 0),
]


def predict(inputs, weights, bias):
    total = sum(i * w for i, w in zip(inputs, weights)) + bias
    return 1 if total > 0 else 0


def train(data, epochs=20, learning_rate=0.1):
    weights = [random.uniform(-1, 1) for _ in range(2)]
    bias = random.uniform(-1, 1)

    print(f"初始权重：{[round(w, 2) for w in weights]}，初始偏移：{round(bias, 2)}\\n")

    for epoch in range(1, epochs + 1):
        total_errors = 0
        for inputs, correct_answer in data:
            guess = predict(inputs, weights, bias)
            error = correct_answer - guess

            if error != 0:
                total_errors += 1
                for i in range(len(weights)):
                    weights[i] += learning_rate * error * inputs[i]
                bias += learning_rate * error

        print(f"第 {epoch} 轮训练：错误次数 {total_errors}，"
              f"权重 {[round(w, 2) for w in weights]}，偏移 {round(bias, 2)}")

        if total_errors == 0:
            print(f"\\n第 {epoch} 轮就学会了！提前结束训练。")
            break

    return weights, bias


def test(data, weights, bias):
    print("\\n--- 测试结果 ---")
    all_correct = True
    for inputs, correct_answer in data:
        guess = predict(inputs, weights, bias)
        result = "正确" if guess == correct_answer else "错误"
        if guess != correct_answer:
            all_correct = False
        print(f"输入 {inputs} -> AI猜：{guess}，正确答案：{correct_answer} ({result})")
    return all_correct


DATASETS = {
    "1": ("AND", TRAINING_DATA_AND),
    "2": ("OR", TRAINING_DATA_OR),
    "3": ("XOR", TRAINING_DATA_XOR),
}

print("选择要训练的逻辑：1 = AND（并且），2 = OR（或者），3 = XOR（不一样才是1，挑战一下神经元的极限）")
choice = input("输入 1、2 或 3：").strip()
name, data = DATASETS.get(choice, DATASETS["1"])

print(f"\\n开始训练神经元学习 {name} 逻辑...\\n")
weights, bias = train(data)
all_correct = test(data, weights, bias)

if name == "XOR":
    print("\\n发现了吗？不管练多少轮，这个神经元始终学不会XOR——这不是运气不好，是数学上真的不可能：")
    print("AND和OR都能画一条直线把'该输出1'和'该输出0'的点分开，XOR不管怎么画都分不开一条直线两边。")
    print("这就是单个神经元的天花板——真实的AI（比如神经网络）靠的是把很多个神经元叠成好几层，")
    print("一层负责画一条线，好几层叠起来就能画出弯曲的边界，这样才能学会XOR这种更复杂的规律。")
else:
    print("\\n提示：这个神经元一开始权重是瞎猜的（随机数），")
    print("每次猜错就往'正确方向'调整一点点权重，猜的次数够多，它就学会规律了。")
    print("真实的AI（比如神经网络）原理类似，只是有几十亿个这样的神经元一起工作。")
    print("__GAME_OUTCOME__:WIN" if all_correct else "__GAME_OUTCOME__:LOSE")`,
    hint: `输入 1 训练AND逻辑，输入 2 训练OR逻辑。想看AI的极限在哪，输入 3 训练XOR——练多少轮都学不会才是正常的，这正是这一关想让你看到的。`,
    walkthrough: [
      { lines: [1, 1], note: `导入random模块——用来生成一开始的随机权重和偏移，让神经元不是从0开始，而是"瞎猜"起步。` },
      { lines: [3, 9], note: `训练数据：每一条是"两个输入 -> 正确答案该是什么"。AND逻辑要两个都是1才算1。` },
      { lines: [11, 17], note: `OR逻辑的训练数据：只要有一个是1，结果就该是1。` },
      { lines: [19, 26], note: `新增的XOR训练数据：两个不一样才算1，一样（都是0或都是1）就算0——注释先提前预告了一句：这个逻辑单个神经元学不会，不是bug，是数学上真的不可能。` },
      { lines: [29, 31], note: `神经元最核心的计算：把每个输入乘上对应的权重再加起来，再加上一个偏移值bias，总和大于0就猜"1"，否则猜"0"——这就是神经元做"决策"的方式。` },
      { lines: [34, 36], note: `训练函数：epochs是要训练多少轮，learning_rate是每次调整权重的"步子"大小；一开始权重和偏移都是瞎猜的随机数。` },
      { lines: [38, 38], note: `训练开始前先亮一下初始的随机权重，方便你对比训练前后到底变了多少。` },
      { lines: [40, 44], note: `反复训练很多轮（默认20轮），每一轮都要看一遍全部训练数据：用现在的权重猜一下，再算跟正确答案差多少。` },
      { lines: [46, 50], note: `猜错了才调整：往"能减小误差"的方向，小幅度修正权重和偏移——这就是"学习"的本质，错了就往对的方向挪一点点，不是一步到位。` },
      { lines: [52, 53], note: `每训练一轮就打印这一轮的错误次数和当前权重，能直观看到数字在慢慢变准（XOR的话会发现错误次数一直降不到0）。` },
      { lines: [55, 57], note: `如果这一整轮全部猜对了，说明学会了，提前结束训练，不用再浪费轮数——但XOR永远走不到这一步，会老老实实跑完全部20轮。` },
      { lines: [59, 59], note: `训练结束，把学到的权重和偏移交出去，后面测试要用到。` },
      { lines: [62, 71], note: `测试函数：用同样的数据再测一遍，先假设"全对"，只要有一条猜错就把这个假设推翻，最后把"是不是全对"交出去。` },
      { lines: [74, 78], note: `新增的字典：把输入的编号（1/2/3）对应到"这个逻辑叫什么名字"和"用哪份训练数据"——比原来一串if/else更容易加新选项，这次多出来的XOR就是这么加进去的。` },
      { lines: [80, 82], note: `提示文字加上了新的XOR选项，读取你的选择，从字典里查出对应的名字和数据（如果输入的不是1/2/3，默认按AND处理，不会报错）。` },
      { lines: [84, 86], note: `真正开始训练、测试，并且记住测试结果是不是全对——前面全是定义好的工具函数，这里才是真正执行的地方。` },
      { lines: [88, 92], note: `新增的揭示逻辑：如果刚才训练的是XOR，不管练得怎么样都直接告诉你真相——这不是练得不够，是AND/OR能画一条直线分开两类点，XOR不管怎么画都分不开，这就是单个神经元的数学天花板，真实AI要叠很多层神经元才能学会这种更复杂的规律。` },
      { lines: [93, 97], note: `AND/OR的收尾逻辑不变：总结"随机起步、猜错就微调"这个学习的本质，打印一个只有代码自己认识的"暗号"，报告这次是不是真的100%学会了——页面看到"全对"这个暗号才会放庆祝的礼花。` },
    ],
  },
  {
    id: 5,
    icon: "🍎",
    title: "游戏5：AI水果分类器（排除法猜水果）",
    explain: `
      <p>这个AI认识的水果一开始有9种：苹果、香蕉、草莓、西瓜、樱桃、葡萄、橙子、菠萝、荔枝。它用的是
      "排除法"——每问一个特征（颜色、形状、大小、表皮有没有刺、是不是成串长……），就把不符合
      的水果从候选名单里排除掉，问到只剩一个候选，就是它的答案。像樱桃和荔枝，颜色、形状、大小
      都一样，得靠"表皮有没有刺"才能分清；橙子和西瓜也很像，得靠"是不是长在树上"才能分清。</p>
      <p>如果候选一开始就只剩一个，AI很快就能猜出来，不会把6个问题都问一遍；如果猜错了，或者
      问遍了所有特征还是筛不出唯一答案，AI会把剩下没问到的特征也补问完，再请你告诉它真正的水果是
      什么，然后把这个新水果记进自己认识的名单——下次再遇到就认识了，这就是"从错误里学习"。</p>
    `,
    code: `# AI水果分类器：这次AI认识9种真实水果，会用"排除法"一步步问问题——
# 每问一个特征，就把不符合的水果排除掉，直到只剩一个候选，就是答案。
# 如果猜错了或者猜不出来，告诉它正确答案，它会把这个新水果学进去，之后就认识了。

FRUITS = [
    {"name": "苹果", "红": True,  "圆": True,  "大": True,  "刺": False, "串": False, "树": True},
    {"name": "香蕉", "红": False, "圆": False, "大": True,  "刺": False, "串": True,  "树": True},
    {"name": "草莓", "红": True,  "圆": False, "大": False, "刺": False, "串": False, "树": False},
    {"name": "西瓜", "红": False, "圆": True,  "大": True,  "刺": False, "串": False, "树": False},
    {"name": "樱桃", "红": True,  "圆": True,  "大": False, "刺": False, "串": True,  "树": True},
    {"name": "葡萄", "红": False, "圆": True,  "大": False, "刺": False, "串": True,  "树": False},
    {"name": "橙子", "红": False, "圆": True,  "大": True,  "刺": False, "串": False, "树": True},
    {"name": "菠萝", "红": False, "圆": False, "大": True,  "刺": True,  "串": False, "树": False},
    {"name": "荔枝", "红": True,  "圆": True,  "大": False, "刺": True,  "串": True,  "树": True},
]

# 每个特征配一句问话——顺序也是排除的顺序，先问区分度高的特征
QUESTIONS = [
    ("红", "这个水果是红色的吗？"),
    ("圆", "是圆形的吗？"),
    ("大", "个头比乒乓球大吗？"),
    ("刺", "表皮上有没有刺或者凸起的小颗粒？"),
    ("串", "平时是不是一串一串/一簇一簇长在一起的？"),
    ("树", "是长在树上的吗？"),
]


def ask_yes_no(question):
    return input(question + "（输入 是/否）：").strip() == "是"


def ask_remaining_features(answers):
    """把这一轮还没问过的特征问题补问完，凑齐完整的6个特征答案，方便待会儿录入新水果。"""
    for feature, question in QUESTIONS:
        if feature not in answers:
            answers[feature] = ask_yes_no(question)
    return answers


def learn_new_fruit(answers):
    real_name = input("你能直接告诉我这是什么水果吗（说出它的名字）？").strip()
    if not real_name:
        print("好吧，那这次先算了。")
        return
    if any(f["name"] == real_name for f in FRUITS):
        print(f"哦，「{real_name}」我其实认识，只是刚才的特征凑巧跟别的水果撞车了。")
        return
    FRUITS.append({"name": real_name, **answers})
    print(f"学到了！「{real_name}」现在被我记进认识的水果名单了，下次应该能猜对。")


print("这个AI认识的水果一开始有9种：苹果、香蕉、草莓、西瓜、樱桃、葡萄、橙子、菠萝、荔枝。")
print("你心里想一个水果，AI会一边问问题一边排除，问到只剩一个候选就是答案！")
print("如果猜错了或者猜不出来，告诉它真正的水果是什么，它会把这个新水果学进去，之后就认识了。\\n")

correct = 0
total = 0

while True:
    print(f"--- 第 {total + 1} 轮 ---")
    candidates = FRUITS[:]
    answers = {}

    for feature, question in QUESTIONS:
        if len(candidates) <= 1:
            break
        answer = ask_yes_no(question)
        answers[feature] = answer
        candidates = [f for f in candidates if f[feature] == answer]

    total += 1
    if len(candidates) == 1:
        guess = candidates[0]["name"]
        print(f"AI猜：{guess}！")
        if ask_yes_no("AI猜对了吗？"):
            print("猜对了！")
            correct += 1
        else:
            print("猜错了——这几个特征凑巧跟别的水果撞车了。")
            ask_remaining_features(answers)
            learn_new_fruit(answers)
    else:
        reason = "问遍了所有特征，还是有好几个水果对得上" if len(candidates) > 1 else "问着问着发现没有一种水果的特征全部对得上"
        print(f"{reason}，AI猜不出来了……")
        learn_new_fruit(answers)

    again = input("\\n再考它一次吗？（输入 是/否）：").strip()
    if again != "是":
        break
    print()

print(f"\\n最终成绩：AI在你出的 {total} 道题里，答对了 {correct} 个。")
print(f"现在AI认识的水果一共有 {len(FRUITS)} 种了。")
print("这就是为什么用AI的时候，不能盲目相信它的每一个答案，得自己核实——")
print("发现错误、告诉它正确答案，它才能跟着学到新东西，这也是真实AI改进的方式之一。")`,
    hint: `想让AI很快猜中，就想一个特征很鲜明的水果（比如香蕉）；想考验AI，就想樱桃或者荔枝——它俩长得很像，AI得靠"表皮有没有刺"才能分清。想看AI"学新水果"，就想一个不在9种里的水果（比如火龙果），猜错/猜不出来之后告诉它名字，再考一次同样的水果试试，看它是不是记住了。`,
    walkthrough: [
      { lines: [1, 3], note: `开头注释点明这一关的核心思路："排除法"——每问一个特征就排除掉一批不符合的候选，问到只剩一个就是答案；第3行是新加的一句，提前预告"猜错/猜不出来会把新水果学进去"这件事。` },
      { lines: [5, 15], note: `AI"认识"的水果，一开始有9种，每种都标了6个特征——这就是AI最初的全部知识，特征标得越准，猜得就越准；游戏过程中猜错/猜不出来学到的新水果，也会用同样的格式追加进这份名单。` },
      { lines: [17, 25], note: `每个特征配一句怎么问，顺序也是排除的顺序——先问区分度高的特征（颜色、形状、大小），能问几句就把候选缩小很多；刺、串、树这种更细节的特征放后面，专门用来区分长得很像的水果，比如樱桃和荔枝。` },
      { lines: [28, 29], note: `小工具函数：把"是/否"的文字回答转换成True/False，方便后面直接拿来跟每种水果的特征值比对。` },
      { lines: [32, 37], note: `新增的函数：排除法猜到只剩1个候选就会提前跳出问答循环，这时候可能还有几个特征没问到——这个函数把QUESTIONS里还没问过的都补问一遍，答案存进answers字典里，凑齐完整的6个特征，才能准确地把新水果记下来。` },
      { lines: [40, 49], note: `新增的函数：问真正的水果叫什么——如果这个名字AI其实已经认识（比如特征刚好跟另一种水果撞车了），就提示一下，不重复添加；如果确实是没见过的新水果，才把它连同刚才问到的6个特征一起追加进FRUITS，往后这一局里都会被当成候选之一。` },
      { lines: [52, 54], note: `开场白：告诉你AI一开始认识哪9种水果，新加的第3句提前说明"猜错/猜不出来会学新水果"这个规则。` },
      { lines: [56, 57], note: `记两个数字：一共考了几轮、AI答对了几轮，最后要用来算成绩。` },
      { lines: [59, 62], note: `用一个死循环让游戏可以一直玩下去；候选名单candidates每一轮都从当前的FRUITS重新复制（如果上一轮学了新水果，这里也会包含进来）；answers是新增的字典，用来记这一轮已经问到的每个特征的答案。` },
      { lines: [64, 69], note: `排除法的核心：依次问每个特征——候选已经只剩1个或0个就提前跳出；否则问一句，把这个答案存进answers，再把不符合的水果从候选里踢出去。` },
      { lines: [71, 77], note: `不管这一轮最后猜不猜得出来都要计数；候选恰好剩1个就是AI的最终猜测，还是要问你"猜对了吗"确认。` },
      { lines: [78, 81], note: `猜错了：先把还没问到的特征补问完凑齐完整答案，再调用"学新水果"的函数——这是新增的关键一步，让AI真的能从这次错误里学到东西，不只是道个歉就算了。` },
      { lines: [82, 85], note: `候选剩好几个或者一个都不剩：这时候6个特征其实已经全问完了，同样调用"学新水果"函数——原来这里只是问一下名字然后揭秘，现在会真的把这个新水果记进FRUITS。` },
      { lines: [87, 90], note: `问你还要不要继续考它，回答"否"（或者其他任何不是"是"的内容）就跳出循环，结束游戏。` },
      { lines: [92, 95], note: `游戏结束，算出这一局的最终成绩，新增一句"现在认识的水果一共有几种了"——如果中途学到过新水果，这个数字会比一开始的9大，直观看到AI在变聪明；最后点明：发现错误、告诉它正确答案，它才能跟着学到新东西，这也是真实AI改进的方式之一。` },
    ],
  },
  {
    id: 6,
    icon: "📚",
    title: "游戏6：AI图书管理员（怎么问AI才有用）",
    explain: `
      <p>这是一个靠关键词找书的"AI"图书管理员，现在认识9本书。跟它说话时，说的关键词越多、越具体
      （比如同时提到"恐龙"和"化石"），它越能把最贴切的那本排到最前面——AI会把匹配到的关键词数量
      标出来，方便你看到"为什么这本排第一"。说得太模糊（比如"随便推荐一本"），它就没办法理解你到底
      想要什么。</p>
      <p>试着描述一下你想看的书，看AI能不能推荐对，也可以试试同时提几个特征词，看排名会不会变。</p>
    `,
    code: `# AI图书管理员：练习怎么问AI才能得到有用的答案

BOOKS = [
    {"title": "《太空探险记》", "tags": ["科幻", "太空", "冒险", "宇航员"]},
    {"title": "《小侦探的一天》", "tags": ["推理", "侦探", "悬疑", "案件"]},
    {"title": "《恐龙王国》", "tags": ["恐龙", "科普", "史前", "化石"]},
    {"title": "《魔法学校》", "tags": ["魔法", "奇幻", "校园", "冒险"]},
    {"title": "《深海探秘》", "tags": ["海洋", "科普", "冒险", "生物"]},
    {"title": "《星际迷航少年版》", "tags": ["科幻", "太空", "机器人"]},
    {"title": "《名侦探的秘密案件》", "tags": ["推理", "侦探", "案件", "悬疑"]},
    {"title": "《恐龙与化石猎人》", "tags": ["恐龙", "化石", "冒险", "科普"]},
    {"title": "《魔法森林的秘密》", "tags": ["魔法", "奇幻", "森林", "悬疑"]},
]


def search_books(query):
    scored = []
    for book in BOOKS:
        hits = [tag for tag in book["tags"] if tag in query]
        if hits:
            scored.append((book["title"], len(hits), hits))
    scored.sort(key=lambda item: item[1], reverse=True)
    return scored


print("AI图书管理员上线！告诉我你想看什么类型的书，我帮你找。")
print("（提示：越具体的关键词，比如'恐龙'、'魔法'、'侦探'，AI越容易帮到你）\\n")

query = input("你想看什么样的书？")
results = search_books(query)

if results:
    print("\\nAI推荐（按匹配到的关键词数量从高到低排序）：")
    for title, count, hits in results:
        print(f"  {title} —— 匹配到 {count} 个关键词：{'、'.join(hits)}")
    print("\\n匹配到的关键词越多，排得越靠前——这就是为什么问题里的关键词越具体、越多，AI给的推荐就越准。")
else:
    print("\\nAI：呃……没太明白你想要哪一类，能不能说得更具体一点？")
    print("试试直接说类型关键词，比如'我想看恐龙的书'、'有没有魔法类的故事'。")
    print("这就是用AI的一个小技巧：问题越具体、关键词越明确，AI给的答案越有用；")
    print("问得太模糊（比如'随便推荐一本'），AI也很难猜中你到底想要什么。")`,
    hint: `先试试只说一个关键词，比如"恐龙"；再试试同时说两三个，比如"恐龙 化石 科普"，对比一下AI推荐的排序有没有变化——匹配到的关键词越多，排得越靠前。`,
    walkthrough: [
      { lines: [1, 1], note: `开头注释点明这一关要练的是"怎么问"，不是"AI怎么答"——AI能不能帮上忙，很大程度上取决于你问得够不够具体。` },
      { lines: [3, 13], note: `书单扩到9本，好几本书故意共用了一些标签（比如"冒险"、"科普"、"恐龙"都在不止一本书里出现）——这样同一句话可能同时命中好几本，才需要接下来的排序逻辑来决定"谁更贴切"。` },
      { lines: [16, 23], note: `搜索函数改成打分排序：不再是"命中就收录"这种有和没有的判断，而是数一下每本书命中了几个标签，把命中的标签也记下来，再按命中数量从高到低排序——命中越多的书排得越靠前。` },
      { lines: [26, 27], note: `开场白直接提示了这一关的技巧：关键词越具体，AI才越容易帮到你。` },
      { lines: [29, 30], note: `问你想看什么书，把你的回答交给搜索函数。` },
      { lines: [32, 36], note: `有结果：不只是列书名，还把每本书命中了几个关键词、具体是哪几个都亮出来，再点明"命中越多排得越靠前"——这样你能直接看到"为什么这本排第一"，而不是靠猜。` },
      { lines: [37, 41], note: `如果一本都没搜到：AI坦白说没听懂，并且给出具体的改进建议——问得越模糊（比如"随便推荐一本"），AI越难猜中你要什么，这就是为什么跟AI/搜索引擎打交道时，说清楚关键词很重要。` },
    ],
  },
  {
    id: 7,
    icon: "✏️",
    title: "游戏7：自己创造一个游戏",
    explain: `
      <p>前面6个游戏都是跟AI相关的例子，现在轮到你了——用Python写一个属于你自己的互动小游戏，
      题材完全自由：猜谜语、文字冒险选分支、简单的问答测验，甚至自己写一版石头剪刀布，都可以。</p>
      <p>这里的运行环境跟前面几关一样：<code>input()</code> 会等你在下面的输入框里打字，
      <code>print()</code> 打印的内容会显示在对话框里。写完点"开始游戏"就能玩自己做的东西了。</p>
    `,
    code: `# 在这里写你自己的游戏！下面是一个最简单的例子，可以直接改，也可以全部删掉重写。
# 记得：input() 会等玩家输入，print() 会把内容显示出来。

name = input("你叫什么名字？")
print(f"你好，{name}！欢迎来玩我做的游戏。")

# 试试加一个问题，根据玩家的回答走向不同的结局？比如：
# choice = input("你想选择 A 还是 B？")
# if choice == "A":
#     print("你选了A，发生了……")
# else:
#     print("你选了B，发生了……")
`,
    hint: `没思路的话可以从"猜数字"、"文字冒险选分支"、"简单问答测验"这几个方向想。写游戏最重要的是先想清楚：玩家会输入什么、根据输入你要打印什么。`,
  },
];
