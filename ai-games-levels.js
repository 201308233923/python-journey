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
      <p>点"开始游戏"，然后跟着提示一步步回答就行。</p>
    `,
    code: `def ai_guess_number():
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
            return
        elif answer == "大":
            high = guess - 1
        elif answer == "小":
            low = guess + 1
        else:
            print("请输入 大/小/对 哦")
            guess_count -= 1

    print("咦，好像数字不在范围内，是不是输错了？")


ai_guess_number()`,
    hint: `AI第一次总是猜(1+100)//2=50。如果你想的数比50小就回答"大"（意思是AI猜大了），比50大就回答"小"。`,
    walkthrough: [
      { lines: [1, 1], note: `定义一个函数，把整个猜数字的逻辑都装在里面——光定义不算真的运行，最后一行调用它才会真的开始玩。` },
      { lines: [2, 3], note: `先让你心里想好数字。这里的 input() 只是"等你按一下回车"，不是真的要你输入什么内容。` },
      { lines: [5, 5], note: `设定猜测范围的上下界——二分法的起点：先假设答案可能是1到100之间任意一个数。` },
      { lines: [6, 6], note: `记一下总共猜了几次，猜中的时候要报给你听。` },
      { lines: [8, 8], note: `只要范围还没缩没了（上界依然大于等于下界），就继续猜下去。` },
      { lines: [9, 10], note: `二分法的核心：永远猜"当前范围的正中间"，这样不管猜对猜错，每猜一次都能排除掉一半的可能性；计数+1记一下猜了几次。` },
      { lines: [11, 12], note: `打印这次猜的数字，然后读你的反馈（"大"/"小"/"对"），.strip() 是去掉你不小心多打的空格。` },
      { lines: [14, 18], note: `猜中了：打印结果和"这就是二分法"的讲解，然后用 return 直接结束整个函数。` },
      { lines: [19, 20], note: `你说AI猜大了，说明真正的数字比guess小，把上界收缩到guess-1，下一轮只在更小的范围里猜。` },
      { lines: [21, 22], note: `同理，猜小了就把下界往上收缩，下一轮只在更大的范围里猜。` },
      { lines: [23, 25], note: `如果你打的不是"大/小/对"这三个词，提示重新输入，同时把计数减回去——这一次没有真正猜中或猜错，不该算数。` },
      { lines: [27, 27], note: `理论上不该走到这里（数字1-100之间二分法一定能猜中），只是防御性地兜个底。` },
      { lines: [30, 30], note: `前面全是"定义"，这一行才是真正"调用"函数——游戏从这一行开始跑。` },
    ],
  },
  {
    id: 2,
    icon: "💬",
    title: "游戏2：简单聊天机器人",
    explain: `
      <p>跟一个"AI"聊天试试。它其实没有真的"理解"你说的话，只是在 <code>RULES</code>
      这个字典里找关键词匹配。早期的AI聊天机器人（还有很多简单客服机器人）就是这么工作的。</p>
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


def chat():
    print("聊天机器人已启动！输入'再见'结束聊天。\\n")
    while True:
        user_input = input("你：")
        reply = get_reply(user_input)
        print(f"机器人：{reply}")
        if "再见" in user_input:
            break

    print("\\n提示：机器人根本不'理解'你说的话，只是在 RULES 这个字典里")
    print("找有没有匹配的关键词。试着自己在 RULES 里加几条规则，看看机器人会不会变'聪明'。")


chat()`,
    hint: `试试打"你好"、"你叫什么名字"、"AI"、"无聊"，看看会不会触发不一样的回复；最后打"再见"结束。`,
    walkthrough: [
      { lines: [1, 1], note: `待会儿要从"多个可能的回复"里随机选一句，需要用到这个内置模块。` },
      { lines: [3, 10], note: `整个机器人的"知识库"：键是关键词，值是"看到这个词可能回复的话"（可以不止一句，随机挑一句，也可以自己加更多规则）。` },
      { lines: [12, 16], note: `如果你说的话一个关键词都没命中，就从这里随便回你一句，不会卡住答不上来。` },
      { lines: [19, 19], note: `定义"怎么根据你说的话决定回复什么"这个逻辑。` },
      { lines: [20, 21], note: `逐个检查RULES里的每一个关键词，看看有没有出现在你刚打的话里面。` },
      { lines: [22, 22], note: `命中了某个关键词，就从它对应的回复列表里随机挑一句返回。` },
      { lines: [23, 23], note: `for循环走完了都没命中任何关键词，就返回一句默认回复。` },
      { lines: [26, 27], note: `定义整个对话流程：一直聊，直到你说"再见"；先打印一句开场白。` },
      { lines: [28, 29], note: `无限循环，每一轮都等你打字。` },
      { lines: [30, 31], note: `调用刚才那个"挑回复"的函数，把结果打印出来，看起来就像AI在回你话。` },
      { lines: [32, 33], note: `检测到"再见"这两个字，跳出循环，结束对话。` },
      { lines: [35, 36], note: `对话结束后直接揭秘：它没有真的理解你，只是在做关键词匹配。` },
      { lines: [39, 39], note: `真正开始运行整个对话，前面都只是定义。` },
    ],
  },
  {
    id: 3,
    icon: "✊",
    title: "游戏3：会学习的石头剪刀布",
    explain: `
      <p>这个AI会记住你出拳的习惯，从第4局开始，就用"你出现次数最多的招数"来预测你下一步，
      然后专门克制它。多打几局，你会发现它越来越难赢——这就是"从数据里学习"的感觉。</p>
      <p>每次输入"石头"/"剪刀"/"布"出一拳，输入"退出"结束游戏。</p>
    `,
    code: `import random

CHOICES = ["石头", "剪刀", "布"]
BEATS = {"石头": "剪刀", "剪刀": "布", "布": "石头"}  # key 能赢 value


def counter_move(predicted):
    """算出能打败 predicted 的招数"""
    for move, loses_to in BEATS.items():
        if loses_to == predicted:
            return move
    return random.choice(CHOICES)


def play():
    history = {"石头": 0, "剪刀": 0, "布": 0}
    ai_score, you_score = 0, 0
    rounds = 0

    print("石头剪刀布！AI 会慢慢学习你的出拳习惯。输入'退出'结束。\\n")

    while True:
        user_move = input("你出（石头/剪刀/布）：").strip()
        if user_move == "退出":
            break
        if user_move not in CHOICES:
            print("请输入 石头/剪刀/布 哦")
            continue

        rounds += 1

        # 前3局AI还没数据，随便出；之后就根据你的历史习惯预测
        if rounds <= 3:
            ai_move = random.choice(CHOICES)
        else:
            predicted = max(history, key=history.get)
            ai_move = counter_move(predicted)

        history[user_move] += 1

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

    print(f"\\n你出拳的习惯统计：{history}")
    print("发现了吗？AI 后期就是靠数你最常出什么，然后专门克制它。")
    print("这就是'从数据中学习规律'的简单例子——真实的AI用的数据量更大，方法更复杂，但思路是相通的。")


play()`,
    hint: `前3局AI是瞎猜的，从第4局开始才会用你的历史记录来预测。想让AI稳赢你，就连续出好几次同一个招数试试。`,
    walkthrough: [
      { lines: [1, 1], note: `导入random模块——AI在没攒够数据的时候要随便出拳，得靠它来"掷骰子"。` },
      { lines: [3, 3], note: `所有合法的出拳选项。` },
      { lines: [4, 4], note: `记录"谁克制谁"的规则——"石头"这个键对应的值是"剪刀"，意思是石头能赢剪刀。` },
      { lines: [7, 12], note: `"反推"逻辑：如果预测你会出剪刀，就要找"谁能赢剪刀"——遍历BEATS字典，找到"值等于剪刀"的那一项，它的键（石头）就是答案。` },
      { lines: [15, 15], note: `把整局游戏的逻辑都装进这个函数里——最后一行调用它才真正开始玩。` },
      { lines: [16, 18], note: `记录你到目前为止分别出过几次石头/剪刀/布（这就是AI用来"学习"的数据），再加两个记分和局数的变量。` },
      { lines: [20, 20], note: `开场白：告诉你怎么玩、怎么退出。` },
      { lines: [22, 23], note: `每一轮先问你出什么。` },
      { lines: [24, 25], note: `想结束游戏的出口。` },
      { lines: [26, 28], note: `容错：打错字了就重新问一遍，不往下走。` },
      { lines: [30, 30], note: `记一下打了第几轮，后面要用这个数字判断AI"是不是已经攒够数据"。` },
      { lines: [32, 32], note: `策略切换点：前3局数据不够只能瞎猜，第4局起就有历史数据可以预测了。` },
      { lines: [33, 34], note: `前3轮数据太少，AI还没法预测，就随便出。` },
      { lines: [35, 37], note: `4轮以后：找出你出得最多的招数（这就是"预测"你接下来最可能出的），再用counter_move算出能克制它的招数。` },
      { lines: [39, 39], note: `把这一轮你出的招数记进历史统计里，下一轮的预测会用到这次更新后的数据。` },
      { lines: [41, 41], note: `把AI这一轮出的招数打印出来，让你马上能对比输赢。` },
      { lines: [43, 50], note: `用最开始定义的BEATS规则判断这一轮到底是谁赢，更新比分。` },
      { lines: [52, 52], note: `每一轮结束都亮一下比分，方便你随时知道自己领先还是落后。` },
      { lines: [54, 54], note: `游戏结束后把你的出拳统计亮出来，让你直观看到"AI就是靠数这个数据来赢你的"。` },
      { lines: [55, 56], note: `再讲一遍"为什么AI会赢"，呼应最开始的说明，让你明白整局游戏里AI到底在利用什么。` },
      { lines: [59, 59], note: `前面全是定义，这一行才是真正开始跑游戏的地方。` },
    ],
  },
  {
    id: 4,
    icon: "🧠",
    title: "游戏4：迷你神经元",
    explain: `
      <p>这是简化到极致的"神经网络"——一个神经元，通过不断对比"猜的答案"和"正确答案"，
      一点点调整权重，学会判断 AND / OR 逻辑。这是ChatGPT这类AI底层原理的最简版本。</p>
      <p>输入 <code>1</code> 训练 AND 逻辑，输入 <code>2</code> 训练 OR 逻辑。
      权重是随机初始化的，每次训练过程可能不完全一样，这是正常的。</p>
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
    for inputs, correct_answer in data:
        guess = predict(inputs, weights, bias)
        result = "正确" if guess == correct_answer else "错误"
        print(f"输入 {inputs} -> AI猜：{guess}，正确答案：{correct_answer} ({result})")


print("选择要训练的逻辑：1 = AND（并且），2 = OR（或者）")
choice = input("输入 1 或 2：").strip()
data = TRAINING_DATA_AND if choice == "1" else TRAINING_DATA_OR
name = "AND" if choice == "1" else "OR"

print(f"\\n开始训练神经元学习 {name} 逻辑...\\n")
weights, bias = train(data)
test(data, weights, bias)

print("\\n提示：这个神经元一开始权重是瞎猜的（随机数），")
print("每次猜错就往'正确方向'调整一点点权重，猜的次数够多，它就学会规律了。")
print("真实的AI（比如神经网络）原理类似，只是有几十亿个这样的神经元一起工作。")`,
    hint: `输入 1 训练AND逻辑，输入 2 训练OR逻辑。`,
    walkthrough: [
      { lines: [1, 1], note: `导入random模块——用来生成一开始的随机权重和偏移，让神经元不是从0开始，而是"瞎猜"起步。` },
      { lines: [3, 17], note: `训练数据：每一条是"两个输入 -> 正确答案该是什么"。AND逻辑要两个都是1才算1，OR逻辑只要有一个是1就算1。` },
      { lines: [20, 22], note: `神经元最核心的计算：把每个输入乘上对应的权重再加起来，再加上一个偏移值bias，总和大于0就猜"1"，否则猜"0"——这就是神经元做"决策"的方式。` },
      { lines: [25, 25], note: `训练函数：epochs是要训练多少轮，learning_rate是每次调整权重的"步子"大小——步子太大容易跳过头，太小学得又太慢。` },
      { lines: [26, 27], note: `一开始权重和偏移都是瞎猜的随机数，神经元这时候还什么都不会。` },
      { lines: [29, 29], note: `训练开始前先亮一下初始的随机权重，方便你对比训练前后到底变了多少。` },
      { lines: [31, 31], note: `反复训练很多轮（默认20轮），每一轮都要看一遍全部训练数据。` },
      { lines: [32, 33], note: `每一轮开始先把错误计数清零，然后把训练数据一条一条拿出来看。` },
      { lines: [34, 35], note: `用现在的权重猜一下，再算跟正确答案差多少（error）。` },
      { lines: [37, 41], note: `猜错了才调整：往"能减小误差"的方向，小幅度修正权重和偏移——这就是"学习"的本质，错了就往对的方向挪一点点，不是一步到位。` },
      { lines: [43, 44], note: `每训练一轮就打印这一轮的错误次数和当前权重，能直观看到数字在慢慢变准。` },
      { lines: [46, 48], note: `如果这一整轮全部猜对了，说明学会了，提前结束训练，不用再浪费轮数。` },
      { lines: [50, 50], note: `训练结束，把学到的权重和偏移交出去，后面测试要用到。` },
      { lines: [53, 53], note: `训练完之后，用同样的数据再测一遍，看看学得对不对。` },
      { lines: [54, 58], note: `打印表头，然后把每一条数据都拿去用训练好的权重预测一次，跟正确答案对比，看猜得对不对。` },
      { lines: [61, 68], note: `真正开始运行：问你训练AND还是OR，训练，再测试——前面全是定义好的工具函数，这里才是真正执行的地方。` },
      { lines: [69, 72], note: `最后总结一下背后的原理：随机起步，每次猜错就微调权重，猜的次数够多就学会了规律——这就是"训练"的本质，也是真实神经网络的简化版。` },
    ],
  },
  {
    id: 5,
    icon: "🍎",
    title: "游戏5：AI水果分类器（为什么AI会出错）",
    explain: `
      <p>这个AI"水果分类器"只学过2个例子：红色+圆形=苹果，不红+不圆=香蕉。这次不限定水果名单——
      你心里随便想一个真实水果（苹果、香蕉、草莓、西瓜、樱桃……什么都行），回答"是否红色"
      "是否圆形"，AI猜一个答案，然后你自己判断它猜对了没有，如实告诉它。</p>
      <p>只要AI猜的水果不是你心里想的那个，就是猜错了——这时候就是"这个AI训练数据不够/
      不够细致"的问题，跟真实的AI模型没训练好是一样的道理。可以一直玩下去，考多少种水果都行。</p>
    `,
    code: `# AI水果分类器：只学过很少的例子，遇到没见过的情况会怎样？

# 训练数据：(是否红色, 是否圆形) -> 水果种类
# 注意这里刻意只给了2条数据，AI能学到的东西非常有限
TRAINING_DATA = {
    (True, True): "苹果",     # 红色 + 圆形
    (False, False): "香蕉",   # 不红 + 不圆（长条形）
}


def ai_guess(is_red, is_round):
    key = (is_red, is_round)
    if key in TRAINING_DATA:
        return TRAINING_DATA[key]
    # 没见过这种组合——AI只能从学过的两种里瞎猜一个
    return "苹果（瞎猜的）"


def ask_yes_no(question):
    answer = input(question + "（输入 是/否）：").strip()
    return answer == "是"


print("这个AI只学过2个例子：红色+圆形=苹果，不红+不圆=香蕉。")
print("你心里想一个真实的水果（随便什么水果都行），回答两个问题，看AI能不能猜对！\\n")

correct = 0
total = 0

while True:
    print(f"\\n--- 第 {total + 1} 轮 ---")
    is_red = ask_yes_no("你想的这个水果是红色的吗？")
    is_round = ask_yes_no("是圆形的吗？")

    guess = ai_guess(is_red, is_round)
    print(f"AI猜：{guess}")

    is_correct = ask_yes_no("AI猜对了吗？")
    total += 1
    if is_correct:
        print("AI猜对了！这个特征组合刚好是它训练时学过的。")
        correct += 1
    else:
        print("AI猜错了——说明这个AI训练数据不够，没学过你这种水果的特征组合")
        print("（也可能是撞上了别的水果，两者特征一样但答案不同），所以判断出了错。")
        print("真实的AI也是一样：训练数据覆盖不到、或者不够细致的情况，它照样会出错。")

    again = input("\\n再考它一次吗？（输入 是/否）：").strip()
    if again != "是":
        break

print(f"\\n最终成绩：AI在你出的 {total} 道题里，答对了 {correct} 个。")
print("这就是为什么用AI的时候，不能盲目相信它的每一个答案，得自己核实——")
print("它只对训练数据里出现过（而且特征描述得够细）的情况有把握。")`,
    hint: `随便想一个真实水果就行，不用局限在苹果香蕉里——草莓、西瓜、樱桃、葡萄、橙子都可以试试，看AI什么时候猜对、什么时候猜错。`,
    walkthrough: [
      { lines: [1, 1], note: `开头注释点明这一关要探索的问题：给AI的例子很少的时候，它会怎么样。` },
      { lines: [3, 8], note: `训练数据：字典的key是"(是否红色, 是否圆形)"这样一对布尔值，value是水果名字——注意这里刻意只给了2种组合，剩下的水果它都没学过。` },
      { lines: [11, 16], note: `预测函数：如果这个特征组合在训练数据里见过，就直接查表返回对应答案；没见过就只能从学过的两种里随便挑一个，返回"苹果（瞎猜的）"。` },
      { lines: [19, 21], note: `一个小工具函数：把"是/否"的文字回答转换成True/False，方便后面直接用布尔值判断。` },
      { lines: [24, 25], note: `开场白：诚实地告诉你这个AI只学过2个例子，接下来随便你想什么水果都可以拿来考它。` },
      { lines: [27, 28], note: `记两个数字：一共考了几轮、AI答对了几轮，最后要用来算成绩。` },
      { lines: [30, 30], note: `用一个死循环让游戏可以一直玩下去，考多少种水果都行——退出的时机在循环最后一步判断。` },
      { lines: [31, 31], note: `打印当前是第几轮，方便你知道进度。` },
      { lines: [32, 33], note: `问你心里想的水果是不是红色、是不是圆形——注意AI从头到尾都不知道你想的具体是哪种水果，只看得到这两个特征。` },
      { lines: [35, 35], note: `把这两个特征交给AI，拿到它的猜测。` },
      { lines: [36, 36], note: `把AI的猜测打印出来。` },
      { lines: [38, 38], note: `关键的一步：不是程序自己判断对错，而是问你——因为只有你自己知道心里想的到底是什么水果，程序没有别的办法验证。` },
      { lines: [39, 39], note: `不管对错，这一轮都要算进"总共考了几次"里。` },
      { lines: [40, 42], note: `你说猜对了：记一分，打印祝贺。` },
      { lines: [43, 46], note: `你说猜错了：解释原因——要么这个特征组合AI压根没学过，要么撞上了别的水果（特征一样但答案不同），这就是训练数据不够/不够细致导致的错误。` },
      { lines: [48, 50], note: `问你还要不要继续考它，回答"否"（或者其他任何不是"是"的内容）就跳出循环，结束游戏。` },
      { lines: [52, 54], note: `游戏结束，算出这一局的最终成绩，再次点明规律：AI只对训练数据里出现过、而且描述得够细的情况有把握，这就是为什么不能盲目相信AI的每一个答案，得自己核实。` },
    ],
  },
  {
    id: 6,
    icon: "📚",
    title: "游戏6：AI图书管理员（怎么问AI才有用）",
    explain: `
      <p>这是一个靠关键词找书的"AI"图书管理员。跟它说话时，包含的关键词越具体（比如"恐龙"、"魔法"），
      它越容易帮你找到对应的书；说得太模糊（比如"随便推荐一本"），它就没办法理解你到底想要什么——
      这也是现实中跟AI聊天/用AI搜索时的一个实用技巧。</p>
      <p>试着描述一下你想看的书，看AI能不能推荐对。</p>
    `,
    code: `# AI图书管理员：练习怎么问AI才能得到有用的答案

BOOKS = [
    {"title": "《太空探险记》", "tags": ["科幻", "太空", "冒险"]},
    {"title": "《小侦探的一天》", "tags": ["推理", "侦探", "悬疑"]},
    {"title": "《恐龙王国》", "tags": ["恐龙", "科普", "史前"]},
    {"title": "《魔法学校》", "tags": ["魔法", "奇幻", "校园"]},
]


def search_books(query):
    matches = []
    for book in BOOKS:
        if any(tag in query for tag in book["tags"]):
            matches.append(book["title"])
    return matches


print("AI图书管理员上线！告诉我你想看什么类型的书，我帮你找。")
print("（提示：越具体的关键词，比如'恐龙'、'魔法'、'侦探'，AI越容易帮到你）\\n")

query = input("你想看什么样的书？")
results = search_books(query)

if results:
    print(f"\\nAI推荐：{', '.join(results)}")
    print("因为你的话里提到了具体关键词，AI才能匹配到对应的书。")
else:
    print("\\nAI：呃……没太明白你想要哪一类，能不能说得更具体一点？")
    print("试试直接说类型关键词，比如'我想看恐龙的书'、'有没有魔法类的故事'。")
    print("这就是用AI的一个小技巧：问题越具体、关键词越明确，AI给的答案越有用；")
    print("问得太模糊（比如'随便推荐一本'），AI也很难猜中你到底想要什么。")`,
    hint: `先试试直接说关键词，比如"恐龙"、"魔法"、"侦探"；再试试说得很模糊，比如"随便推荐一本"，对比两次AI的反应有什么不同。`,
    walkthrough: [
      { lines: [1, 1], note: `开头注释点明这一关要练的是"怎么问"，不是"AI怎么答"——AI能不能帮上忙，很大程度上取决于你问得够不够具体。` },
      { lines: [3, 8], note: `书单：每本书除了标题，还有一组标签（tags）——这些标签就是AI用来判断"你说的话跟哪本书有关"的唯一依据，AI并不"读懂"你的话。` },
      { lines: [11, 16], note: `搜索函数：遍历每一本书，只要你说的话里出现了它的任意一个标签，就算命中，加进结果列表——这跟游戏2聊天机器人的关键词匹配是同一个原理。` },
      { lines: [19, 20], note: `开场白直接提示了这一关的技巧：关键词越具体，AI才越容易帮到你。` },
      { lines: [22, 23], note: `问你想看什么书，把你的回答交给搜索函数。` },
      { lines: [25, 27], note: `如果搜到了结果：打印推荐，并且明确点出"是因为你提到了具体关键词"——把"为什么这次成功了"讲清楚。` },
      { lines: [28, 32], note: `如果一本都没搜到：AI坦白说没听懂，并且给出具体的改进建议——问得越模糊（比如"随便推荐一本"），AI越难猜中你要什么，这就是为什么跟AI/搜索引擎打交道时，说清楚关键词很重要。` },
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
