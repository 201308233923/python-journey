const LEVEL_11 = {
  id: 11,
  title: `第11关：函数 def`,
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
      answer: `def add(a, b):
    result = a + b
    print(result)

add(3, 5)
add(10, 20)`,
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
      answer: `def greet(name="朋友"):
    print(f"你好，{name}")

greet()
greet("小明")`,
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
      answer: `def check_age(age):
    if age >= 18:
        print("成年")
    else:
        print("未成年")

check_age(20)
check_age(10)`,
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
      answer: `def square(n):
    return n * n

result = square(4)
print(result * 2)`,
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
          <p>这里 <code>i</code> 依次是1、2、3（range(1,4)不包含4），代表"第几倍"——
          <code>n * i</code> 就是"n的第i倍"：n=2时，i=1算出2，i=2算出4，i=3算出6，
          所以依次打印出2、4、6。</p>
          <p>写一个函数 print_multiples(n)，内部用 for 循环，打印 n 的1到5倍（5行）。
          调用 print_multiples(3)。</p>
        `,
      starter: `# 写一个函数 def print_multiples(n):，内部用 for 循环打印 n 的1到5倍
# 调用 print_multiples(3)
`,
      hint: `格式：def print_multiples(n): 换行缩进 for i in range(1, 6): 换行缩进缩进 print(n * i) 换行 print_multiples(3)`,
      answer: `def print_multiples(n):
    for i in range(1, 6):
        print(n * i)

print_multiples(3)`,
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
      answer: `def double(n):
    return n * 2

def quadruple(n):
    return double(double(n))

print(quadruple(3))`,
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
    }
  ],
};
