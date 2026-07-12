const TRACK_ID = typeof TRACK !== "undefined" ? TRACK : "course";
// v2：关卡从"直接给答案"改成"只给骨架"，旧存档的代码/进度不再适用，换个key名让它们自动失效。
const STORAGE_PROGRESS = `codecourse_${TRACK_ID}_v2_unlocked`;
const STORAGE_PLACEMENT = `codecourse_${TRACK_ID}_v2_placement`;
const codeKey = (id) => `codecourse_${TRACK_ID}_v2_code_${id}`;
const inputKey = (id) => `codecourse_${TRACK_ID}_v2_input_${id}`;
const failKey = (id) => `codecourse_${TRACK_ID}_v2_fails_${id}`;
// 这个key带v2_，属于"重置进度"会清空的那批——决定"这次攻略这一关，用的是哪个样子"。
const variantKey = (id) => `codecourse_${TRACK_ID}_v2_variant_${id}`;
// 这个key故意不带v2_，"重置进度"清不到它——记录"这一关的几个样子，已经做过哪些了"，
// 这样即使反复点重置，也不会立刻抽到刚做过的样子，除非6个样子都做过一轮了。
const variantSeenKey = (id) => `codecourse_${TRACK_ID}_variantseen_${id}`;

function getFailCount(id) {
  const raw = localStorage.getItem(failKey(id));
  return raw ? parseInt(raw, 10) : 0;
}

function bumpFailCount(id) {
  localStorage.setItem(failKey(id), String(getFailCount(id) + 1));
}

// 有的关卡准备了几个"样子"（同一个知识点，用真正不同的写法/方法完成）。
// 第一次碰到这一关、或者点了"重置进度"之后，会从"还没做过的样子"里随机选一个；
// 之后重新打开这一关，用的还是同一个样子，不会中途换。6个样子都做过一轮了，才会重新循环。
// 没有variants的关卡（比如目前的进阶/高级/调试挑战）直接把关卡本身当成唯一的"样子"用，行为不变。
function resolveVariant(level) {
  if (!level.variants || level.variants.length === 0) return level;

  const currentKey = variantKey(level.id);
  const cached = parseInt(localStorage.getItem(currentKey), 10);
  if (!Number.isNaN(cached) && cached >= 0 && cached < level.variants.length) {
    return level.variants[cached];
  }

  const seenKey = variantSeenKey(level.id);
  let seen = [];
  try {
    seen = JSON.parse(localStorage.getItem(seenKey) || "[]");
  } catch (e) {
    seen = [];
  }
  let candidates = level.variants.map((_, i) => i).filter((i) => !seen.includes(i));
  if (candidates.length === 0) {
    seen = []; // 全部样子都做过一轮了，重新开始新一轮
    candidates = level.variants.map((_, i) => i);
  }
  const idx = candidates[Math.floor(Math.random() * candidates.length)];
  localStorage.setItem(currentKey, String(idx));
  seen.push(idx);
  localStorage.setItem(seenKey, JSON.stringify(seen));
  return level.variants[idx];
}

let pyodide = null;
let currentLevelId = 1;
let currentVariant = null;

