// 每一关的内容：讲解、初始代码（只给骨架，不给答案）、提示、以及判断"过关"的检查函数。
// check(result) 返回 { pass: boolean, message: string }，result = { stdout, err, code }
// explainError(err) 定义在 app.js 里，把Python的报错翻译成人话。
// why 是可选的"为什么"小贴士，针对这一关最容易问的深层问题，放在关卡顶层（跟具体样子无关）。
// 部分check()会顺带看一眼code，防止不用对应知识点、直接把答案写死也能过关。
//
// variants：每一关准备了几个"样子"（考的知识点/难度完全一样，具体题目不同），
// 第一次打开某一关、或者点了"重置进度"之后，会随机选一个样子固定下来——
// 这样重新学一遍的时候，题目不会一模一样，但教的东西还是同一个。
// 挑选逻辑在 app.js 的 resolveVariant() 里。

const LEVELS = [
  {
    id: 1,
    title: "第1关：打印 print()",
    why: `print() 是Python内置的"向屏幕输出"的函数。你在终端/网页里看到的所有文字结果，本质上都是程序调用类似print()的东西，把数据写到了"输出通道"里。`,
    variants: [
      {
        explain: `
          <p>写程序的第一件事，几乎所有人都是从让电脑"说话"开始的。</p>
          <p>在 Python 里，<code>print()</code> 可以把括号里的内容显示在屏幕上，比如：</p>
          <pre>print("我是编程新手")</pre>
          <p>在下面的代码框里写一行代码，打印出："你好，世界！"（包括标点符号）。</p>
        `,
        starter: `# 在下面写一行代码
# 用 print() 打印出：你好，世界！
`,
        hint: `记得文字要用引号 "" 包起来，Python 才知道这是一段文字（叫"字符串"）。格式是 print("你好，世界！")`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.trim().length === 0) {
            return { pass: false, message: "还没有看到任何输出，试试用 print(\"你好，世界！\") 打印点东西。" };
          }
          if (r.stdout.includes("你好") && r.stdout.includes("世界")) {
            return { pass: true, message: "太棒了！你写出了第一行能运行的代码。" };
          }
          return { pass: false, message: "有输出了，但内容不太对，检查一下是不是打印的正好是'你好，世界！'。" };
        },
      },
      {
        explain: `
          <p>写程序的第一件事，几乎所有人都是从让电脑"说话"开始的。</p>
          <p>在 Python 里，<code>print()</code> 可以把括号里的内容显示在屏幕上，比如：</p>
          <pre>print("我是编程新手")</pre>
          <p>在下面的代码框里写一行代码，打印出："Python真好玩！"（包括标点符号）。</p>
        `,
        starter: `# 在下面写一行代码
# 用 print() 打印出：Python真好玩！
`,
        hint: `记得文字要用引号 "" 包起来，Python 才知道这是一段文字（叫"字符串"）。格式是 print("Python真好玩！")`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.trim().length === 0) {
            return { pass: false, message: "还没有看到任何输出，试试用 print(\"Python真好玩！\") 打印点东西。" };
          }
          if (r.stdout.includes("Python") && r.stdout.includes("好玩")) {
            return { pass: true, message: "太棒了！你写出了第一行能运行的代码。" };
          }
          return { pass: false, message: "有输出了，但内容不太对，检查一下是不是打印的正好是'Python真好玩！'。" };
        },
      },
    ],
  },
  {
    id: 2,
    title: "第2关：变量是什么",
    why: `为什么要用变量而不是直接print("你的名字")？因为变量能被反复使用和修改——存一次，后面随时用名字取用，不用每次都重新打一遍值。这是几乎所有程序的基础。`,
    variants: [
      {
        explain: `
          <p>变量就像一个贴了标签的盒子，用来装数据，方便以后取用。</p>
          <pre>name = "小明"
age = 13
print(name)
print(age)</pre>
          <p>等号 <code>=</code> 在这里不是"等于"，而是"把右边的值放进左边这个盒子里"。</p>
          <p>在下面创建一个叫 <code>my_name</code> 的变量，装上你的名字，再用 print() 打印出来。</p>
        `,
        starter: `# 创建一个变量 my_name，存放你的名字
# 然后用 print(my_name) 打印出来
`,
        hint: `变量名不能有空格，也不能用数字开头。文字记得加引号，格式是 my_name = "你的名字"，然后另起一行 print(my_name)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.trim().length === 0) {
            return { pass: false, message: "记得要创建变量并且 print() 出来才能看到结果哦。" };
          }
          if (!/\w+\s*=(?!=)/.test(r.code)) {
            return { pass: false, message: "看到输出了，但代码里好像没有真的创建变量（比如 my_name = ...），检查一下有没有用等号赋值。" };
          }
          return { pass: true, message: "很好，你已经学会用变量存东西了。" };
        },
      },
      {
        explain: `
          <p>变量就像一个贴了标签的盒子，用来装数据，方便以后取用。</p>
          <pre>color = "蓝色"
age = 13
print(color)
print(age)</pre>
          <p>等号 <code>=</code> 在这里不是"等于"，而是"把右边的值放进左边这个盒子里"。</p>
          <p>在下面创建一个叫 <code>my_color</code> 的变量，装上你最喜欢的颜色，再用 print() 打印出来。</p>
        `,
        starter: `# 创建一个变量 my_color，存放你最喜欢的颜色
# 然后用 print(my_color) 打印出来
`,
        hint: `变量名不能有空格，也不能用数字开头。文字记得加引号，格式是 my_color = "你喜欢的颜色"，然后另起一行 print(my_color)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.trim().length === 0) {
            return { pass: false, message: "记得要创建变量并且 print() 出来才能看到结果哦。" };
          }
          if (!/\w+\s*=(?!=)/.test(r.code)) {
            return { pass: false, message: "看到输出了，但代码里好像没有真的创建变量（比如 my_color = ...），检查一下有没有用等号赋值。" };
          }
          return { pass: true, message: "很好，你已经学会用变量存东西了。" };
        },
      },
    ],
  },
  {
    id: 3,
    title: "第3关：数字运算",
    why: `为什么不能直接写死答案数字？因为如果之后数值变了（比如金额、年龄换了别的数），写死的答案就不对了。用变量算出来的代码可以复用，这是编程和"手算"最大的区别。`,
    variants: [
      {
        explain: `
          <p>Python 可以当计算器用：<code>+ - * /</code> 分别是加减乘除。</p>
          <pre>a = 10
b = 3
print(a + b)
print(a - b)</pre>
          <p>试着算一下：如果你今年13岁，10年后你多少岁？创建两个变量（当前年龄、10年后要加的年数），
          算出结果存进第三个变量，再打印出来——不要直接写死答案数字。</p>
        `,
        starter: `# 创建变量 age，值是13
# 创建变量 years_later，值是10
# 算出 future_age = age + years_later
# 打印 future_age
`,
        hint: `格式大概是：age = 13 / years_later = 10 / future_age = age + years_later / print(future_age)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\d/.test(r.stdout)) {
            return { pass: false, message: "输出里没有看到数字，检查一下有没有 print() 出计算结果。" };
          }
          if (!r.stdout.includes("23")) {
            return { pass: false, message: "打印出数字了，但结果不是23，检查一下 age 和 years_later 的值，以及加法有没有写对。" };
          }
          if (!r.code.includes("+")) {
            return { pass: false, message: "结果对了，但代码里好像没有用加法（+）——是不是直接把23写死了？改成用 age + years_later 真正算出来。" };
          }
          return { pass: true, message: "运算成功！13岁10年后是23岁，算对了。" };
        },
      },
      {
        explain: `
          <p>Python 可以当计算器用：<code>+ - * /</code> 分别是加减乘除。</p>
          <pre>a = 10
b = 3
print(a + b)
print(a - b)</pre>
          <p>试着算一下：你有6元零花钱，妈妈又给了你9元，现在一共多少钱？创建两个变量（原来的钱、妈妈给的钱），
          算出结果存进第三个变量，再打印出来——不要直接写死答案数字。</p>
        `,
        starter: `# 创建变量 pocket_money，值是6
# 创建变量 given_money，值是9
# 算出 total_money = pocket_money + given_money
# 打印 total_money
`,
        hint: `格式大概是：pocket_money = 6 / given_money = 9 / total_money = pocket_money + given_money / print(total_money)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\d/.test(r.stdout)) {
            return { pass: false, message: "输出里没有看到数字，检查一下有没有 print() 出计算结果。" };
          }
          if (!r.stdout.includes("15")) {
            return { pass: false, message: "打印出数字了，但结果不是15，检查一下 pocket_money 和 given_money 的值，以及加法有没有写对。" };
          }
          if (!r.code.includes("+")) {
            return { pass: false, message: "结果对了，但代码里好像没有用加法（+）——是不是直接把15写死了？改成用 pocket_money + given_money 真正算出来。" };
          }
          return { pass: true, message: "运算成功！6元加9元一共15元，算对了。" };
        },
      },
    ],
  },
  {
    id: 4,
    title: "第4关：拼接文字（f-string）",
    why: `为什么不直接写死一整句话？因为那样里面的内容就不是变量了，换个人换个值就要重新改代码。f-string的价值在于：内容跟着变量变化，代码本身不用动。`,
    variants: [
      {
        explain: `
          <p>想把变量和文字拼在一起显示，可以在字符串前加一个 <code>f</code>，然后用花括号 <code>{}</code> 把变量包起来：</p>
          <pre>city = "北京"
print(f"我住在{city}")</pre>
          <p>创建 name（你的名字）和 age（你的年龄）两个变量，
          用 f-string 打印出："我叫xxx，今年xx岁"（xxx换成变量的值）。</p>
        `,
        starter: `# 创建变量 name 和 age
# 用 f-string 打印："我叫{name}，今年{age}岁"
`,
        hint: `别忘了字符串前面的 f，格式是 print(f"我叫{name}，今年{age}岁")，花括号里不要再加引号。`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.includes("{")) {
            return { pass: false, message: "花括号好像没有被替换成变量的值，检查一下字符串前面有没有加 f。" };
          }
          if (!r.code.includes("name") || !r.code.includes("age")) {
            return { pass: false, message: "检查一下代码里有没有真的创建 name 和 age 这两个变量，而不是把文字写死。" };
          }
          if (r.stdout.includes("我叫") && r.stdout.includes("岁")) {
            return { pass: true, message: "拼接成功！f-string 以后会经常用到。" };
          }
          return { pass: false, message: "还没看到符合格式的输出，检查一下是不是打印了'我叫...，今年...岁'。" };
        },
      },
      {
        explain: `
          <p>想把变量和文字拼在一起显示，可以在字符串前加一个 <code>f</code>，然后用花括号 <code>{}</code> 把变量包起来：</p>
          <pre>city = "北京"
print(f"我住在{city}")</pre>
          <p>创建 city（你住的城市）和 hobby（你的爱好）两个变量，
          用 f-string 打印出："我住在xxx，喜欢xxx"（xxx换成变量的值）。</p>
        `,
        starter: `# 创建变量 city 和 hobby
# 用 f-string 打印："我住在{city}，喜欢{hobby}"
`,
        hint: `别忘了字符串前面的 f，格式是 print(f"我住在{city}，喜欢{hobby}")，花括号里不要再加引号。`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.includes("{")) {
            return { pass: false, message: "花括号好像没有被替换成变量的值，检查一下字符串前面有没有加 f。" };
          }
          if (!r.code.includes("city") || !r.code.includes("hobby")) {
            return { pass: false, message: "检查一下代码里有没有真的创建 city 和 hobby 这两个变量，而不是把文字写死。" };
          }
          if (r.stdout.includes("我住在") && r.stdout.includes("喜欢")) {
            return { pass: true, message: "拼接成功！f-string 以后会经常用到。" };
          }
          return { pass: false, message: "还没看到符合格式的输出，检查一下是不是打印了'我住在...，喜欢...'。" };
        },
      },
    ],
  },
  {
    id: 5,
    title: "第5关：获取用户输入",
    why: `为什么不直接把内容写死？因为input()能让同一份代码对每个使用它的人都不一样——这是程序能"互动"的关键，AI聊天机器人本质上也是从接收用户输入开始的。`,
    variants: [
      {
        explain: `
          <p><code>input()</code> 可以让程序暂停，等着用户在屏幕上打字。</p>
          <pre>answer = input("你今天开心吗？")
print(answer)</pre>
          <p>这一关比较特殊：因为是在网页里模拟运行，右边多了一个"模拟输入"框，
          在里面按顺序写好你要输入的内容（一行代表一次 input()），再点运行。</p>
          <p>用 input() 问用户"你叫什么名字？"，存到变量 name 里，再用 f-string 打印"你好，{name}！"。</p>
        `,
        starter: `# 用 input() 问："你叫什么名字？"，存到变量 name
# 用 f-string 打印："你好，{name}！"
`,
        hint: `格式大概是：name = input("你叫什么名字？") 然后 print(f"你好，{name}！")`,
        needsInput: true,
        defaultInput: "小明",
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("input(")) {
            return { pass: false, message: "代码里好像没有用到 input()，这一关的重点就是用它接收用户输入。" };
          }
          if (r.stdout.includes("你好")) return { pass: true, message: "完美，你已经学会怎么和程序'对话'了。" };
          return { pass: false, message: "还没看到'你好'开头的输出，检查一下有没有用 input() 接住变量，再打印出来。" };
        },
      },
      {
        explain: `
          <p><code>input()</code> 可以让程序暂停，等着用户在屏幕上打字。</p>
          <pre>answer = input("你今天开心吗？")
print(answer)</pre>
          <p>这一关比较特殊：因为是在网页里模拟运行，右边多了一个"模拟输入"框，
          在里面按顺序写好你要输入的内容（一行代表一次 input()），再点运行。</p>
          <p>用 input() 问用户"你最喜欢什么颜色？"，存到变量 color 里，再用 f-string 打印"我也喜欢{color}！"。</p>
        `,
        starter: `# 用 input() 问："你最喜欢什么颜色？"，存到变量 color
# 用 f-string 打印："我也喜欢{color}！"
`,
        hint: `格式大概是：color = input("你最喜欢什么颜色？") 然后 print(f"我也喜欢{color}！")`,
        needsInput: true,
        defaultInput: "蓝色",
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("input(")) {
            return { pass: false, message: "代码里好像没有用到 input()，这一关的重点就是用它接收用户输入。" };
          }
          if (r.stdout.includes("我也喜欢")) return { pass: true, message: "完美，你已经学会怎么和程序'对话'了。" };
          return { pass: false, message: "还没看到'我也喜欢'开头的输出，检查一下有没有用 input() 接住变量，再打印出来。" };
        },
      },
    ],
  },
  {
    id: 6,
    title: "第6关：if 判断",
    why: `为什么不能直接打印固定结果？因为那样不管条件是什么都只会打印同一句话，程序就失去了"判断"的意义。if的价值在于：不同的输入，走不同的分支，产生不同的结果。`,
    variants: [
      {
        explain: `
          <p>程序需要"做判断"：如果满足条件就做A，不满足就做B。</p>
          <pre>age = 13
if age >= 18:
    print("你是成年人")
else:
    print("你是未成年人")</pre>
          <p>注意冒号 <code>:</code> 和缩进（每行前面的空格），Python 靠缩进来分辨"哪些代码属于if里面"。</p>
          <p>创建变量 score，写一个判断：如果分数大于等于60，打印"及格"，否则打印"不及格"。</p>
        `,
        starter: `# 创建变量 score，随便给个分数
# 写 if / else：分数>=60 打印"及格"，否则打印"不及格"
`,
        hint: `冒号后面换行，下一行要缩进（一般是4个空格）。格式：if score >= 60: 换行缩进 print("及格") 另起一行 else: 换行缩进 print("不及格")`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bif\b/.test(r.code)) {
            return { pass: false, message: "代码里好像没有用到 if，这一关的重点是让程序自己做判断，不是直接打印结果。" };
          }
          if (r.stdout.includes("及格")) return { pass: true, message: "if判断学会了，这是编程里最常用的东西之一。" };
          return { pass: false, message: "还没看到'及格'或'不及格'，检查一下 if/else 的条件和 print() 有没有写对。" };
        },
      },
      {
        explain: `
          <p>程序需要"做判断"：如果满足条件就做A，不满足就做B。</p>
          <pre>age = 13
if age >= 18:
    print("你是成年人")
else:
    print("你是未成年人")</pre>
          <p>注意冒号 <code>:</code> 和缩进（每行前面的空格），Python 靠缩进来分辨"哪些代码属于if里面"。</p>
          <p>创建变量 temperature，写一个判断：如果温度大于等于30度，打印"好热"，否则打印"还好"。</p>
        `,
        starter: `# 创建变量 temperature，随便给个温度
# 写 if / else：温度>=30 打印"好热"，否则打印"还好"
`,
        hint: `冒号后面换行，下一行要缩进（一般是4个空格）。格式：if temperature >= 30: 换行缩进 print("好热") 另起一行 else: 换行缩进 print("还好")`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bif\b/.test(r.code)) {
            return { pass: false, message: "代码里好像没有用到 if，这一关的重点是让程序自己做判断，不是直接打印结果。" };
          }
          if (r.stdout.includes("好热")) return { pass: true, message: "if判断学会了，这是编程里最常用的东西之一。" };
          return { pass: false, message: "还没看到'好热'或'还好'，检查一下 if/else 的条件和 print() 有没有写对。" };
        },
      },
    ],
  },
  {
    id: 7,
    title: "第7关：for 循环",
    why: `为什么不直接写很多个print？因为如果要打印1到10000，手写一万行不现实。循环让"重复"这件事本身变成代码，数量再大也只需要一样多的代码。`,
    variants: [
      {
        explain: `
          <p>循环可以让电脑帮你重复做一件事，不用自己写100遍。</p>
          <pre>for i in range(5):
    print(f"第{i}次")</pre>
          <p><code>range(5)</code> 会依次给出 0,1,2,3,4 这5个数字。</p>
          <p>用 for 循环打印出1到10（每个数字一行）。</p>
        `,
        starter: `# 用 for 循环和 range()，打印1到10
`,
        hint: `range(1, 11) 会从1数到10（不包含11）。格式：for i in range(1, 11): 换行缩进 print(i)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const nums = r.stdout.trim().split(/\s+/).filter(Boolean);
          if (nums.length < 10) {
            return { pass: false, message: `目前只打印了${nums.length}行，应该要有10行（1到10），检查一下 range() 里的数字。` };
          }
          if (nums[0] === "1" && nums[9] === "10") {
            return { pass: true, message: "循环学会了！以后重复的事都能交给电脑做。" };
          }
          if (nums[0] === "0" && nums[9] === "9") {
            return { pass: false, message: "打印出了10个数字，但是从0到9——range(10) 默认从0开始数。想从1开始，要写 range(1, 11)（这样才会数到1,2,...,10）。" };
          }
          if (nums.every((n) => n === nums[0]) && Number.isNaN(Number(nums[0]))) {
            return { pass: false, message: `打印出来的是文字"${nums[0]}"而不是数字：如果用了f-string，检查一下是不是漏了花括号——要写 print(f"{i}")，把变量i用{}包起来；不用f-string的话，直接 print(i) 就行。` };
          }
          return { pass: false, message: "打印的行数够了，但数字好像不是从1到10，检查一下 range() 的起止值。" };
        },
      },
      {
        explain: `
          <p>循环可以让电脑帮你重复做一件事，不用自己写100遍。</p>
          <pre>for i in range(5):
    print(f"第{i}次")</pre>
          <p><code>range(5)</code> 会依次给出 0,1,2,3,4 这5个数字。</p>
          <p>用 for 循环打印出1到15（每个数字一行）。</p>
        `,
        starter: `# 用 for 循环和 range()，打印1到15
`,
        hint: `range(1, 16) 会从1数到15（不包含16）。格式：for i in range(1, 16): 换行缩进 print(i)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const nums = r.stdout.trim().split(/\s+/).filter(Boolean);
          if (nums.length < 15) {
            return { pass: false, message: `目前只打印了${nums.length}行，应该要有15行（1到15），检查一下 range() 里的数字。` };
          }
          if (nums[0] === "1" && nums[14] === "15") {
            return { pass: true, message: "循环学会了！以后重复的事都能交给电脑做。" };
          }
          if (nums[0] === "0" && nums[14] === "14") {
            return { pass: false, message: "打印出了15个数字，但是从0到14——range(15) 默认从0开始数。想从1开始，要写 range(1, 16)（这样才会数到1,2,...,15）。" };
          }
          if (nums.every((n) => n === nums[0]) && Number.isNaN(Number(nums[0]))) {
            return { pass: false, message: `打印出来的是文字"${nums[0]}"而不是数字：如果用了f-string，检查一下是不是漏了花括号——要写 print(f"{i}")，把变量i用{}包起来；不用f-string的话，直接 print(i) 就行。` };
          }
          return { pass: false, message: "打印的行数够了，但数字好像不是从1到15，检查一下 range() 的起止值。" };
        },
      },
    ],
  },
  {
    id: 8,
    title: "第8关：while 循环",
    why: `for循环和while循环有什么区别？for适合"提前知道要循环几次"的情况；while适合"不知道要循环几次，只看条件满不满足"的情况——比如AI猜数字，不知道要猜几次才能猜中，只能用while。`,
    variants: [
      {
        explain: `
          <p>while 循环会一直重复，直到某个条件不再满足。</p>
          <pre>count = 0
while count < 5:
    print(count)
    count = count + 1</pre>
          <p>要小心：如果忘了让条件变化（比如忘了 count = count + 1），循环会一直停不下来！</p>
          <p>用 while 循环，从10倒数到1（每个数字一行）。</p>
        `,
        starter: `# 创建变量 count，值是10
# 用 while 循环倒数到1，每次打印 count
`,
        hint: `每次循环都要让count变小，不然会陷入"死循环"。格式：count = 10 / while count >= 1: 换行缩进 print(count) 换行缩进 count = count - 1`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const nums = r.stdout.trim().split(/\s+/).filter(Boolean);
          if (nums.length < 10) {
            return { pass: false, message: `目前只打印了${nums.length}行，应该要有10行（10倒数到1），检查一下循环条件。` };
          }
          if (nums[0] === "10" && nums[9] === "1") {
            return { pass: true, message: "while循环也学会了，你现在会两种循环了。" };
          }
          return { pass: false, message: "打印的行数够了，但数字顺序不太对，检查一下是不是从10倒数到1。" };
        },
      },
      {
        explain: `
          <p>while 循环会一直重复，直到某个条件不再满足。</p>
          <pre>count = 0
while count < 5:
    print(count)
    count = count + 1</pre>
          <p>要小心：如果忘了让条件变化（比如忘了 count = count + 1），循环会一直停不下来！</p>
          <p>用 while 循环，从100倒数到91（每个数字一行，一共10个数字）。</p>
        `,
        starter: `# 创建变量 count，值是100
# 用 while 循环倒数到91，每次打印 count
`,
        hint: `每次循环都要让count变小，不然会陷入"死循环"。格式：count = 100 / while count >= 91: 换行缩进 print(count) 换行缩进 count = count - 1`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const nums = r.stdout.trim().split(/\s+/).filter(Boolean);
          if (nums.length < 10) {
            return { pass: false, message: `目前只打印了${nums.length}行，应该要有10行（100倒数到91），检查一下循环条件。` };
          }
          if (nums[0] === "100" && nums[9] === "91") {
            return { pass: true, message: "while循环也学会了，你现在会两种循环了。" };
          }
          return { pass: false, message: "打印的行数够了，但数字顺序不太对，检查一下是不是从100倒数到91。" };
        },
      },
    ],
  },
  {
    id: 9,
    title: "第9关：列表 list",
    why: `为什么不用3个单独的变量（比如fav1、fav2、fav3）？列表能把一堆相关的数据放在一起统一处理，尤其是数量不确定的时候（比如AI小游戏里统计出拳记录），列表比一堆散变量好用得多。`,
    variants: [
      {
        explain: `
          <p>列表可以在一个变量里装很多个东西，用方括号 <code>[]</code>：</p>
          <pre>fruits = ["苹果", "香蕉", "橙子"]
print(fruits[0])</pre>
          <p>注意：列表里的第一个东西下标是 <code>0</code>，不是1！</p>
          <p>做一个装有你3个最喜欢的东西的列表，然后把它们都打印出来（一行一个）。</p>
        `,
        starter: `# 创建一个列表 favorites，装3个你喜欢的东西
# 把列表里的每一项都打印出来，一行一个
`,
        hint: `列表用方括号[]，每一项用逗号分开，用下标取出每一项：favorites = ["篮球", "游戏", "音乐"] / print(favorites[0]) / print(favorites[1]) / print(favorites[2])`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "列表学会了，这是存一堆数据最常用的方式。" };
          return { pass: false, message: `目前只打印了${lines.length}行，列表里至少放3个东西，然后都打印出来。` };
        },
      },
      {
        explain: `
          <p>列表可以在一个变量里装很多个东西，用方括号 <code>[]</code>：</p>
          <pre>fruits = ["苹果", "香蕉", "橙子"]
print(fruits[0])</pre>
          <p>注意：列表里的第一个东西下标是 <code>0</code>，不是1！</p>
          <p>做一个装有你3个最想去的地方的列表，然后把它们都打印出来（一行一个）。</p>
        `,
        starter: `# 创建一个列表 dream_places，装3个你想去的地方
# 把列表里的每一项都打印出来，一行一个
`,
        hint: `列表用方括号[]，每一项用逗号分开，用下标取出每一项：dream_places = ["东京", "巴黎", "纽约"] / print(dream_places[0]) / print(dream_places[1]) / print(dream_places[2])`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "列表学会了，这是存一堆数据最常用的方式。" };
          return { pass: false, message: `目前只打印了${lines.length}行，列表里至少放3个东西，然后都打印出来。` };
        },
      },
    ],
  },
  {
    id: 10,
    title: "第10关：字典 dict",
    why: `为什么不用列表 [小明, 13, 篮球]？列表只能靠位置（第0个、第1个）区分含义，容易搞混；字典用"名字"当索引（比如 me["age"]），一眼就知道取的是什么，代码更容易看懂。`,
    variants: [
      {
        explain: `
          <p>字典用"键值对"存数据，比列表更适合表示"一个东西的多个属性"：</p>
          <pre>person = {"name": "小明", "age": 13}
print(person["name"])</pre>
          <p>之前3_rps_ai.py里统计出拳次数用的就是字典，比如 <code>{"石头": 5, "剪刀": 3}</code>。</p>
          <p>做一个字典 me，包含 name、age、hobby 三个键，然后把这三个值分别打印出来。</p>
        `,
        starter: `# 创建字典 me，包含 name、age、hobby 三个键
# 分别打印 me["name"]、me["age"]、me["hobby"]
`,
        hint: `字典用花括号{}，键和值中间用冒号:，取值时用方括号["键名"]。格式：me = {"name": "小明", "age": 13, "hobby": "篮球"}`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("{") || !r.code.includes(":")) {
            return { pass: false, message: "代码里好像没有真的创建字典（花括号{}加冒号:），检查一下有没有写死输出。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "字典也学会了！你现在能存更复杂的数据了。" };
          return { pass: false, message: `目前只打印了${lines.length}行，字典里的 name、age、hobby 都要打印出来（3行）。` };
        },
      },
      {
        explain: `
          <p>字典用"键值对"存数据，比列表更适合表示"一个东西的多个属性"：</p>
          <pre>person = {"name": "小明", "age": 13}
print(person["name"])</pre>
          <p>之前3_rps_ai.py里统计出拳次数用的就是字典，比如 <code>{"石头": 5, "剪刀": 3}</code>。</p>
          <p>做一个字典 pet，包含 name、type、age 三个键（宠物的名字、种类、年龄），然后把这三个值分别打印出来。</p>
        `,
        starter: `# 创建字典 pet，包含 name、type、age 三个键
# 分别打印 pet["name"]、pet["type"]、pet["age"]
`,
        hint: `字典用花括号{}，键和值中间用冒号:，取值时用方括号["键名"]。格式：pet = {"name": "旺财", "type": "狗", "age": 2}`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("{") || !r.code.includes(":")) {
            return { pass: false, message: "代码里好像没有真的创建字典（花括号{}加冒号:），检查一下有没有写死输出。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "字典也学会了！你现在能存更复杂的数据了。" };
          return { pass: false, message: `目前只打印了${lines.length}行，字典里的 name、type、age 都要打印出来（3行）。` };
        },
      },
    ],
  },
  {
    id: 11,
    title: "第11关：函数 def",
    why: `为什么不直接多写几次print计算结果？函数的价值在于"逻辑只写一次，到处调用"——以后想改计算方式（比如加个税），只用改函数内部这一处，所有调用的地方都会跟着变。`,
    variants: [
      {
        explain: `
          <p>函数可以把一段常用的代码打包起来，取个名字，以后随时调用，不用重复写。</p>
          <pre>def greet(name):
    print(f"你好，{name}！")

greet("小明")</pre>
          <p>写一个函数 add(a, b)，打印出两个数字的和，然后调用它两次，传入不同的数字。</p>
        `,
        starter: `# 写一个函数 def add(a, b):，打印 a+b 的结果
# 调用两次 add()，传入不同的数字
`,
        hint: `格式：def add(a, b): 换行缩进 result = a + b 换行缩进 print(result)，然后另起一行调用 add(3, 5)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bdef\s+\w+\s*\(/.test(r.code)) {
            return { pass: false, message: "代码里好像没有用 def 定义函数，这一关的重点是把计算逻辑包进函数里，而不是直接打印结果。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 2) {
            return { pass: false, message: `目前只有${lines.length}行输出，函数至少要调用2次，每次都打印结果。` };
          }
          if (/\d/.test(r.stdout)) return { pass: true, message: "函数学会了！这是让代码不重复的关键工具。" };
          return { pass: false, message: "调用了函数，但输出里没看到数字，检查一下函数里有没有 print() 计算结果。" };
        },
      },
      {
        explain: `
          <p>函数可以把一段常用的代码打包起来，取个名字，以后随时调用，不用重复写。</p>
          <pre>def greet(name):
    print(f"你好，{name}！")

greet("小明")</pre>
          <p>写一个函数 multiply(a, b)，打印出两个数字的乘积，然后调用它两次，传入不同的数字。</p>
        `,
        starter: `# 写一个函数 def multiply(a, b):，打印 a*b 的结果
# 调用两次 multiply()，传入不同的数字
`,
        hint: `格式：def multiply(a, b): 换行缩进 result = a * b 换行缩进 print(result)，然后另起一行调用 multiply(3, 5)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bdef\s+\w+\s*\(/.test(r.code)) {
            return { pass: false, message: "代码里好像没有用 def 定义函数，这一关的重点是把计算逻辑包进函数里，而不是直接打印结果。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 2) {
            return { pass: false, message: `目前只有${lines.length}行输出，函数至少要调用2次，每次都打印结果。` };
          }
          if (/\d/.test(r.stdout)) return { pass: true, message: "函数学会了！这是让代码不重复的关键工具。" };
          return { pass: false, message: "调用了函数，但输出里没看到数字，检查一下函数里有没有 print() 计算结果。" };
        },
      },
    ],
  },
  {
    id: 12,
    title: "毕业关：做出你自己的猜数字游戏",
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
        needsInput: true,
        defaultInput: "5\n8\n7",
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !r.code.includes("input(")) {
            return { pass: false, message: "代码里要用到 while 循环和 input()，不断询问玩家，而不是直接打印'猜对了！'。" };
          }
          if (r.stdout.includes("猜对了")) {
            return { pass: true, message: "毕业啦！点侧栏的'🎮 AI小游戏'解锁真正的AI小游戏吧。" };
          }
          return { pass: false, message: "模拟输入里的数字最终要等于secret（7），并且要打印出'猜对了！'才算通关。" };
        },
      },
      {
        explain: `
          <p>把前面学的都用上：变量、input、if、循环——写一个"猜数字"小游戏。</p>
          <p>电脑心里想好一个数字 <code>secret = 15</code>，玩家不断猜，
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
        starter: `secret = 15
# 用 int(input(...)) 获取玩家猜的数字，存到 guess
# 用 while 循环：只要 guess != secret 就一直问
#   循环里：如果 guess > secret 打印"太大了"，否则打印"太小了"
#   然后重新问一次，更新 guess
# 循环结束后打印"猜对了！"
`,
        hint: `模拟输入框里每行写一个猜测数字，比如：10 / 20 / 15 ，让它们一步步逼近15。别忘了循环里要重新调用 input() 更新 guess，不然会死循环。`,
        needsInput: true,
        defaultInput: "10\n20\n15",
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !r.code.includes("input(")) {
            return { pass: false, message: "代码里要用到 while 循环和 input()，不断询问玩家，而不是直接打印'猜对了！'。" };
          }
          if (r.stdout.includes("猜对了")) {
            return { pass: true, message: "毕业啦！点侧栏的'🎮 AI小游戏'解锁真正的AI小游戏吧。" };
          }
          return { pass: false, message: "模拟输入里的数字最终要等于secret（15），并且要打印出'猜对了！'才算通关。" };
        },
      },
    ],
  },
];
