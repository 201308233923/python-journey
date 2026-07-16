const LEVEL_5 = {
  id: 5,
  title: `第5关：获取用户输入`,
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
      answer: `name = input("你叫什么名字？")
print(f"你好，{name}！")`,
      needsInput: true,
      defaultInput: `小明`,
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
          <p>input() 拿到的永远是文字，想拿来做数学运算，要用 <code>int()</code> 转换成数字：</p>
          <pre>age = int(input("你几岁？"))
print(age + 1)</pre>
          <p>用 input() 问"你几岁？"，转换成数字存到变量 age，
          用 f-string 打印出："明年你xx岁"（xx = age + 1，在花括号里直接算）。</p>
        `,
      starter: `# 用 int(input(...)) 问年龄，存到变量 age
# 用 f-string 打印："明年你{age + 1}岁"
`,
      hint: `格式：age = int(input("你几岁？")) 换行 print(f"明年你{age + 1}岁")`,
      answer: `age = int(input("你几岁？"))
print(f"明年你{age + 1}岁")`,
      needsInput: true,
      defaultInput: `13`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bint\(/.test(r.code) || !r.code.includes("input(")) {
            return { pass: false, message: "这一关要用 int(input(...)) 把输入转成数字，检查一下代码里有没有这样写。" };
          }
          if (r.stdout.includes("明年你") && /\d/.test(r.stdout)) {
            return { pass: true, message: "完美，input() 拿到的是文字，用 int() 转成数字之后就能直接参与计算了。" };
          }
          return { pass: false, message: "还没看到'明年你xx岁'的输出，检查一下有没有把年龄转成数字并且加1。" };
        },
    },
    {
      explain: `
          <p>可以连续用好几次 input()，问好几个不同的问题：</p>
          <pre>name = input("你叫什么？")
food = input("你喜欢吃什么？")
print(f"{name}最喜欢吃{food}")</pre>
          <p>用两次 input()，分别问"你叫什么名字？"和"你喜欢吃什么？"，
          再用 f-string 打印出："xxx最喜欢吃xxx"。</p>
        `,
      starter: `# 用两次 input()，分别问名字和喜欢吃的食物
# 用 f-string 打印："{name}最喜欢吃{food}"
`,
      hint: `模拟输入框里要写两行，第一行是名字，第二行是食物。格式：name = input(...) 换行 food = input(...) 换行 print(f"{name}最喜欢吃{food}")`,
      answer: `name = input("你叫什么？")
food = input("你喜欢吃什么？")
print(f"{name}最喜欢吃{food}")`,
      needsInput: true,
      defaultInput: `小明
披萨`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if ((r.code.match(/input\(/g) || []).length < 2) {
            return { pass: false, message: "这一关要用两次 input()，检查一下是不是只问了一个问题。" };
          }
          if (r.stdout.includes("最喜欢吃")) {
            return { pass: true, message: "完美，一个程序里可以用好几次 input()，收集不同的信息。" };
          }
          return { pass: false, message: "还没看到'...最喜欢吃...'的输出，检查一下两个变量有没有正确拼进f-string。" };
        },
    },
    {
      explain: `
          <p>结合 input() 和数学公式，可以做一个简单的换算器：</p>
          <pre>c = int(input("摄氏度？"))
f = c * 9 / 5 + 32
print(f"华氏温度是{f}度")</pre>
          <p>用 input() 问"今天几度（摄氏）？"，转成数字，用公式 <code>c * 9 / 5 + 32</code> 算出华氏温度，
          再用 f-string 打印出："华氏温度是xx度"。</p>
        `,
      starter: `# 用 int(input(...)) 问摄氏温度，存到变量 celsius
# 算出 fahrenheit = celsius * 9 / 5 + 32
# 用 f-string 打印："华氏温度是{fahrenheit}度"
`,
      hint: `格式：celsius = int(input("今天几度（摄氏）？")) 换行 fahrenheit = celsius * 9 / 5 + 32 换行 print(f"华氏温度是{fahrenheit}度")`,
      answer: `celsius = int(input("今天几度（摄氏）？"))
fahrenheit = celsius * 9 / 5 + 32
print(f"华氏温度是{fahrenheit}度")`,
      needsInput: true,
      defaultInput: `0`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bint\(/.test(r.code) || !r.code.includes("input(") || !r.code.includes("*")) {
            return { pass: false, message: "这一关要用 int(input(...)) 拿到摄氏度，再用公式算出华氏度，检查一下代码里有没有用到乘法。" };
          }
          if (r.stdout.includes("华氏温度是")) {
            return { pass: true, message: "完美，input() + 数学公式，就能做一个简单的单位换算器。" };
          }
          return { pass: false, message: "还没看到'华氏温度是...度'的输出，检查一下公式和f-string有没有写对。" };
        },
    },
    {
      explain: `
          <p>除了 f-string，也可以用加号 <code>+</code> 把 input() 拿到的文字直接拼接起来：</p>
          <pre>city = input("你住哪？")
print("我" + "住在" + city)</pre>
          <p>用 input() 问"你住哪个城市？"，存到变量 city，
          用加号拼接的方式（不用f-string）打印出："我住在xxx"。</p>
        `,
      starter: `# 用 input() 问你住的城市，存到变量 city
# 用加号 + 拼接打印："我住在" + city
`,
      hint: `格式：city = input("你住哪个城市？") 换行 print("我" + "住在" + city)`,
      answer: `city = input("你住哪个城市？")
print("我" + "住在" + city)`,
      needsInput: true,
      defaultInput: `北京`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("input(")) {
            return { pass: false, message: "代码里好像没有用到 input()，这一关的重点就是用它接收用户输入。" };
          }
          if (!r.code.includes("+")) {
            return { pass: false, message: "这一关要用加号 + 拼接文字（不用f-string），检查一下代码里有没有用+号。" };
          }
          if (r.stdout.includes("我住在")) {
            return { pass: true, message: "完美，input() 拿到的内容也是普通字符串，一样能用+号拼接。" };
          }
          return { pass: false, message: "还没看到'我住在...'的输出，检查一下拼接顺序对不对。" };
        },
    },
    {
      explain: `
          <p><code>len()</code> 能算出字符串有几个字：</p>
          <pre>word = "编程"
print(len(word))   # 2</pre>
          <p>用 input() 问"说一个词："，存到变量 word，
          用 f-string 和 len() 打印出："这个词有xx个字"。</p>
        `,
      starter: `# 用 input() 问一个词，存到变量 word
# 用 f-string 和 len()，打印："这个词有{len(word)}个字"
`,
      hint: `格式：word = input("说一个词：") 换行 print(f"这个词有{len(word)}个字")`,
      answer: `word = input("说一个词：")
print(f"这个词有{len(word)}个字")`,
      needsInput: true,
      defaultInput: `编程`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("len(") || !r.code.includes("input(")) {
            return { pass: false, message: "这一关要用 len() 算出输入的字数，检查一下代码里有没有用到 len()。" };
          }
          if (r.stdout.includes("个字") && /\d/.test(r.stdout)) {
            return { pass: true, message: "完美，len() 可以用在任何字符串上，包括 input() 拿到的内容。" };
          }
          return { pass: false, message: "还没看到'这个词有xx个字'的输出，检查一下 len() 和f-string有没有写对。" };
        },
    }
  ],
};