function explainError(err) {
  if (!err) return "";
  if (err.includes("IndentationError")) {
    return "缩进错了：Python靠每行前面的空格来判断代码属于哪一块。冒号(:)的下一行必须往右缩进（一般是4个空格），检查一下是不是漏了或者多了空格。";
  }
  if (err.includes("SyntaxError")) {
    if (err.includes("Maybe you meant '=='")) {
      return "语法错误：单个等号 = 是赋值（把值存进变量），判断'是否相等'要用两个等号 == 。";
    }
    return "语法错误：检查是不是少写了引号 \" \"、括号 ( )，或者忘了在 if / else / while / for / def 结尾加冒号 : 。";
  }
  if (err.includes("NameError")) {
    const match = err.match(/name '(.+?)' is not defined/);
    const name = match ? match[1] : "";
    return name
      ? `用到了变量'${name}'，但它还没被创建。检查一下是不是拼写和你创建时不一致，或者忘了先给它赋值。`
      : "用到了一个还没定义的名字，检查一下变量名有没有拼写错误，或者忘了先赋值。";
  }
  if (err.includes("TypeError")) {
    return "类型不匹配：可能是把文字和数字直接混在一起运算了。文字转数字用 int(...)，数字转文字用 str(...)。";
  }
  if (err.includes("ValueError")) {
    return "值不对：常见原因是 int() 想把不是数字的文字转换成数字，检查一下模拟输入框里是不是填了纯数字。";
  }
  if (err.includes("ZeroDivisionError")) {
    return "除数不能是0，检查一下除法算式里的分母。";
  }
  if (err.includes("IndexError")) {
    return "下标越界：访问了列表里不存在的位置。记得下标从0开始数，最后一个元素的下标是'长度-1'，也可以直接用 -1 表示最后一个。";
  }
  if (err.includes("KeyError")) {
    const match = err.match(/KeyError: '?(.+?)'?$/);
    const key = match ? match[1] : "";
    return key
      ? `字典里没有找到键'${key}'。第一次用某个键之前，要先给它一个初始值，或者用 .get(键, 默认值) 来安全取值。`
      : "字典里没有找到对应的键。第一次用某个键之前，要先给它一个初始值，或者用 .get(键, 默认值) 来安全取值。";
  }
  if (err.includes("EOFError")) {
    return "模拟输入不够用了：程序调用 input() 的次数比模拟输入框里的行数还多，检查一下逻辑，或者在模拟输入框里再加一行。";
  }
  return `程序运行出错了：${err}`;
}

// 通关时撒一把彩纸庆祝一下。尊重"减少动态效果"的系统设置，那种情况下就不放了。
function celebrate() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const colors = ["#4f6df5", "#1a7f4b", "#f5b942", "#e0554f", "#7b93ff", "#6fdf9d"];
  const particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.4,
    w: 5 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: -2.5 + Math.random() * 5,
    vy: 2.5 + Math.random() * 2.5,
    rotation: Math.random() * 360,
    vr: -8 + Math.random() * 16,
  }));

  const start = performance.now();
  const duration = 1600;

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rotation += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.w / 2, p.w, p.w * 0.6);
      ctx.restore();
    });
    if (elapsed < duration) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}

function getUnlockedCount() {
  const raw = localStorage.getItem(STORAGE_PROGRESS);
  return raw ? parseInt(raw, 10) : 1;
}

function setUnlockedCount(n) {
  localStorage.setItem(STORAGE_PROGRESS, String(n));
}

// 水平测试推荐直接跳到第N关时，前面几关不是"真的写代码通过的"，
// 只是测试认为你已经会了。记下这个分界线，侧栏用不同的图标区分"跳过"和"真正通关"。
function getPlacementStart() {
  const raw = localStorage.getItem(STORAGE_PLACEMENT);
  return raw ? parseInt(raw, 10) : null;
}

function setPlacementStart(n) {
  localStorage.setItem(STORAGE_PLACEMENT, String(n));
}

function renderSidebar() {
  const unlocked = getUnlockedCount();
  const placementStart = getPlacementStart();
  const list = document.getElementById("level-list");
  list.innerHTML = "";

  let passedCount = 0;

  LEVELS.forEach((level, idx) => {
    const isLocked = idx + 1 > unlocked;
    const isActive = level.id === currentLevelId;
    const item = document.createElement("div");
    item.className = "level-item" + (isLocked ? " locked" : "") + (isActive ? " active" : "");
    let badge = "▶";
    if (isLocked) {
      badge = "🔒";
    } else if (idx + 1 < unlocked) {
      const wasSkippedByTest = placementStart !== null && level.id < placementStart;
      badge = wasSkippedByTest ? "⏭️" : "✅";
      if (wasSkippedByTest) {
        item.title = "水平测试认为你已经掌握，不代表在这里真的写过代码";
      } else {
        passedCount++;
      }
    }
    item.innerHTML = `<span class="badge">${badge}</span><span>${level.title}</span>`;
    if (!isLocked) {
      item.addEventListener("click", () => selectLevel(level.id));
    }
    list.appendChild(item);
  });

  const summary = document.getElementById("progress-summary");
  if (summary) summary.textContent = `已完成 ${passedCount} / ${LEVELS.length} 关`;
}

