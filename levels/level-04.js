const LEVEL_4 = {
  id: 4,
  title: `第4关：拼接文字（f-string）`,
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
      answer: `name = "小明"
age = 13
print(f"我叫{name}，今年{age}岁")`,
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
          <p>f-string 的花括号 <code>{}</code> 里不仅能放变量，还能直接放一整个算式：</p>
          <pre>age = 13
print(f"5年后我{age + 5}岁")   # 花括号里直接算</pre>
          <p>创建变量 age，用 f-string 打印出："我今年xx岁，5年后我xx岁"——第二个xx要在花括号里直接用 age+5 算出来，不要另外创建一个变量存结果。</p>
        `,
      starter: `# 创建变量 age
# 用 f-string 打印："我今年{age}岁，5年后我{age+5}岁"
# 花括号里直接写算式，不用额外创建变量
`,
      hint: `格式：print(f"我今年{age}岁，5年后我{age + 5}岁")`,
      answer: `age = 13
print(f"我今年{age}岁，5年后我{age + 5}岁")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.includes("{")) {
            return { pass: false, message: "花括号好像没有被替换成值，检查一下字符串前面有没有加 f。" };
          }
          if (!/\{\s*\w+\s*\+\s*\d+\s*\}/.test(r.code)) {
            return { pass: false, message: "这一关要在花括号里直接写算式（比如 {age + 5}），而不是先单独算好存进新变量，检查一下花括号里有没有直接写加法。" };
          }
          if (r.stdout.includes("5年后")) {
            return { pass: true, message: "拼接成功！花括号里可以直接放算式，Python会自动算出结果再显示。" };
          }
          return { pass: false, message: "还没看到符合格式的输出，检查一下是不是打印了'我今年...岁，5年后我...岁'。" };
        },
    },
    {
      explain: `
          <p>f-string 里可以放好几个变量，不限于两个：</p>
          <pre>a = "A"
b = "B"
print(f"{a}和{b}")</pre>
          <p>创建 name（名字）、city（城市）、hobby（爱好）三个变量，
          用一个 f-string 打印出："我叫xxx，来自xxx，喜欢xxx"。</p>
        `,
      starter: `# 创建变量 name、city、hobby
# 用 f-string 打印："我叫{name}，来自{city}，喜欢{hobby}"
`,
      hint: `格式：print(f"我叫{name}，来自{city}，喜欢{hobby}")`,
      answer: `name = "小明"
city = "北京"
hobby = "篮球"
print(f"我叫{name}，来自{city}，喜欢{hobby}")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.includes("{")) {
            return { pass: false, message: "花括号好像没有被替换成变量的值，检查一下字符串前面有没有加 f。" };
          }
          if (!r.code.includes("name") || !r.code.includes("city") || !r.code.includes("hobby")) {
            return { pass: false, message: "检查一下代码里有没有真的创建 name、city、hobby 这三个变量。" };
          }
          if (r.stdout.includes("我叫") && r.stdout.includes("来自") && r.stdout.includes("喜欢")) {
            return { pass: true, message: "拼接成功！一个f-string里可以放任意多个变量。" };
          }
          return { pass: false, message: "还没看到符合格式的输出，检查一下是不是打印了'我叫...，来自...，喜欢...'。" };
        },
    },
    {
      explain: `
          <p>字符串自带一些"方法"，比如 <code>.upper()</code> 能把文字转成大写，可以直接在花括号里调用：</p>
          <pre>name = "tom"
print(f"大写是{name.upper()}")   # 大写是TOM</pre>
          <p>创建一个变量 name，存一个英文名字（比如"xiaoming"），
          用 f-string 打印出："我的英文名大写是xxx"，花括号里直接调用 .upper()。</p>
        `,
      starter: `# 创建变量 name，存一个英文名字（字母）
# 用 f-string 打印："我的英文名大写是{name.upper()}"
`,
      hint: `格式：name = "xiaoming" 换行 print(f"我的英文名大写是{name.upper()}")`,
      answer: `name = "xiaoming"
print(f"我的英文名大写是{name.upper()}")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.includes("{")) {
            return { pass: false, message: "花括号好像没有被替换成值，检查一下字符串前面有没有加 f。" };
          }
          if (!r.code.includes(".upper(")) {
            return { pass: false, message: "这一关要在花括号里调用 .upper() 方法，检查一下代码里有没有写 name.upper()。" };
          }
          if (!/[A-Z]/.test(r.stdout)) {
            return { pass: false, message: "输出里没有看到大写字母，检查一下 name 存的是不是英文字母，以及 .upper() 有没有生效。" };
          }
          return { pass: true, message: "拼接成功！.upper() 是字符串自带的方法，能直接在f-string花括号里调用。" };
        },
    },
    {
      explain: `
          <p>三引号字符串和 f-string 可以结合使用，写出跨好几行的内容：</p>
          <pre>name = "小明"
print(f"""姓名：{name}
年龄：13""")</pre>
          <p>创建 name 和 age 两个变量，用三引号+f-string，打印出两行："姓名：xxx"和"年龄：xxx"。</p>
        `,
      starter: `# 创建变量 name 和 age
# 用三引号 f-string，打印两行：
# 姓名：{name}
# 年龄：{age}
`,
      hint: `格式：print(f"""姓名：{name}\\n年龄：{age}"""）——中间是真正的换行，不是打\\n两个字符。`,
      answer: `name = "小明"
age = 13
print(f"""姓名：{name}
年龄：{age}""")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.includes("{")) {
            return { pass: false, message: "花括号好像没有被替换成值，检查一下字符串前面有没有加 f。" };
          }
          if (!r.code.includes('f"""') && !r.code.includes("f'''")) {
            return { pass: false, message: "这一关要用三引号+f-string结合的写法（比如 f\"\"\"...\"\"\"），检查一下代码里有没有用三引号。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 2) {
            return { pass: false, message: "三引号字符串里要有真正的换行，才会打印成两行，检查一下是不是在字符串中间直接按了回车。" };
          }
          if (r.stdout.includes("姓名") && r.stdout.includes("年龄")) {
            return { pass: true, message: "拼接成功！三引号和f-string结合，可以写出跨行又带变量的内容。" };
          }
          return { pass: false, message: "打印了两行，但内容不太对，检查一下是不是'姓名：...'和'年龄：...'。" };
        },
    },
    {
      explain: `
          <p>f-string 花括号里可以加"格式说明"，比如 <code>:.2f</code> 能把小数固定保留两位：</p>
          <pre>price = 9.5
print(f"价格是{price:.2f}元")   # 价格是9.50元</pre>
          <p>创建变量 price，值是9.5，用 f-string 加 :.2f 格式，打印出："价格是9.50元"。</p>
        `,
      starter: `# 创建变量 price，值是9.5
# 用 f-string 打印："价格是{price:.2f}元"
`,
      hint: `格式：price = 9.5 换行 print(f"价格是{price:.2f}元")`,
      answer: `price = 9.5
print(f"价格是{price:.2f}元")`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.includes("{")) {
            return { pass: false, message: "花括号好像没有被替换成值，检查一下字符串前面有没有加 f。" };
          }
          if (!r.code.includes(":.2f")) {
            return { pass: false, message: "这一关要用 :.2f 格式说明，检查一下花括号里有没有写 {price:.2f}。" };
          }
          if (!/\.\d{2}/.test(r.stdout)) {
            return { pass: false, message: "输出里没看到保留两位小数的数字，检查一下 :.2f 有没有写对位置。" };
          }
          return { pass: true, message: "拼接成功！:.2f 这种格式说明能控制小数显示的位数，很适合处理金额。" };
        },
    }
  ],
};
