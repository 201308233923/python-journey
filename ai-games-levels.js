// AI小游戏的网页版：直接搬运 ai-games/ 文件夹里的4个完整程序。
// 这里是真·交互式的：点"开始游戏"，程序问什么就在下面输入框回答什么，一步步自己探索怎么玩。
// 代码默认收起来，点"查看代码"才展开——先玩，好奇了再去看AI是怎么实现的。

const LEVELS = [
  {
    id: 1,
    icon: "🔢",
    title: "游戏1：AI 猜数字",
    explain: `
      <p>你心里想一个数字，别告诉AI。AI 每次猜一个数，你告诉它"大了"还是"小了"，它很快就能猜中
      ——这就是"二分查找"，很多AI做决策时用的基本思路。可以先选难度：范围越大，理论上限次数
      越高，二分法的效率优势也越明显。</p>
      <p>AI猜完之后会反过来：它心里想一个数字，换你来猜。猜完对比一下双方各用了几次。</p>
      <p>AI还会记住你每次回答划定的范围——如果你哪次回答跟之前自相矛盾（比如范围明明只剩一个
      数字了，还说"比它还大"），AI会当场指出来，让你重新回答，而不是被带偏。</p>
      <p>点"开始游戏"，然后跟着提示一步步回答就行。</p>
    `,
    code: `import random

DIFFICULTIES = {
    "1": ("简单", 1, 50),
    "2": ("中等", 1, 100),
    "3": ("困难", 1, 500),
    "4": ("地狱", 1, 2000),
}


def max_guesses_needed(n):
    """二分法最多需要猜几次，才能覆盖n个数字的范围"""
    guesses = 0
    total = 1
    while total < n:
        total *= 2
        guesses += 1
    return guesses


def ai_guess_number(low_bound, high_bound):
    print(f"请在心里想一个 {low_bound} 到 {high_bound} 之间的数字，别告诉我！")
    input("想好了按回车继续...")

    low, high = low_bound, high_bound
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
            if guess == low:
                print(f"\\n等等，这样矛盾了：范围已经缩小到只剩 {low} 这一个数字了，")
                print("不可能比它自己还大——是不是这次回答按错了？重新回答这一次。")
                guess_count -= 1
                continue
            high = guess - 1
        elif answer == "小":
            if guess == high:
                print(f"\\n等等，这样矛盾了：范围已经缩小到只剩 {high} 这一个数字了，")
                print("不可能比它自己还小——是不是这次回答按错了？重新回答这一次。")
                guess_count -= 1
                continue
            low = guess + 1
        else:
            print("请输入 大/小/对 哦")
            guess_count -= 1

    print("咦，好像数字不在范围内，是不是输错了？")
    return guess_count


def you_guess_number(low_bound, high_bound):
    secret = random.randint(low_bound, high_bound)
    your_count = 0
    print(f"\\n换你来猜！AI 心里想好了一个 {low_bound} 到 {high_bound} 之间的数字，轮到你来猜它。")

    while True:
        raw = input(f"你猜（{low_bound}-{high_bound}之间的数字）：").strip()
        if not raw.isdigit():
            print("请输入一个数字哦")
            continue
        guess = int(raw)
        if guess < low_bound or guess > high_bound:
            print(f"请输入 {low_bound}-{high_bound} 之间的数字")
            continue
        your_count += 1
        if guess == secret:
            print(f"\\n猜对了！你用了 {your_count} 次。")
            return your_count
        elif guess < secret:
            print("小了")
        else:
            print("大了")


def play_one_round(low_bound, high_bound):
    ai_count = ai_guess_number(low_bound, high_bound)
    your_count = you_guess_number(low_bound, high_bound)

    best_possible = max_guesses_needed(high_bound - low_bound + 1)
    print("\\n--- 对比一下 ---")
    print(f"这个范围（{low_bound}-{high_bound}）理论上最多只需要 {best_possible} 次就能猜中任何数字。")
    print(f"AI 猜你的数字用了 {ai_count} 次，你猜 AI 的数字用了 {your_count} 次。")
    if your_count <= ai_count:
        print("你也用上了二分法的思路（每次都猜中间附近），效率跟AI差不多！")
    else:
        print(f"提示：如果每次都猜'当前范围的正中间'，最多{best_possible}次就能在这个范围内猜中任何数字——")
        print("这就是AI刚才用的策略，试试下次也用这个思路。")


def choose_difficulty():
    print("选择难度：1=简单(1-50)，2=中等(1-100)，3=困难(1-500)，4=地狱(1-2000)")
    choice = input("输入 1/2/3/4：").strip()
    name, low_bound, high_bound = DIFFICULTIES.get(choice, DIFFICULTIES["2"])
    print(f"\\n难度：{name}（{low_bound}-{high_bound}）\\n")
    return low_bound, high_bound


low_bound, high_bound = choose_difficulty()
play_one_round(low_bound, high_bound)

while True:
    again = input("\\n再战一局吗？可以换个难度（输入 是/否）：").strip()
    if again != "是":
        break
    low_bound, high_bound = choose_difficulty()
    play_one_round(low_bound, high_bound)`,
    hint: `AI第一次总是猜范围正中间。想让AI很快猜中，就老老实实按你心里想的数字回答；想看"矛盾检测"，可以故意在范围只剩最后一个数字时还乱答"大"或"小"试试。轮到你猜AI的数字时，也用同样的技巧：每次都猜"当前范围的正中间"，猜的次数会明显变少。`,
    walkthrough: [
      { lines: [1, 1], note: `待会儿"反过来轮到你猜"这个环节，AI要偷偷想一个秘密数字，需要用到这个内置模块来随机抽。` },
      { lines: [3, 8], note: `新增的难度表：编号对应"难度名字、范围下限、范围上限"——范围越大，二分法要猜的次数理论上限也越高。` },
      { lines: [11, 18], note: `新增的小工具：算出这个范围理论上最多要猜几次——从1开始不断翻倍，翻几次能盖住整个范围，就要猜几次，这正是二分法效率的数学解释。` },
      { lines: [21, 26], note: `定义AI猜你数字的逻辑，改成接收难度对应的上下界（不再写死1-100）；先让你心里想好数字，input()只是等你按一下回车。` },
      { lines: [28, 32], note: `只要范围还没缩没了就继续猜：永远猜"当前范围的正中间"，计数+1，然后读你的反馈（"大"/"小"/"对"）。` },
      { lines: [34, 38], note: `猜中了：打印结果和"这就是二分法"的讲解，把猜了几次通过 return 带出去。` },
      { lines: [39, 45], note: `你说"大了"：新增的矛盾检测——如果范围已经缩小到只剩guess自己一个数字，还说"比它还大"，那范围就会变成空的，逻辑上不可能，所以先原样重新问一遍（这次不计入次数）；确实还有缩小空间才正常收缩上界。` },
      { lines: [46, 52], note: `你说"小了"：同样的矛盾检测，只是方向相反——范围缩到只剩guess自己还说"比它还小"，也是不可能的，一样重新问一遍。` },
      { lines: [53, 55], note: `如果你打的不是"大/小/对"这三个词，提示重新输入，同时把计数减回去——这一次不该算数。` },
      { lines: [57, 58], note: `理论上不该走到这里（范围内二分法一定能猜中），只是防御性地兜个底，同样把计数带出去。` },
      { lines: [61, 64], note: `定义"反过来"的逻辑，同样接收难度对应的上下界：AI偷偷想一个秘密数字，不会让你看到，然后告诉你轮到你猜了。` },
      { lines: [66, 74], note: `一直问你猜多少，直到猜中为止；如果输入的不是数字，或者不在这个难度的范围内，提示重新输入。` },
      { lines: [75, 82], note: `每猜一次计数+1；猜中了就把总共猜了几次通过 return 带出去；没猜中就告诉你是猜小了还是猜大了。` },
      { lines: [85, 97], note: `新增的"跑完整局"函数：依次跑"AI猜你"和"你猜AI"两段，算出这个范围理论最少要猜几次，再把双方用的次数摆出来对比，给出对应的反馈。` },
      { lines: [100, 105], note: `新增的选难度函数：打印四个选项，读你的选择，从难度表里查出对应的名字和范围（选错了默认按中等处理，不会报错）。` },
      { lines: [108, 109], note: `真正开始玩：先选一次难度，跑第一局。` },
      { lines: [111, 116], note: `问要不要再战——可以借这个机会换个难度再来一局，回答不是"是"就结束整个游戏。` },
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
      <p>这次它还会试着记住你的名字——说一句"我叫XX"或者"我是XX"，它会把这个名字存进一个
      变量里，之后回你话都会带上称呼。这跟"关键词匹配"是两种不同的能力：一个是临时查表，
      一个是真的把信息记在状态里，一直带着用。</p>
      <p>输入什么都行，输入包含"再见"两个字的内容就会结束对话。</p>
    `,
    code: `import random
import re

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


def detect_name(user_input):
    """从"我叫XX"/"我是XX"这种话里，试着抓出一个可能是名字的片段"""
    match = re.search(r"我叫(.+)|我是(.+)", user_input)
    if not match:
        return None
    name = (match.group(1) or match.group(2)).strip()
    name = re.sub(r"[，。！？~～\\s].*$", "", name)  # 只要标点/语气词前面那一小段
    return name if 0 < len(name) <= 6 else None


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
    print("聊天机器人已启动！它这次会试着记住你的名字（说'我叫XX'或'我是XX'）；")
    print("连续两次没听懂的话，它会主动请你教一条新规则。输入'再见'结束聊天。\\n")
    miss_streak = 0
    taught_count = 0
    user_name = None

    while True:
        user_input = input("你：")

        detected_name = detect_name(user_input)
        if detected_name and not user_name:
            user_name = detected_name
            print(f"机器人：记住啦，{user_name}！以后我都这样称呼你。")
            continue

        reply = get_reply(user_input)
        is_default = reply in DEFAULT_REPLIES
        display_reply = f"{user_name}，{reply}" if (user_name and is_default) else reply
        print(f"机器人：{display_reply}")
        if "再见" in user_input:
            break

        if is_default:
            miss_streak += 1
        else:
            miss_streak = 0

        if miss_streak >= 2:
            if learn_new_rule():
                taught_count += 1
            miss_streak = 0

    print(f"\\n这一局你教会了机器人 {taught_count} 条新规则。")
    if user_name:
        print(f"它还记住了你的名字：{user_name}——这是它这次唯一真正'记住'的东西，")
        print("不是靠关键词匹配，而是把这个信息存进了一个变量里，之后一直带着用。")
    print("提示：机器人根本不'理解'你说的话，大部分时候只是在 RULES 这个字典里")
    print("找有没有匹配的关键词。刚才教它的新规则也是这个原理——真正的'记忆'（比如你的名字）")
    print("需要专门用变量存起来，这跟'临时查表回话'是两种不同的能力。")


chat()`,
    hint: `先说一句"我叫小明"（换成你喜欢的名字），看它是不是记住了，之后回你话会不会带上称呼；再试试"你好"、"AI"、"无聊"；连续打两句它接不住的话，看它会不会主动请你教规则；最后打"再见"结束。`,
    walkthrough: [
      { lines: [1, 2], note: `待会儿要从"多个可能的回复"里随机选一句要用random；从"我叫XX"这种话里抓名字要用到正则表达式，得用re模块。` },
      { lines: [4, 11], note: `整个机器人的"知识库"：键是关键词，值是"看到这个词可能回复的话"（可以不止一句，随机挑一句，也可以自己加更多规则）。` },
      { lines: [13, 17], note: `如果你说的话一个关键词都没命中，就从这里随便回你一句，不会卡住答不上来——待会儿也会用这份列表判断"这次是不是没听懂"。` },
      { lines: [20, 24], note: `跟原来一样：逐个检查RULES里的每一个关键词，命中就随机挑一句回复；一个都没命中就返回默认回复。` },
      { lines: [27, 34], note: `新增的函数：用正则表达式在你的话里找"我叫XX"或者"我是XX"这种说法，抓出后面那一小段当候选名字——顺便去掉标点/语气词之后的部分（避免抓到一整句话），长度太长（超过6个字）就当作抓错了，不采用。` },
      { lines: [37, 49], note: `教学逻辑不变：先问关键词，再问希望听到这个关键词时怎么回复——两个都填了才真正写进RULES字典，返回True告诉外面"这次真的学会了一条"。` },
      { lines: [52, 59], note: `定义整个对话流程，开场白提到"会记住名字"和"连续两次没听懂会请教"这两个新行为；user_name这个新变量专门用来存你的名字，一开始是None（还不知道）；然后无限循环，每一轮都等你打字。` },
      { lines: [60, 66], note: `每一轮先试着从你的话里抓名字——如果抓到了、而且之前还不知道你的名字，就记下来并回一句确认，然后直接跳到下一轮（这句话不用再走一遍关键词匹配）。` },
      { lines: [68, 73], note: `正常的关键词匹配流程：挑一句回复；如果已经知道你的名字、而且这次是没命中关键词的默认回复，就在前面加上称呼——命中了具体规则的回复不加称呼，保持规则本身的原意；打印出来，说"再见"就结束对话。` },
      { lines: [75, 78], note: `判断刚才这句是不是默认回复——如果是，说明这次一个关键词都没命中，连续没命中的计数+1；命中过规则就清零，重新计数。` },
      { lines: [80, 83], note: `连续没命中够2次，就触发"教学"环节；真的教成功了才把taught_count加1，不管教没教成功都把计数清零，避免刚教完马上又立刻重复弹出来。` },
      { lines: [85, 91], note: `对话结束，报告教会了几条规则；如果记住了名字，额外点明这是"真正存进变量的记忆"，跟"关键词匹配"是两种不同的能力——一个是临时查表，一个是一直带着用的状态。` },
      { lines: [94, 94], note: `真正开始运行整个对话，前面都只是定义。` },
    ],
  },
  {
    id: 3,
    icon: "✊",
    title: "游戏3：会学习的石头剪刀布",
    explain: `
      <p>先选AI对手的难度：<b>新手AI</b>纯靠运气随便出；<b>进阶AI</b>会看你"最近5局"的出拳习惯，
      猜你接下来最可能出哪个然后专门克制它；<b>高手AI</b>更进一步——它会分别记住"你刚赢了一局
      之后""你刚输了一局之后""平局之后"，你紧接着分别习惯出什么，按当前所处的情境预测，而不是
      把所有历史混在一起统计。</p>
      <p>赛制是三局两胜：谁先赢3局，这一场就算谁赢。打完一场可以选择换个难度再战一场。</p>
      <p>每次输入"石头"/"剪刀"/"布"出一拳，输入"退出"可以提前结束当前这一场。</p>
    `,
    code: `import random

CHOICES = ["石头", "剪刀", "布"]
BEATS = {"石头": "剪刀", "剪刀": "布", "布": "石头"}  # key 能赢 value
WINDOW_SIZE = 5  # 进阶AI只看最近5局，而不是从头到尾全部历史

DIFFICULTIES = {
    "1": "新手",
    "2": "进阶",
    "3": "高手",
}


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


def novice_ai_move(state):
    return random.choice(CHOICES)


def intermediate_ai_move(state):
    recent = state["recent_moves"]
    if len(recent) < WINDOW_SIZE:
        return random.choice(CHOICES)
    predicted = most_common(recent[-WINDOW_SIZE:])
    return counter_move(predicted)


def expert_ai_move(state):
    # 高手AI：看"上一局你赢/输/平之后，你紧接着出了什么"，按当前所处的情境分别
    # 统计，而不是像进阶AI那样把所有历史混在一起——这是从"看整体习惯"进化到
    # "看情境下的习惯"，更贴近真实场景里"人赢了/输了之后往往会改变策略"这件事。
    context_moves = state["after_outcome"].get(state["last_outcome"], [])
    if context_moves:
        predicted = most_common(context_moves)
        return counter_move(predicted)
    return intermediate_ai_move(state)


AI_STRATEGIES = {
    "1": novice_ai_move,
    "2": intermediate_ai_move,
    "3": expert_ai_move,
}


def play_match(difficulty_name, ai_move_fn):
    print(f"\\n选好了！这场对手是【{difficulty_name}AI】，先赢3局的人获胜！输入'退出'可以提前结束这场。\\n")
    state = {"recent_moves": [], "last_outcome": None, "after_outcome": {"赢": [], "输": [], "平": []}}
    you_score = 0
    ai_score = 0
    rounds = 0

    while you_score < 3 and ai_score < 3:
        user_move = input(f"第{rounds + 1}局，你出（石头/剪刀/布）：").strip()
        if user_move == "退出":
            print("提前结束这场比赛。")
            return you_score, ai_score
        if user_move not in CHOICES:
            print("请输入 石头/剪刀/布 哦")
            continue

        rounds += 1
        ai_move = ai_move_fn(state)
        print(f"AI出：{ai_move}")

        if user_move == ai_move:
            outcome = "平"
            print("平局！")
        elif BEATS[user_move] == ai_move:
            outcome = "赢"
            print("你赢了这一局！")
            you_score += 1
        else:
            outcome = "输"
            print("AI赢了这一局！")
            ai_score += 1

        print(f"比分——你：{you_score}  AI：{ai_score}\\n")

        if state["last_outcome"]:
            state["after_outcome"][state["last_outcome"]].append(user_move)
        state["recent_moves"].append(user_move)
        if len(state["recent_moves"]) > WINDOW_SIZE:
            state["recent_moves"].pop(0)
        state["last_outcome"] = outcome

    if you_score > ai_score:
        print("恭喜，你赢下了这场比赛！")
    else:
        print("这场AI赢了，再战一场试试？")
    return you_score, ai_score


def choose_difficulty():
    print("选择对手难度：1=新手AI（纯随机），2=进阶AI（看最近5局频率），3=高手AI（看你赢/输/平之后的反应习惯）")
    choice = input("输入 1/2/3：").strip()
    name = DIFFICULTIES.get(choice, DIFFICULTIES["2"])
    ai_move_fn = AI_STRATEGIES.get(choice, AI_STRATEGIES["2"])
    return name, ai_move_fn


name, ai_move_fn = choose_difficulty()
you_score, ai_score = play_match(name, ai_move_fn)

while True:
    again = input("\\n再来一场吗？可以换个难度（输入 是/否）：").strip()
    if again != "是":
        break
    name, ai_move_fn = choose_difficulty()
    you_score, ai_score = play_match(name, ai_move_fn)

print("\\n发现了吗？AI从'完全随机'到'看整体频率'再到'看情境反应'，一步步更像'真的在观察你'——")
print("这就是AI从简单规则进化到复杂模式识别的缩影。")
print("__GAME_OUTCOME__:WIN" if you_score >= ai_score else "__GAME_OUTCOME__:LOSE")`,
    hint: `新手AI靠猜，进阶AI攒够5局才会用频率预测，高手AI从第2局起就会看"你上一局赢/输/平之后习惯出什么"。想赢高手AI，试试故意打乱"赢了就重复""输了就换"这种下意识的反应模式。`,
    walkthrough: [
      { lines: [1, 1], note: `导入random模块——新手AI全靠它随机出拳，其他难度在数据不够时也会用它来兜底。` },
      { lines: [3, 5], note: `所有合法的出拳选项，"谁克制谁"的规则，再加一个常量WINDOW_SIZE：进阶AI只往前数最近5局，不是全部历史。` },
      { lines: [7, 11], note: `新增的难度表：编号对应难度名字，待会儿用来打印选项和查找对应的AI策略。` },
      { lines: [14, 19], note: `"反推"逻辑：如果预测你会出剪刀，就要找"谁能赢剪刀"——遍历BEATS字典，找到"值等于剪刀"的那一项，它的键就是答案。` },
      { lines: [22, 27], note: `数一下一份出拳记录里，石头/剪刀/布各出现了几次，返回出现最多的那个——这是"预测"的核心计算。` },
      { lines: [30, 31], note: `新手AI的策略：不看任何数据，纯随机出拳。` },
      { lines: [34, 39], note: `进阶AI的策略：数据不够5局就随便出，攒够了就用"最近5局"算出预测，再找能克制它的招数——这是上一版就有的滑动窗口逻辑。` },
      { lines: [42, 50], note: `新增的高手AI策略：不看"最近几局出了什么"，而是看"上一局的结果（赢/输/平）之后，你紧接着习惯出什么"，用这个更精准的情境数据预测；这份情境数据还不够时，退回去用进阶AI的策略兜底。` },
      { lines: [53, 57], note: `把难度编号对应到具体的策略函数——待会儿选了哪个难度，就直接调用对应的函数来决定AI怎么出招，不用写一长串if/elif。` },
      { lines: [60, 65], note: `新增的"打一场比赛"函数：开场白报难度和赛制；state这个字典装着这场比赛AI要用到的全部数据（最近几局、上一局结果、按情境分类的历史）；比分和轮次清零。` },
      { lines: [67, 74], note: `只要双方都没到3胜就继续：读你出的招数，"退出"可以提前结束这场，打错字重新问。` },
      { lines: [76, 78], note: `记一下第几轮；调用这场选定的AI策略函数算出AI出什么，打印出来。` },
      { lines: [80, 90], note: `用BEATS规则判断这一局到底是谁赢，记下这局的结果(outcome)，更新对应的比分。` },
      { lines: [92, 92], note: `每一局结束都亮一下比分。` },
      { lines: [94, 99], note: `更新state：把"上一局结果之后你这次出的招数"记进对应的情境分类里（高手AI靠这个预测）；维护最近5局的滑动窗口（进阶AI靠这个预测）；记下这一局的结果，作为下一局的"上一局结果"。` },
      { lines: [101, 105], note: `跳出循环说明有一方先到3胜——按比分打印这场比赛谁赢了，同时把比分交出去，方便外面统计总的输赢。` },
      { lines: [108, 113], note: `选难度的函数：打印三个选项，读你的选择，从两张表里分别查出难度名字和对应的策略函数（选错了默认按进阶处理，不会报错）。` },
      { lines: [116, 117], note: `真正开始玩：先选一次难度，打一场比赛，记下这场最终比分。` },
      { lines: [119, 124], note: `问要不要再来一场——可以借这个机会换个难度挑战更高级的AI，回答不是"是"就结束整个游戏。` },
      { lines: [126, 128], note: `总结AI三档难度的进化脉络；用最后一场的比分判断整体上算不算赢，打印一个只有代码自己认识的"暗号"，页面看到这个暗号才会放庆祝的礼花。` },
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
      <p>选XOR之后，AI会问你要不要亲眼看看"加一层神经元"能不能解决这个天花板——真的用
      反向传播训练一个两层神经网络（不是演示，是真训练），让你直接看到"深度"是怎么
      解决单层做不到的问题的。</p>
    `,
    code: `import random
import math

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


def sigmoid(x):
    return 1 / (1 + math.exp(-x))


def train_two_layer_xor(hidden_n=3, epochs=3000, learning_rate=1.0):
    """两层神经网络：2个输入 -> hidden_n个隐藏神经元 -> 1个输出神经元，用反向传播训练"""
    w1 = [[random.uniform(-1, 1) for _ in range(2)] for _ in range(hidden_n)]
    b1 = [random.uniform(-1, 1) for _ in range(hidden_n)]
    w2 = [random.uniform(-1, 1) for _ in range(hidden_n)]
    b2 = random.uniform(-1, 1)

    for _ in range(epochs):
        for inputs, target in TRAINING_DATA_XOR:
            hidden = [sigmoid(sum(inputs[i] * w1[j][i] for i in range(2)) + b1[j]) for j in range(hidden_n)]
            output = sigmoid(sum(hidden[j] * w2[j] for j in range(hidden_n)) + b2)

            error = target - output
            d_output = error * output * (1 - output)

            for j in range(hidden_n):
                d_hidden = d_output * w2[j] * hidden[j] * (1 - hidden[j])
                for i in range(2):
                    w1[j][i] += learning_rate * d_hidden * inputs[i]
                b1[j] += learning_rate * d_hidden
                w2[j] += learning_rate * d_output * hidden[j]
            b2 += learning_rate * d_output

    return w1, b1, w2, b2, hidden_n


def test_two_layer_xor(w1, b1, w2, b2, hidden_n):
    print("\\n--- 两层神经网络的测试结果 ---")
    all_correct = True
    for inputs, target in TRAINING_DATA_XOR:
        hidden = [sigmoid(sum(inputs[i] * w1[j][i] for i in range(2)) + b1[j]) for j in range(hidden_n)]
        output = sigmoid(sum(hidden[j] * w2[j] for j in range(hidden_n)) + b2)
        guess = 1 if output > 0.5 else 0
        result = "正确" if guess == target else "错误"
        if guess != target:
            all_correct = False
        print(f"输入 {inputs} -> AI猜：{guess}，正确答案：{target} ({result})")
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

    want_upgrade = input("\\n要不要亲眼看看加一层神经元之后，XOR能不能被学会？（输入 是/否）：").strip()
    if want_upgrade == "是":
        print("\\n这次改用两层：2个输入 -> 3个隐藏神经元 -> 1个输出神经元，训练3000轮...\\n")
        w1, b1, w2, b2, hidden_n = train_two_layer_xor()
        two_layer_correct = test_two_layer_xor(w1, b1, w2, b2, hidden_n)
        if two_layer_correct:
            print("\\n看到了吗？两层神经元，全部猜对！多出来的这一层让网络能画出弯曲的分界线，")
            print("不再局限于一条直线——这就是深度学习里'深度'两个字的含义：层数越多，能学会的规律越复杂。")
        else:
            print("\\n这次没有全部学会——训练神经网络本来就有运气成分（权重是随机起步的，偶尔会卡在半路）。")
            print("真实的深度学习项目里，遇到这种情况通常会换一次随机初始化，或者调整训练轮数再试。")
        print("__GAME_OUTCOME__:WIN" if two_layer_correct else "__GAME_OUTCOME__:LOSE")
else:
    print("\\n提示：这个神经元一开始权重是瞎猜的（随机数），")
    print("每次猜错就往'正确方向'调整一点点权重，猜的次数够多，它就学会规律了。")
    print("真实的AI（比如神经网络）原理类似，只是有几十亿个这样的神经元一起工作。")
    print("__GAME_OUTCOME__:WIN" if all_correct else "__GAME_OUTCOME__:LOSE")`,
    hint: `输入 1 训练AND逻辑，输入 2 训练OR逻辑。想看AI的极限在哪，输入 3 训练XOR——练多少轮都学不会才是正常的。选完XOR之后，一定要试试"要不要看两层神经元"那个选项，输入"是"，看单层学不会的问题，加一层之后是怎么被解决的。`,
    walkthrough: [
      { lines: [1, 2], note: `random用来生成一开始的随机权重和偏移；math这次新增，两层网络要用到里面的指数函数e^x（藏在下面的sigmoid里）。` },
      { lines: [4, 10], note: `训练数据：每一条是"两个输入 -> 正确答案该是什么"。AND逻辑要两个都是1才算1。` },
      { lines: [12, 18], note: `OR逻辑的训练数据：只要有一个是1，结果就该是1。` },
      { lines: [20, 27], note: `XOR训练数据：两个不一样才算1，一样（都是0或都是1）就算0——注释先提前预告了一句：这个逻辑单个神经元学不会，不是bug，是数学上真的不可能。` },
      { lines: [30, 32], note: `单个神经元最核心的计算：把每个输入乘上对应的权重再加起来，再加上一个偏移值bias，总和大于0就猜"1"，否则猜"0"。` },
      { lines: [35, 60], note: `单神经元的训练函数：一开始权重瞎猜，反复训练很多轮，每轮看一遍全部数据、猜错了就往"能减小误差"的方向微调权重，全部猜对就提前结束——这套逻辑不变，AND/OR能学会，XOR学不会。` },
      { lines: [63, 72], note: `单神经元的测试函数：用训练好的权重把每条数据都测一遍，看猜得对不对，最后交出"是不是全对"这个结果。` },
      { lines: [75, 76], note: `新增：sigmoid把任意一个数字压缩到0~1之间——两层网络的每个神经元都要经过这一步再往下传，这是让"多层叠加"真正有意义的关键（如果没有这一步，无论叠多少层，数学上都等价于一层，一样学不会XOR）。` },
      { lines: [79, 102], note: `新增的两层网络训练函数：2个输入先经过3个隐藏神经元（每个都用sigmoid处理），再汇总到1个输出神经元；每条数据算完预测，把误差用"反向传播"这个方法，从输出神经元往回一层层传给隐藏神经元，各自按自己对误差的"贡献大小"微调权重——这比单神经元的调整规则复杂，但思路是相通的：错了就往对的方向挪一点。` },
      { lines: [105, 116], note: `两层网络的测试函数：跟单神经元的test()结构一样，只是要先经过隐藏层再到输出层，多一步中间计算。` },
      { lines: [119, 123], note: `把输入的编号（1/2/3）对应到"这个逻辑叫什么名字"和"用哪份训练数据"。` },
      { lines: [125, 127], note: `提示文字列出三个选项，读取你的选择，从字典里查出对应的名字和数据（选错了默认按AND处理，不会报错）。` },
      { lines: [129, 131], note: `真正开始训练、测试单个神经元，并且记住测试结果是不是全对。` },
      { lines: [133, 137], note: `如果刚才训练的是XOR，不管练得怎么样都直接揭示真相：AND/OR能画一条直线分开两类点，XOR不管怎么画都分不开，这是单个神经元的数学天花板。` },
      { lines: [139, 150], note: `新增的关键环节：问你要不要亲眼看两层网络解决XOR——选"是"就真的训练一个两层网络并测试，根据这次是不是真的全部学会了，给出对应的解读（学会了就点出"深度"的含义；没学会就如实说明训练本身有随机成分，这也是真实场景会遇到的情况），最后打印结算暗号。` },
      { lines: [151, 155], note: `AND/OR的收尾逻辑不变：总结"随机起步、猜错就微调"这个学习的本质，打印结算暗号，页面看到"全对"才会放庆祝的礼花。` },
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
      <p>每一轮先是AI猜你的水果——猜错了或者猜不出来，告诉它真正的水果是什么，它会记进自己
      认识的名单，下次遇到类似的就更容易猜对。猜完之后反过来：AI心里想一个水果，换你来问特征、
      排除、最后猜出它是谁——同一套排除法算法，这次从"出题者"换成"答题者"来体验。</p>
    `,
    code: `import random

# AI水果分类器：这次AI认识9种真实水果，会用"排除法"一步步问问题——
# 每问一个特征，就把不符合的水果排除掉，直到只剩一个候选，就是答案。
# 每一轮AI先猜你的水果，猜完反过来轮到你猜AI心里想的水果。
# 如果AI猜错了或者猜不出来，告诉它正确答案，它会把这个新水果学进去，之后就认识了。

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

# 反过来轮到你问的时候，用同一份问题文案，靠特征名（红/圆/大/刺/串/树）当输入指令
FEATURE_QUESTIONS = dict(QUESTIONS)


def ask_yes_no(question):
    return input(question + "（输入 是/否）：").strip() == "是"


def learn_new_fruit(answers):
    real_name = input("你能直接告诉我这是什么水果吗（说出它的名字）？").strip()
    if not real_name:
        print("好吧，那这次先算了。")
        return
    if any(f["name"] == real_name for f in FRUITS):
        print(f"哦，「{real_name}」我其实认识，只是刚才的特征凑巧跟别的水果撞车了。")
        return
    FRUITS.append({"name": real_name, **answers})
    print(f"学到了！「{real_name}」现在被我记进认识的水果名单了，下次遇到类似的就更容易猜对。")


def ai_guess_your_fruit():
    """AI用排除法猜你心里想的水果，返回这一轮是不是猜对了"""
    candidates = FRUITS[:]
    answers = {}

    for feature, question in QUESTIONS:
        if len(candidates) <= 1:
            break
        answer = ask_yes_no(question)
        answers[feature] = answer
        # 用 .get(feature, answer) 而不是直接 [feature]——万一某个候选水果是之前
        # 猜错时中途学到的，没被问完全部6个特征，缺的那个特征就用当前answer当默认值，
        # 相当于"这一项还不确定，先当它符合"，不会因为数据不全就被误删掉。
        candidates = [f for f in candidates if f.get(feature, answer) == answer]

    if len(candidates) == 1:
        guess = candidates[0]["name"]
        print(f"AI猜：{guess}！")
        if ask_yes_no("AI猜对了吗？"):
            print("猜对了！")
            return True
        print("猜错了——这几个特征凑巧跟别的水果撞车了。")
        learn_new_fruit(answers)
        return False

    reason = "问遍了所有特征，还是有好几个水果对得上" if len(candidates) > 1 else "问着问着发现没有一种水果的特征全部对得上"
    print(f"{reason}，AI猜不出来了……")
    learn_new_fruit(answers)
    return False


def you_guess_ai_fruit():
    """反过来，AI心里想一个水果，换你问特征来猜，返回你问了几个特征"""
    # 只从"6个特征全部知道"的水果里选——之前猜错时中途学到的新水果，
    # 可能只记了一两个特征，如果被选中当秘密水果，你问到它没被记过的
    # 特征时，AI会答不上来，所以这种"半吊子"的新水果暂时不参与这个环节。
    known_fruits = [f for f in FRUITS if all(feature in f for feature, _ in QUESTIONS)]
    secret = random.choice(known_fruits)
    names = [f["name"] for f in known_fruits]
    print(f"\\n换你来猜！这次AI心里想的水果，是这 {len(names)} 种之一：{'、'.join(names)}")
    print("输入 红/圆/大/刺/串/树 中的一个字问特征，AI会如实回答；想好了就直接打水果的名字来猜。")

    asked = 0
    while True:
        raw = input("\\n问特征或者猜名字：").strip()
        if not raw:
            continue
        if raw in FEATURE_QUESTIONS:
            asked += 1
            print(f"{FEATURE_QUESTIONS[raw]}——{'是' if secret[raw] else '否'}")
            continue
        if raw == secret["name"]:
            print(f"猜对了！你问了 {asked} 个特征就找到了答案。")
            return asked
        print(f"不对，AI心里想的不是「{raw}」——可以继续问特征，或者再猜一次。")


print("这个AI认识的水果一开始有9种：苹果、香蕉、草莓、西瓜、樱桃、葡萄、橙子、菠萝、荔枝。")
print("每一轮先是AI猜你的水果，猜完之后反过来轮到你猜AI的水果！")
print("如果AI猜错了或者猜不出来，告诉它真正的水果是什么，它会把这个新水果学进去，之后就认识了。\\n")

correct = 0
total = 0

while True:
    print(f"--- 第 {total + 1} 轮：AI 先猜你的水果 ---")
    if ai_guess_your_fruit():
        correct += 1
    total += 1

    you_guess_ai_fruit()

    again = input("\\n再来一轮吗？（输入 是/否）：").strip()
    if again != "是":
        break
    print()

print(f"\\n最终成绩：AI在你出的 {total} 道题里，答对了 {correct} 个。")
print(f"现在AI认识的水果一共有 {len(FRUITS)} 种了。")
print("这就是为什么用AI的时候，不能盲目相信它的每一个答案，得自己核实——")
print("发现错误、告诉它正确答案，它才能跟着学到新东西，这也是真实AI改进的方式之一。")`,
    hint: `想让AI很快猜中，就想一个特征很鲜明的水果（比如香蕉）；想考验AI，就想樱桃或者荔枝。反过来轮到你猜的时候，也可以用排除法：先问区分度高的特征（红/圆/大），把候选缩小到一两个，再问细节特征（刺/串/树）锁定答案，不用一个个水果名字瞎猜。`,
    walkthrough: [
      { lines: [1, 1], note: `反过来轮到你猜的环节，AI要偷偷从候选水果里随机选一个当"秘密水果"，需要用到这个内置模块。` },
      { lines: [3, 6], note: `开头注释点明这一关的核心思路："排除法"——现在改成AI先猜你的、你再猜AI的，两边轮流体验同一套算法。` },
      { lines: [8, 18], note: `AI"认识"的水果，一开始有9种，每种都标了6个特征——这就是AI最初的全部知识；游戏过程中学到的新水果，也会追加进这份名单，只是可能没有全部6个特征。` },
      { lines: [20, 28], note: `每个特征配一句怎么问，顺序也是排除的顺序——先问区分度高的特征（颜色、形状、大小），刺、串、树这种更细节的特征放后面，专门用来区分长得很像的水果，比如樱桃和荔枝。` },
      { lines: [30, 31], note: `新增：把QUESTIONS这份"特征->问句"的列表转成字典，反过来轮到你问的时候，直接用特征名（比如"红"）当输入指令去查对应的问句文案，不用另外重写一份。` },
      { lines: [34, 35], note: `小工具函数：把"是/否"的文字回答转换成True/False，方便后面直接拿来跟每种水果的特征值比对。` },
      { lines: [38, 47], note: `猜错/猜不出来之后，直接问真正的水果叫什么——如果这个名字AI其实已经认识，就提示一下，不重复添加；如果确实是没见过的新水果，就把它连同已经问到的特征一起追加进FRUITS。` },
      { lines: [50, 63], note: `把原来的排除法主循环包成一个独立函数：依次问每个特征，把答案存进answers，用 .get(feature, answer) 让缺数据的候选水果不会被误判排除。` },
      { lines: [65, 73], note: `候选恰好剩1个：这就是AI的最终猜测，问你"猜对了吗"；猜对了返回True，猜错了调用"学新水果"再返回False。` },
      { lines: [75, 78], note: `候选剩好几个或者一个都不剩：AI老实承认猜不出来，同样调用"学新水果"，返回False——这个函数到这里全部走完，把"猜没猜对"这个结果交给外面。` },
      { lines: [81, 90], note: `新增的反向函数：AI从当前水果里随机选一个当秘密水果——但只从"6个特征全部知道"的挑（新增的这行过滤），中途学到的、特征还没记全的新水果不参与，不然你问到它没被记过的特征，AI会不知道怎么回答；然后告诉你候选名单一共有几种、分别是谁，以及怎么问特征。` },
      { lines: [92, 104], note: `主循环：你可以输入特征名问是非题（从FEATURE_QUESTIONS里查对应的问句，如实回答是/否），也可以直接打水果名字来猜——猜对了把问了几个特征交出去，猜错了提示可以继续问或者再猜。` },
      { lines: [107, 109], note: `开场白：说明这次是"AI先猜你的，你再猜AI的"这个来回结构。` },
      { lines: [111, 112], note: `记两个数字：一共考了几轮、AI答对了几轮，最后要用来算成绩。` },
      { lines: [114, 118], note: `每一轮先跑"AI猜你的水果"，猜对了correct计数+1，不管猜没猜对total都要+1。` },
      { lines: [120, 120], note: `紧接着跑反过来的部分，轮到你来猜AI心里想的水果。` },
      { lines: [122, 125], note: `问你还要不要再来一轮，回答"否"（或者其他任何不是"是"的内容）就跳出循环，结束游戏。` },
      { lines: [127, 130], note: `游戏结束，算出AI这边的最终成绩，报一下现在认识的水果一共有几种了；最后点明：发现错误、告诉它正确答案，它才能跟着学到新东西，这也是真实AI改进的方式之一。` },
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