function selectLevel(id) {
  currentLevelId = id;
  const level = LEVELS.find((l) => l.id === id);
  currentVariant = resolveVariant(level);

  document.getElementById("level-title").textContent = level.title;
  document.getElementById("level-explain").innerHTML = currentVariant.explain;

  const savedCode = localStorage.getItem(codeKey(id));
  document.getElementById("code-editor").value = savedCode !== null ? savedCode : currentVariant.starter;

  const inputRow = document.getElementById("input-row");
  const inputEditor = document.getElementById("input-editor");
  if (currentVariant.needsInput) {
    inputRow.classList.remove("hidden");
    const savedInput = localStorage.getItem(inputKey(id));
    inputEditor.value = savedInput !== null ? savedInput : (currentVariant.defaultInput || "");
  } else {
    inputRow.classList.add("hidden");
  }

  document.getElementById("output-box").textContent = "";
  document.getElementById("feedback-box").className = "feedback-box";
  document.getElementById("feedback-box").textContent = "";
  document.getElementById("hint-box").classList.add("hidden");
  document.getElementById("hint-box").textContent = currentVariant.hint || "";
  const hintNudgeBtn = document.getElementById("hint-nudge-btn");
  if (hintNudgeBtn) hintNudgeBtn.classList.add("hidden");
  const answerBox = document.getElementById("answer-box");
  const answerNudgeBtn = document.getElementById("answer-nudge-btn");
  if (answerBox) {
    answerBox.classList.add("hidden");
    answerBox.textContent = currentVariant.answer || "";
  }
  if (answerNudgeBtn) answerNudgeBtn.classList.add("hidden");
  const whyBtn = document.getElementById("why-btn");
  const whyBox = document.getElementById("why-box");
  if (whyBox) {
    whyBox.classList.add("hidden");
    whyBox.textContent = level.why || "";
  }
  if (whyBtn) whyBtn.classList.toggle("hidden", !level.why);
  document.getElementById("next-level-btn").classList.add("hidden");
  const summaryBox = document.getElementById("completion-summary");
  if (summaryBox) summaryBox.classList.add("hidden");

  renderSidebar();
}

// 登录了账号的话，每过一关就顺手把进度悄悄同步到云端，不用等用户自己点同步按钮。
// 没登录、或者supabase还没加载好的时候，这里什么都不做——本地localStorage的保存不受影响。
function autoSaveToCloud() {
  if (typeof supabaseClient === "undefined" || !supabaseClient) return;
  supabaseClient.auth
    .getUser()
    .then(({ data }) => {
      if (data && data.user) return pushProgressToCloud(data.user.id);
    })
    .catch(() => {});
}

// 通关一整条赛道之后，提醒一下"这些东西在真实世界里是干嘛用的"——
// 青少年对"学这个到底有什么用"特别敏感，光说"你完成了"不够有说服力。
const TRACK_REAL_WORLD_USE = {
  course: "从 print() 到猜数字小游戏——你写的 if 判断、循环、函数，就是每一个软件处理你每次点击背后的真实逻辑。",
  assessment: "FizzBuzz、词频统计、质数判断——这些看着简单的题，是技术面试的常见敲门砖，也是搜索引擎、推荐系统这些'高级'技术拆开后的真实样子。",
  advanced: "递归、排序、二分查找、类——这些是计算机科学的地基。你自己实现的二分法，跟数据库索引、搜索引擎背后用的是同一个思路。",
  debug: "找bug、修bug——这是真实程序员日常工作里占比最大的一部分，比从零写代码更常见。你刚练的，是工作中最实用的能力之一。",
};

function showCompletionSummary() {
  const summaryBox = document.getElementById("completion-summary");
  if (!summaryBox) return;
  // 只在第一次通关时记一次时间戳，之后重新打开这一关不会覆盖掉——
  // 证书页要用这个时间戳显示"完成于XX年XX月"。
  const completedAtKey = `codecourse_${TRACK_ID}_v2_completed_at`;
  if (!localStorage.getItem(completedAtKey)) {
    localStorage.setItem(completedAtKey, new Date().toISOString());
  }
  const rows = LEVELS.map((l) => {
    const fails = getFailCount(l.id);
    const status = fails === 0 ? "一次通过 ✓" : `错了 ${fails} 次`;
    return `<li><span class="completion-row-title">${l.title}</span><span class="completion-row-count">${status}</span></li>`;
  });
  const realWorldUse = TRACK_REAL_WORLD_USE[TRACK_ID];
  summaryBox.innerHTML = `
    <p class="completion-summary-title">🎉 全部关卡完成！每一关的情况：</p>
    <ul class="completion-summary-list">${rows.join("")}</ul>
    ${realWorldUse ? `<p class="completion-real-world">💡 ${realWorldUse}</p>` : ""}
    <a class="completion-cert-link" href="certificate.html">🎓 生成结业证书 →</a>
  `;
  summaryBox.classList.remove("hidden");
}

