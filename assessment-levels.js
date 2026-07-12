// 给"已经有基础"的人用的测试关卡：不讲基础语法，直接给题目，写代码验证水平。
// check(result) 返回 { pass: boolean, message: string }，result = { stdout, err, code }
// explainError(err) 定义在 app.js 里。
// check()会顺带检查代码里有没有真的用到对应的技术，防止把答案写死也能过关。

const LEVELS = [
  {
    id: 1,
    title: "测试1：FizzBuzz",
    explain: `
      <p>经典的编程测试题。写一个循环，打印1到20（每个数字一行），规则如下：</p>
      <ul>
        <li>能同时被3和5整除，打印 <code>FizzBuzz</code></li>
        <li>只能被3整除，打印 <code>Fizz</code></li>
        <li>只能被5整除，打印 <code>Buzz</code></li>
        <li>都不满足，打印数字本身</li>
      </ul>
    `,
    starter: `# 写一个 for 循环，打印1到20
# 用 % 取余数来判断能不能被3或5整除
`,
    hint: `判断"能不能被3整除"用 n % 3 == 0。记得先判断"同时被3和5整除"这个条件，不然会漏掉FizzBuzz。`,
    answer: `for n in range(1, 21):
    if n % 3 == 0 and n % 5 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)`,
    why: `FizzBuzz为什么是经典面试题？它同时考"循环+条件判断+取余运算"这三个基础，而且条件顺序稍微写错就会出bug（比如15漏判成Fizz），很适合检验对基础语法的熟练程度。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err), reviewLevel: 6 };
      if (!r.code.includes("%")) {
        return { pass: false, message: "代码里好像没有用取余运算符 %，检查一下是不是把20行结果直接写死了。", reviewLevel: 7 };
      }
      const lines = r.stdout.trim().split("\n").filter(Boolean);
      if (lines.length < 20) {
        return { pass: false, message: `目前只打印了${lines.length}行，应该有20行（1到20每个数字一行）。`, reviewLevel: 7 };
      }
      if (lines[2] !== "Fizz") return { pass: false, message: "第3行应该是 Fizz（3能被3整除），检查一下判断条件。", reviewLevel: 6 };
      if (lines[4] !== "Buzz") return { pass: false, message: "第5行应该是 Buzz（5能被5整除），检查一下判断条件。", reviewLevel: 6 };
      if (lines[14] !== "FizzBuzz") return { pass: false, message: "第15行应该是 FizzBuzz（15能同时被3和5整除），检查一下条件的判断顺序。", reviewLevel: 6 };
      if (lines[0] !== "1") return { pass: false, message: "第1行应该是数字1本身（1不能被3或5整除）。", reviewLevel: 6 };
      return { pass: true, message: "FizzBuzz 完全正确，基础的循环和条件判断没问题。" };
    },
  },
  {
    id: 2,
    title: "测试2：列表统计",
    explain: `
      <p>给定列表：</p>
      <pre>nums = [4, 8, 15, 16, 23, 42]</pre>
      <p>计算并打印这些数字的总和与最大值（可以用内置的 <code>sum()</code> / <code>max()</code>，也可以自己写循环）。</p>
    `,
    starter: `nums = [4, 8, 15, 16, 23, 42]
# 打印 nums 的总和
# 打印 nums 的最大值
`,
    hint: `sum(nums) 直接算总和，max(nums) 直接算最大值。`,
    answer: `nums = [4, 8, 15, 16, 23, 42]
print(sum(nums))
print(max(nums))`,
    why: `为什么Python要内置sum()/max()这些函数？因为"对一组数据求和/求最大值"是极其常见的需求，内置函数比自己写循环更快、更不容易出错——但理解它们背后就是遍历+累加/比较，遇到内置函数解决不了的情况时才知道怎么自己实现。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err), reviewLevel: 9 };
      if (!r.code.includes("sum(") && !r.code.includes("max(") && !/\bfor\b/.test(r.code)) {
        return { pass: false, message: "代码里好像没有用 sum()/max() 或者循环，检查一下是不是把108和42直接写死了。", reviewLevel: 9 };
      }
      if (!r.stdout.includes("108")) {
        return { pass: false, message: "总和不对：这组数字加起来应该是108，检查一下有没有漏加或算错。", reviewLevel: 9 };
      }
      if (!r.stdout.includes("42")) {
        return { pass: false, message: "最大值不对：应该是42，检查一下 max() 或者比较逻辑。", reviewLevel: 9 };
      }
      return { pass: true, message: "统计正确，sum/max 用得很熟练。" };
    },
  },
  {
    id: 3,
    title: "测试3：字符串处理",
    explain: `
      <p>给定字符串：</p>
      <pre>text = "programming is fun"</pre>
      <p>统计并打印字母 <code>m</code> 在这个字符串里出现了几次。</p>
    `,
    starter: `text = "programming is fun"
# 统计 text 里字母 m 出现的次数，打印出来
`,
    hint: `可以用 text.count("m")，也可以自己写循环逐个字符判断。`,
    answer: `text = "programming is fun"
count = text.count("m")
print(count)`,
    why: `为什么字符串可以像列表一样遍历？因为字符串本质上就是"字符的序列"，Python里很多用在列表上的操作（遍历、切片、count）字符串也能用，这种"不同类型共享同一套操作"的设计能少记很多规则。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err), reviewLevel: 4 };
      if (!r.code.includes(".count(") && !/\bfor\b/.test(r.code)) {
        return { pass: false, message: "代码里好像没有用 .count() 或者循环，检查一下是不是把答案2直接写死了。", reviewLevel: 4 };
      }
      if (r.stdout.includes("2")) {
        return { pass: true, message: "统计正确！'programming'里正好有2个m。" };
      }
      return { pass: false, message: "答案不对：正确次数是2，检查一下统计逻辑（大小写、有没有漏判字符）。", reviewLevel: 4 };
    },
  },
  {
    id: 4,
    title: "测试4：函数 + 判断质数",
    explain: `
      <p>写一个函数 <code>is_prime(n)</code>，判断 n 是不是质数（只能被1和自己整除，且大于1）。</p>
      <p>写完后调用 <code>is_prime(17)</code> 和 <code>is_prime(15)</code>，把两个结果都打印出来。</p>
    `,
    starter: `def is_prime(n):
    # 判断 n 是不是质数，返回 True 或 False
    pass

print(is_prime(17))
print(is_prime(15))`,
    hint: `可以用 for 循环从2试到 n-1，看有没有能整除n的数；一个都没有就是质数。别忘了 n<=1 的情况直接返回 False。`,
    answer: `def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True

print(is_prime(17))
print(is_prime(15))`,
    why: `判断质数为什么要试到n-1？因为质数的定义就是"除了1和自己没有别的因数"，逐个试是最直接的验证方式（后面学更多算法后会知道其实只需要试到根号n，但现在这样写完全正确，只是慢一点）。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err), reviewLevel: 11 };
      if (!r.code.includes("def is_prime")) {
        return { pass: false, message: "代码里好像没有用 def 定义 is_prime 函数，检查一下是不是把 True/False 直接写死了。", reviewLevel: 11 };
      }
      // 光检查 True/False 是否都出现过还不够——逻辑写反了（质数判True，合数判False）
      // 也会让两个词都出现，得确认是 is_prime(17) 先打印 True、is_prime(15) 后打印 False。
      const lines = r.stdout.trim().split("\n").filter(Boolean);
      if (lines[0] === "True" && lines[1] === "False") {
        return { pass: true, message: "质数判断函数写对了，17是质数，15不是。" };
      }
      if (lines[0] !== "True") return { pass: false, message: "is_prime(17) 应该是 True（17是质数），检查一下函数逻辑。", reviewLevel: 11 };
      return { pass: false, message: "is_prime(15) 应该是 False（15 = 3×5，不是质数），检查一下函数逻辑。", reviewLevel: 11 };
    },
  },
  {
    id: 5,
    title: "测试5：字典统计词频",
    explain: `
      <p>给定列表：</p>
      <pre>words = ["苹果", "香蕉", "苹果", "橙子", "苹果", "香蕉"]</pre>
      <p>统计每个词出现的次数，存进一个字典，然后打印这个字典（或者把每个词和次数分别打印出来也行）。</p>
    `,
    starter: `words = ["苹果", "香蕉", "苹果", "橙子", "苹果", "香蕉"]
# 用字典统计每个词出现的次数
# 打印统计结果
`,
    hint: `可以先创建一个空字典 counts = {}，然后遍历 words，用 counts[word] = counts.get(word, 0) + 1 累加次数。`,
    answer: `words = ["苹果", "香蕉", "苹果", "橙子", "苹果", "香蕉"]
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
print(counts)`,
    why: `词频统计是文本分析最基础的操作——搜索引擎、推荐系统、垃圾邮件过滤，很多都是从"数一数每个词出现了几次"这一步开始的。字典正是干这个最合适的数据结构。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err), reviewLevel: 10 };
      if (!/\bfor\b/.test(r.code) || (!r.code.includes("{") && !r.code.includes("dict("))) {
        return { pass: false, message: "代码里好像没有用循环+字典统计，检查一下是不是把结果直接写死了。", reviewLevel: 10 };
      }
      // 光分别检查"苹果"、"3"、"香蕉"、"2"是否出现还不够——次数算错了但刚好都
      // 出现过（比如苹果2次香蕉3次，数字对调）也会通过。这一关允许打印字典或者
      // 分别打印，格式不固定，所以用"词后面隔几个字符内出现对应次数"这种宽松的
      // 邻近匹配，而不是要求完全固定的格式。
      const okApple = /苹果.{0,8}3/.test(r.stdout);
      const okBanana = /香蕉.{0,8}2/.test(r.stdout);
      if (okApple && okBanana) {
        return { pass: true, message: "词频统计正确：苹果3次，香蕉2次，橙子1次。" };
      }
      return { pass: false, message: "统计结果不太对：苹果应该出现3次，香蕉2次，橙子1次，检查一下计数逻辑。", reviewLevel: 10 };
    },
  },
  {
    id: 6,
    title: "测试6：预测下一步（对接AI小游戏）",
    explain: `
      <p>这道题的思路和 <code>ai-games/3_rps_ai.py</code> 里"会学习的石头剪刀布"完全一样。</p>
      <p>给定一份出拳历史记录：</p>
      <pre>history = ["石头", "石头", "剪刀", "石头", "布", "石头"]</pre>
      <p>统计出现次数最多的选择，把它打印出来（这就是"预测对手下一步"的核心逻辑）。</p>
    `,
    starter: `history = ["石头", "石头", "剪刀", "石头", "布", "石头"]
# 统计出现次数最多的选择，打印出来
`,
    hint: `可以用字典统计每个选择出现的次数，再用 max(counts, key=counts.get) 找出次数最多的那个键。`,
    answer: `history = ["石头", "石头", "剪刀", "石头", "布", "石头"]
counts = {}
for move in history:
    counts[move] = counts.get(move, 0) + 1
prediction = max(counts, key=counts.get)
print(prediction)`,
    why: `"预测下一步"这类AI功能，本质上很多时候就是"统计历史数据里最常见的模式"。没有魔法，只是数据统计——理解了这一点，AI就没那么神秘了。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err), reviewLevel: 10 };
      const hasDict = r.code.includes("{") || r.code.includes("dict(");
      const hasCount = r.code.includes(".get(") || r.code.includes("+= 1") || r.code.includes("+=1") || r.code.includes(".count(");
      if (!/\bfor\b/.test(r.code) || !hasDict || !hasCount) {
        return { pass: false, message: "代码里好像没有真的用循环+字典统计出现次数，检查一下是不是把'石头'直接写死了。", reviewLevel: 10 };
      }
      if (r.stdout.includes("石头")) {
        return { pass: true, message: "全部测试通过！这正是 ai-games 里AI'学习'你出拳习惯的核心逻辑，你已经完全掌握了。去侧栏点'🎮 AI小游戏'试试真正的AI小游戏吧。" };
      }
      return { pass: false, message: "答案不对：'石头'出现了4次，是历史记录里次数最多的，检查一下统计逻辑。", reviewLevel: 10 };
    },
  },
];
