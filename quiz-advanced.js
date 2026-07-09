// 高级题库（对应"高级"advanced.html的6个能力点）：给学完进阶、正在挑战高级关卡的人用。
// 涉及递归、排序算法、字符编码、类(class)、二分法、切片这些更硬核的概念。
// targetLevel 对应 advanced-levels.js 里的关卡 id（1-6）。
// 目前主要用途：每日复习会按学习进度混入这个题库（进度到了advanced阶段才会抽到这里的题）。

const QUIZ_ADVANCED = [
  // ---- 第1关相关：递归/阶乘 ----
  {
    q: "递归函数的定义是？",
    options: ["函数在内部调用自己", "函数调用另一个函数", "只能调用一次的函数", "没有参数的函数"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "写递归函数时，为什么一定要有\"终止条件\"？",
    options: [
      "没有终止条件会导致函数无限调用自己，最终报错（栈溢出）",
      "终止条件只是为了让代码更好看",
      "Python强制要求每个函数都写终止条件，不然无法运行",
      "终止条件是可选的，不写也没关系"
    ],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "factorial(4) 用递归计算，会依次调用哪些？",
    options: [
      "factorial(4) -> factorial(3) -> factorial(2) -> factorial(1)",
      "只调用factorial(4)一次",
      "factorial(1) -> factorial(2) -> factorial(3) -> factorial(4)",
      "同时调用所有的factorial"
    ],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "5的阶乘（5!）等于多少？",
    options: ["120", "20", "25", "15"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)\n这里的 if n <= 1: return 1 起什么作用？",
    options: ["终止条件，防止无限递归", "只是一个可有可无的判断", "用来处理负数输入", "用来打印结果"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "递归和循环相比，主要的思路差异是什么？",
    options: [
      "递归把大问题拆成结构相同的小问题，循环靠重复执行同一段代码",
      "递归运行速度总是比循环快",
      "递归不能用来计算阶乘",
      "两者没有任何区别"
    ],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "factorial(1) 作为终止条件应该返回什么？",
    options: ["1", "0", "None", "factorial(0)"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "如果 factorial 函数忘记写终止条件（比如永远执行 return n * factorial(n-1)），会发生什么？",
    options: ["无限递归下去，最终报错（超出最大递归深度）", "自动返回0", "程序会正常运行完毕", "只会计算一次就停止"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "递归函数每次调用自己时，传进去的参数一般会怎么变化？",
    options: ["朝着终止条件的方向变化（比如n不断减小）", "参数保持不变", "参数会随机变化", "参数会不断变大"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "3的阶乘（3!）等于多少？",
    options: ["6", "9", "3", "1"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "递归特别适合解决哪类问题？",
    options: ["可以拆分成\"和自己结构一样的小问题\"的问题，比如树、嵌套数据", "只能解决数学计算问题", "只能用来打印文字", "只适合处理字符串"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "factorial(0) 按照 n<=1 返回1 的规则，结果应该是？",
    options: ["1（0的阶乘定义为1）", "0", "报错", "None"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "递归函数里，除了终止条件那一支，另一支通常要做什么？",
    options: ["调用自己（传入变化后的参数），并利用返回值算出当前结果", "打印一条消息就结束", "什么都不用做", "直接返回固定值"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "把阶乘计算用递归实现，和用for循环实现相比，哪个更适合当作\"学习递归思想\"的入门例子？",
    options: ["递归实现，因为它结构简单又能体现\"自己调用自己\"的核心思想", "for循环，因为递归学不到东西", "两者都不适合", "只有类才能做阶乘计算"],
    answer: 0,
    targetLevel: 1,
  },
  {
    q: "6的阶乘（6!）等于多少？",
    options: ["720", "36", "120", "6"],
    answer: 0,
    targetLevel: 1,
  },

  // ---- 第2关相关：冒泡排序 ----
  {
    q: "冒泡排序的基本思路是？",
    options: ["相邻两个元素比较大小，大的往后交换，重复多轮直到排好序", "随机打乱元素顺序", "只比较第一个和最后一个元素", "把所有元素相加"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "冒泡排序为什么叫\"冒泡\"？",
    options: ["因为较大的元素会像气泡一样，一轮一轮\"冒\"到列表末尾", "因为它是最快的排序算法", "因为它只能给小数字排序", "这是任意起的名字，没有实际含义"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "nums[i], nums[i+1] = nums[i+1], nums[i] 这行代码在做什么？",
    options: ["交换列表里两个相邻元素的位置", "把两个元素相加", "删除其中一个元素", "报错，不能这样写"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "冒泡排序需要几层循环？",
    options: ["两层（外层控制轮数，内层两两比较）", "一层就够", "三层", "不需要循环"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "[5, 2, 8, 1, 9] 从小到大排序后是？",
    options: ["[1, 2, 5, 8, 9]", "[9, 8, 5, 2, 1]", "[5, 2, 8, 1, 9]", "[1, 9, 2, 8, 5]"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "冒泡排序内层循环里，判断 nums[i] > nums[i+1] 成立时应该做什么？",
    options: ["交换这两个元素的位置", "跳过这两个元素", "删除较大的元素", "结束整个排序"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "自己实现冒泡排序（而不是直接调用 sorted()）的主要目的是？",
    options: ["理解排序算法背后\"比较+交换\"的真实逻辑，而不只是用一个黑盒函数", "因为sorted()有bug不能用", "因为冒泡排序运行更快", "Python里根本没有sorted()函数"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "冒泡排序算法的效率和内置的 sorted() 相比如何？",
    options: ["冒泡排序更简单但效率更低，sorted()内部用了更高效的算法", "冒泡排序永远比sorted()快", "两者效率完全一样", "sorted()不能给列表排序"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "[3, 1, 2] 冒泡排序第一轮比较后（假设从左到右两两比较交换），大致会发生什么？",
    options: ["较大的数字会逐渐往右移动", "较小的数字会往右移动", "顺序完全不变", "列表长度会改变"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "冒泡排序里，交换两个变量的值，除了 a, b = b, a 这种写法，用一个临时变量怎么实现？",
    options: ["temp = a; a = b; b = temp", "a = b; b = a", "a, b = a, b", "swap(a, b)"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "对一个已经排好序的列表再跑一遍冒泡排序，会发生什么？",
    options: ["不会发生任何交换，列表保持不变", "会报错", "会把列表打乱", "只会交换第一个元素"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "[9, 7, 5, 3, 1] 排序后是？",
    options: ["[1, 3, 5, 7, 9]", "[9, 7, 5, 3, 1]", "[1, 9, 3, 7, 5]", "[9, 1, 7, 3, 5]"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "常见的排序算法除了冒泡排序，你可能还听过？",
    options: ["快速排序、选择排序、插入排序等", "只有冒泡排序这一种算法", "没有其他排序算法", "排序只能用sorted()实现"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "冒泡排序外层循环 for _ in range(len(nums)): 里，为什么用 _ 而不是一个正常变量名？",
    options: ["因为这一轮的循环变量本身不会被用到，用_表示\"这个变量不重要\"", "_是Python的关键字，必须这样写", "这样写会报错", "_代表下划线数字"],
    answer: 0,
    targetLevel: 2,
  },
  {
    q: "[1, 2, 3, 4, 5] 已经是升序排列，用冒泡排序处理后结果是？",
    options: ["[1, 2, 3, 4, 5]（不变）", "[5, 4, 3, 2, 1]", "报错", "变成空列表"],
    answer: 0,
    targetLevel: 2,
  },

  // ---- 第3关相关：凯撒密码/ord/chr ----
  {
    q: "ord(\"a\") 的结果是？",
    options: ["97", "65", "1", "\"a\""],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "chr(97) 的结果是？",
    options: ["\"a\"", "97", "\"A\"", "报错"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "ord() 和 chr() 是什么关系？",
    options: ["互为反函数：ord把字符转数字，chr把数字转回字符", "两者做的是同一件事", "chr把字符转数字，ord把数字转回字符（和实际相反）", "两者没有关系"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "chr(ord(\"a\") + 3) 的结果是？",
    options: ["\"d\"", "\"a\"", "100", "报错"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "凯撒密码加密的核心思路是？",
    options: ["把每个字母的编码值加上固定的偏移量，再转回字母", "把字母顺序倒过来", "把字母换成随机符号", "把字母重复两遍"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "\"hello\" 每个字母往后移3位（凯撒密码），加密结果是？",
    options: ["\"khoor\"", "\"ifmmp\"", "\"hello\"", "\"olleh\""],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "为什么计算机能对文字做\"位移\"这样的数学运算？",
    options: ["因为计算机内部把字符存储为对应的数字编码（比如ASCII码）", "因为文字本身就是数字", "这是不可能做到的，凯撒密码不能用代码实现", "只有中文字符才能这样处理"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "ord(\"b\") 比 ord(\"a\") 大多少？",
    options: ["1", "2", "0", "10"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "result = result + chr(ord(c) + shift) 这行代码在循环里反复执行的作用是？",
    options: ["把每个转换后的字母依次拼接成最终的加密字符串", "只保留最后一个字母", "删除result里的内容", "报错"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "小写字母 \"z\" 的编码是122，如果位移量导致超过\"z\"，比如把\"z\"位移3位，正常情况下应该怎么处理才不出错？",
    options: ["需要绕回\"a\"重新开始（取模运算），否则会变成不是字母的其他字符", "直接报错并停止", "自动变成大写字母", "不需要处理，超过也没关系"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "凯撒密码这种加密方法，在现代密码学里安全吗？",
    options: ["不安全，位移量只有26种可能，很容易被暴力破解", "非常安全，无法破解", "只有超级计算机才能破解", "位移量是无限的，绝对安全"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "for c in message: 这行代码在做什么？",
    options: ["遍历message字符串里的每一个字符", "只取第一个字符", "把message转成数字", "报错，字符串不能这样遍历"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "ord(\"A\")（大写A）和 ord(\"a\")（小写a）的结果一样吗？",
    options: ["不一样，大小写字母的编码值不同", "一样，Python不区分大小写字母的编码", "都会报错", "取决于操作系统"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "凯撒密码的\"解密\"（还原加密前的文字），思路应该是？",
    options: ["用相反方向的位移（减去shift，而不是加上）", "重新加密一次", "无法解密", "把结果反转字符串顺序"],
    answer: 0,
    targetLevel: 3,
  },
  {
    q: "为什么这道题特意说明\"字母都是小写，不用考虑超出z要绕回a的情况\"？",
    options: ["因为完整实现绕回逻辑需要额外的取模运算，题目先只练最基本的ord/chr转换", "因为大写字母不能用这种方法加密", "因为绕回逻辑不存在", "因为z永远不会被位移到"],
    answer: 0,
    targetLevel: 3,
  },

  // ---- 第4关相关：class ----
  {
    q: "class 关键字的作用是？",
    options: ["定义一个类，把数据和操作打包在一起", "定义一个函数", "定义一个变量", "定义一个循环"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "__init__ 方法什么时候会自动执行？",
    options: ["创建一个新对象（实例化）的时候", "每次调用类的其他方法时", "程序结束时", "永远不会自动执行"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "self 在类的方法里代表什么？",
    options: ["这个对象自己", "类本身", "一个固定的字符串", "Python的关键字，没有实际含义"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "class Dog:\n    def __init__(self, name):\n        self.name = name\nmy_dog = Dog(\"旺财\")，my_dog.name 是？",
    options: ["\"旺财\"", "\"Dog\"", "None", "报错"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "为什么要用类，而不是直接用几个独立的变量存数据？",
    options: [
      "类能把相关的数据和操作打包成一个整体，创建多个实例时互不干扰",
      "类运行速度比变量快",
      "类占用的内存更少",
      "Python要求所有数据都必须放进类里"
    ],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "account = BankAccount()，这行代码在做什么？",
    options: ["创建一个BankAccount类的新对象（实例）", "定义BankAccount类", "调用一个叫BankAccount的函数（不创建对象）", "报错"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "account1 = BankAccount(); account2 = BankAccount()，account1.balance 和 account2.balance 是同一个变量吗？",
    options: ["不是，两个对象的余额互相独立", "是的，两者共用一个余额", "会报错，不能创建两个对象", "只能创建一个BankAccount对象"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "类的方法（比如 deposit）定义时，第一个参数为什么必须是 self？",
    options: ["这样方法内部才能访问和修改这个对象自己的数据", "self是Python的保留关键字，不能省略", "self必须是第一个参数，否则程序无法运行（这是语法要求，但原因和访问对象数据有关）", "纯粹是命名习惯，没有实际作用"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "调用对象的方法，比如 account.deposit(100)，这里的100会被传给方法的哪个参数？",
    options: ["amount（self会自动传入，不用手动写）", "self", "两个参数都是100", "不会传给任何参数"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "self.balance = self.balance + amount 和 self.balance += amount 是一样的吗？",
    options: ["一样，是同一个意思的两种写法", "不一样，后者会报错", "前者更快", "self.balance不能用+="],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "\"面向对象编程\"这个说法里的\"对象\"，指的是？",
    options: ["用类创建出来的、包含自己数据和方法的实体", "计算机屏幕上显示的图形", "一个具体的数字", "只是一个营销术语，没有实际含义"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "class BankAccount:\n    def __init__(self):\n        self.balance = 0\n如果创建对象时不传任何参数，比如 account = BankAccount()，会发生什么？",
    options: ["正常创建，balance初始化为0", "报错，因为__init__需要参数", "balance会是None", "无法创建对象"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "类和函数最大的区别是？",
    options: ["类可以同时打包数据和多个相关的操作，函数通常只做一件独立的事", "类的运行速度比函数快", "函数不能有参数，类可以", "两者完全一样，没有区别"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "如果 deposit 方法忘记写 self 这个参数，比如写成 def deposit(amount):，调用 account.deposit(100) 会怎样？",
    options: ["报错，因为Python会自动把account作为第一个参数传进去，和amount对不上", "正常运行，没有影响", "amount会变成None", "会自动忽略self"],
    answer: 0,
    targetLevel: 4,
  },
  {
    q: "创建一个 BankAccount 对象，存入100，取出30，最终 balance 是多少？",
    options: ["70", "130", "100", "30"],
    answer: 0,
    targetLevel: 4,
  },

  // ---- 第5关相关：二分法 ----
  {
    q: "二分法猜数字的核心思路是？",
    options: ["每次猜中间值，根据大小关系排除一半的可能范围", "从1开始一个个往上试", "随机猜测", "每次都猜同一个数"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "(low + high) // 2 求的是什么？",
    options: ["low和high之间的中间值（向下取整）", "low和high的和", "low和high里较大的那个", "low和high的差"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "猜测的数字比secret大（guess > secret），应该怎么调整范围？",
    options: ["缩小上界：high = guess - 1", "缩小下界：low = guess + 1", "范围不用变", "重新从1开始猜"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "猜测的数字比secret小（guess < secret），应该怎么调整范围？",
    options: ["缩小下界：low = guess + 1", "缩小上界：high = guess - 1", "范围不用变", "重新从100开始猜"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "为什么二分法比\"从1开始一个个试\"要快很多？",
    options: ["每猜一次就能排除一半的可能性，而不是只排除一个数", "因为计算机运行速度更快", "因为二分法不需要循环", "其实不会更快"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "在1到100之间用二分法猜数字，最多需要猜多少次？",
    options: ["7次左右（log2(100)约等于6.6，向上取整为7）", "100次", "1次", "50次"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "while low <= high: 这个循环条件的作用是？",
    options: ["只要还有可能的范围没被排除完，就继续猜", "让循环执行固定10次", "检查low和high是否相等", "这是错误写法，应该用low < high"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "如果猜中了（guess == secret），应该做什么？",
    options: ["打印结果并结束函数（return）", "继续猜下一个数", "把high设为low", "报错"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "二分法这种\"每次排除一半\"的思路，在计算机科学里被称为什么复杂度？",
    options: ["对数复杂度（O(log n)）", "线性复杂度（O(n)）", "常数复杂度（O(1)）", "平方复杂度（O(n²）)"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "从1亿个数字里用二分法找一个数，大约最多需要猜多少次？",
    options: ["27次左右", "1亿次", "100次", "1次"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "二分法要求被猜测/查找的数据必须满足什么前提？",
    options: ["数据是有序的（或者范围是连续且已知边界的）", "数据必须是文字", "数据必须小于100", "没有任何前提条件"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "count += 1 在二分法猜数字函数里的作用是？",
    options: ["记录已经猜了多少次", "记录secret的值", "记录low的值", "没有实际作用"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "现实生活中，翻字典查一个字时\"先翻到大概中间，再往前或往后翻\"，这种查找方式类似于？",
    options: ["二分法", "冒泡排序", "递归阶乘", "词频统计"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "guess = (low + high) // 2 为什么用 // 而不是 /？",
    options: ["下标/位置需要是整数，// 保证结果是整数（向下取整）", "// 运算速度更快", "/ 会报错", "两者没有区别"],
    answer: 0,
    targetLevel: 5,
  },
  {
    q: "如果 low > high（范围已经不存在了）还没猜中，说明什么？",
    options: ["secret不在原本设定的范围内，或者逻辑有问题", "猜中了", "需要重新开始猜", "low和high设置错了顺序"],
    answer: 0,
    targetLevel: 5,
  },

  // ---- 第6关相关：切片+字典（只看最近N次）----
  {
    q: "history[-3:] 这种切片写法的意思是？",
    options: ["取列表最后3个元素", "取列表前3个元素", "删除最后3个元素", "报错，下标不能是负数"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "负数下标 -1 代表列表里的哪个元素？",
    options: ["最后一个元素", "第一个元素", "倒数第二个元素", "不存在，会报错"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "history = [\"石头\", \"石头\", \"剪刀\", \"布\", \"石头\", \"布\"]，history[-3:] 的结果是？",
    options: ["[\"布\", \"石头\", \"布\"]", "[\"石头\", \"石头\", \"剪刀\"]", "[\"布\"]", "整个列表"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "为什么\"只看最近N次\"有时候比\"看全部历史\"更能反映当前趋势？",
    options: [
      "最近的数据更能代表现在的情况，这在推荐系统、股票预测等场景很常见",
      "看全部历史运行速度更快",
      "全部历史数据总是不准确的",
      "两者没有区别"
    ],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "history[:3] 和 history[-3:] 的区别是？",
    options: ["前者取前3个元素，后者取最后3个元素", "两者完全一样", "前者取最后3个，后者取前3个（和实际相反）", "history[:3]会报错"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "对最近N次的记录做统计，用什么数据结构最合适？",
    options: ["字典（键是选择，值是出现次数）", "只能用一个数字变量", "字符串拼接", "不需要任何数据结构"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "nums = [1,2,3,4,5]，nums[-2:] 的结果是？",
    options: ["[4, 5]", "[1, 2]", "[5]", "[1, 2, 3, 4, 5]"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "\"时间衰减\"这个概念，在这里指的是什么？",
    options: ["越久远的数据参考价值越低，最近的数据更重要", "时间会让数据自动消失", "程序运行时间会越来越长", "和这道题没有关系"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "nums = [10, 20, 30, 40, 50]，nums[-1] 是？",
    options: ["50", "10", "40", "报错"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "如果 history 只有2个元素，history[-3:] 会怎样（不会报错吗）？",
    options: ["不会报错，会返回这2个元素（切片不会因为超出范围而报错）", "会报错，因为没有3个元素", "会返回空列表", "会自动补齐成3个"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "\"只看最近3次\"的AI预测和\"看全部历史\"的AI预测，哪个能更快适应你策略的变化？",
    options: ["只看最近3次的版本", "看全部历史的版本", "两者速度一样", "都不能适应变化"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "recent = history[-3:]，然后对recent做词频统计，这个组合技巧体现了什么设计思路？",
    options: ["先用切片缩小范围，再复用已经学过的统计套路，而不是重写一套新逻辑", "切片和统计不能一起使用", "这样写一定会报错", "这是没有意义的组合"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "nums = [1,2,3,4,5,6]，nums[-4:] 的结果是？",
    options: ["[3, 4, 5, 6]", "[1, 2, 3, 4]", "[4, 5, 6]", "报错"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "股票价格预测、推荐系统这些真实场景，为什么也常常\"更看重最近的数据\"？",
    options: ["因为用户的兴趣/市场情况会随时间变化，旧数据的参考价值会降低", "因为旧数据存储空间不够", "因为旧数据格式不兼容", "其实真实场景不会这样做"],
    answer: 0,
    targetLevel: 6,
  },
  {
    q: "history[-3:] 取出的是原列表的一部分，这个操作会修改原来的 history 列表吗？",
    options: ["不会，切片会返回一个新的列表，原列表不受影响", "会，原列表会被截断成3个元素", "会报错", "取决于Python版本"],
    answer: 0,
    targetLevel: 6,
  },
];
