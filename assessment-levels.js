// 给"已经有基础"的人用的测试关卡：不讲基础语法，直接给题目，写代码验证水平。
// check(result) 返回 { pass: boolean, message: string }，result = { stdout, err }
// explainError(err) 定义在 app.js 里。

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
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      const lines = r.stdout.trim().split("\n").filter(Boolean);
      if (lines.length < 20) {
        return { pass: false, message: `目前只打印了${lines.length}行，应该有20行（1到20每个数字一行）。` };
      }
      if (lines[2] !== "Fizz") return { pass: false, message: "第3行应该是 Fizz（3能被3整除），检查一下判断条件。" };
      if (lines[4] !== "Buzz") return { pass: false, message: "第5行应该是 Buzz（5能被5整除），检查一下判断条件。" };
      if (lines[14] !== "FizzBuzz") return { pass: false, message: "第15行应该是 FizzBuzz（15能同时被3和5整除），检查一下条件的判断顺序。" };
      if (lines[0] !== "1") return { pass: false, message: "第1行应该是数字1本身（1不能被3或5整除）。" };
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
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (!r.stdout.includes("108")) {
        return { pass: false, message: "总和不对：这组数字加起来应该是108，检查一下有没有漏加或算错。" };
      }
      if (!r.stdout.includes("42")) {
        return { pass: false, message: "最大值不对：应该是42，检查一下 max() 或者比较逻辑。" };
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
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (r.stdout.includes("2")) {
        return { pass: true, message: "统计正确！'programming'里正好有2个m。" };
      }
      return { pass: false, message: "答案不对：正确次数是2，检查一下统计逻辑（大小写、有没有漏判字符）。" };
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
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      const hasTrue = r.stdout.includes("True");
      const hasFalse = r.stdout.includes("False");
      if (hasTrue && hasFalse) {
        return { pass: true, message: "质数判断函数写对了，17是质数，15不是。" };
      }
      if (!hasTrue) return { pass: false, message: "is_prime(17) 应该是 True（17是质数），检查一下函数逻辑。" };
      return { pass: false, message: "is_prime(15) 应该是 False（15 = 3×5，不是质数），检查一下函数逻辑。" };
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
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      const okApple = r.stdout.includes("苹果") && r.stdout.includes("3");
      const okBanana = r.stdout.includes("香蕉") && r.stdout.includes("2");
      if (okApple && okBanana) {
        return { pass: true, message: "词频统计正确：苹果3次，香蕉2次，橙子1次。" };
      }
      return { pass: false, message: "统计结果不太对：苹果应该出现3次，香蕉2次，橙子1次，检查一下计数逻辑。" };
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
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (r.stdout.includes("石头")) {
        return { pass: true, message: "全部测试通过！这正是 ai-games 里AI'学习'你出拳习惯的核心逻辑，你已经完全掌握了。去 ai-games 文件夹试试真正的AI小游戏吧。" };
      }
      return { pass: false, message: "答案不对：'石头'出现了4次，是历史记录里次数最多的，检查一下统计逻辑。" };
    },
  },
];
