// 入口水平测试的题库：每题标了一个 targetLevel —— 在本次抽到的10题里，
// 如果这题答错了，就把它的 targetLevel 计入候选；最终推荐"候选里最靠前的关卡"作为起点。
// 全部答对 -> 建议直接去 assessment.html 做进阶题目。
// 题库有40+题，每次测试从里面随机抽10题，题目和选项顺序也会打乱（在 quiz-app.js 里处理）。

const QUIZ = [
  // ---- print（对应 course 第1关）----
  {
    q: "下面哪一行代码，能在屏幕上显示出文字 \"你好\"？",
    options: ["print(\"你好\")", "show(\"你好\")", "text(\"你好\")", "echo(\"你好\")"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "哪个函数可以把内容显示在屏幕上？",
    options: ["print", "input", "def", "return"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "print(\"Hello\") 运行后，屏幕上会出现什么？",
    options: ["Hello", "\"Hello\"", "print(\"Hello\")", "什么都不会出现"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "print(1, 2, 3) 会输出什么？",
    options: ["1 2 3", "1,2,3", "[1, 2, 3]", "会报错"],
    answer: 0,
    targetLevel: 1,
  },

  // ---- 变量（对应第2关）----
  {
    q: "name = \"小明\" 这行代码是在做什么？",
    options: [
      "创建一个叫 name 的变量，把\"小明\"存进去",
      "判断 name 是不是等于\"小明\"",
      "打印\"小明\"这两个字",
      "删除一个叫 name 的变量",
    ],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "下面哪一个是合法的变量名？",
    options: ["my_age", "2age", "my age", "class-name"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "x = 5，然后执行 x = x + 1，此时 x 是多少？",
    options: ["6", "5", "x+1", "会报错"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "下面哪一行代码会报错？",
    options: ["y = ", "y = 5", "y = \"5\"", "y = \"五\""],
    answer: 0,
    targetLevel: 2,
  },

  // ---- 数字运算（对应第3关）----
  {
    q: "在 Python 里，10 // 3 的结果是？",
    options: ["3", "3.33", "1", "会报错"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "4 + 5 * 2 的结果是？",
    options: ["14", "18", "9", "20"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "10 / 4 的结果是？",
    options: ["2.5", "2", "3", "2.0"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "a = 6，b = 3，a - b 的结果是？",
    options: ["3", "9", "2", "18"],
    answer: 0,
    targetLevel: 3,
  },

  // ---- f-string（对应第4关）----
  {
    q: "name = \"小明\"，下面哪一行能打印出\"你好，小明\"？",
    options: [
      "print(f\"你好，{name}\")",
      "print(\"你好，name\")",
      "print(你好，name)",
      "print{\"你好，\" name}",
    ],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "下面哪个是正确的 f-string 写法？",
    options: ["f\"你好{name}\"", "\"f你好{name}\"", "f\"你好(name)\"", "print f\"你好{name}\""],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "name = \"小红\"，print(f\"{name}你好\") 会输出什么？",
    options: ["小红你好", "{name}你好", "name你好", "会报错"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "想在一句话里同时显示姓名和年龄两个变量的值，用什么方法最合适？",
    options: ["f-string", "分开print很多次再手动拼起来", "把变量名直接写进普通字符串里", "没办法做到"],
    answer: 0,
    targetLevel: 4,
  },

  // ---- input（对应第5关）----
  {
    q: "input() 函数的作用是？",
    options: ["让程序暂停，等待用户输入内容", "打印内容", "做数学运算", "创建一个函数"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "name = input(\"你叫什么？\")，用户输入的内容会被存到哪里？",
    options: ["变量 name 里", "直接打印出来，不会保存", "丢失掉", "存到一个列表里"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "input() 返回的数据类型是？",
    options: ["字符串（文字）", "整数", "小数", "列表"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "想把 input() 的结果当成数字来做加法，应该怎么做？",
    options: ["用 int() 转换一下", "直接加就行", "input() 自动就是数字", "做不到"],
    answer: 0,
    targetLevel: 5,
  },

  // ---- if 判断（对应第6关）----
  {
    q: "score = 55，下面这段代码会打印什么？\nif score >= 60:\n    print(\"及格\")\nelse:\n    print(\"不及格\")",
    options: ["不及格", "及格", "会报错", "什么都不打印"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "if 后面的条件写完，必须要有什么符号？",
    options: ["冒号 :", "分号 ;", "逗号 ,", "感叹号 !"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "下面哪个说法是对的？",
    options: ["else 不能单独出现，必须配合 if 使用", "else 可以单独使用", "if 不需要缩进", "if 只能用一次"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "x = 10\nif x > 5:\n    print(\"A\")\nelse:\n    print(\"B\")\n会输出什么？",
    options: ["A", "B", "AB", "会报错"],
    answer: 0,
    targetLevel: 6,
  },

  // ---- for 循环（对应第7关）----
  {
    q: "range(1, 4) 依次会产生哪些数字？",
    options: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3", "1, 4"],
    answer: 0,
    targetLevel: 7,
  },
  {
    q: "for i in range(3): print(i) 会打印几行？",
    options: ["3行", "4行", "2行", "0行"],
    answer: 0,
    targetLevel: 7,
  },
  {
    q: "for 循环主要用来做什么？",
    options: ["重复执行一段代码", "判断条件", "存储数据", "定义函数"],
    answer: 0,
    targetLevel: 7,
  },
  {
    q: "range(5) 里的第一个数字是？",
    options: ["0", "1", "5", "-1"],
    answer: 0,
    targetLevel: 7,
  },

  // ---- while 循环（对应第8关）----
  {
    q: "while 循环会在什么情况下停止？",
    options: ["条件变成 False", "永远不会停止", "执行一次后自动停止", "遇到 print 就停止"],
    answer: 0,
    targetLevel: 8,
  },
  {
    q: "下面哪段代码会变成\"死循环\"（永远停不下来）？",
    options: [
      "count = 1\nwhile count < 5:\n    print(count)",
      "count = 1\nwhile count < 5:\n    print(count)\n    count = count + 1",
      "for i in range(5):\n    print(i)",
      "print(\"hello\")",
    ],
    answer: 0,
    targetLevel: 8,
  },
  {
    q: "while 和 for 循环最主要的区别是？",
    options: [
      "while更适合\"不确定要循环几次，只看条件满不满足\"的情况",
      "while只能循环1次",
      "while不能配合if使用",
      "两者完全没有区别",
    ],
    answer: 0,
    targetLevel: 8,
  },
  {
    q: "count = 0\nwhile count < 3:\n    count = count + 1\n执行结束后 count 最终是多少？",
    options: ["3", "2", "0", "死循环，不会结束"],
    answer: 0,
    targetLevel: 8,
  },

  // ---- 列表（对应第9关）----
  {
    q: "fruits = [\"苹果\", \"香蕉\", \"橙子\"]，fruits[1] 是？",
    options: ["香蕉", "苹果", "橙子", "会报错"],
    answer: 0,
    targetLevel: 9,
  },
  {
    q: "列表用什么符号来定义？",
    options: ["方括号 []", "花括号 {}", "圆括号 ()", "尖括号 <>"],
    answer: 0,
    targetLevel: 9,
  },
  {
    q: "nums = [10, 20, 30]，nums[0] 是？",
    options: ["10", "20", "30", "会报错"],
    answer: 0,
    targetLevel: 9,
  },
  {
    q: "想把一个新元素加到列表末尾，用哪个方法？",
    options: [".append()", ".add()", ".insert(0)", ".push()"],
    answer: 0,
    targetLevel: 9,
  },

  // ---- 字典（对应第10关）----
  {
    q: "字典用什么符号来定义？",
    options: ["花括号 {}", "方括号 []", "圆括号 ()", "双引号 \"\""],
    answer: 0,
    targetLevel: 10,
  },
  {
    q: "person = {\"name\": \"小明\", \"age\": 13}，怎么取出年龄？",
    options: ["person[\"age\"]", "person[age]", "person.age", "person(age)"],
    answer: 0,
    targetLevel: 10,
  },
  {
    q: "字典和列表最大的不同是？",
    options: [
      "字典用\"键\"取值，列表用\"位置(下标)\"取值",
      "字典不能存文字",
      "列表不能存数字",
      "两者没有区别",
    ],
    answer: 0,
    targetLevel: 10,
  },
  {
    q: "{\"a\": 1, \"b\": 2} 这个字典里有几对键值？",
    options: ["2", "1", "3", "0"],
    answer: 0,
    targetLevel: 10,
  },

  // ---- 函数（对应第11关）----
  {
    q: "def 关键字在 Python 里是用来做什么的？",
    options: ["创建一个函数", "创建一个变量", "写一个判断条件", "写一个循环"],
    answer: 0,
    targetLevel: 11,
  },
  {
    q: "函数最大的好处是？",
    options: ["避免重复写同样的代码", "让代码运行变快", "让代码变得更长", "没有好处"],
    answer: 0,
    targetLevel: 11,
  },
  {
    q: "下面哪一个是正确定义函数的写法？",
    options: ["def greet(name):", "function greet(name):", "def greet(name)", "greet(name):"],
    answer: 0,
    targetLevel: 11,
  },
  {
    q: "调用一个已经定义好的函数 greet，应该怎么写？",
    options: ["greet(\"小明\")", "def greet(\"小明\")", "call greet(\"小明\")", "greet[\"小明\"]"],
    answer: 0,
    targetLevel: 11,
  },
];
