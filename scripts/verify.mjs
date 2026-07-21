#!/usr/bin/env node
// 零依赖的回归校验脚本：
// 1) 三档题库（quiz.js/quiz-intermediate.js/quiz-advanced.js）结构校验
//    （答案下标越界、选项重复、targetLevel越界）。
// 2) 四条赛道的关卡文件（levels/、assessment-levels.js/advanced-levels.js/
//    debug-levels.js）——每一关（或每个variant）的参考答案 answer，真的用
//    python3跑一遍（跟app.js里RUNNER_TEMPLATE同样的模拟逻辑），再喂给这一关
//    自己的 check()，确认参考答案真的能通过校验。防止以后改check()或改answer
//    的时候，两边不匹配了却没人发现。
// 3) assessment-levels.js里"去初级复习"链接用到的 reviewLevel 数字越界校验。
// 4) ai-games-levels.js（交互式，没有check()/answer）：至少校验每个游戏的
//    Python代码本身能正常编译（无语法错误）。
// 5) 所有HTML页面的 href/src 本地文件引用完整性校验（防止死链接）。
//
// 用法：node scripts/verify.mjs

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

let failures = 0;
let checks = 0;

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

function loadInSandbox(relPath, globalName) {
  const code = fs.readFileSync(path.join(ROOT, relPath), "utf8");
  // explainError 是 app.js 里定义的，levels文件的check()在 r.err 分支会调用它——
  // 单独加载关卡文件时不存在，给个占位实现，避免真出错的参考答案在这里直接
  // 因为 ReferenceError 崩溃，而不是被正常判定成"没通过check()"。
  const sandbox = { explainError: (err) => String(err) };
  vm.createContext(sandbox);
  // 文件里用的是 const/let 声明（QUIZ / LEVELS），这些不会挂到vm的全局对象上
  // （Node vm的已知行为：只有var/函数声明才会变成contextify对象的属性）。
  // 包一层立即执行函数，靠闭包拿到声明的值，作为整个脚本的返回值带出来。
  const wrapped = `(function(){\n${code}\nreturn typeof ${globalName} !== "undefined" ? ${globalName} : undefined;\n})()`;
  return vm.runInContext(wrapped, sandbox, { filename: relPath });
}

function validateQuiz(name, arr, maxLevel) {
  if (!Array.isArray(arr)) {
    fail(`${name}: 没有找到题库数组`);
    return;
  }
  arr.forEach((q, i) => {
    checks += 1;
    const where = `${name}#${i} "${(q.q || "").slice(0, 24)}"`;
    if (!q.q || typeof q.q !== "string") fail(`${where}: 缺少题目文本`);
    if (!Array.isArray(q.options) || q.options.length < 2) fail(`${where}: 选项数量不对`);
    if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= (q.options || []).length) {
      fail(`${where}: 答案下标越界 (answer=${q.answer}, options=${(q.options || []).length})`);
    }
    if (new Set(q.options || []).size !== (q.options || []).length) fail(`${where}: 选项有重复`);
    if (typeof q.targetLevel !== "number" || q.targetLevel < 1 || q.targetLevel > maxLevel) {
      fail(`${where}: targetLevel越界 (${q.targetLevel})`);
    }
  });
}

console.log("== 题库结构校验 ==");
validateQuiz("quiz.js", loadInSandbox("quiz.js", "QUIZ"), 12);
validateQuiz("quiz-intermediate.js", loadInSandbox("quiz-intermediate.js", "QUIZ_INTERMEDIATE"), 6);
validateQuiz("quiz-advanced.js", loadInSandbox("quiz-advanced.js", "QUIZ_ADVANCED"), 6);
console.log(`  ${checks} 道题检查完毕`);

function runPython(code, input) {
  const out = execFileSync("python3", [path.join(__dirname, "py_shim.py")], {
    input: JSON.stringify({ code, input: input || "" }),
    encoding: "utf8",
  });
  return JSON.parse(out); // [stdout, err]
}

// 初级(course)赛道的关卡拆成了 levels/ 目录下每关一个文件 + index.js 汇总
// （原来的单个 levels.js 2342行不好改），这里把目录下所有文件按顺序拼起来，
// 当成一个整体脚本去eval，跟浏览器里 <script> 标签依次加载共享全局作用域
// 是同一个效果。
function loadLevelsDirInSandbox(dirRelPath, globalName) {
  const dir = path.join(ROOT, dirRelPath);
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".js") && f !== "index.js")
    .sort();
  const combined = [...files.map((f) => fs.readFileSync(path.join(dir, f), "utf8")), fs.readFileSync(path.join(dir, "index.js"), "utf8")].join(
    "\n"
  );
  const sandbox = { explainError: (err) => String(err) };
  vm.createContext(sandbox);
  const wrapped = `(function(){\n${combined}\nreturn typeof ${globalName} !== "undefined" ? ${globalName} : undefined;\n})()`;
  return vm.runInContext(wrapped, sandbox, { filename: dirRelPath });
}