const RUNNER_TEMPLATE = `
import io, contextlib, json

_input_lines = _input_raw.split("\\n")
if _input_lines and _input_lines[-1] == "":
    _input_lines = _input_lines[:-1]
_input_pos = {"i": 0}

def _shimmed_input(prompt=""):
    if _input_pos["i"] >= len(_input_lines):
        raise EOFError("没有更多模拟输入了，请在'模拟输入'框里再加一行")
    val = _input_lines[_input_pos["i"]]
    _input_pos["i"] += 1
    print(str(prompt) + val)
    return val

_buf = io.StringIO()
_err = None
try:
    with contextlib.redirect_stdout(_buf):
        exec(compile(_user_code, "<code>", "exec"), {"input": _shimmed_input, "__name__": "__main__"})
except Exception as e:
    _err = f"{type(e).__name__}: {e}"

json.dumps([_buf.getvalue(), _err])
`;

async function runCurrentLevel() {
  const level = LEVELS.find((l) => l.id === currentLevelId);
  const variant = currentVariant || resolveVariant(level);
  const code = document.getElementById("code-editor").value;
  const inputRaw = variant.needsInput ? document.getElementById("input-editor").value : "";

  localStorage.setItem(codeKey(level.id), code);
  if (variant.needsInput) localStorage.setItem(inputKey(level.id), inputRaw);

  const runBtn = document.getElementById("run-btn");
  runBtn.disabled = true;
  runBtn.textContent = "运行中...";

  const outputBox = document.getElementById("output-box");
  const feedbackBox = document.getElementById("feedback-box");
  feedbackBox.className = "feedback-box";
  feedbackBox.textContent = "";

  try {
    pyodide.globals.set("_user_code", code);
    pyodide.globals.set("_input_raw", inputRaw);
    const resultJson = await pyodide.runPythonAsync(RUNNER_TEMPLATE);
    const [stdout, err] = JSON.parse(resultJson);

    outputBox.textContent = stdout + (err ? `\n--- 错误 ---\n${err}` : "");

    const verdict = variant.check({ stdout, err, code });
    feedbackBox.classList.add(verdict.pass ? "success" : "fail");
    if (!verdict.pass && verdict.reviewLevel) {
      const messageSpan = document.createElement("span");
      messageSpan.textContent = verdict.message + " ";
      const link = document.createElement("a");
      link.href = `course.html?start=${verdict.reviewLevel}`;
      link.className = "review-link";
      link.textContent = "去初级复习这个知识点 →";
      feedbackBox.innerHTML = "";
      feedbackBox.appendChild(messageSpan);
      feedbackBox.appendChild(link);
    } else {
      feedbackBox.textContent = verdict.message;
    }

    const nextLevelBtn = document.getElementById("next-level-btn");
    if (verdict.pass) {
      celebrate();
      const idx = LEVELS.findIndex((l) => l.id === level.id);
      const unlocked = getUnlockedCount();
      if (idx + 2 > unlocked) {
        setUnlockedCount(idx + 2);
        renderSidebar();
      }
      const next = LEVELS[idx + 1];
      if (next) {
        nextLevelBtn.classList.remove("hidden");
        nextLevelBtn.onclick = () => selectLevel(next.id);
      } else {
        nextLevelBtn.classList.add("hidden");
        showCompletionSummary();
      }
      autoSaveToCloud();
    } else {
      nextLevelBtn.classList.add("hidden");
      bumpFailCount(level.id);
      // 连续错3次以上、还没主动点开过提示的话，冒出一个按钮提醒ta可以看提示了——
      // 但不直接把提示内容摆出来，得自己点一下才展开，不是被动接收。
      const hintBox = document.getElementById("hint-box");
      const hintNudgeBtn = document.getElementById("hint-nudge-btn");
      if (
        getFailCount(level.id) >= 3 &&
        hintBox &&
        hintBox.classList.contains("hidden") &&
        variant.hint &&
        hintNudgeBtn &&
        hintNudgeBtn.classList.contains("hidden")
      ) {
        hintNudgeBtn.classList.remove("hidden");
      }
      // 同样3次以上才冒出来，跟提示按钮并列——这个是真的完整参考答案，
      // 不是提示，得自己主动点"查看参考答案"才会展开，不会被动塞过来。
      const answerBox = document.getElementById("answer-box");
      const answerNudgeBtn = document.getElementById("answer-nudge-btn");
      if (
        getFailCount(level.id) >= 3 &&
        answerBox &&
        answerBox.classList.contains("hidden") &&
        variant.answer &&
        answerNudgeBtn &&
        answerNudgeBtn.classList.contains("hidden")
      ) {
        answerNudgeBtn.classList.remove("hidden");
      }
    }
  } catch (e) {
    outputBox.textContent = `运行环境出错：${e}`;
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = "▶ 运行";
  }
}

