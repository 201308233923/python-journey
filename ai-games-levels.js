// AI小游戏的网页版：直接搬运 ai-games/ 文件夹里的4个完整程序。
// 这里是真·交互式的：点"开始游戏"，程序问什么就在下面输入框回答什么，一步步自己探索怎么玩。
// 代码默认收起来，点"查看代码"才展开——先玩，好奇了再去看AI是怎么实现的。

const LEVELS = [
  {
    id: 1,
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
      { code: `def ai_guess_number():`, note: `定义一个函数，把整个猜数字的逻辑都装在里面——光定义不算真的运行，最后一行调用它才会真的开始玩。` },
      { code: `print("请在心里想一个...")\ninput("想好了按回车继续...")`, note: `先让你心里想好数字。这里的 input() 只是"等你按一下回车"，不是真的要你输入什么内容。` },
      { code: `low, high = 1, 100`, note: `设定猜测范围的上下界——二分法的起点：先假设答案可能是1到100之间任意一个数。` },
      { code: `guess_count = 0`, note: `记一下总共猜了几次，猜中的时候要报给你听。` },
      { code: `while low <= high:`, note: `只要范围还没缩没了（上界依然大于等于下界），就继续猜下去。` },
      { code: `guess = (low + high) // 2`, note: `二分法的核心：永远猜"当前范围的正中间"，这样不管猜对猜错，每猜一次都能排除掉一半的可能性。` },
      { code: `answer = input(...).strip()`, note: `读你的反馈（"大"/"小"/"对"），.strip() 是去掉你不小心多打的空格。` },
      { code: `if answer == "对":\n    ...\n    return`, note: `猜中了：打印结果和"这就是二分法"的讲解，然后用 return 直接结束整个函数。` },
      { code: `elif answer == "大":\n    high = guess - 1`, note: `你说AI猜大了，说明真正的数字比guess小，把上界收缩到guess-1，下一轮只在更小的范围里猜。` },
      { code: `elif answer == "小":\n    low = guess + 1`, note: `同理，猜小了就把下界往上收缩，下一轮只在更大的范围里猜。` },
      { code: `else:\n    ...\n    guess_count -= 1`, note: `如果你打的不是这三个词，提示重新输入，同时把计数减回去——这一次没有真正猜中或猜错，不该算数。` },
      { code: `ai_guess_number()`, note: `前面全是"定义"，这一行才是真正"调用"函数——游戏从这一行开始跑。` },
    ],
  },
  {
    id: 2,
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
      { code: `import random`, note: `待会儿要从"多个可能的回复"里随机选一句，需要用到这个内置模块。` },
      { code: `RULES = {...}`, note: `整个机器人的"知识库"：键是关键词，值是"看到这个词可能回复的话"（可以不止一句，随机挑一句）。` },
      { code: `DEFAULT_REPLIES = [...]`, note: `如果你说的话一个关键词都没命中，就从这里随便回你一句，不会卡住答不上来。` },
      { code: `def get_reply(user_input):`, note: `定义"怎么根据你说的话决定回复什么"这个逻辑。` },
      { code: `for keyword, replies in RULES.items():\n    if keyword in user_input:`, note: `逐个检查RULES里的每一个关键词，看看有没有出现在你刚打的话里面。` },
      { code: `return random.choice(replies)`, note: `命中了某个关键词，就从它对应的回复列表里随机挑一句返回。` },
      { code: `return random.choice(DEFAULT_REPLIES)`, note: `for循环走完了都没命中任何关键词，就返回一句默认回复。` },
      { code: `def chat():`, note: `定义整个对话流程：一直聊，直到你说"再见"。` },
      { code: `while True:\n    user_input = input("你：")`, note: `无限循环，每一轮都等你打字。` },
      { code: `reply = get_reply(user_input)\nprint(f"机器人：{reply}")`, note: `调用刚才那个"挑回复"的函数，把结果打印出来，看起来就像AI在回你话。` },
      { code: `if "再见" in user_input:\n    break`, note: `检测到"再见"这两个字，跳出循环，结束对话。` },
      { code: `print("...机器人根本不'理解'你说的话...")`, note: `对话结束后直接揭秘：它没有真的理解你，只是在做关键词匹配。` },
      { code: `chat()`, note: `真正开始运行整个对话，前面都只是定义。` },
    ],
  },
  {
    id: 3,
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
      { code: `CHOICES = ["石头", "剪刀", "布"]`, note: `所有合法的出拳选项。` },
      { code: `BEATS = {"石头": "剪刀", ...}`, note: `记录"谁克制谁"的规则——"石头"这个键对应的值是"剪刀"，意思是石头能赢剪刀。` },
      { code: `def counter_move(predicted):\n    for move, loses_to in BEATS.items():\n        if loses_to == predicted:\n            return move`, note: `"反推"逻辑：如果预测你会出剪刀，就要找"谁能赢剪刀"——遍历BEATS字典，找到"值等于剪刀"的那一项，它的键（石头）就是答案。` },
      { code: `history = {"石头": 0, "剪刀": 0, "布": 0}`, note: `记录你到目前为止分别出过几次石头/剪刀/布——这就是AI用来"学习"的数据。` },
      { code: `while True:\n    user_move = input(...)`, note: `每一轮先问你出什么。` },
      { code: `if user_move == "退出":\n    break`, note: `想结束游戏的出口。` },
      { code: `if user_move not in CHOICES:\n    continue`, note: `容错：打错字了就重新问一遍，不往下走。` },
      { code: `rounds += 1`, note: `记一下打了第几轮，后面要用这个数字判断AI"是不是已经攒够数据"。` },
      { code: `if rounds <= 3:\n    ai_move = random.choice(CHOICES)`, note: `前3轮数据太少，AI还没法预测，就随便出。` },
      { code: `else:\n    predicted = max(history, key=history.get)\n    ai_move = counter_move(predicted)`, note: `4轮以后：找出你出得最多的招数（这就是"预测"你接下来最可能出的），再用counter_move算出能克制它的招数。` },
      { code: `history[user_move] += 1`, note: `把这一轮你出的招数记进历史统计里，下一轮的预测会用到这次更新后的数据。` },
      { code: `if user_move == ai_move:\n    ...\nelif BEATS[user_move] == ai_move:\n    ...\nelse:\n    ...`, note: `用最开始定义的BEATS规则判断这一轮到底是谁赢，更新比分。` },
      { code: `print(f"...你出拳的习惯统计：{history}")`, note: `游戏结束后把你的出拳统计亮出来，让你直观看到"AI就是靠数这个数据来赢你的"。` },
    ],
  },
  {
    id: 4,
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
      { code: `TRAINING_DATA_AND / TRAINING_DATA_OR`, note: `训练数据：每一条是"两个输入 -> 正确答案该是什么"。AND逻辑要两个都是1才算1，OR逻辑只要有一个是1就算1。` },
      { code: `def predict(inputs, weights, bias):\n    total = sum(i * w for i, w in zip(inputs, weights)) + bias`, note: `神经元最核心的计算：把每个输入乘上对应的权重再加起来，再加上一个偏移值bias。` },
      { code: `return 1 if total > 0 else 0`, note: `这个总和如果大于0就猜"1"，否则猜"0"——这就是神经元做"决策"的方式。` },
      { code: `weights = [random.uniform(-1, 1) for _ in range(2)]\nbias = random.uniform(-1, 1)`, note: `一开始权重和偏移都是瞎猜的随机数，神经元这时候还什么都不会。` },
      { code: `for epoch in range(1, epochs + 1):`, note: `反复训练很多轮（默认20轮），每一轮都要看一遍全部训练数据。` },
      { code: `guess = predict(inputs, weights, bias)\nerror = correct_answer - guess`, note: `用现在的权重猜一下，再算跟正确答案差多少（error）。` },
      { code: `if error != 0:\n    weights[i] += learning_rate * error * inputs[i]\n    bias += learning_rate * error`, note: `猜错了才调整：往"能减小误差"的方向，小幅度修正权重和偏移——这就是"学习"的本质，错了就往对的方向挪一点点，不是一步到位。` },
      { code: `if total_errors == 0:\n    break`, note: `如果这一整轮全部猜对了，说明学会了，提前结束训练，不用再浪费轮数。` },
      { code: `def test(data, weights, bias):`, note: `训练完之后，用同样的数据再测一遍，看看学得对不对。` },
      { code: `choice = input(...)\n...\nweights, bias = train(data)\ntest(data, weights, bias)`, note: `真正开始运行：问你训练AND还是OR，训练，再测试——前面全是定义好的工具函数，这里才是真正执行的地方。` },
    ],
  },
  {
    id: 5,
    title: "游戏5：自己创造一个游戏",
    explain: `
      <p>前面4个游戏都是跟AI相关的例子，现在轮到你了——用Python写一个属于你自己的互动小游戏，
      题材完全自由：猜谜语、文字冒险选分支、简单的问答测验，甚至自己写一版石头剪刀布，都可以。</p>
      <p>这里的运行环境跟前面4关一样：<code>input()</code> 会等你在下面的输入框里打字，
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
