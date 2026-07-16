const LEVEL_12 = {
  id: 12,
  title: `毕业关：做出你自己的猜数字游戏`,
  why: `这一关和 ai-games 里"AI猜数字"刚好是反过来的关系：那边是AI用二分法猜你心里的数，这里是你自己写代码猜电脑心里的数。循环+判断的结构其实一模一样。`,
  variants: [
    {
      explain: `
          <p>把前面学的都用上：变量、input、if、循环——写一个"猜数字"小游戏。</p>
          <p>电脑心里想好一个数字 <code>secret = 7</code>，玩家不断猜，
          程序告诉他"太大了"或"太小了"，猜中后打印"猜对了！"并结束。</p>
          <p>思路提示：</p>
          <ol>
            <li>用 input() + int() 获取玩家第一次猜的数字</li>
            <li>用 while 循环：只要猜的数字不等于secret就一直问</li>
            <li>循环里用 if/else 判断猜大了还是猜小了</li>
            <li>猜对了，打印"猜对了！"</li>
          </ol>
          <p><strong>恭喜通关！</strong>侧栏点"🎮 AI小游戏"，去玩4个真正的AI小游戏——
          对照着代码，看看是不是能认出这一关学的变量、循环、if、input，那些"AI"其实都是你已经学会的东西拼出来的。</p>
        `,
      starter: `secret = 7
# 用 int(input(...)) 获取玩家猜的数字，存到 guess
# 用 while 循环：只要 guess != secret 就一直问
#   循环里：如果 guess > secret 打印"太大了"，否则打印"太小了"
#   然后重新问一次，更新 guess
# 循环结束后打印"猜对了！"
`,
      hint: `模拟输入框里每行写一个猜测数字，比如：5 / 8 / 7 ，让它们一步步逼近7。别忘了循环里要重新调用 input() 更新 guess，不然会死循环。`,
      answer: `secret = 7
guess = int(input("猜一个数字："))
while guess != secret:
    if guess > secret:
        print("太大了")
    else:
        print("太小了")
    guess = int(input("再猜一个："))
print("猜对了！")`,
      needsInput: true,
      defaultInput: `5
8
7`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !r.code.includes("input(")) {
            return { pass: false, message: "代码里要用到 while 循环和 input()，不断询问玩家，而不是直接打印'猜对了！'。" };
          }
          if (r.stdout.includes("猜对了")) {
            return { pass: true, message: "毕业啦！点侧栏的'🎮 AI小游戏'去玩真正的AI小游戏吧。" };
          }
          return { pass: false, message: "模拟输入里的数字最终要等于secret（7），并且要打印出'猜对了！'才算通关。" };
        },
    },
    {
      explain: `
          <p>在基础版猜数字上加一个功能：用计数器统计玩家一共猜了几次，猜中后连次数一起打印出来。</p>
          <p>电脑心里想好一个数字 <code>secret = 15</code>，每猜一次计数器加1，
          猜中后打印"猜对了！"和"你用了X次猜中！"。</p>
        `,
      starter: `secret = 15
count = 0
# 用 int(input(...)) 获取玩家猜的数字，存到 guess
# count += 1
# 用 while 循环：只要 guess != secret 就一直问（记得每次问完 count += 1）
#   循环里：如果 guess > secret 打印"太大了"，否则打印"太小了"
# 循环结束后打印"猜对了！"，再打印 f"你用了{count}次猜中！"
`,
      hint: `模拟输入框里写：10 / 20 / 15，一步步逼近15。别忘了每问一次就要把count加1（count += 1），循环内外都要加。`,
      answer: `secret = 15
count = 0
guess = int(input("猜一个数字："))
count += 1
while guess != secret:
    if guess > secret:
        print("太大了")
    else:
        print("太小了")
    guess = int(input("再猜一个："))
    count += 1
print("猜对了！")
print(f"你用了{count}次猜中！")`,
      needsInput: true,
      defaultInput: `10
20
15`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !r.code.includes("input(")) {
            return { pass: false, message: "代码里要用到 while 循环和 input()，不断询问玩家。" };
          }
          if (!r.code.includes("+= 1") && !r.code.includes("+=1")) {
            return { pass: false, message: "这一关要用一个计数器统计猜测次数，检查一下有没有用 count += 1 这样的写法。" };
          }
          if (r.stdout.includes("猜对了") && r.stdout.includes("次猜中")) {
            return { pass: true, message: "毕业啦！加上计数器之后，游戏还能告诉玩家用了几次才猜中。点侧栏的'🎮 AI小游戏'去玩真正的AI小游戏吧。" };
          }
          return { pass: false, message: "要打印'猜对了！'和'你用了X次猜中！'两句话才算通关，检查一下有没有都写。" };
        },
    },
    {
      explain: `
          <p>限制最多只能猜3次，猜不中就算失败。</p>
          <p>电脑心里想好一个数字 <code>secret = 7</code>，最多让玩家猜3次：
          猜中了提前打印"猜对了！"并用break跳出；3次都没猜中，打印"太可惜了，没猜中"。</p>
        `,
      starter: `secret = 7
max_tries = 3
tries = 0
found = False
# 用 while 循环：只要 tries < max_tries 就继续
#   int(input(...)) 获取猜测，tries += 1
#   如果猜中：打印"猜对了！"，found = True，break
#   否则：打印"太大了"或"太小了"
# 循环结束后，如果 not found，打印"太可惜了，没猜中"
`,
      hint: `模拟输入框写：5 / 8 / 7，第3次正好猜中。别忘了猜中时要用 break 提前跳出循环，并且把 found 设成 True。`,
      answer: `secret = 7
max_tries = 3
tries = 0
found = False
while tries < max_tries:
    guess = int(input("猜一个数字："))
    tries += 1
    if guess == secret:
        print("猜对了！")
        found = True
        break
    else:
        if guess > secret:
            print("太大了")
        else:
            print("太小了")
if not found:
    print("太可惜了，没猜中")`,
      needsInput: true,
      defaultInput: `5
8
7`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !r.code.includes("input(")) {
            return { pass: false, message: "代码里要用到 while 循环和 input()，不断询问玩家，而不是直接打印'猜对了！'。" };
          }
          if (!r.code.includes("break")) {
            return { pass: false, message: "这一关猜中时要用 break 提前跳出循环，检查一下代码里有没有 break。" };
          }
          if (!r.code.includes("tries") && !r.code.includes("max_tries")) {
            return { pass: false, message: "这一关要限制最多猜的次数，检查一下有没有用一个变量记录已经猜了几次。" };
          }
          if (r.stdout.includes("猜对了")) {
            return { pass: true, message: "毕业啦！限制次数之后，游戏多了一点挑战性。点侧栏的'🎮 AI小游戏'去玩真正的AI小游戏吧。" };
          }
          return { pass: false, message: "按照默认输入应该在第3次就能猜中并打印'猜对了！'，检查一下逻辑。" };
        },
    },
    {
      explain: `
          <p>这次猜的不是数字，是一个词——用字符串比较代替数字大小比较。</p>
          <p>电脑心里想好一个动物 <code>secret = "大象"</code>，玩家不断猜（不用int()转换，直接比较文字），
          猜错了打印"再想想"，猜中了打印"猜对了！"。</p>
        `,
      starter: `secret = "大象"
# 用 input() 获取玩家猜的动物（不用int()，直接是文字）
# 用 while 循环：只要猜的和secret不一样就一直问
#   打印"再想想"
#   重新 input() 问一次
# 循环结束后打印"猜对了！"
`,
      hint: `模拟输入框写：狮子 / 老虎 / 大象。这一关猜的是文字，不需要用int()转换。`,
      answer: `secret = "大象"
guess = input("猜一个动物：")
while guess != secret:
    print("再想想")
    guess = input("再猜一个：")
print("猜对了！")`,
      needsInput: true,
      defaultInput: `狮子
老虎
大象`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !r.code.includes("input(")) {
            return { pass: false, message: "代码里要用到 while 循环和 input()，不断询问玩家。" };
          }
          if (/\bint\(/.test(r.code)) {
            return { pass: false, message: "这一关猜的是文字，不需要用 int() 转换成数字，检查一下是不是多此一举了。" };
          }
          if (r.stdout.includes("猜对了")) {
            return { pass: true, message: "毕业啦！同样的while+input结构，不仅能猜数字，也能猜文字。点侧栏的'🎮 AI小游戏'去玩真正的AI小游戏吧。" };
          }
          return { pass: false, message: "模拟输入里最终要猜出'大象'，并且打印'猜对了！'才算通关。" };
        },
    },
    {
      explain: `
          <p>加一个"范围检查"：如果玩家猜的数字超出1到100，额外提醒一下。</p>
          <p>电脑心里想好一个数字 <code>secret = 50</code>，如果猜的数字小于1或大于100，
          打印"超出范围了！"；否则正常判断"太大了"/"太小了"；猜中打印"猜对了！"。</p>
        `,
      starter: `secret = 50
# 用 int(input(...)) 获取猜测，存到 guess
# 用 while 循环：只要 guess != secret 就一直问
#   如果 guess < 1 or guess > 100：打印"超出范围了！"
#   elif guess > secret：打印"太大了"
#   否则：打印"太小了"
#   重新 input() 问一次
# 循环结束后打印"猜对了！"
`,
      hint: `模拟输入框写：150 / 30 / 70 / 50。第一次故意超出范围看看提示，后面几次正常逼近50。`,
      answer: `secret = 50
guess = int(input("猜一个数字（1-100）："))
while guess != secret:
    if guess < 1 or guess > 100:
        print("超出范围了！")
    elif guess > secret:
        print("太大了")
    else:
        print("太小了")
    guess = int(input("再猜一个："))
print("猜对了！")`,
      needsInput: true,
      defaultInput: `150
30
70
50`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\belif\b/.test(r.code)) {
            return { pass: false, message: "这一关要用 elif 处理'超出范围'和'太大/太小'两种不同的情况，检查一下有没有用elif。" };
          }
          if (!/\bor\b/.test(r.code)) {
            return { pass: false, message: "判断'超出范围'要用 or 合并两个条件（小于1 或 大于100），检查一下有没有用or。" };
          }
          if (r.stdout.includes("超出范围了") && r.stdout.includes("猜对了")) {
            return { pass: true, message: "毕业啦！加了范围检查之后，游戏能应对更多不合理的输入了。点侧栏的'🎮 AI小游戏'去玩真正的AI小游戏吧。" };
          }
          return { pass: false, message: "要先看到一次'超出范围了！'，最后打印'猜对了！'才算通关，检查一下逻辑和模拟输入。" };
        },
    },
    {
      explain: `
          <p>用列表记录玩家猜过的每一个数字，猜中后把历史记录一起打印出来。</p>
          <p>电脑心里想好一个数字 <code>secret = 7</code>，每猜一次就用 <code>.append()</code>
          记进列表 history，猜中后打印"猜对了！"和完整的历史记录。</p>
        `,
      starter: `secret = 7
history = []
# 用 int(input(...)) 获取猜测，存到 guess，用 history.append(guess) 记下来
# 用 while 循环：只要 guess != secret 就一直问
#   打印"太大了"或"太小了"
#   重新 input() 并 append 到 history
# 循环结束后打印"猜对了！"
# 打印 f"你一共猜了这些数字：{history}"
`,
      hint: `模拟输入框写：5 / 8 / 7。别忘了每次猜测（包括第一次和每次循环里）都要用 history.append(guess) 记下来。`,
      answer: `secret = 7
history = []
guess = int(input("猜一个数字："))
history.append(guess)
while guess != secret:
    if guess > secret:
        print("太大了")
    else:
        print("太小了")
    guess = int(input("再猜一个："))
    history.append(guess)
print("猜对了！")
print(f"你一共猜了这些数字：{history}")`,
      needsInput: true,
      defaultInput: `5
8
7`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !r.code.includes("input(")) {
            return { pass: false, message: "代码里要用到 while 循环和 input()，不断询问玩家，而不是直接打印'猜对了！'。" };
          }
          if (!r.code.includes(".append(")) {
            return { pass: false, message: "这一关要用 .append() 把每次猜测记进 history 列表，检查一下代码里有没有用到。" };
          }
          if (r.stdout.includes("猜对了") && r.stdout.includes("你一共猜了")) {
            return { pass: true, message: "毕业啦！用列表记录整个猜测过程，是很实用的调试/回顾技巧。点侧栏的'🎮 AI小游戏'去玩真正的AI小游戏吧。" };
          }
          return { pass: false, message: "要打印'猜对了！'和'你一共猜了这些数字：...'才算通关，检查一下有没有都写。" };
        },
    }
  ],
};
