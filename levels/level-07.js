const LEVEL_7 = {
  id: 7,
  title: `第7关：for 循环`,
  why: `为什么不直接写很多个print？因为如果要打印1到10000，手写一万行不现实。循环让"重复"这件事本身变成代码，数量再大也只需要一样多的代码。`,
  variants: [
    {
      explain: `
          <p>循环可以让电脑帮你重复做一件事，不用自己写100遍。</p>
          <pre>for i in range(5):
    print(f"第{i}次")</pre>
          <p><code>range(5)</code> 会依次给出 0,1,2,3,4 这5个数字，<code>i</code> 就是用来装这些数字的变量——
          每循环一次，<code>i</code> 就会变成下一个数字，所以上面这段代码会依次打印"第0次""第1次"……"第4次"。
          （<code>i</code> 只是习惯用的名字，换成别的名字比如 num 也完全可以。）</p>
          <p>用 for 循环打印出1到10（每个数字一行）。</p>
        `,
      starter: `# 用 for 循环和 range()，打印1到10
`,
      hint: `range(1, 11) 会从1数到10（不包含11）。格式：for i in range(1, 11): 换行缩进 print(i)`,
      answer: `for i in range(1, 11):
    print(i)`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bfor\b/.test(r.code) || !r.code.includes("range(")) {
            return { pass: false, message: "代码里好像没有用 for 循环 + range()，检查一下是不是把1到10直接写死了十个print()。" };
          }
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
          <p><code>range()</code> 可以传第三个参数当"步长"，控制每次跳几个数：</p>
          <pre>for i in range(0, 10, 3):
    print(i)   # 0, 3, 6, 9</pre>
          <p>用 range() 加步长的写法，打印出2到10之间的偶数：2, 4, 6, 8, 10。</p>
        `,
      starter: `# 用 range(起点, 终点, 步长)，打印2, 4, 6, 8, 10
`,
      hint: `格式：for i in range(2, 11, 2): 换行缩进 print(i)`,
      answer: `for i in range(2, 11, 2):
    print(i)`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/range\([^)]*,[^)]*,[^)]*\)/.test(r.code)) {
            return { pass: false, message: "这一关要用 range() 的第三个参数（步长），检查一下 range() 里有没有写三个数字，用逗号隔开。" };
          }
          const nums = r.stdout.trim().split(/\s+/).filter(Boolean);
          if (nums.length < 5) {
            return { pass: false, message: `目前只打印了${nums.length}行，应该要有5行（2,4,6,8,10），检查一下 range() 的参数。` };
          }
          if (nums[0] === "2" && nums[4] === "10") {
            return { pass: true, message: "步长学会了！range(起点, 终点, 步长) 能控制每次跳几个数。" };
          }
          return { pass: false, message: "打印的行数够了，但数字好像不是2,4,6,8,10，检查一下 range() 的三个参数。" };
        },
    },
    {
      explain: `
          <p>range() 的步长可以是负数，用来倒着数：</p>
          <pre>for i in range(5, 0, -1):
    print(i)   # 5, 4, 3, 2, 1</pre>
          <p>用 for 循环 + 负数步长，打印出从10倒数到1（每个数字一行）。</p>
        `,
      starter: `# 用 range(起点, 终点, -1)，从10倒数到1
`,
      hint: `格式：for i in range(10, 0, -1): 换行缩进 print(i)`,
      answer: `for i in range(10, 0, -1):
    print(i)`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/range\([^)]*-1[^)]*\)/.test(r.code)) {
            return { pass: false, message: "这一关要用负数步长（-1）让 range() 倒着数，检查一下 range() 里有没有写 -1。" };
          }
          const nums = r.stdout.trim().split(/\s+/).filter(Boolean);
          if (nums.length < 10) {
            return { pass: false, message: `目前只打印了${nums.length}行，应该要有10行（10倒数到1）。` };
          }
          if (nums[0] === "10" && nums[9] === "1") {
            return { pass: true, message: "负数步长学会了！for循环也能像while一样倒着数。" };
          }
          return { pass: false, message: "打印的行数够了，但数字顺序不太对，检查一下是不是从10倒数到1。" };
        },
    },
    {
      explain: `
          <p>for 循环不仅能配合 range()，还能直接遍历一个列表，依次拿到里面的每一项：</p>
          <pre>colors = ["红", "绿", "蓝"]
for c in colors:
    print(c)</pre>
          <p>创建一个装有3种水果的列表 fruits，用 for 循环直接遍历它（不用range和下标），把每一项都打印出来。</p>
        `,
      starter: `# 创建列表 fruits，装3种水果
# 用 for 循环直接遍历 fruits，打印每一项
`,
      hint: `格式：fruits = ["苹果", "香蕉", "橙子"] 换行 for f in fruits: 换行缩进 print(f)`,
      answer: `fruits = ["苹果", "香蕉", "橙子"]
for f in fruits:
    print(f)`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.code.includes("range(")) {
            return { pass: false, message: "这一关要直接遍历列表本身（for x in fruits），不需要用 range()，检查一下有没有用错方式。" };
          }
          if (!/\bfor\b/.test(r.code)) {
            return { pass: false, message: "代码里好像没有用 for 循环遍历列表，检查一下写法。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "遍历学会了！for循环可以直接作用在列表上，不需要下标。" };
          return { pass: false, message: `目前只打印了${lines.length}行，列表里至少要有3种水果，然后都打印出来。` };
        },
    },
    {
      explain: `
          <p>循环配合一个"累加器"变量，可以算出一组数字的总和：</p>
          <pre>total = 0
for i in range(1, 4):
    total += i
print(total)   # 1+2+3 = 6</pre>
          <p>用 for 循环 + 累加器，算出1加到10的总和（1+2+...+10），打印结果。</p>
        `,
      starter: `# 创建变量 total = 0
# 用 for 循环从1加到10，每次把 i 累加进 total（total += i）
# 打印 total
`,
      hint: `格式：total = 0 换行 for i in range(1, 11): 换行缩进 total += i 换行 print(total)`,
      answer: `total = 0
for i in range(1, 11):
    total += i
print(total)`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bfor\b/.test(r.code)) {
            return { pass: false, message: "代码里好像没有用 for 循环，检查一下有没有真的循环累加，而不是直接算出答案写死。" };
          }
          if (!r.code.includes("+=") && !/\w+\s*=\s*\w+\s*\+/.test(r.code)) {
            return { pass: false, message: "这一关要用累加器（比如 total += i），检查一下代码里有没有在循环里累加。" };
          }
          if (r.stdout.includes("55")) {
            return { pass: true, message: "累加学会了！1加到10的和是55，循环+累加器是很常用的组合。" };
          }
          return { pass: false, message: "结果不对，1加到10应该是55，检查一下 range() 的范围和累加逻辑。" };
        },
    },
    {
      explain: `
          <p>循环体里可以用f-string，每次打印不一样的计算结果，比如打印乘法表：</p>
          <pre>for i in range(1, 4):
    print(f"2x{i}={2*i}")   # 2x1=2 / 2x2=4 / 2x3=6</pre>
          <p><code>i</code> 依次是1、2、3，每一轮就用当前的 <code>i</code> 拼出"2x{i}"这句话，
          再算出 <code>2*i</code> 当结果——i变了，拼出来的文字和算出来的结果就跟着变。</p>
          <p>用 for 循环，打印出"5的乘法表"：5x1=5 一直到 5x9=45（每行一个）。</p>
        `,
      starter: `# 用 for 循环 + f-string，打印5的乘法表：5x1=5 到 5x9=45
`,
      hint: `格式：for i in range(1, 10): 换行缩进 print(f"5x{i}={5*i}")`,
      answer: `for i in range(1, 10):
    print(f"5x{i}={5*i}")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bfor\b/.test(r.code)) {
            return { pass: false, message: "代码里好像没有用 for 循环，检查一下是不是把9行结果直接写死了。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 9) {
            return { pass: false, message: `目前只打印了${lines.length}行，5的乘法表应该有9行（5x1到5x9）。` };
          }
          if (r.stdout.includes("5x1=5") && r.stdout.includes("5x9=45")) {
            return { pass: true, message: "乘法表学会了！循环配合f-string，可以每次打印不一样的计算结果。" };
          }
          return { pass: false, message: "打印的行数够了，但内容不太对，检查一下是不是从5x1=5打印到5x9=45。" };
        },
    }
  ],
};
