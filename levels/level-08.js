const LEVEL_8 = {
  id: 8,
  title: `第8关：while 循环`,
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
      answer: `count = 10
while count >= 1:
    print(count)
    count = count - 1`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while")) {
            return { pass: false, message: "代码里好像没有用 while 循环，检查一下是不是把10行结果直接写死了。" };
          }
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
          <p>while 特别适合"不知道要循环几次，只看条件满不满足"的场景：</p>
          <pre>total = 0
while total < 10:
    total += 5
print(total)</pre>
          <p>用 while 循环，从1开始，每次把 count 累加进 total，count 也跟着+1，
          一直加到 total 达到或超过50为止，最后打印 total。</p>
        `,
      starter: `# 创建变量 count = 1, total = 0
# 用 while 循环：只要 total < 50 就一直加
#   total += count
#   count += 1
# 循环结束后打印 total
`,
      hint: `格式：count = 1 / total = 0 / while total < 50: 换行缩进 total += count 换行缩进 count += 1 / print(total)`,
      answer: `count = 1
total = 0
while total < 50:
    total += count
    count += 1
print(total)`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while")) {
            return { pass: false, message: "代码里好像没有用 while 循环，检查一下有没有真的循环累加，而不是直接把答案写死。" };
          }
          if (!r.code.includes("+=") && !/\w+\s*=\s*\w+\s*\+/.test(r.code)) {
            return { pass: false, message: "这一关要在循环里累加 total，检查一下有没有用 total += count 这样的写法。" };
          }
          if (r.stdout.includes("55")) {
            return { pass: true, message: "学会了！这正是while最擅长的场景——不知道要循环几次，只要盯着条件就行。" };
          }
          return { pass: false, message: "结果不对，按1、2、3...一直累加到超过50，最终total应该是55，检查一下循环逻辑。" };
        },
    },
    {
      explain: `
          <p><code>while True</code> 会一直循环下去，配合 <code>break</code> 才能跳出来：</p>
          <pre>count = 0
while True:
    count += 1
    print(count)
    if count == 3:
        break</pre>
          <p>用 while True + break 的写法，打印5次"继续"，第5次之后用break跳出循环。</p>
        `,
      starter: `# 创建变量 count = 0
# 用 while True: 一直循环，每次打印"继续"，count加1
# 当 count == 5 时用 break 跳出循环
`,
      hint: `格式：count = 0 / while True: 换行缩进 count += 1 换行缩进 print("继续") 换行缩进 if count == 5: 换行缩进缩进 break`,
      answer: `count = 0
while True:
    count += 1
    print("继续")
    if count == 5:
        break`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("break")) {
            return { pass: false, message: "这一关要用 break 跳出 while True 循环，检查一下代码里有没有 break。" };
          }
          if (!/while\s+True/.test(r.code)) {
            return { pass: false, message: "这一关要用 while True: 作为循环条件，检查一下有没有写对。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length === 5 && lines.every((l) => l === "继续")) {
            return { pass: true, message: "while True + break 学会了！这是处理'不确定循环几次，但要有办法跳出来'的常见写法。" };
          }
          return { pass: false, message: `应该正好打印5次"继续"，目前是${lines.length}次，检查一下 break 的触发条件。` };
        },
    },
    {
      explain: `
          <p>while 循环里可以嵌套 if 判断，统计满足某个条件的数字有多少个：</p>
          <pre>count = 0
n = 1
while n <= 5:
    if n > 2:
        count += 1
    n += 1
print(count)   # 3、4、5 比2大，一共3个</pre>
          <p>用 while + if，统计1到20之间，比10大的数字一共有几个，打印这个数量。</p>
        `,
      starter: `# 创建变量 count = 0, n = 1