function setupButtons() {
  document.getElementById("run-btn").addEventListener("click", runCurrentLevel);

  // Ctrl/Cmd+Enter 直接运行代码，不用每次都用鼠标点"运行"按钮——
  // 写代码时"改一点、跑一下"这个动作要重复很多次，快捷键能省不少来回。
  const runShortcutHandler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      const runBtn = document.getElementById("run-btn");
      if (!runBtn.disabled) runCurrentLevel();
    }
  };
  document.getElementById("code-editor").addEventListener("keydown", runShortcutHandler);
  const inputEditor = document.getElementById("input-editor");
  if (inputEditor) inputEditor.addEventListener("keydown", runShortcutHandler);

  document.getElementById("reset-btn").addEventListener("click", () => {
    const level = LEVELS.find((l) => l.id === currentLevelId);
    const variant = currentVariant || resolveVariant(level);
    document.getElementById("code-editor").value = variant.starter;
  });

  document.getElementById("hint-btn").addEventListener("click", () => {
    document.getElementById("hint-box").classList.toggle("hidden");
  });

  const hintNudgeBtn = document.getElementById("hint-nudge-btn");
  if (hintNudgeBtn) {
    hintNudgeBtn.addEventListener("click", () => {
      document.getElementById("hint-box").classList.remove("hidden");
      hintNudgeBtn.classList.add("hidden");
    });
  }

  const answerNudgeBtn = document.getElementById("answer-nudge-btn");
  if (answerNudgeBtn) {
    answerNudgeBtn.addEventListener("click", () => {
      const answerBox = document.getElementById("answer-box");
      answerBox.classList.remove("hidden");
      answerNudgeBtn.classList.add("hidden");
      // 需要模拟输入的关卡（比如猜数字），参考答案是配合 defaultInput 写的——
      // 只展示代码、不把模拟输入框也换成配套的输入，学生复制这份代码去跑，
      // 输入框里如果还留着自己之前乱试的数字，光是代码对也会跑不出预期结果，
      // 看起来就像"这份参考答案是错的"。
      if (currentVariant && currentVariant.needsInput) {
        const inputEditor = document.getElementById("input-editor");
        if (inputEditor) inputEditor.value = currentVariant.defaultInput || "";
        answerBox.textContent =
          (currentVariant.answer || "") +
          "\n\n# （这一关需要模拟输入，已经帮你把左边\"模拟输入\"框也换成配合这份答案的内容了）";
      }
    });
  }

  const whyBtn = document.getElementById("why-btn");
  if (whyBtn) {
    whyBtn.addEventListener("click", () => {
      document.getElementById("why-box").classList.toggle("hidden");
    });
  }

  const saveBtn = document.getElementById("save-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const level = LEVELS.find((l) => l.id === currentLevelId);
      const variant = currentVariant || resolveVariant(level);
      localStorage.setItem(codeKey(level.id), document.getElementById("code-editor").value);
      if (variant.needsInput) {
        localStorage.setItem(inputKey(level.id), document.getElementById("input-editor").value);
      }

      const originalText = saveBtn.textContent;
      saveBtn.disabled = true;

      if (typeof supabaseClient !== "undefined" && supabaseClient) {
        try {
          const { data } = await supabaseClient.auth.getUser();
          if (data && data.user) {
            await pushProgressToCloud(data.user.id);
            saveBtn.textContent = "✅ 已保存到账号";
          } else {
            saveBtn.textContent = "✅ 已保存到本机（没登录账号，换设备会丢）";
          }
        } catch (e) {
          saveBtn.textContent = "✅ 已保存到本机（同步到账号失败，检查网络）";
        }
      } else {
        saveBtn.textContent = "✅ 已保存到本机";
      }

      setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
      }, 1800);
    });
  }

  const resetProgressBtn = document.getElementById("reset-progress-btn");
  if (resetProgressBtn) {
    resetProgressBtn.addEventListener("click", () => {
      const ok = confirm("确定要清空所有关卡的进度和代码，从第1关重新开始吗？");
      if (!ok) return;
      const prefix = `codecourse_${TRACK_ID}_v2_`;
      Object.keys(localStorage)
        .filter((k) => k.startsWith(prefix))
        .forEach((k) => localStorage.removeItem(k));
      renderSidebar();
      selectLevel(LEVELS[0].id);
    });
  }
}

