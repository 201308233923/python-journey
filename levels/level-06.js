const LEVEL_6 = {
  id: 6,
  title: `第6关：if 判断`,
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
      answer: `score = 75
if score >= 60:
    print("及格")
else:
    print("不及格")`,
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
          <p>if 后面可以接好几个 <code>elif</code>（"否则如果"），处理两种以上的情况：</p>
          <pre>if score >= 90:
    print("A")
elif score >= 60:
    print("B")
else:
    print("C")</pre>
          <p>创建变量 score，值大于等于90，写一个 if/elif/else 三分支判断：>=90打印"A"，>=60打印"B"，否则打印"C"。要让最终输出是"A"。</p>
        `,
      starter: `# 创建变量 score，值 >= 90
# 写 if/elif/else：>=90打印"A"，>=60打印"B"，否则打印"C"
`,
      hint: `格式：if score >= 90: 换行缩进 print("A") 另起一行 elif score >= 60: 换行缩进 print("B") 另起一行 else: 换行缩进 print("C")`,
      answer: `score = 95
if score >= 90:
    print("A")
elif score >= 60:
    print("B")
else:
    print("C")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\belif\b/.test(r.code)) {
            return { pass: false, message: "这一关要用 elif 处理第二种情况，检查一下代码里有没有 elif。" };
          }
          if (r.stdout.includes("A")) return { pass: true, message: "elif 学会了！可以用来处理两种以上的分支情况。" };
          return { pass: false, message: "还没看到'A'，检查一下 score 的值是不是真的大于等于90。" };
        },
    },
    {
      explain: `
          <p>if 不一定要配 else——如果不满足条件，就什么都不做，直接往下走：</p>
          <pre>balance = 30
if balance < 50:
    print("余额不足，请充值")</pre>
          <p>创建变量 balance，值小于50，写一个只有 if（没有else）的判断：如果 balance 小于50，打印"余额不足，请充值"。</p>
        `,
      starter: `# 创建变量 balance，值 < 50
# 写一个只有 if（不需要else）的判断：balance < 50 时打印"余额不足，请充值"
`,
      hint: `格式：if balance < 50: 换行缩进 print("余额不足，请充值")——不需要写else。`,
      answer: `balance = 30
if balance < 50:
    print("余额不足，请充值")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bif\b/.test(r.code)) {
            return { pass: false, message: "代码里好像没有用到 if，检查一下有没有写判断。" };
          }
          if (r.stdout.includes("余额不足")) return { pass: true, message: "if 学会了！不是每个if都必须配else，不满足条件时可以什么都不做。" };
          return { pass: false, message: "还没看到'余额不足，请充值'，检查一下 balance 的值是不是真的小于50。" };
        },
    },
    {
      explain: `
          <p><code>and</code> 可以把两个条件"合并"，两个都满足才算真：</p>
          <pre>if score >= 60 and attendance >= 80:
    print("通过")
else:
    print("不通过")</pre>
          <p>创建 score 和 attendance 两个变量，值都要满足条件，写判断：分数>=60 并且 出勤率>=80，才打印"通过"，否则打印"不通过"。要让最终输出是"通过"。</p>
        `,
      starter: `# 创建变量 score（>=60）和 attendance（>=80）
# 写判断：score >= 60 and attendance >= 80 时打印"通过"，否则"不通过"
`,
      hint: `格式：if score >= 60 and attendance >= 80: 换行缩进 print("通过") 另起一行 else: 换行缩进 print("不通过")`,
      answer: `score = 80
attendance = 90
if score >= 60 and attendance >= 80:
    print("通过")
else:
    print("不通过")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\band\b/.test(r.code)) {
            return { pass: false, message: "这一关要用 and 合并两个条件，检查一下代码里有没有 and。" };
          }
          if (r.stdout.includes("通过") && !r.stdout.includes("不通过")) {
            return { pass: true, message: "and 学会了！两个条件都满足才会走进if里面。" };
          }
          return { pass: false, message: "还没看到'通过'，检查一下 score 和 attendance 是不是都满足了条件。" };
        },
    },
    {
      explain: `
          <p><code>or</code> 可以把两个条件"合并"，只要有一个满足就算真：</p>
          <pre>if day == "周六" or day == "周日":
    print("周末")
else:
    print("工作日")</pre>
          <p>创建变量 day，值是"周六"或"周日"，写判断：day是"周六" 或者 day是"周日"，打印"周末"，否则打印"工作日"。</p>
        `,
      starter: `# 创建变量 day，值是 "周六" 或 "周日"
# 写判断：day == "周六" or day == "周日" 时打印"周末"，否则"工作日"
`,
      hint: `格式：if day == "周六" or day == "周日": 换行缩进 print("周末") 另起一行 else: 换行缩进 print("工作日")`,
      answer: `day = "周六"
if day == "周六" or day == "周日":
    print("周末")
else:
    print("工作日")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bor\b/.test(r.code)) {
            return { pass: false, message: "这一关要用 or 合并两个条件，检查一下代码里有没有 or。" };
          }
          if (r.stdout.includes("周末")) {
            return { pass: true, message: "or 学会了！只要有一个条件满足，就会走进if里面。" };
          }
          return { pass: false, message: "还没看到'周末'，检查一下 day 的值是不是'周六'或'周日'。" };
        },
    },
    {
      explain: `
          <p><code>not</code> 可以把条件的真假"反过来"：</p>
          <pre>if not (age >= 18):
    print("未成年人")
else:
    print("成年人")</pre>
          <p>创建变量 age，值小于18，用 not 写判断：如果 not (age>=18) 打印"未成年人"，否则打印"成年人"。</p>
        `,
      starter: `# 创建变量 age，值 < 18
# 写判断：not (age >= 18) 时打印"未成年人"，否则"成年人"
`,
      hint: `格式：if not (age >= 18): 换行缩进 print("未成年人") 另起一行 else: 换行缩进 print("成年人")`,
      answer: `age = 15
if not (age >= 18):
    print("未成年人")
else:
    print("成年人")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bnot\b/.test(r.code)) {
            return { pass: false, message: "这一关要用 not 反转条件，检查一下代码里有没有 not。" };
          }
          if (r.stdout.includes("未成年人")) {
            return { pass: true, message: "not 学会了！它能把条件的真假反过来。" };
          }
          return { pass: false, message: "还没看到'未成年人'，检查一下 age 的值是不是真的小于18。" };
        },
    }
  ],
};
