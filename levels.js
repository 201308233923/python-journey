// 每一关的内容：讲解、初始代码、提示、以及判断"过关"的检查函数。
// check(result) 返回 { pass: boolean, message: string }，result = { stdout, err }

const LEVELS = [
  {
    id: 1,
    title: "第1关：你好，世界",
    explain: `
      <p>写程序的第一件事，几乎所有人都是从让电脑"说话"开始的。</p>
      <p>在 Python 里，<code>print()</code> 可以把括号里的内容显示在屏幕上。</p>
      <pre>print("你好，世界！")</pre>
      <p>试着把下面代码里的文字改成你自己的名字，然后点"运行"看看。</p>
    `,
    starter: `print("你好，世界！")`,
    hint: `记得文字要用引号 "" 包起来，Python 才知道这是一段文字（叫"字符串"）。`,
    check: (r) => {
      if (r.err) return { pass: false, message: "代码报错了，看看下面的错误提示，检查有没有少写引号或括号。" };
      if (r.stdout.trim().length > 0) return { pass: true, message: "太棒了！你写出了第一行能运行的代码。" };
      return { pass: false, message: "好像还没有输出内容，试试用 print() 打印点什么。" };
    },
  },
  {
    id: 2,
    title: "第2关：变量是什么",
    explain: `
      <p>变量就像一个贴了标签的盒子，用来装数据，方便以后取用。</p>
      <pre>name = "小明"
age = 13
print(name)
print(age)</pre>
      <p>等号 <code>=</code> 在这里不是"等于"，而是"把右边的值放进左边这个盒子里"。</p>
      <p>试试创建一个叫 <code>my_name</code> 的变量，装上你的名字，再打印出来。</p>
    `,
    starter: `my_name = "你的名字"
print(my_name)`,
    hint: `变量名不能有空格，也不能用数字开头。字符串（文字）记得加引号，数字不用加。`,
    check: (r) => {
      if (r.err) return { pass: false, message: "代码报错了，检查一下变量名和引号有没有对齐。" };
      if (r.stdout.trim().length > 0) return { pass: true, message: "很好，你已经学会用变量存东西了。" };
      return { pass: false, message: "记得要 print() 出来才能看到结果哦。" };
    },
  },
  {
    id: 3,
    title: "第3关：数字运算",
    explain: `
      <p>Python 可以当计算器用：<code>+ - * /</code> 分别是加减乘除。</p>
      <pre>a = 10
b = 3
print(a + b)
print(a - b)
print(a * b)
print(a / b)</pre>
      <p>试着算一下：如果你今年13岁，10年后你多少岁？用变量算出来，别直接写死答案。</p>
    `,
    starter: `age = 13
years_later = 10
future_age = age + years_later
print(future_age)`,
    hint: `除法 / 的结果会带小数点，比如 10/3 是 3.333...；如果只想要整数结果，可以用 // 。`,
    check: (r) => {
      if (r.err) return { pass: false, message: "运算符打错了吗？看看错误提示。" };
      if (/\d/.test(r.stdout)) return { pass: true, message: "运算成功！Python 当计算器还挺好用的。" };
      return { pass: false, message: "输出里好像没有数字，检查一下有没有 print() 结果。" };
    },
  },
  {
    id: 4,
    title: "第4关：拼接文字（f-string）",
    explain: `
      <p>想把变量和文字拼在一起显示，可以在字符串前加一个 <code>f</code>，然后用花括号 <code>{}</code> 把变量包起来：</p>
      <pre>name = "小明"
age = 13
print(f"我叫{name}，今年{age}岁")</pre>
      <p>试着用 f-string 介绍一下你自己。</p>
    `,
    starter: `name = "你的名字"
age = 13
print(f"我叫{name}，今年{age}岁")`,
    hint: `别忘了字符串前面的 f，还有花括号里不要再加引号。`,
    check: (r) => {
      if (r.err) return { pass: false, message: "f-string 的格式检查一下：f\"...{变量}...\"" };
      if (r.stdout.includes("{") ) return { pass: false, message: "花括号好像没有被替换成变量的值，检查一下前面有没有加 f。" };
      if (r.stdout.trim().length > 0) return { pass: true, message: "拼接成功！f-string 以后会经常用到。" };
      return { pass: false, message: "还没看到输出，加上 print() 试试。" };
    },
  },
  {
    id: 5,
    title: "第5关：获取用户输入",
    explain: `
      <p><code>input()</code> 可以让程序暂停，等着用户在屏幕上打字。</p>
      <pre>name = input("你叫什么名字？")
print(f"你好，{name}！")</pre>
      <p>这一关比较特殊：因为是在网页里模拟运行，右边多了一个"模拟输入"框，
      在里面按顺序写好你要输入的内容（一行代表一次 input()），再点运行。</p>
    `,
    starter: `name = input("你叫什么名字？")
print(f"你好，{name}！")`,
    hint: `模拟输入框里写一行文字，比如"小明"，代表 input() 会拿到这一行作为回答。`,
    needsInput: true,
    defaultInput: "小明",
    check: (r) => {
      if (r.err) return { pass: false, message: "报错了？看看是不是模拟输入框里没填内容。" };
      if (r.stdout.includes("你好")) return { pass: true, message: "完美，你已经学会怎么和程序'对话'了。" };
      return { pass: false, message: "看看输出对不对，或许要调整一下代码。" };
    },
  },
  {
    id: 6,
    title: "第6关：if 判断",
    explain: `
      <p>程序需要"做判断"：如果满足条件就做A，不满足就做B。</p>
      <pre>age = 13
if age >= 18:
    print("你是成年人")
else:
    print("你是未成年人")</pre>
      <p>注意冒号 <code>:</code> 和缩进（每行前面的空格），Python 靠缩进来分辨"哪些代码属于if里面"。</p>
      <p>试着写一个判断：如果分数大于等于60，打印"及格"，否则打印"不及格"。</p>
    `,
    starter: `score = 75
if score >= 60:
    print("及格")
else:
    print("不及格")`,
    hint: `冒号后面换行，下一行要缩进（一般是4个空格），这是Python的硬性规定。`,
    check: (r) => {
      if (r.err) return { pass: false, message: "很可能是缩进或冒号的问题，仔细检查每个 if/else 后面。" };
      if (r.stdout.includes("及格")) return { pass: true, message: "if判断学会了，这是编程里最常用的东西之一。" };
      return { pass: false, message: "改一下条件或分数，让程序打印出'及格'或'不及格'试试。" };
    },
  },
  {
    id: 7,
    title: "第7关：for 循环",
    explain: `
      <p>循环可以让电脑帮你重复做一件事，不用自己写100遍。</p>
      <pre>for i in range(5):
    print(f"第{i}次")</pre>
      <p><code>range(5)</code> 会依次给出 0,1,2,3,4 这5个数字。</p>
      <p>试着用 for 循环打印出1到10。</p>
    `,
    starter: `for i in range(1, 11):
    print(i)`,
    hint: `range(1, 11) 会从1数到10（不包含11），这是个常见的小坑。`,
    check: (r) => {
      if (r.err) return { pass: false, message: "看看range()的括号和冒号有没有写对。" };
      const nums = r.stdout.trim().split(/\s+/);
      if (nums.length >= 5) return { pass: true, message: "循环学会了！以后重复的事都能交给电脑做。" };
      return { pass: false, message: "好像打印的次数不太够，检查一下 range() 里的数字。" };
    },
  },
  {
    id: 8,
    title: "第8关：while 循环",
    explain: `
      <p>while 循环会一直重复，直到某个条件不再满足。</p>
      <pre>count = 0
while count < 5:
    print(count)
    count = count + 1</pre>
      <p>要小心：如果忘了让条件变化（比如忘了 count = count + 1），循环会一直停不下来！</p>
      <p>试着用 while 循环，从10倒数到1。</p>
    `,
    starter: `count = 10
while count >= 1:
    print(count)
    count = count - 1`,
    hint: `每次循环都要让count变化，不然会陷入"死循环"。`,
    check: (r) => {
      if (r.err) return { pass: false, message: "检查一下循环条件和缩进。" };
      const nums = r.stdout.trim().split(/\s+/);
      if (nums.length >= 5) return { pass: true, message: "while循环也学会了，你现在会两种循环了。" };
      return { pass: false, message: "看看输出的行数够不够，调整一下条件。" };
    },
  },
  {
    id: 9,
    title: "第9关：列表 list",
    explain: `
      <p>列表可以在一个变量里装很多个东西，用方括号 <code>[]</code>：</p>
      <pre>fruits = ["苹果", "香蕉", "橙子"]
print(fruits[0])
for fruit in fruits:
    print(fruit)</pre>
      <p>注意：列表里的第一个东西下标是 <code>0</code>，不是1！</p>
      <p>试着做一个装有你3个最喜欢的东西的列表，然后用for循环打印出来。</p>
    `,
    starter: `favorites = ["篮球", "游戏", "音乐"]
for item in favorites:
    print(item)`,
    hint: `列表用方括号[]，里面每一项用逗号分开。下标从0开始数。`,
    check: (r) => {
      if (r.err) return { pass: false, message: "检查一下方括号和逗号。" };
      const lines = r.stdout.trim().split("\n").filter(Boolean);
      if (lines.length >= 2) return { pass: true, message: "列表学会了，这是存一堆数据最常用的方式。" };
      return { pass: false, message: "列表里放几个东西，然后循环打印出来试试。" };
    },
  },
  {
    id: 10,
    title: "第10关：字典 dict",
    explain: `
      <p>字典用"键值对"存数据，比列表更适合表示"一个东西的多个属性"：</p>
      <pre>person = {"name": "小明", "age": 13}
print(person["name"])
print(person["age"])</pre>
      <p>之前3_rps_ai.py里统计出拳次数用的就是字典，比如 <code>{"石头": 5, "剪刀": 3}</code>。</p>
      <p>试着做一个字典描述你自己（名字、年龄、爱好），然后打印出来。</p>
    `,
    starter: `me = {"name": "你的名字", "age": 13, "hobby": "编程"}
print(me["name"])
print(me["hobby"])`,
    hint: `字典用花括号{}，键和值中间用冒号:，取值时用方括号["键名"]。`,
    check: (r) => {
      if (r.err) return { pass: false, message: "检查一下花括号、冒号和引号。" };
      if (r.stdout.trim().length > 0) return { pass: true, message: "字典也学会了！你现在能存更复杂的数据了。" };
      return { pass: false, message: "打印字典里的某个值试试。" };
    },
  },
  {
    id: 11,
    title: "第11关：函数 def",
    explain: `
      <p>函数可以把一段常用的代码打包起来，取个名字，以后随时调用，不用重复写。</p>
      <pre>def greet(name):
    print(f"你好，{name}！")

greet("小明")
greet("小红")</pre>
      <p>试着写一个函数，输入两个数字，打印出它们的和。</p>
    `,
    starter: `def add(a, b):
    result = a + b
    print(f"{a} + {b} = {result}")

add(3, 5)
add(10, 20)`,
    hint: `def 函数名(参数): 换行后缩进写函数内容，调用时函数名(实际的值)。`,
    check: (r) => {
      if (r.err) return { pass: false, message: "检查 def 后面的冒号和缩进。" };
      if (/\d/.test(r.stdout)) return { pass: true, message: "函数学会了！这是让代码不重复的关键工具。" };
      return { pass: false, message: "调用一下你写的函数，看看有没有打印结果。" };
    },
  },
  {
    id: 12,
    title: "毕业关：做出你自己的猜数字游戏",
    explain: `
      <p>把前面学的都用上：变量、input、if、循环——写一个"猜数字"小游戏。</p>
      <p>电脑心里想好一个数字（比如7），玩家不断猜，程序告诉他"太大"或"太小"，猜中为止。</p>
      <p>下面是一个填了一半的框架，试着把它补充完整并运行成功：</p>
      <pre>secret = 7
guess = int(input("猜一个1-10的数字："))
while guess != secret:
    if guess &gt; secret:
        print("太大了")
    else:
        print("太小了")
    guess = int(input("再猜一次："))
print("猜对了！")</pre>
      <p><strong>恭喜通关！</strong>你现在已经具备读懂 <code>ai-games</code> 文件夹里4个AI小游戏代码的基础了。
      打开终端运行：</p>
      <pre>cd ~/Projects/learn-python/ai-games
python3 1_guess_number_ai.py</pre>
      <p>对照着代码，看看是不是能认出这一关学的变量、循环、if、input——那些"AI"其实都是你已经学会的东西拼出来的。</p>
    `,
    starter: `secret = 7
guess = int(input("猜一个1-10的数字："))
while guess != secret:
    if guess > secret:
        print("太大了")
    else:
        print("太小了")
    guess = int(input("再猜一次："))
print("猜对了！")`,
    hint: `模拟输入框里每行写一个猜测数字，比如：5 / 8 / 7 ，让它们一步步逼近7。`,
    needsInput: true,
    defaultInput: "5\n8\n7",
    check: (r) => {
      if (r.err) return { pass: false, message: "看看报错信息，检查int(input(...))有没有写对。" };
      if (r.stdout.includes("猜对了")) return { pass: true, message: "毕业啦！去 ai-games 文件夹解锁真正的AI小游戏吧。" };
      return { pass: false, message: "模拟输入里的数字最终要等于secret（7），才能触发'猜对了'。" };
    },
  },
];