const PYODIDE_TIMEOUT_MS = 30000;

async function loadPyodideWithFallback() {
  const loadingText = document.getElementById("loading-text");
  const retryBtn = document.getElementById("loading-retry-btn");

  const showError = (message) => {
    loadingText.textContent = message;
    retryBtn.classList.remove("hidden");
    retryBtn.onclick = () => location.reload();
  };

  if (typeof loadPyodide === "undefined") {
    showError("Python 运行环境加载失败：网页无法连接到运行环境所在的地址，可能是网络问题或者被拦截了。检查一下网络连接，然后重试。");
    return null;
  }

  try {
    return await Promise.race([
      loadPyodide(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), PYODIDE_TIMEOUT_MS)),
    ]);
  } catch (e) {
    showError("加载失败或者超时了，可能是网络不稳定。点击下面的按钮重试一次。");
    return null;
  }
}

async function init() {
  setupButtons();
  renderSidebar();

  pyodide = await loadPyodideWithFallback();
  if (!pyodide) return;

  // 如果之前登录过账号（Supabase会话是持久化的），先把云端的真实进度拉下来盖掉本地缓存，
  // 这样已经登录过的设备/浏览器直接打开这个学习页面，看到的也是最新进度——不用非得先去
  // 首页或者重新点一次登录才会同步。这个promise是 progress-sync.js 定义的（脚本加载顺序上，
  // 它在 app.js 之后才加载，所以只能在这里、也就是 app.js 已经执行过 await 之后再引用它）。
  if (window.cloudProgressReady) await window.cloudProgressReady;

  document.getElementById("loading").classList.add("hidden");
  document.getElementById("level-view").classList.remove("hidden");

  const params = new URLSearchParams(location.search);
  // 从水平测试跳转过来的话，带着 ?start=N，直接解锁到第N关并停在那里（前面几关标记成"测试认为你已经会了"）。
  const startParam = parseInt(params.get("start"), 10);
  const startLevel = LEVELS.find((l) => l.id === startParam);
  // 从首页"继续上次的学习"按钮跳转过来的话，带着 ?resume=N，
  // 这些关卡是真的解锁过的，只是单纯跳过去，不改动解锁状态和跳关标记。
  // 这个链接正常只会是网站自己生成的（真解锁到哪就带哪个N），但URL是用户能
  // 直接改的，得再校验一次是不是真解锁过，不然手动把N改大就能跳过没写过的关卡，
  // 一旦通过还会把中间跳过的关卡也悄悄标记成"解锁"。
  const resumeParam = parseInt(params.get("resume"), 10);
  const resumeCandidate = LEVELS.find((l) => l.id === resumeParam);
  const resumeIdx = resumeCandidate ? LEVELS.findIndex((l) => l.id === resumeParam) : -1;
  const resumeLevel = resumeCandidate && resumeIdx + 1 <= getUnlockedCount() ? resumeCandidate : null;

  if (startLevel) {
    const idx = LEVELS.findIndex((l) => l.id === startParam);
    if (idx + 1 > getUnlockedCount()) setUnlockedCount(idx + 1);
    setPlacementStart(startParam);
    renderSidebar();
    selectLevel(startLevel.id);
  } else if (resumeLevel) {
    selectLevel(resumeLevel.id);
  } else {
    // 正常打开固定从第1关开始，不自动跳到"上次做到的那关"，
    // 已解锁的关卡仍然可以在左边侧栏直接点进去。
    selectLevel(LEVELS[0].id);
  }
}

init();