# 用 while 循环，n 从1数到20
#   如果 n > 10，count 加1
#   n 加1
# 打印 count
`,
      hint: `格式：count = 0 / n = 1 / while n <= 20: 换行缩进 if n > 10: 换行缩进缩进 count += 1 换行缩进 n += 1 / print(count)`,
      answer: `count = 0
n = 1
while n <= 20:
    if n > 10:
        count += 1
    n += 1
print(count)`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !/\bif\b/.test(r.code)) {
            return { pass: false, message: "这一关要在 while 循环里嵌套 if 判断，检查一下代码里有没有两者都用到。" };
          }
          if (r.stdout.includes("10")) {
            return { pass: true, message: "学会了！while 配合 if，可以一边循环一边统计满足条件的数量。" };
          }
          return { pass: false, message: "结果不对，1到20之间比10大的数字（11到20）一共有10个，检查一下判断条件。" };
        },
    },
    {
      explain: `
          <p>while 循环可以模拟"不断减半"，看看要减几次才会小到某个值以下——这是后面"二分法"思路的雏形：</p>
          <pre>num = 8
steps = 0
while num > 1:
    num = num // 2
    steps += 1
print(steps)   # 8→4→2→1，一共3步</pre>
          <p>用 while 循环，num 从100开始，不断整除2（num = num // 2），
          统计要经过几步 num 才会小到等于1，打印步数。</p>
        `,
      starter: `# 创建变量 num = 100, steps = 0
# 用 while 循环：只要 num > 1 就一直减半
#   num = num // 2
#   steps += 1
# 打印 steps
`,
      hint: `格式：num = 100 / steps = 0 / while num > 1: 换行缩进 num = num // 2 换行缩进 steps += 1 / print(steps)`,
      answer: `num = 100
steps = 0
while num > 1:
    num = num // 2
    steps += 1
print(steps)`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !r.code.includes("//")) {
            return { pass: false, message: "这一关要用 while 循环 + 整除（//）不断减半，检查一下代码里有没有都用到。" };
          }
          // 用 \b6\b 而不是 includes("6")：光查子串的话，答案错成16、26、60这些
          // 带"6"的数字也会被误判通过，加上单词边界确保匹配到的是独立的"6"。
          if (/\b6\b/.test(r.stdout)) {
            return { pass: true, message: "学会了！100不断除以2，减到1需要6步——这种'每次砍半'的思路后面在高级关卡的二分法里还会再遇到。" };
          }
          return { pass: false, message: "结果不对，100不断整除2一直到1，应该是6步（100→50→25→12→6→3→1），检查一下循环逻辑。" };
        },
    },
    {
      explain: `
          <p>while 循环的条件也可以直接写一个列表——只要列表不是空的，就算"真"：</p>
          <pre>items = ["a", "b"]
while items:
    print(items.pop())</pre>
          <p><code>.pop()</code> 会取出并删除列表最后一个元素。</p>
          <p>创建一个装有3个字母的列表 items，用 while 循环 + .pop()，不断取出并打印，直到列表空了为止。</p>
        `,
      starter: `# 创建列表 items，装3个字母，比如 ["a", "b", "c"]
# 用 while 循环：只要 items 不是空的，就用 .pop() 取出一个并打印
`,
      hint: `格式：items = ["a", "b", "c"] 换行 while items: 换行缩进 print(items.pop())`,
      answer: `items = ["a", "b", "c"]
while items:
    print(items.pop())`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes(".pop(")) {
            return { pass: false, message: "这一关要用 .pop() 取出并删除列表最后一项，检查一下代码里有没有用到。" };
          }
          if (!r.code.includes("while")) {
            return { pass: false, message: "代码里好像没有用 while 循环，检查一下写法。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) {
            return { pass: true, message: "学会了！非空的列表在 while 条件里会被当成'真'，配合 .pop() 可以不断取空一个列表。" };
          }
          return { pass: false, message: `目前只打印了${lines.length}行，列表里至少要有3个元素，然后都取出来打印。` };
        },
    }
  ],
};
