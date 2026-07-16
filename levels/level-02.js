const LEVEL_2 = {
  id: 2,
  title: `第2关：变量是什么`,
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
      answer: `my_name = "小明"
print(my_name)`,
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
      answer: `my_age = 13
print(my_age)`,
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
      answer: `my_name, my_age = "小明", 13
print(my_name)
print(my_age)`,
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
      answer: `score = 60
print(score)
score = 90
print(score)`,
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
      answer: `original = "苹果"
copy = original
print(copy)`,
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
      answer: `a = b = "你好"
print(a)
print(b)`,
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
    }
  ],
};
