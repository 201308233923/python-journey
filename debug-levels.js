// 调试挑战：每一关都是一段"写好了但是有bug"的代码，任务是找到并修好它，而不是从零写。
// 这是跟"初级/进阶/高级"互补的能力——真实工作里，读别人的代码、找bug比从零写新代码更常见。
// starter 就是有问题的代码本身（不是空白骨架），改对了才能过关。

const LEVELS = [
  {
    id: 1,
    title: "第1关：温度转换器（缩进错误）",
    explain: `
      <p>这段代码想把摄氏度转换成华氏度，运行 <code>celsius_to_fahrenheit(0)</code> 应该得到 32.0，
      运行 <code>celsius_to_fahrenheit(100)</code> 应该得到 212.0。</p>
      <p>点"运行"试试，看看它出了什么问题，找到bug改好它。</p>
    `,
    starter: `def celsius_to_fahrenheit(c):
    f = c * 9/5 + 32
  return f

print(celsius_to_fahrenheit(0))
print(celsius_to_fahrenheit(100))`,
    hint: `报错信息里提到"缩进不匹配"——检查 return 这一行前面的空格数量，是不是和上面 f = ... 那一行对不齐。`,
    why: `为什么Python这么在意缩进？因为很多语言用花括号{}来表示"这段代码属于哪一块"，Python选择了用缩进本身来表达，代码更简洁好读，代价是缩进错一点就会出错——这是Python的设计取舍，不是bug。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (r.stdout.includes("32.0") && r.stdout.includes("212.0")) {
        return { pass: true, message: "修好了！这是最常见的bug之一：缩进不对齐。" };
      }
      return { pass: false, message: "还没看到正确的32.0和212.0，检查一下函数逻辑有没有被改动。" };
    },
  },
  {
    id: 2,
    title: "第2关：打印1到10（差一错误）",
    explain: `
      <p>这段代码想打印1到10（每个数字一行），点"运行"看看实际打印到了几。</p>
    `,
    starter: `for i in range(1, 10):
    print(i)`,
    hint: `range(1, 10) 里的10是"不包含"的，检查一下打印到了几，需要改成几才能到10。这种"差一"的bug在编程里非常常见。`,
    why: `为什么range()的终点不包含本身？这是编程语言里一个常见的设计习惯（叫"左闭右开区间"），好处是range(0, n)正好给出n个数、配合列表长度用起来很顺手——刚接触时反直觉，习惯了会发现它其实更方便。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      const nums = r.stdout.trim().split(/\s+/).filter(Boolean);
      if (nums.length === 10 && nums[9] === "10") {
        return { pass: true, message: "修好了！这种'差一错误'（off-by-one）是最经典的编程bug类型。" };
      }
      return { pass: false, message: `目前打印到了${nums[nums.length - 1] || "无"}，应该要打印到10，检查一下 range() 的参数。` };
    },
  },
  {
    id: 3,
    title: "第3关：判断18岁（赋值和比较搞混了）",
    explain: `
      <p>这段代码想判断age是不是正好18岁，点"运行"看看发生了什么。</p>
    `,
    starter: `age = 18
if age = 18:
    print("正好18岁")
else:
    print("不是18岁")`,
    hint: `单个等号 = 是"赋值"（把值放进变量），判断"是否相等"要用两个等号 == 。`,
    why: `为什么Python不让 if age = 18 这样写（有些语言允许）？因为这是一个极容易手滑的错误，Python选择在这里直接报错，而不是"悄悄按你可能没想到的方式执行"，这样的错误更容易被发现，而不是留到后面变成难查的bug。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (r.stdout.includes("正好18岁")) {
        return { pass: true, message: "修好了！= 和 == 混淆是新手最常犯的错误之一，以后要多注意。" };
      }
      return { pass: false, message: "还没看到'正好18岁'，检查一下判断条件对不对。" };
    },
  },
  {
    id: 4,
    title: "第4关：拼接年龄（类型不匹配）",
    explain: `
      <p>这段代码想打印"小明今年13岁"，点"运行"看看出了什么问题。</p>
    `,
    starter: `name = "小明"
age = 13
print(name + "今年" + age + "岁")`,
    hint: `+ 拼接字符串时，两边必须都是文字（字符串）。age是数字，需要先转换成文字才能拼接。`,
    why: `为什么Python不自动把数字转成文字？因为"13" + "岁"和13+多少哪个是"加法"，如果自动转换，容易掩盖真正的bug（比如你以为在做数学运算，其实在做拼接）。Python选择让你明确写出 str(age)，代码意图更清楚。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (r.stdout.includes("小明今年13岁")) {
        return { pass: true, message: "修好了！数字不能直接和文字拼接，这是很常见的类型问题。" };
      }
      return { pass: false, message: "还没看到'小明今年13岁'，检查一下拼接的方式。" };
    },
  },
  {
    id: 5,
    title: "第5关：及格线判断（条件顺序错了）",
    explain: `
      <p>这段代码想判断分数等级：90分以上是"优秀"，60-89是"及格"，60以下是"不及格"。
      score是95分，点"运行"看看结果对不对。</p>
    `,
    starter: `score = 95
if score >= 60:
    print("及格")
elif score >= 90:
    print("优秀")
else:
    print("不及格")`,
    hint: `95分应该显示"优秀"，但如果第一个条件已经是"大于等于60"，95分会先被这一条拦下来，永远走不到下面的判断。检查一下几个条件的先后顺序。`,
    why: `为什么if/elif的顺序会影响结果？因为Python的if/elif是"从上往下，第一个满足的条件就执行，后面全部跳过"，不会继续往下检查。这跟很多人以为的"每个条件都会单独判断一次"不一样，是很容易踩的坑。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (r.stdout.includes("优秀")) {
        return { pass: true, message: "修好了！条件判断的顺序很重要，范围更小/更严格的条件要写在前面。" };
      }
      return { pass: false, message: "95分应该打印'优秀'，检查一下 if/elif 的顺序。" };
    },
  },
  {
    id: 6,
    title: "第6关：倒数（循环条件反了）",
    explain: `
      <p>这段代码想从5倒数到1，然后打印"倒数结束"。点"运行"看看数字有没有被打印出来。</p>
    `,
    starter: `count = 5
while count < 0:
    print(count)
    count -= 1
print("倒数结束")`,
    hint: `count 一开始是5（正数），检查一下 while 后面的条件——要让循环真的执行，条件该写成"大于"还是"小于"？`,
    why: `这个bug没有报错，只是"什么都没做"——这类bug往往比直接报错的bug更难发现，因为程序看起来"正常运行完了"。养成运行后检查结果是否符合预期的习惯，比只看"有没有报错"更重要。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      const lines = r.stdout.trim().split("\n").filter(Boolean);
      if (lines.length === 6 && lines[0] === "5" && lines[4] === "1") {
        return { pass: true, message: "修好了！while 的条件方向写反是很容易忽略的bug。" };
      }
      return { pass: false, message: "应该要打印5,4,3,2,1然后'倒数结束'，检查一下循环条件。" };
    },
  },
  {
    id: 7,
    title: "第7关：取最后一个水果（下标越界）",
    explain: `
      <p>这段代码想打印列表里的最后一个水果（橙子），点"运行"看看出了什么问题。</p>
    `,
    starter: `fruits = ["苹果", "香蕉", "橙子"]
print("最后一个水果是：" + fruits[3])`,
    hint: `这个列表只有3个元素，下标是0、1、2。想取"最后一个"，除了用正确的下标，也可以用一个更简便的写法：负数下标（比如-1代表最后一个）。`,
    why: `为什么下标从0开始，而不是像日常数数一样从1开始？这跟计算机内存的存储方式有关——下标本质上是"从起始位置数过去多少步"，第一个元素就在起始位置，走0步就到了。这是几乎所有编程语言的共同设计。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (r.stdout.includes("最后一个水果是：橙子")) {
        return { pass: true, message: "修好了！下标越界（IndexError）通常是数错了位置，或者忘了下标从0开始。" };
      }
      return { pass: false, message: "还没看到'最后一个水果是：橙子'，检查一下下标。" };
    },
  },
  {
    id: 8,
    title: "毕业关：统计词频（字典键不存在）",
    explain: `
      <p>这段代码想统计每个词出现的次数，点"运行"看看出了什么问题。</p>
    `,
    starter: `words = ["苹果", "香蕉", "苹果", "橙子"]
counts = {}
for w in words:
    counts[w] += 1
print(counts)`,
    hint: `counts[w] += 1 的意思是"取出counts[w]的值，加1，再存回去"——但第一次遇到某个词的时候，counts里还没有这个键，取值这一步就会失败。需要先给它一个初始值（比如用 .get() 方法设置默认值0）。`,
    why: `为什么字典不会自动给不存在的键一个默认值？因为如果访问不存在的键都"悄悄"返回某个默认值（比如0），拼写错误的键名就会被无声无息地放过，很难发现——报错反而是一种保护，逼你处理"这个键真的存在吗"这个问题。`,
    check: (r) => {
      if (r.err) return { pass: false, message: explainError(r.err) };
      if (r.stdout.includes("苹果") && r.stdout.includes("2") && r.stdout.includes("香蕉") && r.stdout.includes("橙子")) {
        return { pass: true, message: "毕业啦！KeyError（键不存在）是字典最常见的bug，遇到陌生代码报这个错，先检查是不是忘了给默认值。" };
      }
      return { pass: false, message: "结果应该包含苹果2次、香蕉1次、橙子1次，检查一下统计逻辑。" };
    },
  },
];
