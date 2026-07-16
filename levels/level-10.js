const LEVEL_10 = {
  id: 10,
  title: `第10关：字典 dict`,
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
      answer: `me = {"name": "小明", "age": 13, "hobby": "篮球"}
print(me["name"])
print(me["age"])
print(me["hobby"])`,
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
      answer: `pet = {"name": "旺财", "type": "狗", "age": 2}
print(pet.get("name"))
print(pet.get("type"))
print(pet.get("age"))`,
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
      answer: `pet = {"name": "旺财", "type": "狗", "age": 2}
for key in pet:
    print(pet[key])`,
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
      answer: `pet = {"name": "旺财", "type": "狗", "age": 2}
for key, value in pet.items():
    print(f"{key}: {value}")`,
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
      answer: `pet = {"name": "旺财", "type": "狗"}
pet["age"] = 2
print(pet["name"])
print(pet["type"])
print(pet["age"])`,
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
      answer: `pet = {"name": "旺财", "type": "狗", "age": 1}
print(pet["age"])
pet["age"] = 2
print(pet["age"])`,
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
    }
  ],
};