function verifyLevels(label, LEVELS) {
  const before = failures;
  if (!Array.isArray(LEVELS)) {
    fail(`${label}: 没有找到 LEVELS 数组`);
    return;
  }
  LEVELS.forEach((level) => {
    const hasVariants = Array.isArray(level.variants) && level.variants.length > 0;
    const variants = hasVariants ? level.variants : [level];
    variants.forEach((variant, vi) => {
      checks += 1;
      const where = `${label} 第${level.id}关${hasVariants ? ` 变体${vi}` : ""}`;
      if (!variant.answer) {
        fail(`${where}: 没有 answer 字段可校验`);
        return;
      }
      if (typeof variant.check !== "function") {
        fail(`${where}: 没有 check() 函数`);
        return;
      }
      const input = variant.needsInput ? variant.defaultInput || "" : "";
      let stdout;
      let err;
      try {
        [stdout, err] = runPython(variant.answer, input);
      } catch (e) {
        fail(`${where}: python shim 崩溃 -- ${e.message}`);
        return;
      }
      let verdict;
      try {
        verdict = variant.check({ stdout, err, code: variant.answer });
      } catch (e) {
        fail(`${where}: check() 抛出异常 -- ${e.message}`);
        return;
      }
      if (!verdict || verdict.pass !== true) {
        fail(`${where}: 参考答案没有通过 check() -- ${verdict && verdict.message}`);
      }
    });
  });
  console.log(`  ${label}: ${failures - before === 0 ? "全部通过" : `${failures - before} 处失败`}`);
}

console.log("\n== 关卡 参考答案<->check() 配对校验 ==");
verifyLevels("levels/ (初级)", loadLevelsDirInSandbox("levels", "LEVELS"));
const assessmentLevels = loadInSandbox("assessment-levels.js", "LEVELS");
verifyLevels("assessment-levels.js", assessmentLevels);
verifyLevels("advanced-levels.js", loadInSandbox("advanced-levels.js", "LEVELS"));
verifyLevels("debug-levels.js", loadInSandbox("debug-levels.js", "LEVELS"));

// ---------- reviewLevel 越界校验 ----------
// assessment-levels.js 答错时会给一个"去初级复习这个知识点"的链接
// （course.html?start=reviewLevel），这个数字是从check()函数体里直接
// return出来的，不是一个独立可以直接读的字段，只能从函数源码里用正则挖出来。
// 校验它落在初级12关的合法范围内——手滑打错一个数字，就会生成一个指向
// 不存在关卡的死链接，而且只有真的连错触发到那个分支才会被人发现。
const COURSE_LEVEL_COUNT = 12;

function verifyReviewLevels(label, LEVELS) {
  const before = failures;
  LEVELS.forEach((level) => {
    const variants = Array.isArray(level.variants) && level.variants.length ? level.variants : [level];
    variants.forEach((variant) => {
      if (typeof variant.check !== "function") return;
      const src = variant.check.toString();
      const matches = [...src.matchAll(/reviewLevel:\s*(\d+)/g)];
      matches.forEach((m) => {
        checks += 1;
        const n = parseInt(m[1], 10);
        if (n < 1 || n > COURSE_LEVEL_COUNT) {
          fail(`${label} 第${level.id}关: reviewLevel越界 (${n})，初级只有${COURSE_LEVEL_COUNT}关`);
        }
      });
    });
  });
  console.log(`  ${label}: ${failures - before === 0 ? "全部通过" : `${failures - before} 处失败`}`);
}

console.log("\n== reviewLevel 越界校验 ==");
verifyReviewLevels("assessment-levels.js", assessmentLevels);

// ---------- ai-games-levels.js：Python语法校验 ----------
// 这4个AI小游戏是交互式的（没有 answer/check()，靠真人一步步输入），
// 没法像其他赛道那样跑一遍确认"参考答案能通过校验"。退而求其次，至少
// 确认每个游戏的Python代码本身能正常编译（没有语法错误）——不实际执行
// （代码里有 input() 会卡住等输入），只用 compile() 检查语法。
function verifyAiGamesSyntax() {
  const before = failures;
  const LEVELS = loadInSandbox("ai-games-levels.js", "LEVELS");
  if (!Array.isArray(LEVELS)) {
    fail("ai-games-levels.js: 没有找到 LEVELS 数组");
    return;
  }
  LEVELS.forEach((level) => {
    checks += 1;
    if (!level.code || typeof level.code !== "string") {
      fail(`ai-games-levels.js 第${level.id}关: 没有 code 字段`);
      return;
    }
    try {
      execFileSync("python3", ["-c", "import sys; compile(sys.stdin.read(), '<code>', 'exec')"], {
        input: level.code,
        encoding: "utf8",
      });
    } catch (e) {
      fail(`ai-games-levels.js 第${level.id}关: Python语法错误 -- ${e.message}`);
    }
  });
  console.log(`  ai-games-levels.js: ${failures - before === 0 ? "全部通过" : `${failures - before} 处失败`}`);
}

