// 每一关的内容：讲解、初始代码（只给骨架，不给答案）、提示、以及判断"过关"的检查函数。
// check(result) 返回 { pass: boolean, message: string }，result = { stdout, err, code }
// explainError(err) 定义在 app.js 里，把Python的报错翻译成人话。
// why 是可选的"为什么"小贴士，针对这一关最容易问的深层问题，放在关卡顶层（跟具体样子无关）。
// 部分check()会顺带看一眼code，防止不用对应知识点、直接把答案写死也能过关。
//
// variants：每一关准备了6个"样子"——不是简单换个场景文字，而是用真正不同的写法/方法
// 达到同一个学习目标（比如第9关，有的样子教你用下标取值，有的教你用for循环遍历，
// 有的教你用切片）。第一次打开某一关会随机挑一个；点"重置进度"之后，
// 会优先挑"还没做过的样子"，6个都做过一轮了才会重新循环——不会立刻重复。
// 挑选逻辑在 app.js 的 resolveVariant() 里。

const LEVELS = [
  {
    id: 1,
    title: "第1关：打印 print()",
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
      },
    ],
  },
  {
    id: 2,
    title: "第2关：变量是什么",
    why: `为什么要用变量而不是直接print("你的名字")？因为变量能被反复使用和修改——存一次，后面随时用名字取用，不用每次都重新打一遍值。这是几乎所有程序的基础。`,
    variants: [
      {
        explain: `
          <p>变量就像一个贴了标签的盒子，用来装数据，方便以后取用。</p>
          <pre>name = "小明"
age = 13
print(name)
print(age)</pre>
          <p>等号 <code>=</code> 在这里不是"等于"，而是"把右边的值放进左边这个盒子里"。</p>
          <p>在下面创建一个叫 <code>my_name</code> 的变量，装上你的名字，再用 print() 打印出来。</p>
        `,
        starter: `# 创建一个变量 my_name，存放你的名字
# 然后用 print(my_name) 打印出来
`,
        hint: `变量名不能有空格，也不能用数字开头。文字记得加引号，格式是 my_name = "你的名字"，然后另起一行 print(my_name)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.trim().length === 0) {
            return { pass: false, message: "记得要创建变量并且 print() 出来才能看到结果哦。" };
          }
          if (!/\w+\s*=(?!=)/.test(r.code)) {
            return { pass: false, message: "看到输出了，但代码里好像没有真的创建变量（比如 my_name = ...），检查一下有没有用等号赋值。" };
          }
          return { pass: true, message: "很好，你已经学会用变量存东西了。" };
        },
      },
      {
        explain: `
          <p>变量不仅能装文字，也能装数字，装数字的时候不需要加引号：</p>
          <pre>age = 13
print(age)</pre>
          <p>创建一个叫 <code>my_age</code> 的变量，装上你的年龄（数字，不加引号），再用 print() 打印出来。</p>
        `,
        starter: `# 创建一个变量 my_age，存放你的年龄（数字）
# 然后用 print(my_age) 打印出来
`,
        hint: `数字不用加引号，格式是 my_age = 13，然后另起一行 print(my_age)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.trim().length === 0) {
            return { pass: false, message: "记得要创建变量并且 print() 出来才能看到结果哦。" };
          }
          if (!/\w+\s*=(?!=)/.test(r.code)) {
            return { pass: false, message: "看到输出了，但代码里好像没有真的创建变量（比如 my_age = ...），检查一下有没有用等号赋值。" };
          }
          if (!/^\d+$/.test(r.stdout.trim())) {
            return { pass: false, message: "这一关存的是数字，检查一下 my_age 有没有直接写数字（不加引号）。" };
          }
          return { pass: true, message: "很好，数字变量也学会了，不加引号就是数字类型。" };
        },
      },
      {
        explain: `
          <p>Python 允许一行代码同时创建好几个变量：</p>
          <pre>a, b = "苹果", "香蕉"
print(a)
print(b)</pre>
          <p>用这种一行创建两个变量的写法，创建 my_name 和 my_age，分别装上你的名字和年龄，然后分两行打印出来。</p>
        `,
        starter: `# 一行同时创建两个变量：my_name, my_age = "你的名字", 你的年龄
# 然后分别 print(my_name) 和 print(my_age)
`,
        hint: `格式：my_name, my_age = "小明", 13，然后 print(my_name) 换行 print(my_age)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 2) {
            return { pass: false, message: "这一关要打印两行（名字和年龄各一行），检查一下是不是两个都print了。" };
          }
          if (!/\w+\s*,\s*\w+\s*=/.test(r.code)) {
            return { pass: false, message: "检查一下有没有用'一行创建两个变量'的写法，比如 my_name, my_age = \"小明\", 13。" };
          }
          return { pass: true, message: "很好，一行同时创建多个变量的写法学会了。" };
        },
      },
      {
        explain: `
          <p>变量可以被重新赋值——新的值会覆盖掉旧的值：</p>
          <pre>score = 60
print(score)
score = 90
print(score)</pre>
          <p>创建变量 score，先赋值60并打印，然后重新赋值成90，再打印一次。</p>
        `,
        starter: `# 创建变量 score = 60，打印
# 再把 score 重新赋值成 90，打印
`,
        hint: `格式：score = 60 换行 print(score) 换行 score = 90 换行 print(score)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 2) {
            return { pass: false, message: "这一关要打印两次（重新赋值前后各一次），检查一下是不是两次都print了。" };
          }
          if (lines[0] === lines[lines.length - 1]) {
            return { pass: false, message: "两次打印的值一样，看起来变量没有被真的重新赋值，检查一下有没有写第二次 score = ..." };
          }
          if ((r.code.match(/\w+\s*=(?!=)/g) || []).length < 2) {
            return { pass: false, message: "检查一下代码里有没有对同一个变量赋值两次。" };
          }
          return { pass: true, message: "很好，变量可以随时被重新赋值，新值会覆盖旧值。" };
        },
      },
      {
        explain: `
          <p>可以把一个变量的值，赋给另一个新变量：</p>
          <pre>original = "苹果"
copy = original
print(copy)</pre>
          <p>创建变量 original，装上任意文字，再创建变量 copy，把 original 的值赋给它，然后打印 copy。</p>
        `,
        starter: `# 创建变量 original，装上任意文字
# 创建变量 copy，把 original 的值赋给它
# print(copy)
`,
        hint: `格式：original = "苹果" 换行 copy = original 换行 print(copy)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (r.stdout.trim().length === 0) {
            return { pass: false, message: "记得要创建变量并且 print() 出来才能看到结果哦。" };
          }
          if ((r.code.match(/\w+\s*=(?!=)/g) || []).length < 2) {
            return { pass: false, message: "这一关要创建两个变量（original 和 copy），检查一下是不是只写了一次赋值。" };
          }
          return { pass: true, message: "很好，一个变量的值可以传给另一个变量，两者存的是同一份数据。" };
        },
      },
      {
        explain: `
          <p>Python 支持"链式赋值"：一次性把同一个值同时赋给好几个变量：</p>
          <pre>x = y = "同一个值"
print(x)
print(y)</pre>
          <p>用链式赋值，把同一段文字同时赋给 a 和 b 两个变量，然后分两行打印。</p>
        `,
        starter: `# 用链式赋值：a = b = "任意文字"
# 然后分别 print(a) 和 print(b)
`,
        hint: `格式：a = b = "你好" 换行 print(a) 换行 print(b)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 2) {
            return { pass: false, message: "这一关要打印两行（a和b各一行），检查一下是不是两个都print了。" };
          }
          if (lines[0] !== lines[1]) {
            return { pass: false, message: "链式赋值应该让两个变量存一样的值，检查一下打印出来的两行是不是相同。" };
          }
          if (!/\w+\s*=\s*\w+\s*=(?!=)/.test(r.code)) {
            return { pass: false, message: "检查一下有没有用链式赋值的写法，比如 a = b = \"你好\"。" };
          }
          return { pass: true, message: "很好，链式赋值可以一次性给多个变量存同一个值。" };
        },
      },
    ],
  },
  {
    id: 3,
    title: "第3关：数字运算",
    why: `为什么不能直接写死答案数字？因为如果之后数值变了（比如金额、年龄换了别的数），写死的答案就不对了。用变量算出来的代码可以复用，这是编程和"手算"最大的区别。`,
    variants: [
      {
        explain: `
          <p>Python 可以当计算器用：<code>+ - * /</code> 分别是加减乘除。</p>
          <pre>a = 10
b = 3
print(a + b)</pre>
          <p>试着算一下：如果你今年13岁，10年后你多少岁？创建两个变量（当前年龄、10年后要加的年数），
          算出结果存进第三个变量，再打印出来——不要直接写死答案数字。</p>
        `,
        starter: `# 创建变量 age，值是13
# 创建变量 years_later，值是10
# 算出 future_age = age + years_later
# 打印 future_age
`,
        hint: `格式大概是：age = 13 / years_later = 10 / future_age = age + years_later / print(future_age)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\d/.test(r.stdout)) {
            return { pass: false, message: "输出里没有看到数字，检查一下有没有 print() 出计算结果。" };
          }
          if (!r.stdout.includes("23")) {
            return { pass: false, message: "打印出数字了，但结果不是23，检查一下 age 和 years_later 的值，以及加法有没有写对。" };
          }
          if (!r.code.includes("+")) {
            return { pass: false, message: "结果对了，但代码里好像没有用加法（+）——是不是直接把23写死了？改成用 age + years_later 真正算出来。" };
          }
          return { pass: true, message: "运算成功！13岁10年后是23岁，算对了。" };
        },
      },
      {
        explain: `
          <p>Python 可以当计算器用：<code>+ - * /</code> 分别是加减乘除。</p>
          <pre>a = 10
b = 3
print(a - b)</pre>
          <p>试着算一下：你有20元零花钱，花了7元买文具，还剩多少钱？创建两个变量（原来的钱、花掉的钱），
          用减法算出结果存进第三个变量，再打印出来——不要直接写死答案数字。</p>
        `,
        starter: `# 创建变量 total_money，值是20
# 创建变量 spent_money，值是7
# 算出 remaining_money = total_money - spent_money
# 打印 remaining_money
`,
        hint: `格式大概是：total_money = 20 / spent_money = 7 / remaining_money = total_money - spent_money / print(remaining_money)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\d/.test(r.stdout)) {
            return { pass: false, message: "输出里没有看到数字，检查一下有没有 print() 出计算结果。" };
          }
          if (!r.stdout.includes("13")) {
            return { pass: false, message: "打印出数字了，但结果不是13，检查一下 total_money 和 spent_money 的值，以及减法有没有写对。" };
          }
          if (!r.code.includes("-")) {
            return { pass: false, message: "结果对了，但代码里好像没有用减法（-）——是不是直接把13写死了？改成用 total_money - spent_money 真正算出来。" };
          }
          return { pass: true, message: "运算成功！20元花掉7元，还剩13元，算对了。" };
        },
      },
      {
        explain: `
          <p>Python 可以当计算器用：<code>+ - * /</code> 分别是加减乘除。</p>
          <pre>a = 10
b = 3
print(a * b)</pre>
          <p>试着算一下：一支笔3元，买5支笔要多少钱？创建两个变量（单价、数量），
          用乘法算出结果存进第三个变量，再打印出来——不要直接写死答案数字。</p>
        `,
        starter: `# 创建变量 price 值是3
# 创建变量 quantity 值是5
# 算出 total = price * quantity
# 打印 total
`,
        hint: `格式大概是：price = 3 / quantity = 5 / total = price * quantity / print(total)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\d/.test(r.stdout)) {
            return { pass: false, message: "输出里没有看到数字，检查一下有没有 print() 出计算结果。" };
          }
          if (!r.stdout.includes("15")) {
            return { pass: false, message: "打印出数字了，但结果不是15，检查一下 price 和 quantity 的值，以及乘法有没有写对。" };
          }
          if (!r.code.includes("*")) {
            return { pass: false, message: "结果对了，但代码里好像没有用乘法（*）——是不是直接把15写死了？改成用 price * quantity 真正算出来。" };
          }
          return { pass: true, message: "运算成功！3元一支笔买5支是15元，算对了。" };
        },
      },
      {
        explain: `
          <p>Python 可以当计算器用：<code>+ - * /</code> 分别是加减乘除，<code>//</code> 是"整除"（只要商，不要余数）。</p>
          <pre>a = 10
b = 3
print(a // b)   # 3（不是3.33）</pre>
          <p>试着算一下：30个苹果平均分给5个人，每人分几个？创建两个变量（苹果总数、人数），
          用整除算出结果存进第三个变量，再打印出来——不要直接写死答案数字。</p>
        `,
        starter: `# 创建变量 total_apples 值是30
# 创建变量 people 值是5
# 算出 each = total_apples // people
# 打印 each
`,
        hint: `格式大概是：total_apples = 30 / people = 5 / each = total_apples // people / print(each)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\d/.test(r.stdout)) {
            return { pass: false, message: "输出里没有看到数字，检查一下有没有 print() 出计算结果。" };
          }
          if (!r.stdout.includes("6")) {
            return { pass: false, message: "打印出数字了，但结果不是6，检查一下 total_apples 和 people 的值，以及整除有没有写对。" };
          }
          if (!r.code.includes("//")) {
            return { pass: false, message: "结果对了，但代码里好像没有用整除（//）——是不是直接把6写死了？改成用 total_apples // people 真正算出来。" };
          }
          return { pass: true, message: "运算成功！30个苹果分给5人，每人6个，算对了。" };
        },
      },
      {
        explain: `
          <p>括号可以改变运算的优先级，先算括号里面的：</p>
          <pre>print((2 + 3) * 4)   # 20，不是2 + 3*4 = 14</pre>
          <p>创建三个变量 a=2、b=3、c=4，算出 (a + b) * c 存进第四个变量，再打印出来——不要直接写死答案数字。</p>
        `,
        starter: `# 创建变量 a=2, b=3, c=4
# 算出 result = (a + b) * c
# 打印 result
`,
        hint: `格式大概是：a = 2 / b = 3 / c = 4 / result = (a + b) * c / print(result)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\d/.test(r.stdout)) {
            return { pass: false, message: "输出里没有看到数字，检查一下有没有 print() 出计算结果。" };
          }
          if (!r.stdout.includes("20")) {
            return { pass: false, message: "打印出数字了，但结果不是20，检查一下有没有先算括号里的加法，再乘以c。" };
          }
          if (!r.code.includes("+") || !r.code.includes("*")) {
            return { pass: false, message: "结果对了，但代码里好像没有同时用到加法和乘法——是不是直接把20写死了？改成用 (a + b) * c 真正算出来。" };
          }
          return { pass: true, message: "运算成功！(2+3)*4 = 20，括号改变了运算顺序，算对了。" };
        },
      },
      {
        explain: `
          <p>可以把好几步运算结合起来，用一个变量存中间结果：</p>
          <pre>subtotal = 3 * 5
total = subtotal + 2
print(total)</pre>
          <p>试着算一下：一件衣服25元，买3件，另外加10元运费，一共要付多少钱？
          先算出衣服总价（乘法），再加上运费（加法），最后打印总价——不要直接写死答案数字。</p>
        `,
        starter: `# 创建变量 price 值是25，quantity 值是3，shipping 值是10
# 先算 clothes_total = price * quantity
# 再算 total = clothes_total + shipping
# 打印 total
`,
        hint: `格式大概是：price = 25 / quantity = 3 / shipping = 10 / clothes_total = price * quantity / total = clothes_total + shipping / print(total)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\d/.test(r.stdout)) {
            return { pass: false, message: "输出里没有看到数字，检查一下有没有 print() 出计算结果。" };
          }
          if (!r.stdout.includes("85")) {
            return { pass: false, message: "打印出数字了，但结果不是85，检查一下是不是先算了衣服总价(25*3=75)，再加上运费(75+10=85)。" };
          }
          if (!r.code.includes("+") || !r.code.includes("*")) {
            return { pass: false, message: "结果对了，但代码里好像没有同时用到乘法和加法——是不是直接把85写死了？改成两步算出来。" };
          }
          return { pass: true, message: "运算成功！3件衣服75元加10元运费，一共85元，两步计算都对了。" };
        },
      },
    ],
  },
  {
    id: 4,
    title: "第4关：拼接文字（f-string）",
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
      },
    ],
  },
  {
    id: 5,
    title: "第5关：获取用户输入",
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
        needsInput: true,
        defaultInput: "小明",
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
        needsInput: true,
        defaultInput: "13",
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
        needsInput: true,
        defaultInput: "小明\n披萨",
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
        needsInput: true,
        defaultInput: "0",
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
        needsInput: true,
        defaultInput: "北京",
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
        needsInput: true,
        defaultInput: "编程",
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
      },
    ],
  },
  {
    id: 6,
    title: "第6关：if 判断",
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
      },
    ],
  },
  {
    id: 7,
    title: "第7关：for 循环",
    why: `为什么不直接写很多个print？因为如果要打印1到10000，手写一万行不现实。循环让"重复"这件事本身变成代码，数量再大也只需要一样多的代码。`,
    variants: [
      {
        explain: `
          <p>循环可以让电脑帮你重复做一件事，不用自己写100遍。</p>
          <pre>for i in range(5):
    print(f"第{i}次")</pre>
          <p><code>range(5)</code> 会依次给出 0,1,2,3,4 这5个数字。</p>
          <p>用 for 循环打印出1到10（每个数字一行）。</p>
        `,
        starter: `# 用 for 循环和 range()，打印1到10
`,
        hint: `range(1, 11) 会从1数到10（不包含11）。格式：for i in range(1, 11): 换行缩进 print(i)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
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
          <p>用 for 循环，打印出"5的乘法表"：5x1=5 一直到 5x9=45（每行一个）。</p>
        `,
        starter: `# 用 for 循环 + f-string，打印5的乘法表：5x1=5 到 5x9=45
`,
        hint: `格式：for i in range(1, 10): 换行缩进 print(f"5x{i}={5*i}")`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 9) {
            return { pass: false, message: `目前只打印了${lines.length}行，5的乘法表应该有9行（5x1到5x9）。` };
          }
          if (r.stdout.includes("5x1=5") && r.stdout.includes("5x9=45")) {
            return { pass: true, message: "乘法表学会了！循环配合f-string，可以每次打印不一样的计算结果。" };
          }
          return { pass: false, message: "打印的行数够了，但内容不太对，检查一下是不是从5x1=5打印到5x9=45。" };
        },
      },
    ],
  },
  {
    id: 8,
    title: "第8关：while 循环",
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
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
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
      },
    ],
  },
  {
    id: 9,
    title: "第9关：列表 list",
    why: `为什么不用3个单独的变量（比如fav1、fav2、fav3）？列表能把一堆相关的数据放在一起统一处理，尤其是数量不确定的时候（比如AI小游戏里统计出拳记录），列表比一堆散变量好用得多。`,
    variants: [
      {
        explain: `
          <p>列表可以在一个变量里装很多个东西，用方括号 <code>[]</code>：</p>
          <pre>fruits = ["苹果", "香蕉", "橙子"]
print(fruits[0])</pre>
          <p>注意：列表里的第一个东西下标是 <code>0</code>，不是1！</p>
          <p>做一个装有你3个最喜欢的东西的列表，然后用下标把它们都打印出来（一行一个）。</p>
        `,
        starter: `# 创建一个列表 favorites，装3个你喜欢的东西
# 用下标把列表里的每一项都打印出来，一行一个
`,
        hint: `列表用方括号[]，每一项用逗号分开，用下标取出每一项：favorites = ["篮球", "游戏", "音乐"] / print(favorites[0]) / print(favorites[1]) / print(favorites[2])`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "列表学会了，这是存一堆数据最常用的方式。" };
          return { pass: false, message: `目前只打印了${lines.length}行，列表里至少放3个东西，然后都打印出来。` };
        },
      },
      {
        explain: `
          <p>比起一个个写下标，for 循环可以直接遍历列表，依次拿到每一项：</p>
          <pre>fruits = ["苹果", "香蕉", "橙子"]
for f in fruits:
    print(f)</pre>
          <p>做一个装有你3个最想去的地方的列表，用 for 循环（不用下标）把它们都打印出来。</p>
        `,
        starter: `# 创建列表 dream_places，装3个你想去的地方
# 用 for 循环遍历打印，不要用下标 [0][1][2]
`,
        hint: `格式：dream_places = ["东京", "巴黎", "纽约"] 换行 for place in dream_places: 换行缩进 print(place)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bfor\b/.test(r.code) || r.code.includes("range(")) {
            return { pass: false, message: "这一关要用 for 循环直接遍历列表（for x in dream_places），不用下标或range()，检查一下写法。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "遍历学会了！for循环直接作用在列表上，不需要一个个写下标。" };
          return { pass: false, message: `目前只打印了${lines.length}行，列表里至少放3个地方，然后都打印出来。` };
        },
      },
      {
        explain: `
          <p><code>len()</code> 能算出列表有几项，配合 range()，可以用"下标"的方式遍历：</p>
          <pre>fruits = ["苹果", "香蕉"]
for i in range(len(fruits)):
    print(fruits[i])</pre>
          <p>做一个装有3个你喜欢的电影/动画名字的列表，用 <code>range(len(...))</code> + 下标的方式遍历打印。</p>
        `,
        starter: `# 创建列表 movies，装3个你喜欢的电影/动画名字
# 用 for i in range(len(movies)): 遍历，print(movies[i])
`,
        hint: `格式：movies = ["A", "B", "C"] 换行 for i in range(len(movies)): 换行缩进 print(movies[i])`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/range\(\s*len\(/.test(r.code)) {
            return { pass: false, message: "这一关要用 range(len(...)) 的写法遍历，检查一下代码里有没有用 len()。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "学会了！range(len(列表)) 能拿到所有合法下标，是另一种常见的遍历写法。" };
          return { pass: false, message: `目前只打印了${lines.length}行，列表里至少放3个东西，然后都打印出来。` };
        },
      },
      {
        explain: `
          <p>列表也可以从空的开始，用 <code>.append()</code> 逐个添加元素：</p>
          <pre>fruits = []
fruits.append("苹果")
fruits.append("香蕉")</pre>
          <p>创建一个空列表 hobbies，用 .append() 往里面添加3个你的爱好，然后遍历打印出来。</p>
        `,
        starter: `# 创建空列表 hobbies = []
# 用 .append() 添加3个你的爱好
# 遍历打印出来
`,
        hint: `格式：hobbies = [] 换行 hobbies.append("篮球") 换行 hobbies.append("画画") 换行 hobbies.append("音乐") 换行 for h in hobbies: 换行缩进 print(h)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const appendCount = (r.code.match(/\.append\(/g) || []).length;
          if (appendCount < 3) {
            return { pass: false, message: "这一关要用 .append() 往空列表里添加至少3个元素，检查一下 .append( 是不是只写了不到3次。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "学会了！列表可以从空的开始，用 .append() 一个个动态添加。" };
          return { pass: false, message: `目前只打印了${lines.length}行，添加进去的3个爱好都要打印出来。` };
        },
      },
      {
        explain: `
          <p>负数下标可以从"末尾"往前数：<code>-1</code> 就是最后一个元素，不用先算长度。</p>
          <pre>fruits = ["苹果", "香蕉", "橙子"]
print(fruits[-1])   # 橙子</pre>
          <p>创建一个装有3个东西的列表 favorites，用正常下标打印第1、第2项，
          再用 <code>[-1]</code> 打印最后一项。</p>
        `,
        starter: `# 创建列表 favorites，装3个你喜欢的东西
# print(favorites[0])
# print(favorites[1])
# 用负数下标 favorites[-1] 打印最后一项
`,
        hint: `格式：favorites = ["篮球", "游戏", "音乐"] 换行 print(favorites[0]) 换行 print(favorites[1]) 换行 print(favorites[-1])`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("[-1]")) {
            return { pass: false, message: "这一关要用 [-1] 打印列表最后一项，检查一下代码里有没有用负数下标。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "学会了！负数下标能直接从末尾取值，[-1]永远是最后一个元素。" };
          return { pass: false, message: `目前只打印了${lines.length}行，至少要打印3行。` };
        },
      },
      {
        explain: `
          <p>切片 <code>[start:end]</code> 能一次取出列表的一部分（不包含end这个位置）：</p>
          <pre>nums = [1, 2, 3, 4]
print(nums[0:2])   # [1, 2]</pre>
          <p>创建一个装有3个东西的列表 favorites，用切片 <code>[0:2]</code> 打印前两项，
          再单独打印第3项（下标2）。</p>
        `,
        starter: `# 创建列表 favorites，装3个你喜欢的东西
# 用切片 favorites[0:2] 打印前两项
# 再单独打印第三项 favorites[2]
`,
        hint: `格式：favorites = ["篮球", "游戏", "音乐"] 换行 print(favorites[0:2]) 换行 print(favorites[2])`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\[\s*\d*\s*:\s*\d*\s*\]/.test(r.code)) {
            return { pass: false, message: "这一关要用切片语法（比如 favorites[0:2]），检查一下代码里有没有用冒号做切片。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 2) return { pass: true, message: "切片学会了！[start:end] 能一次取出列表的一部分。" };
          return { pass: false, message: `目前只打印了${lines.length}行，至少要打印2行（切片结果+第三项）。` };
        },
      },
    ],
  },
  {
    id: 10,
    title: "第10关：字典 dict",
    why: `为什么不用列表 [小明, 13, 篮球]？列表只能靠位置（第0个、第1个）区分含义，容易搞混；字典用"名字"当索引（比如 me["age"]），一眼就知道取的是什么，代码更容易看懂。`,
    variants: [
      {
        explain: `
          <p>字典用"键值对"存数据，比列表更适合表示"一个东西的多个属性"：</p>
          <pre>person = {"name": "小明", "age": 13}
print(person["name"])</pre>
          <p>之前3_rps_ai.py里统计出拳次数用的就是字典，比如 <code>{"石头": 5, "剪刀": 3}</code>。</p>
          <p>做一个字典 me，包含 name、age、hobby 三个键，用方括号 <code>["键名"]</code> 分别打印这三个值。</p>
        `,
        starter: `# 创建字典 me，包含 name、age、hobby 三个键
# 分别打印 me["name"]、me["age"]、me["hobby"]
`,
        hint: `字典用花括号{}，键和值中间用冒号:，取值时用方括号["键名"]。格式：me = {"name": "小明", "age": 13, "hobby": "篮球"}`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("{") || !r.code.includes(":")) {
            return { pass: false, message: "代码里好像没有真的创建字典（花括号{}加冒号:），检查一下有没有写死输出。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "字典也学会了！你现在能存更复杂的数据了。" };
          return { pass: false, message: `目前只打印了${lines.length}行，字典里的 name、age、hobby 都要打印出来（3行）。` };
        },
      },
      {
        explain: `
          <p>用 <code>.get("键")</code> 也能取值，比 <code>[]</code> 更安全——键不存在时不会报错，只会返回 None（或者你指定的默认值）。</p>
          <pre>person = {"name": "小明"}
print(person.get("name"))
print(person.get("age", 0))   # age不存在，返回默认值0</pre>
          <p>做一个字典 pet，包含 name、type、age 三个键，用 <code>.get()</code> 方法（不用方括号）分别打印这三个值。</p>
        `,
        starter: `# 创建字典 pet，包含 name、type、age 三个键
# 用 .get() 方法分别打印 pet.get("name")、pet.get("type")、pet.get("age")
`,
        hint: `格式：pet = {"name": "旺财", "type": "狗", "age": 2} 换行 print(pet.get("name")) 换行 print(pet.get("type")) 换行 print(pet.get("age"))`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if ((r.code.match(/\.get\(/g) || []).length < 2) {
            return { pass: false, message: "这一关要用 .get() 方法取值，检查一下代码里有没有至少用两次 .get(。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "学会了！.get() 取值更安全，键不存在也不会直接报错。" };
          return { pass: false, message: `目前只打印了${lines.length}行，pet的三个值都要打印出来（3行）。` };
        },
      },
      {
        explain: `
          <p>for 循环可以直接遍历字典，拿到的是每一个"键"：</p>
          <pre>scores = {"数学": 90, "语文": 85}
for key in scores:
    print(scores[key])</pre>
          <p>做一个装有3个键的字典 pet（name、type、age），用 for 循环遍历它的键，通过键打印出每个值。</p>
        `,
        starter: `# 创建字典 pet，包含 name、type、age 三个键
# 用 for key in pet: 遍历，print(pet[key])
`,
        hint: `格式：pet = {"name": "旺财", "type": "狗", "age": 2} 换行 for key in pet: 换行缩进 print(pet[key])`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("{") || !r.code.includes(":")) {
            return { pass: false, message: "代码里好像没有真的创建字典，检查一下有没有用花括号+冒号。" };
          }
          if (!/for\s+\w+\s+in\s+\w+\s*:/.test(r.code)) {
            return { pass: false, message: "这一关要用 for 循环遍历字典的键，检查一下有没有写 for key in pet:。" };
          }
          if ((r.code.match(/print\(/g) || []).length > 2) {
            return { pass: false, message: "看起来像是手动写了好几个print，这一关应该只在循环体里写一次print，让循环帮你重复执行。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "遍历学会了！for循环遍历字典时，拿到的是每一个键，可以用键去取对应的值。" };
          return { pass: false, message: `目前只打印了${lines.length}行，字典里的3个值都要打印出来。` };
        },
      },
      {
        explain: `
          <p><code>.items()</code> 能同时拿到字典的键和值，很适合配合 for 循环使用：</p>
          <pre>scores = {"数学": 90, "语文": 85}
for subject, score in scores.items():
    print(f"{subject}: {score}")</pre>
          <p>做一个装有3个键的字典 pet（name、type、age），用 <code>.items()</code> 同时遍历键和值，
          用 f-string 打印成"键: 值"的格式（一行一个）。</p>
        `,
        starter: `# 创建字典 pet，包含 name、type、age 三个键
# 用 for key, value in pet.items(): 遍历
# 打印 f"{key}: {value}"
`,
        hint: `格式：pet = {"name": "旺财", "type": "狗", "age": 2} 换行 for key, value in pet.items(): 换行缩进 print(f"{key}: {value}")`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes(".items(")) {
            return { pass: false, message: "这一关要用 .items() 同时遍历键和值，检查一下代码里有没有用到。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: ".items() 学会了！它能一次性拿到键和值，不用再单独用键去查值。" };
          return { pass: false, message: `目前只打印了${lines.length}行，字典里的3对键值都要打印出来。` };
        },
      },
      {
        explain: `
          <p>字典创建之后，还能用 <code>dict["新键"] = 值</code> 动态添加新的键值对：</p>
          <pre>person = {"name": "小明"}
person["age"] = 13
print(person["age"])</pre>
          <p>先创建一个只有 name、type 两个键的字典 pet，再用动态添加的方式补上第三个键 age，
          最后把三个值都打印出来。</p>
        `,
        starter: `# 创建字典 pet，先只包含 name、type 两个键
# 用 pet["age"] = 一个数字，动态添加第三个键
# 打印 pet["name"]、pet["type"]、pet["age"]
`,
        hint: `格式：pet = {"name": "旺财", "type": "狗"} 换行 pet["age"] = 2 换行 print(pet["name"]) 换行 print(pet["type"]) 换行 print(pet["age"])`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\w+\[["'][\w]+["']\]\s*=(?!=)/.test(r.code)) {
            return { pass: false, message: "这一关要用 dict[\"新键\"] = 值 的写法动态添加键，检查一下代码里有没有这样写。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 3) return { pass: true, message: "学会了！字典创建之后还能随时用方括号赋值的方式添加新键。" };
          return { pass: false, message: `目前只打印了${lines.length}行，三个键的值都要打印出来。` };
        },
      },
      {
        explain: `
          <p>已经存在的键，也能用同样的方式重新赋值，覆盖掉旧的值：</p>
          <pre>pet = {"age": 1}
print(pet["age"])
pet["age"] = 2
print(pet["age"])</pre>
          <p>创建字典 pet（包含 name、type、age），先打印一次 age，
          再用 <code>pet["age"] = 新值</code> 修改它，然后再打印一次，两次的值要不一样。</p>
        `,
        starter: `# 创建字典 pet，包含 name、type、age
# print(pet["age"])
# 修改 pet["age"] 为一个新的数字
# print(pet["age"])
`,
        hint: `格式：pet = {"name": "旺财", "type": "狗", "age": 1} 换行 print(pet["age"]) 换行 pet["age"] = 2 换行 print(pet["age"])`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 2) {
            return { pass: false, message: "这一关要打印两次 age（修改前后各一次），检查一下是不是两次都打印了。" };
          }
          if (lines[0] === lines[lines.length - 1]) {
            return { pass: false, message: "两次打印的值一样，看起来 age 没有被真的修改，检查一下有没有写 pet[\"age\"] = 新值。" };
          }
          if (!/\w+\[["'][\w]+["']\]\s*=(?!=)/.test(r.code)) {
            return { pass: false, message: "检查一下有没有用 pet[\"age\"] = ... 的写法修改已有的键。" };
          }
          return { pass: true, message: "学会了！已有的键也能用方括号赋值的方式直接覆盖修改。" };
        },
      },
    ],
  },
  {
    id: 11,
    title: "第11关：函数 def",
    why: `为什么不直接多写几次print计算结果？函数的价值在于"逻辑只写一次，到处调用"——以后想改计算方式（比如加个税），只用改函数内部这一处，所有调用的地方都会跟着变。`,
    variants: [
      {
        explain: `
          <p>函数可以把一段常用的代码打包起来，取个名字，以后随时调用，不用重复写。</p>
          <pre>def greet(name):
    print(f"你好，{name}！")

greet("小明")</pre>
          <p>写一个函数 add(a, b)，打印出两个数字的和，然后调用它两次，传入不同的数字。</p>
        `,
        starter: `# 写一个函数 def add(a, b):，打印 a+b 的结果
# 调用两次 add()，传入不同的数字
`,
        hint: `格式：def add(a, b): 换行缩进 result = a + b 换行缩进 print(result)，然后另起一行调用 add(3, 5)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bdef\s+\w+\s*\(/.test(r.code)) {
            return { pass: false, message: "代码里好像没有用 def 定义函数，这一关的重点是把计算逻辑包进函数里，而不是直接打印结果。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 2) {
            return { pass: false, message: `目前只有${lines.length}行输出，函数至少要调用2次，每次都打印结果。` };
          }
          if (/\d/.test(r.stdout)) return { pass: true, message: "函数学会了！这是让代码不重复的关键工具。" };
          return { pass: false, message: "调用了函数，但输出里没看到数字，检查一下函数里有没有 print() 计算结果。" };
        },
      },
      {
        explain: `
          <p>函数的参数可以设置"默认值"，调用时不传这个参数，就会用默认值：</p>
          <pre>def greet(name="朋友"):
    print(f"你好，{name}")

greet()          # 你好，朋友
greet("小明")     # 你好，小明</pre>
          <p>写一个函数 greet(name="朋友")，调用一次不传参数（用默认值），再调用一次传入具体名字。</p>
        `,
        starter: `# 写一个函数 def greet(name="朋友"):，打印 f"你好，{name}"
# 调用一次不传参数，再调用一次传入具体名字
`,
        hint: `格式：def greet(name="朋友"): 换行缩进 print(f"你好，{name}") 换行 greet() 换行 greet("小明")`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/def\s+\w+\([^)]*=\s*["']/.test(r.code)) {
            return { pass: false, message: "这一关要给参数设置默认值（比如 def greet(name=\"朋友\"):），检查一下有没有在括号里写等号。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length < 2) {
            return { pass: false, message: `目前只有${lines.length}行输出，函数要调用两次——一次用默认值，一次传参数。` };
          }
          if (lines[0] === lines[1]) {
            return { pass: false, message: "两次调用的结果一样，检查一下第二次调用是不是真的传了不同的参数进去。" };
          }
          return { pass: true, message: "默认参数学会了！不传参数时会自动用默认值。" };
        },
      },
      {
        explain: `
          <p>函数内部可以包含 if 判断，根据传入的值做不同的事：</p>
          <pre>def check_age(age):
    if age >= 18:
        print("成年")
    else:
        print("未成年")</pre>
          <p>写一个函数 check_age(age)，内部用 if/else 判断：大于等于18打印"成年"，否则打印"未成年"。
          调用两次，一次传大于18的数字，一次传小于18的数字。</p>
        `,
        starter: `# 写一个函数 def check_age(age):，内部用 if/else 判断成年/未成年
# 调用两次，分别传大于18和小于18的数字
`,
        hint: `格式：def check_age(age): 换行缩进 if age >= 18: 换行缩进缩进 print("成年") 换行缩进 else: 换行缩进缩进 print("未成年") 换行 check_age(20) 换行 check_age(10)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bdef\s+\w+\s*\(/.test(r.code)) {
            return { pass: false, message: "代码里好像没有用 def 定义函数，检查一下写法。" };
          }
          if (!/\bif\b/.test(r.code)) {
            return { pass: false, message: "这一关函数内部要用 if 判断，检查一下有没有写。" };
          }
          // "未成年"本身就包含"成年"两个字，不能直接用 includes("成年") 判断——
          // 得排除掉"未成年"里那个"成年"，确认真的有一次独立打印了"成年"。
          const hasAdult = /(^|[^未])成年/.test(r.stdout);
          const hasMinor = r.stdout.includes("未成年");
          if (hasAdult && hasMinor) {
            return { pass: true, message: "学会了！函数内部完全可以包含if这样的判断逻辑。" };
          }
          return { pass: false, message: "还没看到'成年'和'未成年'都出现，检查一下两次调用传的数字是不是一大一小。" };
        },
      },
      {
        explain: `
          <p>函数可以用 <code>return</code> 把结果"返回"给调用它的地方，而不是直接在函数里打印：</p>
          <pre>def square(n):
    return n * n

result = square(4)
print(result * 2)   # 32</pre>
          <p>写一个函数 square(n)，用 return 返回 n 的平方（不要在函数里print）。
          调用 square(4)，把返回值存进变量，再乘以2并打印。</p>
        `,
        starter: `# 写一个函数 def square(n):，用 return 返回 n*n（不要在函数里print）
# result = square(4)
# print(result * 2)
`,
        hint: `格式：def square(n): 换行缩进 return n * n 换行 result = square(4) 换行 print(result * 2)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("return")) {
            return { pass: false, message: "这一关要用 return 返回结果，而不是在函数内部print，检查一下代码里有没有 return。" };
          }
          if (!r.code.includes("*")) {
            return { pass: false, message: "结果要用乘法算出来，检查一下代码里有没有用到 * 号。" };
          }
          if (r.stdout.includes("32")) {
            return { pass: true, message: "return 学会了！返回值可以在函数外面继续参与计算，这跟直接print不一样。" };
          }
          return { pass: false, message: "结果不对，square(4)是16，再乘以2应该是32，检查一下return的值对不对。" };
        },
      },
      {
        explain: `
          <p>函数内部也可以包含 for 循环，一次调用处理好几个值：</p>
          <pre>def print_multiples(n):
    for i in range(1, 4):
        print(n * i)

print_multiples(2)   # 2, 4, 6</pre>
          <p>写一个函数 print_multiples(n)，内部用 for 循环，打印 n 的1到5倍（5行）。
          调用 print_multiples(3)。</p>
        `,
        starter: `# 写一个函数 def print_multiples(n):，内部用 for 循环打印 n 的1到5倍
# 调用 print_multiples(3)
`,
        hint: `格式：def print_multiples(n): 换行缩进 for i in range(1, 6): 换行缩进缩进 print(n * i) 换行 print_multiples(3)`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\bdef\s+\w+\s*\(/.test(r.code) || !/\bfor\b/.test(r.code)) {
            return { pass: false, message: "这一关的函数内部要用 for 循环，检查一下代码里有没有同时用到 def 和 for。" };
          }
          const nums = r.stdout.trim().split(/\s+/).filter(Boolean);
          if (nums.length < 5) {
            return { pass: false, message: `目前只打印了${nums.length}行，print_multiples(3) 应该打印5行（3的1到5倍）。` };
          }
          if (nums[0] === "3" && nums[4] === "15") {
            return { pass: true, message: "学会了！函数内部可以包含循环，一次调用就能处理一整批数据。" };
          }
          return { pass: false, message: "结果不对，print_multiples(3) 应该打印3,6,9,12,15，检查一下循环逻辑。" };
        },
      },
      {
        explain: `
          <p>函数内部可以调用另一个函数——像搭积木一样组合起来：</p>
          <pre>def double(n):
    return n * 2

def quadruple(n):
    return double(double(n))   # 调用了两次double

print(quadruple(3))   # 12</pre>
          <p>写两个函数：double(n) 返回 n 的2倍；quadruple(n) 内部调用两次 double() 返回 n 的4倍。
          调用 quadruple(3) 并打印结果。</p>
        `,
        starter: `# 写函数 def double(n):，用 return 返回 n*2
# 写函数 def quadruple(n):，内部调用两次 double()，返回 n 的4倍
# print(quadruple(3))
`,
        hint: `格式：def double(n): 换行缩进 return n * 2 换行 def quadruple(n): 换行缩进 return double(double(n)) 换行 print(quadruple(3))`,
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if ((r.code.match(/\bdef\b/g) || []).length < 2) {
            return { pass: false, message: "这一关要写两个函数（double 和 quadruple），检查一下是不是只写了一个 def。" };
          }
          if (!r.code.includes("return")) {
            return { pass: false, message: "这一关要用 return 返回结果，检查一下两个函数里有没有都用到。" };
          }
          if (r.stdout.includes("12")) {
            return { pass: true, message: "学会了！函数可以调用另一个函数，像搭积木一样把小功能组合成大功能。" };
          }
          return { pass: false, message: "结果不对，quadruple(3) 应该是12（3的4倍），检查一下 quadruple 内部有没有调用两次 double。" };
        },
      },
    ],
  },
  {
    id: 12,
    title: "毕业关：做出你自己的猜数字游戏",
    why: `这一关和 ai-games 里"AI猜数字"刚好是反过来的关系：那边是AI用二分法猜你心里的数，这里是你自己写代码猜电脑心里的数。循环+判断的结构其实一模一样。`,
    variants: [
      {
        explain: `
          <p>把前面学的都用上：变量、input、if、循环——写一个"猜数字"小游戏。</p>
          <p>电脑心里想好一个数字 <code>secret = 7</code>，玩家不断猜，
          程序告诉他"太大了"或"太小了"，猜中后打印"猜对了！"并结束。</p>
          <p>思路提示：</p>
          <ol>
            <li>用 input() + int() 获取玩家第一次猜的数字</li>
            <li>用 while 循环：只要猜的数字不等于secret就一直问</li>
            <li>循环里用 if/else 判断猜大了还是猜小了</li>
            <li>猜对了，打印"猜对了！"</li>
          </ol>
          <p><strong>恭喜通关！</strong>侧栏点"🎮 AI小游戏"，去玩4个真正的AI小游戏——
          对照着代码，看看是不是能认出这一关学的变量、循环、if、input，那些"AI"其实都是你已经学会的东西拼出来的。</p>
        `,
        starter: `secret = 7
# 用 int(input(...)) 获取玩家猜的数字，存到 guess
# 用 while 循环：只要 guess != secret 就一直问
#   循环里：如果 guess > secret 打印"太大了"，否则打印"太小了"
#   然后重新问一次，更新 guess
# 循环结束后打印"猜对了！"
`,
        hint: `模拟输入框里每行写一个猜测数字，比如：5 / 8 / 7 ，让它们一步步逼近7。别忘了循环里要重新调用 input() 更新 guess，不然会死循环。`,
        needsInput: true,
        defaultInput: "5\n8\n7",
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !r.code.includes("input(")) {
            return { pass: false, message: "代码里要用到 while 循环和 input()，不断询问玩家，而不是直接打印'猜对了！'。" };
          }
          if (r.stdout.includes("猜对了")) {
            return { pass: true, message: "毕业啦！点侧栏的'🎮 AI小游戏'解锁真正的AI小游戏吧。" };
          }
          return { pass: false, message: "模拟输入里的数字最终要等于secret（7），并且要打印出'猜对了！'才算通关。" };
        },
      },
      {
        explain: `
          <p>在基础版猜数字上加一个功能：用计数器统计玩家一共猜了几次，猜中后连次数一起打印出来。</p>
          <p>电脑心里想好一个数字 <code>secret = 15</code>，每猜一次计数器加1，
          猜中后打印"猜对了！"和"你用了X次猜中！"。</p>
        `,
        starter: `secret = 15
count = 0
# 用 int(input(...)) 获取玩家猜的数字，存到 guess
# count += 1
# 用 while 循环：只要 guess != secret 就一直问（记得每次问完 count += 1）
#   循环里：如果 guess > secret 打印"太大了"，否则打印"太小了"
# 循环结束后打印"猜对了！"，再打印 f"你用了{count}次猜中！"
`,
        hint: `模拟输入框里写：10 / 20 / 15，一步步逼近15。别忘了每问一次就要把count加1（count += 1），循环内外都要加。`,
        needsInput: true,
        defaultInput: "10\n20\n15",
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !r.code.includes("input(")) {
            return { pass: false, message: "代码里要用到 while 循环和 input()，不断询问玩家。" };
          }
          if (!r.code.includes("+= 1") && !r.code.includes("+=1")) {
            return { pass: false, message: "这一关要用一个计数器统计猜测次数，检查一下有没有用 count += 1 这样的写法。" };
          }
          if (r.stdout.includes("猜对了") && r.stdout.includes("次猜中")) {
            return { pass: true, message: "毕业啦！加上计数器之后，游戏还能告诉玩家用了几次才猜中。点侧栏的'🎮 AI小游戏'解锁真正的AI小游戏吧。" };
          }
          return { pass: false, message: "要打印'猜对了！'和'你用了X次猜中！'两句话才算通关，检查一下有没有都写。" };
        },
      },
      {
        explain: `
          <p>限制最多只能猜3次，猜不中就算失败。</p>
          <p>电脑心里想好一个数字 <code>secret = 7</code>，最多让玩家猜3次：
          猜中了提前打印"猜对了！"并用break跳出；3次都没猜中，打印"太可惜了，没猜中"。</p>
        `,
        starter: `secret = 7
max_tries = 3
tries = 0
found = False
# 用 while 循环：只要 tries < max_tries 就继续
#   int(input(...)) 获取猜测，tries += 1
#   如果猜中：打印"猜对了！"，found = True，break
#   否则：打印"太大了"或"太小了"
# 循环结束后，如果 not found，打印"太可惜了，没猜中"
`,
        hint: `模拟输入框写：5 / 8 / 7，第3次正好猜中。别忘了猜中时要用 break 提前跳出循环，并且把 found 设成 True。`,
        needsInput: true,
        defaultInput: "5\n8\n7",
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("break")) {
            return { pass: false, message: "这一关猜中时要用 break 提前跳出循环，检查一下代码里有没有 break。" };
          }
          if (!r.code.includes("tries") && !r.code.includes("max_tries")) {
            return { pass: false, message: "这一关要限制最多猜的次数，检查一下有没有用一个变量记录已经猜了几次。" };
          }
          if (r.stdout.includes("猜对了")) {
            return { pass: true, message: "毕业啦！限制次数之后，游戏多了一点挑战性。点侧栏的'🎮 AI小游戏'解锁真正的AI小游戏吧。" };
          }
          return { pass: false, message: "按照默认输入应该在第3次就能猜中并打印'猜对了！'，检查一下逻辑。" };
        },
      },
      {
        explain: `
          <p>这次猜的不是数字，是一个词——用字符串比较代替数字大小比较。</p>
          <p>电脑心里想好一个动物 <code>secret = "大象"</code>，玩家不断猜（不用int()转换，直接比较文字），
          猜错了打印"再想想"，猜中了打印"猜对了！"。</p>
        `,
        starter: `secret = "大象"
# 用 input() 获取玩家猜的动物（不用int()，直接是文字）
# 用 while 循环：只要猜的和secret不一样就一直问
#   打印"再想想"
#   重新 input() 问一次
# 循环结束后打印"猜对了！"
`,
        hint: `模拟输入框写：狮子 / 老虎 / 大象。这一关猜的是文字，不需要用int()转换。`,
        needsInput: true,
        defaultInput: "狮子\n老虎\n大象",
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes("while") || !r.code.includes("input(")) {
            return { pass: false, message: "代码里要用到 while 循环和 input()，不断询问玩家。" };
          }
          if (/\bint\(/.test(r.code)) {
            return { pass: false, message: "这一关猜的是文字，不需要用 int() 转换成数字，检查一下是不是多此一举了。" };
          }
          if (r.stdout.includes("猜对了")) {
            return { pass: true, message: "毕业啦！同样的while+input结构，不仅能猜数字，也能猜文字。点侧栏的'🎮 AI小游戏'解锁真正的AI小游戏吧。" };
          }
          return { pass: false, message: "模拟输入里最终要猜出'大象'，并且打印'猜对了！'才算通关。" };
        },
      },
      {
        explain: `
          <p>加一个"范围检查"：如果玩家猜的数字超出1到100，额外提醒一下。</p>
          <p>电脑心里想好一个数字 <code>secret = 50</code>，如果猜的数字小于1或大于100，
          打印"超出范围了！"；否则正常判断"太大了"/"太小了"；猜中打印"猜对了！"。</p>
        `,
        starter: `secret = 50
# 用 int(input(...)) 获取猜测，存到 guess
# 用 while 循环：只要 guess != secret 就一直问
#   如果 guess < 1 or guess > 100：打印"超出范围了！"
#   elif guess > secret：打印"太大了"
#   否则：打印"太小了"
#   重新 input() 问一次
# 循环结束后打印"猜对了！"
`,
        hint: `模拟输入框写：150 / 30 / 70 / 50。第一次故意超出范围看看提示，后面几次正常逼近50。`,
        needsInput: true,
        defaultInput: "150\n30\n70\n50",
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\belif\b/.test(r.code)) {
            return { pass: false, message: "这一关要用 elif 处理'超出范围'和'太大/太小'两种不同的情况，检查一下有没有用elif。" };
          }
          if (!/\bor\b/.test(r.code)) {
            return { pass: false, message: "判断'超出范围'要用 or 合并两个条件（小于1 或 大于100），检查一下有没有用or。" };
          }
          if (r.stdout.includes("超出范围了") && r.stdout.includes("猜对了")) {
            return { pass: true, message: "毕业啦！加了范围检查之后，游戏能应对更多不合理的输入了。点侧栏的'🎮 AI小游戏'解锁真正的AI小游戏吧。" };
          }
          return { pass: false, message: "要先看到一次'超出范围了！'，最后打印'猜对了！'才算通关，检查一下逻辑和模拟输入。" };
        },
      },
      {
        explain: `
          <p>用列表记录玩家猜过的每一个数字，猜中后把历史记录一起打印出来。</p>
          <p>电脑心里想好一个数字 <code>secret = 7</code>，每猜一次就用 <code>.append()</code>
          记进列表 history，猜中后打印"猜对了！"和完整的历史记录。</p>
        `,
        starter: `secret = 7
history = []
# 用 int(input(...)) 获取猜测，存到 guess，用 history.append(guess) 记下来
# 用 while 循环：只要 guess != secret 就一直问
#   打印"太大了"或"太小了"
#   重新 input() 并 append 到 history
# 循环结束后打印"猜对了！"
# 打印 f"你一共猜了这些数字：{history}"
`,
        hint: `模拟输入框写：5 / 8 / 7。别忘了每次猜测（包括第一次和每次循环里）都要用 history.append(guess) 记下来。`,
        needsInput: true,
        defaultInput: "5\n8\n7",
        check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!r.code.includes(".append(")) {
            return { pass: false, message: "这一关要用 .append() 把每次猜测记进 history 列表，检查一下代码里有没有用到。" };
          }
          if (r.stdout.includes("猜对了") && r.stdout.includes("你一共猜了")) {
            return { pass: true, message: "毕业啦！用列表记录整个猜测过程，是很实用的调试/回顾技巧。点侧栏的'🎮 AI小游戏'解锁真正的AI小游戏吧。" };
          }
          return { pass: false, message: "要打印'猜对了！'和'你一共猜了这些数字：...'才算通关，检查一下有没有都写。" };
        },
      },
    ],
  },
];
