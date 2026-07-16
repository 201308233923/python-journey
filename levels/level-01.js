const LEVEL_1 = {
  id: 1,
  title: `第1关：打印 print()`,
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
      answer: `print("你好，世界！")`,
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
          <p><code>print()</code> 其实能一次接收多个内容，中间用逗号隔开，Python 会自动在它们中间加一个空格：</p>
          <pre>print("A", "B")   # 输出：A B</pre>
          <p>用这种"逗号分隔多个内容"的写法，打印出：你好 世界！（"你好"和"世界！"是两段分开的文字，逗号隔开）。</p>
        `,
      starter: `# 用逗号分隔两段文字，一次性 print 出来
# print("你好", "世界！")
`,
      hint: `格式：print("你好", "世界！")，注意是用逗号，不是加号。`,
      answer: `print("你好", "世界！")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/print\(\s*["'][^"']*["']\s*,/.test(r.code)) {
            return { pass: false, message: "这一关要用逗号分隔多个内容传给 print()，检查一下是不是写成了 print(\"你好\", \"世界！\") 这种格式。" };
          }
          if (r.stdout.includes("你好") && r.stdout.includes("世界")) {
            return { pass: true, message: "太棒了！print() 用逗号分隔多个内容时，会自动在中间加空格。" };
          }
          return { pass: false, message: "有输出了，但内容不太对，检查一下两段文字是不是'你好'和'世界！'。" };
        },
    },
    {
      explain: `
          <p>除了直接把文字写进 print() 里，也可以先把文字存进一个变量，再打印这个变量：</p>
          <pre>message = "我是编程新手"
print(message)</pre>
          <p>创建一个变量 message，存放文字"Python真好玩！"，然后用 print(message) 打印出来。</p>
        `,
      starter: `# 创建变量 message，存放文字：Python真好玩！
# 然后 print(message)
`,
      hint: `格式：message = "Python真好玩！" 换行 print(message)`,
      answer: `message = "Python真好玩！"
print(message)`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\w+\s*=(?!=)/.test(r.code)) {
            return { pass: false, message: "这一关要先创建一个变量存文字，再 print 这个变量，检查一下有没有用等号赋值。" };
          }
          if (r.stdout.includes("Python") && r.stdout.includes("好玩")) {
            return { pass: true, message: "太棒了！先存进变量再打印，这是接下来会经常用到的写法。" };
          }
          return { pass: false, message: "有输出了，但内容不太对，检查一下是不是打印的正好是'Python真好玩！'。" };
        },
    },
    {
      explain: `
          <p>文字（字符串）之间可以用加号 <code>+</code> 拼接起来：</p>
          <pre>print("我" + "是" + "编程新手")</pre>
          <p>用加号把几段文字拼接起来，打印出："你好，世界！"（可以拆成"你好"、"，"、"世界"、"！"几段，用+号连起来）。</p>
        `,
      starter: `# 用 + 号把几段文字拼接起来，打印出：你好，世界！
`,
      hint: `格式：print("你" + "好" + "，" + "世界" + "！")，每一段都要用引号包起来。`,
      answer: `print("你" + "好" + "，" + "世界" + "！")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("+")) {
            return { pass: false, message: "这一关要用加号 + 拼接几段文字，检查一下代码里有没有用+号。" };
          }
          if (r.stdout.includes("你好") && r.stdout.includes("世界")) {
            return { pass: true, message: "太棒了！+ 号拼接字符串，是除了逗号之外另一种常见的写法。" };
          }
          return { pass: false, message: "有输出了，但内容不太对，检查一下拼起来的是不是'你好，世界！'。" };
        },
    },
    {
      explain: `
          <p>print() 可以调用很多次，每次调用会另起一行：</p>
          <pre>print("第一行")
print("第二行")</pre>
          <p>用两次 print()，第一行打印"你好"，第二行打印"世界！"。</p>
        `,
      starter: `# 用两次 print()
# 第一次打印：你好
# 第二次打印：世界！
`,
      hint: `格式：print("你好") 换行 print("世界！")`,
      answer: `print("你好")
print("世界！")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 2) {
            return { pass: false, message: "这一关要用两次 print()，分别打印两行，检查一下是不是只写了一次。" };
          }
          if (r.stdout.includes("你好") && r.stdout.includes("世界")) {
            return { pass: true, message: "太棒了！每调用一次print()，内容就会另起一行。" };
          }
          return { pass: false, message: "打印了两行，但内容不太对，检查一下第一行是不是'你好'，第二行是不是'世界！'。" };
        },
    },
    {
      explain: `
          <p>用三个引号 <code>"""</code> 包起来的字符串可以直接换行，print 出来的时候也会分成好几行：</p>
          <pre>print("""第一行
第二行""")</pre>
          <p>用三引号字符串，打印出两行：第一行"你好"，第二行"世界！"。</p>
        `,
      starter: `# 用三个引号 """ 包起来的字符串，中间直接换行
# print("""你好
# 世界！""")
`,
      hint: `格式：print("""你好\\n世界！"""）——把上面starter里的注释去掉，中间保留真正的换行（不是打\\n两个字符）。`,
      answer: `print("""你好
世界！""")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes('"""') && !r.code.includes("'''")) {
            return { pass: false, message: "这一关要用三引号（\"\"\" 或 '''）包起来的字符串，检查一下代码里有没有用三引号。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 2) {
            return { pass: false, message: "三引号字符串里要有真正的换行，才会打印成两行，检查一下是不是在字符串中间直接按了回车。" };
          }
          if (r.stdout.includes("你好") && r.stdout.includes("世界")) {
            return { pass: true, message: "太棒了！三引号字符串可以直接跨行书写，很适合打印一大段话。" };
          }
          return { pass: false, message: "打印了两行，但内容不太对，检查一下第一行是不是'你好'，第二行是不是'世界！'。" };
        },
    }
  ],
};