console.log("\n== ai-games-levels.js Python语法校验 ==");
verifyAiGamesSyntax();

// ---------- AI小游戏"逐行解读"覆盖率校验 ----------
// walkthrough是{lines:[起,止], note}的列表，标注代码里哪些行范围配了解读框。
// 之前出过的问题：新增/改动代码后没同步补walkthrough，导致有些关卡后半段
// 一大段真代码完全没有解读框，看起来像"代码被删掉了一截"。这里校验：
// 1) 行号范围没越界、互不重叠；2) 代码里每一行非空白的代码都至少被一个
// walkthrough条目覆盖（纯空行不需要覆盖，允许拿来分隔）。
function verifyAiGamesWalkthrough() {
  const before = failures;
  const LEVELS = loadInSandbox("ai-games-levels.js", "LEVELS");
  if (!Array.isArray(LEVELS)) return;
  LEVELS.forEach((level) => {
    if (!Array.isArray(level.walkthrough) || level.walkthrough.length === 0) return;
    const lines = level.code.split("\n");
    const coveredBy = new Array(lines.length + 1).fill(-1);
    level.walkthrough.forEach((item, idx) => {
      checks += 1;
      const [start, end] = item.lines;
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > lines.length || start > end) {
        fail(`ai-games-levels.js 第${level.id}关 walkthrough[${idx}]: 行范围越界或非法 -- [${start}, ${end}]`);
        return;
      }
      for (let ln = start; ln <= end; ln++) {
        if (coveredBy[ln] !== -1) {
          fail(`ai-games-levels.js 第${level.id}关 walkthrough[${idx}]: 第${ln}行跟 walkthrough[${coveredBy[ln]}] 重叠`);
        }
        coveredBy[ln] = idx;
      }
    });
    for (let ln = 1; ln <= lines.length; ln++) {
      if (lines[ln - 1].trim() === "") continue;
      checks += 1;
      if (coveredBy[ln] === -1) {
        fail(`ai-games-levels.js 第${level.id}关: 第${ln}行代码没有配解读框 -- "${lines[ln - 1].trim()}"`);
      }
    }
  });
  console.log(`  ai-games-levels.js walkthrough覆盖率: ${failures - before === 0 ? "全部通过" : `${failures - before} 处失败`}`);
}

console.log("\n== AI小游戏逐行解读覆盖率校验 ==");
verifyAiGamesWalkthrough();

// ---------- HTML内部链接/脚本引用完整性校验 ----------
// 网站现在11个HTML页面互相跳转，<a href>和<script src>指向的本地文件
// 全靠人肉核对，很容易在改文件名/加新页面的时候悄悄产生死链接，没人
// 会发现（不像404页面那样一打开就能看到）。这里扫一遍所有HTML文件，
// 校验每一个"看起来是本地文件"的href/src真的存在。
// 跳过：外部链接(http/https)、锚点(#xxx)、mailto:、javascript:。
function verifyLinks() {
  const before = failures;
  const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
  const refRegex = /(?:href|src)="([^"]+)"/g;

  htmlFiles.forEach((htmlFile) => {
    const content = fs.readFileSync(path.join(ROOT, htmlFile), "utf8");
    [...content.matchAll(refRegex)].forEach((m) => {
      const ref = m[1];
      if (/^(https?:)?\/\//.test(ref) || ref.startsWith("#") || ref.startsWith("mailto:") || ref.startsWith("javascript:") || ref.startsWith("data:")) {
        return;
      }
      checks += 1;
      const cleanPath = ref.split("?")[0].split("#")[0];
      const target = path.join(ROOT, cleanPath);
      if (!fs.existsSync(target)) {
        fail(`${htmlFile}: 引用的文件不存在 -- "${ref}"`);
      }
    });
  });
  console.log(`  ${failures - before === 0 ? "全部通过" : `${failures - before} 处失败`}`);
}

console.log("\n== HTML内部链接/脚本引用完整性校验 ==");
verifyLinks();

console.log(`\n共 ${checks} 项检查，${failures} 项失败。`);
process.exit(failures > 0 ? 1 : 0);
