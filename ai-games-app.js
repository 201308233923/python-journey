let pyodide = null;
let currentLevelId = null;
let session = null; // { code, seed, inputList } while a game is in progress
// runTurn() 跑代码是异步的，跑完之前按钮没被禁用——连点"开始游戏"或者按住回车不放
// 会在同一个pyodide全局命名空间上同时起两次 runPythonAsync，谁的结果后到就盖掉谁的，
// 界面显示的内容可能跟真实游戏状态对不上。这个标志位保证同一时间只有一次在跑。
let turnInFlight = false;

// v3：v2那次换key只是treat symptom——根本原因是"开始游戏"/"保存"以前不管
// 代码有没有真的被改过都会存档，导致刚玩过一次但没手动改代码的人，也会被
// 那份"没改过的官方代码快照"卡住，官方代码之后再更新也看不到。这次连同
// saveCodeIfEdited()一起修：只有真的编辑过才存档，配合这次换key把v2期间
// 已经被误存的快照也一并冲掉，以后关卡代码更新不用再手动换key了。
const codeKey = (id) => `aigames_v3_code_${id}`;

function explainError(err) {
  if (!err) return "";
  if (err.includes("IndentationError")) {
    return "缩进错了：Python靠每行前面的空格来判断代码属于哪一块。冒号(:)的下一行必须往右缩进（一般是4个空格），检查一下是不是漏了或者多了空格。";
  }
  if (err.includes("SyntaxError")) {
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
    return "值不对：常见原因是 int() 想把不是数字的文字转换成数字，检查一下输入的是不是纯数字。";
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
  return `程序运行出错了：${err}`;
}

function renderSidebar() {
  const list = document.getElementById("level-list");
  list.innerHTML = "";
  LEVELS.forEach((level) => {
    const isActive = level.id === currentLevelId;
    const item = document.createElement("div");
    item.className = "level-item" + (isActive ? " active" : "");
    item.innerHTML = `<span class="badge">${level.icon || "🎮"}</span><span>${level.title}</span>`;
    item.addEventListener("click", () => selectLevel(level.id));
    list.appendChild(item);
  });
}

function setCodeSectionOpen(open) {
  document.getElementById("code-section").classList.toggle("hidden", !open);
  document.getElementById("code-toggle-btn").textContent = open ? "▼ 隐藏代码" : "▶ 查看代码";
}

// 逐行解读：把整段代码原样显示出来（保留缩进/空行），walkthrough里标注了的
// 行范围用一个高亮框框起来，紧跟着放一个可以点的💡图标，点一下在下面弹出这段
// 代码在这个游戏里具体干了什么。展示的是关卡自带的"原版代码"该长什么样，不是
// 从code-editor实时抠出来的——这样即使玩家已经把代码改乱了，解读本身还是
// 对得上原版逻辑。💡图标不放进高亮框本身里面，是因为code-editor现在是可以
// 直接编辑的，如果高亮文字本身就是点击区域，点一下到底是"想把光标放在这个字
// 中间接着打字"还是"想看解读"就分不清楚了；图标是一个跟代码文字完全分开的
// 小控件，点它不会跟正常编辑代码打架。（这里故意不给图标加
// contenteditable="false"——同一个可编辑区域里塞十几个"不可编辑孤岛"，
// 部分浏览器渲染这么多个的时候表现不一致，有的会把中间的吞掉，去掉这个属性
// 换成普通可编辑span更稳，代价只是图标理论上可能被误删，删了点"重置代码"
// 就好了。）
function renderAnnotatedCode(level) {
  const lines = level.code.split("\n");
  const coveredBy = new Array(lines.length + 1).fill(-1); // 1-indexed
  (level.walkthrough || []).forEach((item, idx) => {
    const [start, end] = item.lines;
    for (let ln = start; ln <= end; ln++) coveredBy[ln] = idx;
  });

  // segments.join("\n")而不是每段后面手动拼"\n"——手动拼的话最后一段后面也会
  // 多一个"\n"，跟level.code本身（如果不以\n结尾）的换行数对不上，导致
  // getEditorText()读出来的"干净代码"永远比level.code多一行空行。这个多出来的
  // 空行本身对Python运行没影响，但会导致"存过一次档、其实没真的改字"的代码
  // 跟level.code逐字比较时被误判成"改过"，进而永远显示不带解读的纯文字版——
  // 这正是这次要修的bug。
  const segments = [];
  let i = 1;
  while (i <= lines.length) {
    const idx = coveredBy[i];
    if (idx === -1) {
      segments.push(escapeHtml(lines[i - 1]));
      i += 1;
      continue;
    }
    const start = i;
    while (i <= lines.length && coveredBy[i] === idx) i += 1;
    const chunk = lines.slice(start - 1, i - 1).join("\n");
    segments.push(`<span class="walkthrough-highlight">${escapeHtml(chunk)}</span><span class="walkthrough-icon" data-idx="${idx}" aria-label="讲解">?</span>`);
  }
  return segments.join("\n");
}

// 保存/运行代码之前，要把💡图标和还开着的解读气泡都去掉，只留纯代码文字——
// 不然图标的emoji字符、气泡里的解读文字会被当成代码的一部分存起来或者拿去跑。
// 用cloneNode操作副本，不影响用户正在看的实际DOM。
function getEditorText(container) {
  const clone = container.cloneNode(true);
  clone.querySelectorAll(".walkthrough-popup, .walkthrough-icon").forEach((el) => el.remove());
  return clone.textContent;
}

// 把关卡代码原样（如果有逐行解读，代码本身还带着高亮框+💡图标）加载进code-editor。
// 只有"真的动过、内容跟原版不一样"的存档才显示成纯文字——玩家自己改过的代码
// 没法保证行号还跟walkthrough对得上，带着解读展示会文不对题。但如果存档内容
// 跟原版逐字一样（比如以前测试时点过一次"保存"但其实没改字），那还是应该走
// 带解读的版本，不然这个存档就变成一个"沉默的开关"，一直悄悄把解读关掉，
// 玩家根本不知道为什么突然看不到解读了。
function loadCodeIntoEditor(level, codeEditor, savedCode) {
  const hasWalkthrough = Array.isArray(level.walkthrough) && level.walkthrough.length > 0;
  if (savedCode !== null && savedCode !== level.code) {
    codeEditor.textContent = savedCode;
  } else if (hasWalkthrough) {
    codeEditor.innerHTML = renderAnnotatedCode(level);
  } else {
    codeEditor.textContent = level.code;
  }
}

// 点💡图标，在它下面插入/收起一个小气泡显示解读文字——同一时间只开一个，
// 点开新的会先把上一个关掉。用事件委托挂在code-editor上，而不是给每个
// 图标单独绑监听器，这样每次重新渲染（切关卡/重置代码）都不用担心监听器
// 重复绑定或者绑到已经被替换掉的旧节点上。
function setupWalkthroughDelegation() {
  const container = document.getElementById("code-editor");
  if (!container) return;
  container.addEventListener("click", (e) => {
    const icon = e.target.closest ? e.target.closest(".walkthrough-icon") : null;
    if (!icon || !container.contains(icon)) return;
    e.preventDefault();

    const openPopup = container.querySelector(".walkthrough-popup");
    const reopeningSame = openPopup && openPopup.dataset.idx === icon.dataset.idx && openPopup.previousElementSibling === icon;
    if (openPopup) openPopup.remove();
    if (reopeningSame) return;

    const level = LEVELS.find((l) => l.id === currentLevelId);
    const item = level.walkthrough[parseInt(icon.dataset.idx, 10)];
    if (!item) return;
    const popup = document.createElement("div");
    popup.className = "walkthrough-popup";
    popup.setAttribute("contenteditable", "false");
    popup.dataset.idx = icon.dataset.idx;
    popup.textContent = item.note;
    icon.insertAdjacentElement ? icon.insertAdjacentElement("afterend", popup) : container.appendChild(popup);
  });
}

// contenteditable的div默认按回车会插入<div>/<br>这类结构，不同浏览器行为还
// 不统一，会让"读出来的代码文字"跟"看起来的换行"对不上。手动接管回车/粘贴，
// 保证代码内容自始至终都是纯文字+真正的\n字符（配合CSS的white-space:pre-wrap
// 显示换行），这样getEditorText()读到的永远是干净、可以直接拿去跑的代码。
function setupCodeEditorPlainTextBehavior(codeEditor) {
  codeEditor.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.isComposing) {
      e.preventDefault();
      document.execCommand("insertText", false, "\n");
    }
  });
  codeEditor.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text/plain");
    document.execCommand("insertText", false, text);
  });
}

