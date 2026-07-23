// 中级题库（对应"进阶"assessment.html的6个能力点）：给已经学完初级、正在做进阶题目的人用。
// 题目风格比初级题库更综合——经常要在脑子里跑一遍代码逻辑，而不是单纯背语法。
// targetLevel 对应 assessment-levels.js 里的关卡 id（1-6）。
// 目前主要用途：每日复习会按学习进度混入这个题库（进度到了assessment阶段才会抽到这里的题）。

const QUIZ_INTERMEDIATE = [
  // ---- 测试1相关：条件+循环+取余（FizzBuzz类型）----
  {
    q: "n = 9，n % 3 == 0 的结果是？",
    options: ["True", "False", "3", "0"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "下面哪个表达式能判断一个数能同时被3和5整除？",
    options: ["n % 3 == 0 and n % 5 == 0", "n % 3 == 0 or n % 5 == 0", "n % 15", "n / 3 == n / 5"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "for i in range(1, 16):，当写 FizzBuzz 逻辑时，为什么要先判断\"能同时被3和5整除\"这个条件，再判断只被3整除？",
    options: [
      "因为if/elif从上到下第一个满足就执行，先判断更严格的条件，否则会被前面的条件拦截",
      "顺序不影响结果",
      "Python要求条件必须按数字大小排序",
      "因为elif必须放在最后",
    ],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "15 % 3 和 15 % 5 分别是多少？",
    options: ["0 和 0", "5 和 3", "1 和 1", "0 和 3"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "下面这段代码，n=7 时会打印什么？\nif n % 3 == 0:\n    print(\"Fizz\")\nelif n % 5 == 0:\n    print(\"Buzz\")\nelse:\n    print(n)",
    options: ["7", "Fizz", "Buzz", "什么都不打印"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "写FizzBuzz时，如果把\"同时被3和5整除\"的判断放在了所有条件的最后面（而不是最前面），会出现什么问题？",
    options: [
      "15这种数会先被\"只被3整除\"的条件拦下来，永远打印成Fizz而不是FizzBuzz",
      "程序会报错",
      "没有任何影响，结果一样",
      "循环会少执行一次",
    ],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "100 % 6 的结果是？",
    options: ["4", "16", "16.67", "6"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "一个数 n，怎么判断它是奇数还是偶数？",
    options: ["n % 2 == 0 就是偶数，否则是奇数", "n // 2 == 0 就是偶数", "看n是不是正数", "没办法判断"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "for i in range(1, 21): 这段循环，i的最后一个值是？",
    options: ["20", "21", "19", "1"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "下面哪个说法正确？",
    options: [
      "% 运算符求的是除法的余数，不是商",
      "% 运算符求的是除法的商，不是余数",
      "% 和 // 是完全一样的运算符",
      "% 只能用在偶数上",
    ],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "n = 12，判断 n 是否能被4整除，应该怎么写？",
    options: ["n % 4 == 0", "n / 4 == 0", "n // 4 == True", "n * 4 == 0"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "循环里同时判断多个互斥条件（比如FizzBuzz的四种情况），用哪种结构最合适？",
    options: ["if / elif / elif / else 链式判断", "写四个独立的if，互不相关", "只用while循环", "不需要判断，直接打印"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "下面代码运行会打印几行？\nfor i in range(1, 6):\n    if i % 2 == 0:\n        print(i)",
    options: ["2行（2和4）", "3行", "5行", "6行"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "45 既能被3整除也能被5整除，用FizzBuzz逻辑判断，应该输出？",
    options: ["FizzBuzz", "Fizz", "Buzz", "45"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "n % 3 == 0 and n % 5 == 0 这个表达式，等价于下面哪个更简洁的写法？",
    options: ["n % 15 == 0", "n % 8 == 0", "n // 15 == 0", "没有等价写法"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "n = 20，n % 4 == 0 的结果是？",
    options: ["True", "False", "4", "5"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "想判断一个数能不能同时被2和3整除，条件应该怎么写？",
    options: ["n % 2 == 0 and n % 3 == 0", "n % 2 == 0 or n % 3 == 0", "n % 6", "n / 2 == n / 3"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "18 % 4 的结果是？",
    options: ["2", "4.5", "4", "0"],
    answer: 0,
    targetLevel: 1,
  },

  // ---- 测试2相关：sum/max/列表统计 ----
  {
    q: "nums = [4, 8, 15, 16, 23, 42]，sum(nums) 的结果是？",
    options: ["108", "42", "6", "23"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "max([4, 8, 15, 16, 23, 42]) 的结果是？",
    options: ["42", "23", "4", "108"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "不用 sum()，用循环自己计算列表总和，下面哪种写法正确？",
    options: [
      "total = 0\nfor n in nums:\n    total += n",
      "total = 0\nfor n in nums:\n    total = n",
      "total = nums\nfor n in nums:\n    total += 1",
      "total = sum\nfor n in nums:\n    total(n)",
    ],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "min([4, 8, 15, 16, 23, 42]) 的结果是？",
    options: ["4", "42", "8", "0"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "想知道一个列表的平均值，可以怎么算？",
    options: ["sum(nums) / len(nums)", "max(nums) / len(nums)", "sum(nums) * len(nums)", "len(nums) / sum(nums)"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "sum([]) （空列表求和）的结果是？",
    options: ["0", "None", "报错", "空列表"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "max() 函数除了列表，能不能直接对多个单独的数字使用，比如 max(3, 7, 5)？",
    options: ["可以，会返回7", "不可以，只能传列表", "会报错", "只能传两个数字"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "自己写循环找列表最大值，下面哪个思路正确？",
    options: [
      "先假设第一个元素是最大值，然后逐个比较，比它大就更新",
      "从最后一个元素开始往前找",
      "先排序，再取中间的值",
      "计算所有元素的和，最大的就是和",
    ],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "nums = [1, 2, 3]; nums2 = [4, 5]; sum(nums) + sum(nums2) 的结果是？",
    options: ["15", "9", "6", "报错，不能把两个sum相加"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "len(nums) 和 sum(nums) 分别求的是什么？",
    options: ["len求列表长度（元素个数），sum求所有元素总和", "两者是同一个意思", "len求总和，sum求长度", "两者都求平均值"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "nums = [-3, -1, -7]，max(nums) 的结果是？",
    options: ["-1", "-7", "-3", "0"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "想找列表里第二大的数，最简单的思路是？",
    options: ["排序后取倒数第二个", "用sum()除以2", "用max()减1", "没办法找到"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "sum(nums) 内部实际上是在做什么？",
    options: ["把列表里所有元素依次累加起来", "把列表元素相乘", "只取第一个元素", "计算列表长度"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "nums = [10, 20, 30, 40]，想打印\"总和是100，最大值是40\"，下面哪个写法对？",
    options: [
      "print(f\"总和是{sum(nums)}，最大值是{max(nums)}\")",
      "print(f\"总和是{max(nums)}，最大值是{sum(nums)}\")",
      "print(\"总和是sum(nums)，最大值是max(nums)\")",
      "print(sum + max)",
    ],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "如果列表里同时有正数和负数，比如 [5, -10, 3]，sum() 的结果是？",
    options: ["-2", "18", "8", "报错"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "自己写循环求和时，一个常见的bug是忘了做什么？",
    options: ["忘了在循环外先把 total 初始化为0", "忘了写for", "忘了加冒号", "忘了导入sum模块"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "nums = [2, 4, 6]，sum(nums) / len(nums)（平均数）的结果是？",
    options: ["4.0", "12", "3", "2"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "scores = [70, 85, 90]，max(scores) - min(scores) 的结果是？",
    options: ["20", "90", "70", "15"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "想知道一个列表里一共有多少个元素，用哪个函数？",
    options: ["len()", "sum()", "max()", "count()"],
    answer: 0,
    targetLevel: 2,
  },

  // ---- 测试3相关：字符串处理/.count() ----
  {
    q: "text = \"programming\"，text.count(\"m\") 的结果是？",
    options: ["2", "1", "3", "0"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: ".count() 方法在字符串上的作用是？",
    options: ["统计某个字符或子串出现的次数", "统计字符串总长度", "把字符串转成数字", "删除某个字符"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "\"hello\".count(\"l\") 的结果是？",
    options: ["2", "1", "5", "0"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "字符串是否可以像列表一样用 for 循环逐个字符遍历？",
    options: ["可以，字符串本质上是字符的序列", "不可以，字符串不能遍历", "只有数字字符串可以遍历", "需要先转成列表才能遍历"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "\"Programming\".count(\"m\") 和 \"Programming\".count(\"M\") 结果一样吗？",
    options: ["不一样，因为.count()区分大小写", "一样，.count()不区分大小写", "都会报错", "取决于Python版本"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "len(\"hello\") 的结果是？",
    options: ["5", "4", "6", "报错"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "不用 .count()，自己写循环统计字符出现次数，思路是？",
    options: [
      "遍历字符串每个字符，遇到目标字符就把计数器加1",
      "用sum()直接对字符串求和",
      "用len()减去目标字符",
      "字符串不能这样统计"
    ],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "\"apple\".count(\"p\") 的结果是？",
    options: ["2", "1", "3", "0"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "\"\".count(\"a\") （空字符串统计）的结果是？",
    options: ["0", "报错", "None", "1"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "text.count(\"is\") 里传入的是两个字符\"is\"，这在统计什么？",
    options: ["统计子串\"is\"整体出现的次数（不是分别统计i和s）", "统计i和s各自出现的次数之和", "报错，count只能传单个字符", "统计字符串长度是否等于2"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "字符串的哪些操作是从列表那里\"借用\"过来的设计思路？",
    options: ["遍历、切片、count这类操作，因为字符串本质是字符序列", "只有print可以用在字符串上", "字符串和列表完全不同，没有共通点", "只有数字类型有这些操作"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "\"banana\".count(\"a\") 的结果是？",
    options: ["3", "2", "1", "6"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "想统计一句话里某个词出现了几次（比如统计\"the\"在一段英文里出现几次），用什么方法比较合适？",
    options: [".count()", ".append()", "sum()", "input()"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "text = \"aabbcc\"，text.count(\"b\") 的结果是？",
    options: ["2", "1", "4", "0"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "自己写循环统计字符时，需要在循环外先做什么？",
    options: ["把计数器初始化为0", "先打印字符串", "先把字符串转成列表", "先调用.count()"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "\"mississippi\".count(\"s\") 的结果是？",
    options: ["4", "2", "3", "0"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "\"hello world\".count(\" \")（统计空格）的结果是？",
    options: ["1", "0", "2", "11"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "想知道一个字符串总共有多少个字符（包括空格），用什么函数？",
    options: ["len()", "count()", "sum()", "size()"],
    answer: 0,
    targetLevel: 3,
  },

  // ---- 测试4相关：函数+判断质数 ----
  {
    q: "质数的定义是？",
    options: ["只能被1和自己整除，且大于1的数", "所有奇数", "所有比10小的数", "只能被2整除的数"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "写 is_prime(n) 函数判断质数，最基本的思路是？",
    options: [
      "从2试到n-1，看有没有能整除n的数，一个都没有就是质数",
      "只要n是奇数就是质数",
      "看n是不是比10大",
      "看n的最后一位是不是1、3、7、9"
    ],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "is_prime(1) 应该返回什么？",
    options: ["False（质数的定义要求大于1）", "True", "None", "报错"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "is_prime(2) 应该返回什么？",
    options: ["True（2是最小的质数）", "False", "None", "报错"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "17 是质数吗？",
    options: ["是，17只能被1和17整除", "不是，17能被3整除", "不是，17是偶数", "不确定"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "15 是质数吗？",
    options: ["不是，15 = 3 × 5", "是，15是奇数", "不确定", "是，因为15不能被2整除"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "写函数时，为什么要先单独处理 n <= 1 的情况？",
    options: [
      "因为质数定义要求大于1，不特殊处理会导致1或负数被误判为质数",
      "因为Python不允许函数处理小于1的数",
      "这一步不是必须的，可以省略",
      "因为负数在Python里不能做取余运算"
    ],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "在循环里判断质数时，用什么运算符来检测\"能否整除\"？",
    options: ["% （取余，结果为0说明能整除）", "// （取整除）", "* （乘法）", "** （乘方）"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "函数内部用for循环判断质数，如果发现有一个数能整除n，应该怎么做？",
    options: ["提前返回False，不用再继续试下去了", "继续把剩下的数都试完", "把n改成质数", "报错"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "调用一个返回布尔值的函数，比如 print(is_prime(17))，屏幕上会显示什么？",
    options: ["True 或 False 这两个词之一", "17这个数字", "prime这个字符串", "什么都不显示"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "质数判断函数为什么理论上只需要试到根号n，而不是n-1？",
    options: [
      "如果n有一个大于根号n的因数，那必然还有一个小于根号n的因数与它配对，所以试到根号n就够了",
      "因为Python的性能限制",
      "因为根号n永远是整数",
      "这个说法是错的，必须试到n-1"
    ],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "def is_prime(n): 函数定义完，如果忘了写return，直接执行会怎样？",
    options: ["函数会返回None，而不是True/False", "自动返回True", "报错，函数必须有return", "自动返回False"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "9 是质数吗？",
    options: ["不是，9 = 3 × 3", "是，9是奇数", "是，9不能被2整除", "不确定"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "判断质数的函数里，循环变量一般从几开始试？",
    options: ["2（因为1和n自己不算\"其他因数\"）", "0", "1", "n本身"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "写一个函数判断质数并复用它，比 3 次单独写判断逻辑的好处是？",
    options: ["避免重复代码，逻辑只需要改一处", "运行速度更快", "占用内存更少", "没有任何好处"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "is_prime(1) 和 is_prime(4) 分别应该返回什么？",
    options: ["False 和 False", "True 和 True", "False 和 True", "True 和 False"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "23 是质数吗？",
    options: ["是，23只能被1和23整除", "不是，23能被3整除", "不是，23是奇数", "不确定"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "判断质数时，为什么要从2开始试，而不是从1开始？",
    options: ["因为所有数字都能被1整除，从1试没有意义", "因为Python不允许从1开始的循环", "因为1是最大的质数", "从1开始会导致死循环"],
    answer: 0,
    targetLevel: 4,
  },

  // ---- 测试5相关：字典词频统计 ----
  {
    q: "words = [\"苹果\", \"香蕉\", \"苹果\"]，用字典统计词频，counts[\"苹果\"] 最终应该是？",
    options: ["2", "1", "3", "0"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "counts.get(word, 0) + 1 这种写法的作用是？",
    options: [
      "取出word当前的计数（不存在就当0），然后加1",
      "把word的计数固定设为1",
      "删除word这个键",
      "报错，get不能这样用"
    ],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "统计词频时，为什么不能直接写 counts[word] += 1 而不做任何处理？",
    options: [
      "如果word第一次出现，counts里还没有这个键，会报KeyError",
      "这样写法完全没问题",
      "+= 运算符不能用在字典上",
      "字典的值不能是数字"
    ],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "words = [\"a\", \"b\", \"a\", \"a\", \"b\"]，统计后 counts[\"a\"] 应该是？",
    options: ["3", "2", "1", "5"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "词频统计的典型步骤是？",
    options: [
      "创建空字典 -> 遍历列表 -> 每个元素让对应的计数+1（不存在就先设为0）",
      "先给列表排序，再打印",
      "只用一次print就能统计",
      "用while循环手动数每个词多少次"
    ],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "统计好词频后，想找出现次数最多的词，可以怎么做？",
    options: ["max(counts, key=counts.get)", "sum(counts)", "counts[0]", "len(counts)"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "counts = {}，遍历words时用 for w in words: counts[w] = counts.get(w, 0) + 1，这行代码在处理什么情况？",
    options: [
      "无论w是不是第一次出现，都能正确累加",
      "只能处理第一次出现的情况",
      "会导致重复的词被覆盖成1",
      "只统计不重复的词有多少个"
    ],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "词频统计在现实里可以用来做什么？",
    options: ["文本分析、搜索引擎、推荐系统等，统计一个词/元素出现频率的场景", "只能用来数水果", "不能用在实际项目里", "只能统计英文单词"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "words = [\"x\"]，counts = {}; counts[words[0]] = counts.get(words[0], 0) + 1，counts 最终是？",
    options: ["{\"x\": 1}", "{\"x\": 0}", "{}", "报错"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "如果想同时统计\"出现次数\"和\"第一次出现的位置\"，字典的值可以存什么？",
    options: ["可以存一个包含两个信息的列表或另一个字典", "字典的值只能是数字", "做不到", "只能开两个字典"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "counts[w] += 1 和 counts[w] = counts[w] + 1 有区别吗？",
    options: ["没有区别，是同一个意思的两种写法", "前者更快，结果不同", "后者会报错", "只有数字类型能用+="],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "统计词频后打印 for word, count in counts.items():，这行代码在做什么？",
    options: ["同时取出字典里每一对键和值", "只取出键", "只取出值", "报错，字典没有items方法"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "words = [\"猫\", \"狗\", \"猫\", \"猫\", \"狗\"]，哪个词出现次数最多？",
    options: ["猫（3次）", "狗（2次）", "两者一样多", "无法判断"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "为什么字典比列表更适合做词频统计？",
    options: ["字典能直接用\"词\"当键快速定位对应的计数，列表要遍历查找很慢", "列表不能存文字", "字典运行速度比列表慢", "两者没有区别"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "统计词频时把结果打印出来，下面哪种方式更清楚？",
    options: ["遍历字典，每个词和对应次数分行打印", "只打印整个字典对象一次", "只打印次数，不打印词", "两种方式没有区别"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "words = [\"a\",\"b\",\"c\",\"a\",\"a\",\"b\"]，统计后 counts[\"a\"] 最终应该是？",
    options: ["3", "2", "1", "6"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "统计好词频后，想知道一共出现过多少个不同的词，可以用？",
    options: ["len(counts)", "sum(counts)", "max(counts)", "counts[0]"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "counts = {}\ncounts[\"x\"] = counts.get(\"x\", 0) + 1\n执行一次后，counts 是？",
    options: ["{\"x\": 1}", "{\"x\": 0}", "{}", "报错"],
    answer: 0,
    targetLevel: 5,
  },

  // ---- 测试6相关：统计最多+预测（max配合key）----
  {
    q: "history = [\"石头\", \"石头\", \"剪刀\", \"石头\"]，出现次数最多的是？",
    options: ["石头（3次）", "剪刀（1次）", "两者一样多", "无法判断"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "max(counts, key=counts.get) 这行代码在做什么？",
    options: [
      "在字典的键里，找出对应值(次数)最大的那个键",
      "找出字典里最大的值",
      "对字典的键排序",
      "报错，字典不能用max"
    ],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "\"预测下一步\"这类AI功能，最基础的实现思路往往是？",
    options: ["统计历史数据里最常出现的模式，用它来预测", "完全随机猜测", "永远预测同一个固定答案", "不需要任何数据"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "counts = {\"石头\": 4, \"剪刀\": 1, \"布\": 1}，max(counts, key=counts.get) 的结果是？",
    options: ["石头", "剪刀", "布", "4"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "key=counts.get 里的 key 参数在 max() 里的作用是？",
    options: ["告诉max()按什么标准比较大小（这里是按对应的值比较），而不是直接比较键本身", "指定字典的某个具体键", "限制只看某一个键", "没有实际作用"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "如果不用 key 参数，直接对字典用 max(counts)，会比较什么？",
    options: ["直接比较键本身的大小（比如字符串按字典序）", "比较值的大小", "报错", "随机返回一个键"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "预测下一步出拳时，为什么用字典统计次数，而不是直接看最后一次出的拳？",
    options: [
      "看整体历史的统计规律比只看最后一次更能反映对手的习惯",
      "字典比列表运行更快",
      "最后一次出拳无法获取",
      "两种方式没有区别"
    ],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "统计好次数后，除了 max(counts, key=counts.get)，还能怎么找出现最多的键？",
    options: [
      "自己写循环，逐个比较每个键对应的值，记录当前最大的",
      "用sum()直接得到答案",
      "字典会自动排好序，取第一个就行",
      "没有别的办法"
    ],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "history = [\"布\", \"布\", \"石头\", \"布\", \"剪刀\"]，用统计次数的方法预测下一步最可能是？",
    options: ["布（出现了3次，最多）", "石头", "剪刀", "无法预测"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "\"AI会学习\"这种说法，在这个石头剪刀布的例子里具体指什么？",
    options: [
      "程序统计并记忆你过去的出拳习惯，用来调整之后的应对策略",
      "程序真的有自我意识",
      "程序会随机变化，和数据无关",
      "AI这个词只是营销用语，没有实际逻辑"
    ],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "如果历史记录里几个选择出现的次数完全相等，max(counts, key=counts.get) 会怎么处理？",
    options: ["返回其中一个（具体是哪个由遍历顺序决定），不会报错", "报错，不允许并列", "返回所有并列的键组成的列表", "返回None"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "这种\"数出现次数最多的模式来预测\"的方法，在数据分析里有一个常见名字，最接近的是？",
    options: ["统计出现频率最高的众数（mode）", "计算平均值（mean）", "计算中位数（median）", "计算标准差"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "history = [\"石头\"] * 10（也就是石头出现了10次），预测下一步会是？",
    options: ["石头", "剪刀", "布", "无法判断"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "在实现\"预测下一步\"之前，第一步应该做什么？",
    options: ["先把历史选择的出现次数统计出来（词频统计）", "直接调用max()不需要统计", "先删除历史记录", "先判断质数"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "counts.get(\"布\", 0) 在统计不存在的键\"布\"时会返回什么？",
    options: ["0（默认值）", "报错", "None", "布"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "counts = {\"a\": 2, \"b\": 5, \"c\": 1}，max(counts, key=counts.get) 的结果是？",
    options: ["b", "5", "a", "c"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "如果历史记录里只出现过一种选择，比如全都是\"布\"，用统计次数的方法预测下一步会是？",
    options: ["布", "石头", "剪刀", "无法预测"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "max(counts, key=counts.get) 返回的是字典的键还是值？",
    options: ["键（次数最多对应的那个键）", "值（最大的次数本身）", "键值对组成的元组", "报错"],
    answer: 0,
    targetLevel: 6,
  },
];
