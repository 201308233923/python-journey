const LEVEL_3 = {
  id: 3,
  title: `第3关：数字运算`,
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
      answer: `age = 13
years_later = 10
future_age = age + years_later
print(future_age)`,
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
      answer: `total_money = 20
spent_money = 7
remaining_money = total_money - spent_money
print(remaining_money)`,
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
      answer: `price = 3
quantity = 5
total = price * quantity
print(total)`,
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
      answer: `total_apples = 30
people = 5
each = total_apples // people
print(each)`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\d/.test(r.stdout)) {
            return { pass: false, message: "输出里没有看到数字，检查一下有没有 print() 出计算结果。" };
          }
          if (!/\b6\b/.test(r.stdout)) {
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
      answer: `a = 2
b = 3
c = 4
result = (a + b) * c
print(result)`,
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
      answer: `price = 25
quantity = 3
shipping = 10
clothes_total = price * quantity
total = clothes_total + shipping
print(total)`,
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
    }
  ],
};
