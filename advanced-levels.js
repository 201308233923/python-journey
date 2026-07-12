// 高级关卡：教一些新手课程和进阶测试都没教过的更硬核的概念——
// 递归、排序算法、字符串编码、类(class)——难度比前两个阶段更高。
// 和新手课程一样，只给骨架代码，写对了才能解锁下一关；报错时给具体解释。
// check()会顺带检查代码里有没有真的用到对应的技术，防止把答案写死也能过关。

const LEVELS = [
  {
    id: 1,
    title: "第1关：递归——阶乘",
    explain: `
      <p>递归就是"函数在内部调用自己"。写递归函数一定要有个"终止条件"，不然会无限调用下去。</p>
      <pre>def countdown(n):
    if n <= 0:
        print("发射！")
        return
    print(n)
    countdown(n - 1)</pre>
      <p>写一个递归函数 <code>factorial(n)</code>，计算 n 的阶乘（比如 5! = 5×4×3×2×1 = 120）。
      终止条件：n&lt;=1 时返回 1。调用 <code>factorial(5)</code> 并打印结果。</p>
    `,
    starter: `def factorial(n):
    # 终止条件：n<=1 时返回 1
    # 否则返回 n * factorial(n-1)


print(factorial(5))`,
    hint: `factorial(5) = 5 * factorial(4) = 5 * 4 * factorial(3) = ... 一直乘到 factorial(1) 返回1为止。`,
    answer: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,
    why: `为什么不用循环算阶乘（更简单）？递归教的是一种更通用的思路——把大问题拆成"和自己结构一样的小问题"，这个思路在处理树、嵌套数据这些循环搞不定的问题时非常关键。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      // 先去掉注释里的文字再数出现次数——不然在注释里随便写几个"factorial("
      // 就能凑够次数，绕开"函数真的调用了自己"这个检查。
      const codeWithoutComments = r.code.replace(/#.*$/gm, "");
      const calls = (codeWithoutComments.match(/factorial\s*\(/g) || []).length;
      if (calls < 3) {
        return { pass: false, message: "代码里 factorial( 出现的次数太少，看起来函数内部没有真的调用自己——检查一下是不是漏了递归调用 factorial(n-1)。" };
      }
      if (r.stdout.includes("120")) return { pass: true, message: "递归学会了！5的阶乘是120，函数正确地调用了自己。" };
      return { pass: false, message: "结果不对，5! 应该是120（5×4×3×2×1），检查一下终止条件和递归调用。" };
    },
  },
  {
    id: 2,
    title: "第2关：冒泡排序",
    explain: `
      <p>冒泡排序的思路：相邻两个数比大小，大的换到后面去，像气泡一样"冒"到最后。
      重复很多轮，直到没有需要交换的为止，整个列表就排好序了。</p>
      <p>给定 <code>nums = [5, 2, 8, 1, 9]</code>，<strong>不能用内置的 sorted() 或 .sort()</strong>，
      自己写冒泡排序把它从小到大排好，然后打印。</p>
    `,
    starter: `nums = [5, 2, 8, 1, 9]

# 用双层循环实现冒泡排序：
# 外层循环控制轮数，内层循环两两比较相邻元素，大的往后交换
# 交换两个变量的写法：nums[i], nums[i+1] = nums[i+1], nums[i]

print(nums)`,
    hint: `外层 for _ in range(len(nums)): 内层 for i in range(len(nums)-1): 如果 nums[i] > nums[i+1] 就交换这两个位置。`,
    answer: `nums = [5, 2, 8, 1, 9]

for i in range(len(nums)):
    for j in range(len(nums) - 1):
        if nums[j] > nums[j + 1]:
            nums[j], nums[j + 1] = nums[j + 1], nums[j]

print(nums)`,
    why: `为什么不直接用 sorted()？内置的排序函数背后其实也是类似的比较+交换逻辑（只是更高效），自己实现一遍冒泡排序，是为了真正理解"排序"到底是怎么发生的，而不只是会调用一个黑盒函数。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (r.code.includes("sorted(") || r.code.includes(".sort(")) {
        return { pass: false, message: "这一关不能用内置的 sorted() 或 .sort()，要自己写双层循环比较、交换来实现排序。" };
      }
      if (!/nums\s*\[[^\]]*\]\s*>=?\s*nums\s*\[/.test(r.code)) {
        return { pass: false, message: "代码里好像没看到两个 nums[...] 元素直接比较大小，检查一下是不是真的在两两比较元素，而不是直接把排好的结果写死。" };
      }
      if (r.stdout.includes("[1, 2, 5, 8, 9]")) {
        return { pass: true, message: "排序成功！这就是冒泡排序——用最朴素的两两比较实现了排序。" };
      }
      return { pass: false, message: "结果不对，排序后应该是 [1, 2, 5, 8, 9]，检查一下比较和交换的逻辑。" };
    },
  },
  {
    id: 3,
    title: "第3关：凯撒密码",
    explain: `
      <p>凯撒密码是最古老的加密方法之一：把每个字母往后移动固定的位数。
      比如移动3位，"a"变成"d"，"b"变成"e"。</p>
      <p><code>ord(c)</code> 能把字母转成对应的数字编码，<code>chr(n)</code> 能把数字编码转回字母。
      小写字母 "a" 的编码是97。</p>
      <pre>print(ord("a"))     # 97
print(chr(97))     # a
print(chr(ord("a") + 3))   # d</pre>
      <p>把 <code>message = "hello"</code> 每个字母往后移 <code>shift = 3</code> 位，打印加密后的结果（应该是"khoor"）。
      这道题里的字母都是小写，不用考虑超出"z"要绕回"a"的情况。</p>
    `,
    starter: `message = "hello"
shift = 3

# 遍历message里的每个字母，用 ord()+shift 再 chr() 转回字母
# 把转换后的字母拼成新字符串，最后打印

result = ""
`,
    hint: `for c in message: 每个字母用 chr(ord(c) + shift) 转换，然后拼接到 result 后面：result = result + chr(ord(c) + shift)`,
    answer: `message = "hello"
shift = 3

result = ""
for c in message:
    result = result + chr(ord(c) + shift)

print(result)`,
    why: `为什么计算机能这样"移位"加密文字？因为计算机眼里字母本来就是数字（ord值），文字处理本质上都是数字处理——这也是为什么后面能学到的字符串方法，底层都能用数字运算来实现。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (!/chr\s*\(\s*ord\s*\(/.test(r.code)) {
        return { pass: false, message: "代码里好像没看到 chr(ord(...)+shift) 这种转换写法，检查一下是不是把'khoor'直接写死了，而不是真的做了字母转换。" };
      }
      if (r.stdout.includes("khoor")) {
        return { pass: true, message: "加密成功！'hello'每个字母往后移3位就是'khoor'。" };
      }
      return { pass: false, message: "结果不对，加密后应该是'khoor'，检查一下 ord()/chr() 的用法和位移方向。" };
    },
  },
  {
    id: 4,
    title: "第4关：类（class）",
    explain: `
      <p>类（class）可以把数据和操作打包在一起。比如一个"银行账户"，既有数据（余额），
      也有操作（存钱、取钱）。</p>
      <pre>class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        print(f"{self.name}: 汪汪！")

my_dog = Dog("旺财")
my_dog.bark()</pre>
      <p><code>self</code> 代表"这个对象自己"。<code>__init__</code> 是创建对象时自动运行的初始化方法。</p>
      <p>写一个 <code>BankAccount</code> 类：<code>__init__</code> 里把 <code>self.balance</code> 设为0；
      写一个 <code>deposit(self, amount)</code> 方法给余额加钱；写一个 <code>withdraw(self, amount)</code>
      方法给余额减钱。创建一个账户，存入100，取出30，打印余额（应该是70）。</p>
    `,
    starter: `class BankAccount:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        # 把 amount 加到 self.balance 上
        pass

    def withdraw(self, amount):
        # 把 amount 从 self.balance 里减掉
        pass


account = BankAccount()
account.deposit(100)
account.withdraw(30)
print(account.balance)`,
    hint: `deposit里写 self.balance = self.balance + amount，withdraw里写 self.balance = self.balance - amount，记得删掉 pass。`,
    answer: `class BankAccount:
    def __init__(self):
        self.balance = 0

    def deposit(self, amount):
        self.balance = self.balance + amount

    def withdraw(self, amount):
        self.balance = self.balance - amount


account = BankAccount()
account.deposit(100)
account.withdraw(30)
print(account.balance)`,
    why: `为什么不直接用几个变量存余额？类能把"数据"（余额）和"能对这个数据做的操作"（存、取）绑在一起，创建多个账户时，每个账户的余额互不干扰——这是面向对象编程的核心价值：把相关的东西打包成一个"物"。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (!r.code.includes("class BankAccount") || !r.code.includes(".deposit(") || !r.code.includes(".withdraw(")) {
        return { pass: false, message: "代码里好像没有真的定义并用到 BankAccount 类的 deposit/withdraw 方法，检查一下是不是把70直接写死了。" };
      }
      if (r.stdout.includes("70")) {
        return { pass: true, message: "类写对了！存100取30，余额正好是70。" };
      }
      return { pass: false, message: "结果不对，存100取30后余额应该是70，检查一下deposit/withdraw方法有没有真的修改self.balance。" };
    },
  },
  {
    id: 5,
    title: "第5关：自己实现二分法猜数字",
    explain: `
      <p>你在 <code>ai-games</code> 里玩过AI用"二分法"猜数字。现在轮到你自己实现这个算法了
      （这次不用真人互动，直接让代码知道 secret 是多少，自己跟自己对战验证逻辑对不对）。</p>
      <p>写一个函数 <code>binary_guess(secret)</code>：从 <code>low=1, high=100</code> 开始，
      不断猜中间值 <code>(low+high)//2</code>，和secret比较，打印每次的猜测，
      直到猜中为止，最后打印"用了X次猜中"。调用 <code>binary_guess(42)</code> 试试。</p>
    `,
    starter: `def binary_guess(secret):
    low, high = 1, 100
    count = 0
    while low <= high:
        guess = (low + high) // 2
        count += 1
        print(f"第{count}次猜测：{guess}")
        # 比较 guess 和 secret：
        #   猜中了(guess == secret)：打印"用了X次猜中"，然后 return
        #   猜大了(guess > secret)：缩小上界 high = guess - 1
        #   猜小了(guess < secret)：缩小下界 low = guess + 1


binary_guess(42)`,
    hint: `guess > secret 说明猜大了，要往小的范围找：high = guess - 1；guess < secret 同理 low = guess + 1。`,
    answer: `def binary_guess(secret):
    low, high = 1, 100
    count = 0
    while low <= high:
        guess = (low + high) // 2
        count += 1
        print(f"第{count}次猜测：{guess}")
        if guess == secret:
            print(f"用了{count}次猜中")
            return
        elif guess > secret:
            high = guess - 1
        else:
            low = guess + 1


binary_guess(42)`,
    why: `为什么二分法比一个个数字试快这么多？每猜一次就排除一半的可能性——100个数字最多猜7次，1亿个数字最多也只要27次左右。这种"每次砍半"的思路（也叫对数复杂度）是很多高效算法的核心。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (!r.code.includes("while") || !r.code.includes("//")) {
        return { pass: false, message: "代码里要用 while 循环和 (low+high)//2 算中间值，检查一下是不是把结果直接写死了。" };
      }
      const lines = r.stdout.trim().split("\n").filter(Boolean);
      if (!r.stdout.includes("用了") || !r.stdout.includes("次猜中")) {
        return { pass: false, message: "还没看到'用了X次猜中'，检查一下猜中时有没有打印这句话并结束函数。" };
      }
      if (lines.length <= 10) {
        return { pass: true, message: "实现成功！用二分法猜中42只需要几次，比一个个数字试快多了。" };
      }
      return { pass: false, message: "猜的次数太多了，看起来不是真的二分——检查一下每次是不是用 (low+high)//2 猜中间值。" };
    },
  },
  {
    id: 6,
    title: "毕业关：升级版猜拳AI（只看最近3次）",
    explain: `
      <p><code>ai-games/3_rps_ai.py</code> 里的AI是看"全部历史"来预测你的下一步。
      这样做有个问题：如果你中途改变了策略，AI要花很久才能"忘掉"你以前的习惯。</p>
      <p>改进版思路：只参考"最近3次"出拳来预测，这样AI能更快适应你策略的变化。</p>
      <p>给定 <code>history = ["石头", "石头", "剪刀", "布", "石头", "布"]</code>，
      只取最后3个（用切片 <code>history[-3:]</code>），统计这3个里出现次数最多的，打印出来
      （最后3个是"布"、"石头"、"布"，"布"出现2次最多）。</p>
    `,
    starter: `history = ["石头", "石头", "剪刀", "布", "石头", "布"]

# 用切片取最后3个：recent = history[-3:]
# 统计 recent 里每个选择出现的次数（用字典）
# 打印出现次数最多的那个
`,
    hint: `recent = history[-3:]，然后跟之前的字典统计+max(counts, key=counts.get)套路一样。`,
    answer: `history = ["石头", "石头", "剪刀", "布", "石头", "布"]

recent = history[-3:]
counts = {}
for choice in recent:
    counts[choice] = counts.get(choice, 0) + 1

best = max(counts, key=counts.get)
print(best)`,
    why: `为什么"只看最近的"有时候比"看全部历史"更好？因为很多真实场景里，最近的行为更能代表现在的趋势——推荐系统、股票预测、天气预报都更看重近期数据，这叫"时间衰减"，是数据分析里很常见的思路。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (!r.code.includes("-3:")) {
        return { pass: false, message: "代码里好像没有用切片取最后3个（history[-3:]），检查一下是不是把'布'直接写死了。" };
      }
      if (!r.code.includes("{") || !(r.code.includes(".get(") || r.code.includes("+= 1") || r.code.includes("+=1"))) {
        return { pass: false, message: "这一关要用字典统计次数（比如 counts[x] = counts.get(x, 0) + 1），检查一下代码里有没有真的统计出现次数，而不是直接把'布'写死。" };
      }
      if (r.stdout.includes("布")) {
        return { pass: true, message: "毕业啦！只看最近3次，AI能更快跟上你的策略变化——这是很多真实推荐系统也会用的思路（更看重最近的行为）。" };
      }
      return { pass: false, message: "答案不对：最后3次是'布'、'石头'、'布'，'布'出现2次最多，检查一下切片和统计逻辑。" };
    },
  },
];