function selectLevel(id) {
  currentLevelId = id;
  session = null;
  const level = LEVELS.find((l) => l.id === id);

  document.getElementById("level-title").textContent = level.title;
  document.getElementById("level-explain").innerHTML = level.explain;

  const codeEditor = document.getElementById("code-editor");
  const savedCode = localStorage.getItem(codeKey(id));
  loadCodeIntoEditor(level, codeEditor, savedCode);
  codeEditor.contentEditable = "true";

  setCodeSectionOpen(false);
  document.getElementById("hint-box").classList.add("hidden");
  document.getElementById("hint-box").textContent = level.hint || "";

  document.getElementById("terminal-box").textContent = "";
  document.getElementById("turn-input-row").classList.add("hidden");
  document.getElementById("turn-input").value = "";
  document.getElementById("start-game-btn").classList.remove("hidden");
  document.getElementById("restart-game-btn").classList.add("hidden");
  document.getElementById("clear-chat-btn").classList.add("hidden");
  document.getElementById("game-feedback").className = "feedback-box";
  document.getElementById("game-feedback").textContent = "";

  renderSidebar();
}

const RUNNER_TEMPLATE = `
import io, contextlib, json, random

random.seed(_seed)

_input_lines = json.loads(_input_json)
_input_pos = {"i": 0}

def _shimmed_input(prompt=""):
    print(str(prompt), end="")
    if _input_pos["i"] >= len(_input_lines):
        raise EOFError("__WAITING_FOR_INPUT__")
    val = _input_lines[_input_pos["i"]]
    _input_pos["i"] += 1
    print(val)
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

// Pyodide（几MB的Python运行环境）现在改成懒加载——点第一次"开始游戏"才真的去
// 下载，不是一打开AI小游戏页面就自动下载。#loading这个全屏遮罩原来是"打开页面"
// 时用的，现在复用成"点开始游戏但环境还没就绪"时用。
async function ensurePyodideReady() {
  if (pyodide) return true;
  document.getElementById("level-view").classList.add("hidden");
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("loading-text").textContent = "Python 运行环境加载中，第一次运行会花几秒钟...";
  pyodide = await loadPyodideWithFallback();
  if (!pyodide) return false;
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("level-view").classList.remove("hidden");
  return true;
}

async function runTurn() {
  if (!pyodide) {
    const ready = await ensurePyodideReady();
    if (!ready) return;
  }

  const terminalBox = document.getElementById("terminal-box");
  const inputRow = document.getElementById("turn-input-row");
  const startBtn = document.getElementById("start-game-btn");
  const restartBtn = document.getElementById("restart-game-btn");
  const feedback = document.getElementById("game-feedback");

  pyodide.globals.set("_user_code", session.code);
  pyodide.globals.set("_seed", session.seed);
  pyodide.globals.set("_input_json", JSON.stringify(session.inputList));

  let stdout = "";
  let err = null;
  try {
    const resultJson = await pyodide.runPythonAsync(RUNNER_TEMPLATE);
    [stdout, err] = JSON.parse(resultJson);
  } catch (e) {
    terminalBox.textContent = `运行环境出错：${e}`;
    return;
  }

  // 每一轮都是把完整代码从头重跑一遍（靠固定的随机种子保证前面的内容不会变），
  // session.clearedAt 记录"清空对话"时的字符位置，之后只显示这个位置之后的新内容。
  session.lastFullStdout = stdout;
  const visible = stdout.slice(session.clearedAt);

  if (err && err.includes("__WAITING_FOR_INPUT__")) {
    terminalBox.textContent = visible;
    inputRow.classList.remove("hidden");
    startBtn.classList.add("hidden");
    restartBtn.classList.add("hidden");
    document.getElementById("turn-input").focus();
  } else if (err) {
    terminalBox.textContent = `${visible}\n--- 错误 ---\n${err}`;
    inputRow.classList.add("hidden");
    startBtn.classList.add("hidden");
    restartBtn.classList.remove("hidden");
    document.getElementById("code-editor").contentEditable = "true";
    feedback.classList.add("fail");
    feedback.textContent = explainError(err);
  } else {
    // 有明确输赢的关卡（比如石头剪刀布）会在代码最后一行专门打印这个标记，
    // 报告这一局到底是赢是输——不是所有关卡都会打印（比如聊天机器人、
    // 创造游戏这种没有"赢/输"概念的关卡），没打印就按"正常完成"处理，
    // 照常放礼花；打印了"LOSE"就不放礼花，换一句不带庆祝感的提示。
    const outcomeMatch = visible.match(/\n?__GAME_OUTCOME__:(WIN|LOSE)\s*$/);
    const displayText = outcomeMatch ? visible.slice(0, outcomeMatch.index) : visible;
    const outcome = outcomeMatch ? outcomeMatch[1] : null;

    terminalBox.textContent = displayText;
    inputRow.classList.add("hidden");
    startBtn.classList.add("hidden");
    restartBtn.classList.remove("hidden");
    if (outcome === "LOSE") {
      feedback.classList.add("fail");
      feedback.textContent = "这局没赢——点'重新开始'再来一局，试试能不能翻盘。";
    } else {
      feedback.classList.add("success");
      feedback.textContent = "玩完了！点'重新开始'可以再来一局。";
      celebrate();
    }
    markLevelPlayed(currentLevelId);
  }
}

// 代码从头到尾干净跑完（不管这一局是赢是输，第2/6/7关这种没有"赢/输"概念的
// 关卡也算）就记一下"这关真的玩过了"——证书页用这份记录判断AI小游戏这条
// 赛道是不是"全部7关都玩过"，跟其他赛道靠"解锁到第几关"判断通关不是同一套
// 机制（AI小游戏7关从一开始就全部开放，没有先后解锁顺序）。
function markLevelPlayed(id) {
  const key = `aigames_v1_played_${id}`;
  if (localStorage.getItem(key) === "1") return;
  localStorage.setItem(key, "1");
  const allPlayed = LEVELS.every((level) => localStorage.getItem(`aigames_v1_played_${level.id}`) === "1");
  if (allPlayed && !localStorage.getItem("aigames_v1_completed_at")) {
    localStorage.setItem("aigames_v1_completed_at", new Date().toISOString());
  }
}

function runTurnGuarded() {
  turnInFlight = true;
  runTurn().finally(() => {
    turnInFlight = false;
  });
}

// 只有代码真的跟官方版本不一样才存档，一字不差就把之前可能存过的旧档清掉——
// 不然哪怕玩家完全没动代码，也会把"这次看到的官方代码"存死成"玩家自己的代码"，
// 以后官方代码再更新，没手动改过的人也会一直卡在存档那一份旧版本上，
// 每次关卡代码更新都得手动换一次codeKey才能冲掉，treat symptom不如治本。
function saveCodeIfEdited(id, code, level) {
  if (code === level.code) {
    localStorage.removeItem(codeKey(id));
  } else {
    localStorage.setItem(codeKey(id), code);
  }
}

function startGame() {
  if (turnInFlight) return;
  const codeEditor = document.getElementById("code-editor");
  const code = getEditorText(codeEditor);
  const level = LEVELS.find((l) => l.id === currentLevelId);
  saveCodeIfEdited(currentLevelId, code, level);
  codeEditor.contentEditable = "false";
  setCodeSectionOpen(false);

  session = {
    code,
    seed: Math.floor(Math.random() * 2 ** 31),
    inputList: [],
    clearedAt: 0,
    lastFullStdout: "",
  };
  document.getElementById("game-feedback").className = "feedback-box";
  document.getElementById("game-feedback").textContent = "";
  document.getElementById("clear-chat-btn").classList.remove("hidden");
  runTurnGuarded();
}

function clearChat() {
  if (!session) return;
  session.clearedAt = session.lastFullStdout.length;
  document.getElementById("terminal-box").textContent = "";
}

function submitTurn() {
  if (turnInFlight) return;
  const input = document.getElementById("turn-input");
  if (!session) return;
  session.inputList.push(input.value);
  input.value = "";
  runTurnGuarded();
}

function setupButtons() {
  document.getElementById("code-toggle-btn").addEventListener("click", () => {
    const open = document.getElementById("code-section").classList.contains("hidden");
    setCodeSectionOpen(open);
  });

  document.getElementById("hint-btn").addEventListener("click", () => {
    document.getElementById("hint-box").classList.toggle("hidden");
  });

  setupWalkthroughDelegation();
  setupCodeEditorPlainTextBehavior(document.getElementById("code-editor"));

  document.getElementById("reset-code-btn").addEventListener("click", () => {
    const level = LEVELS.find((l) => l.id === currentLevelId);
    loadCodeIntoEditor(level, document.getElementById("code-editor"), null);
  });

  const saveBtn = document.getElementById("save-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const level = LEVELS.find((l) => l.id === currentLevelId);
      saveCodeIfEdited(currentLevelId, getEditorText(document.getElementById("code-editor")), level);

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

  document.getElementById("start-game-btn").addEventListener("click", startGame);
  document.getElementById("restart-game-btn").addEventListener("click", () => selectLevel(currentLevelId));
  document.getElementById("clear-chat-btn").addEventListener("click", clearChat);

  document.getElementById("turn-send-btn").addEventListener("click", submitTurn);
  document.getElementById("turn-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitTurn();
  });

  // 其他4条赛道（初级/进阶/高级/调试挑战）侧栏都有"重置进度"，AI小游戏这边
  // 之前漏掉了——玩家想清空重新玩（包括教过AI的新水果/新规则），没有入口。
  const resetProgressBtn = document.getElementById("reset-progress-btn");
  if (resetProgressBtn) {
    resetProgressBtn.addEventListener("click", () => {
      const ok = confirm("确定要清空所有游戏的进度和代码，重新开始吗？");
      if (!ok) return;
      Object.keys(localStorage)
        .filter((k) => k.startsWith("aigames_"))
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

  // 纯文字提示挂太久容易让人怀疑"是不是卡住了/坏了"，尤其是网络慢的时候
  // 一等就是十几秒。根据等的时长分阶段换文案，配合CSS里的转圈动画一起
  // 给持续的进度反馈。
  const stageTimers = [
    setTimeout(() => {
      loadingText.textContent = "还在加载中，网络慢的时候要多等一会儿，正常现象...";
    }, 6000),
    setTimeout(() => {
      loadingText.textContent = "有点慢，不过确实还在加载，马上就好...";
    }, 15000),
  ];
  const clearStageTimers = () => stageTimers.forEach(clearTimeout);

  try {
    const result = await Promise.race([
      loadPyodide(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), PYODIDE_TIMEOUT_MS)),
    ]);
    clearStageTimers();
    return result;
  } catch (e) {
    clearStageTimers();
    showError("加载失败或者超时了，可能是网络不稳定。点击下面的按钮重试一次。");
    return null;
  }
}

async function init() {
  setupButtons();

  // 跟 app.js 同一个道理：登录过账号的话，先把云端进度拉下来盖掉本地缓存，
  // 这个promise是 progress-sync.js 定义的，只能在这里（已经过了第一个await）之后引用它。
  if (window.cloudProgressReady) await window.cloudProgressReady;

  document.getElementById("loading").classList.add("hidden");
  document.getElementById("level-view").classList.remove("hidden");

  selectLevel(LEVELS[0].id);
}

init();
