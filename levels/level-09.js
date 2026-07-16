const LEVEL_9 = {
  id: 9,
  title: `第9关：列表 list`,
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
      answer: `favorites = ["篮球", "游戏", "音乐"]
print(favorites[0])
print(favorites[1])
print(favorites[2])`,
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
      answer: `dream_places = ["东京", "巴黎", "纽约"]
for place in dream_places:
    print(place)`,
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
          <p>这里的 <code>i</code> 不再只是"第几次循环"，而是被当成"下标"用——len(fruits)是2，
          所以 <code>i</code> 会依次是0和1，正好是fruits里每一项的下标，<code>fruits[i]</code> 就是
          "取出下标为i的那一项"（第一轮i=0，取到"苹果"；第二轮i=1，取到"香蕉"）。</p>
          <p>做一个装有3个你喜欢的电影/动画名字的列表，用 <code>range(len(...))</code> + 下标的方式遍历打印。</p>
        `,
      starter: `# 创建列表 movies，装3个你喜欢的电影/动画名字
# 用 for i in range(len(movies)): 遍历，print(movies[i])
`,
      hint: `格式：movies = ["A", "B", "C"] 换行 for i in range(len(movies)): 换行缩进 print(movies[i])`,
      answer: `movies = ["A", "B", "C"]
for i in range(len(movies)):
    print(movies[i])`,
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
      answer: `hobbies = []
hobbies.append("篮球")
hobbies.append("画画")
hobbies.append("音乐")
for h in hobbies:
    print(h)`,
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
      answer: `favorites = ["篮球", "游戏", "音乐"]
print(favorites[0])
print(favorites[1])
print(favorites[-1])`,
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
      answer: `favorites = ["篮球", "游戏", "音乐"]
print(favorites[0:2])
print(favorites[2])`,
      check: (r) => {
          if (r.err) return { pass: false, message: explainError(r.err) };
          if (!/\[\s*\d*\s*:\s*\d*\s*\]/.test(r.code)) {
            return { pass: false, message: "这一关要用切片语法（比如 favorites[0:2]），检查一下代码里有没有用冒号做切片。" };
          }
          const lines = r.stdout.trim().split("\n").filter(Boolean);
          if (lines.length >= 2) return { pass: true, message: "切片学会了！[start:end] 能一次取出列表的一部分。" };
          return { pass: false, message: `目前只打印了${lines.length}行，至少要打印2行（切片结果+第三项）。` };
        },
    }
  ],
};
