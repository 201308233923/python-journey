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
  },
];
