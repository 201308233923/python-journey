const STORAGE_PROGRESS = "codecourse_unlocked";
const codeKey = (id) => `codecourse_code_${id}`;
const inputKey = (id) => `codecourse_input_${id}`;

let pyodide = null;
let currentLevelId = 1;

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
    return "值不对：常见原因是 int() 想把不是数字的文字转换成数字，检查一下模拟输入框里是不是填了纯数字。";
  }
  if (err.includes("ZeroDivisionError")) {
    return "除数不能是0，检查一下除法算式里的分母。";
  }
  if (err.includes("EOFError")) {
    return "模拟输入不够用了：程序调用 input() 的次数比模拟输入框里的行数还多，检查一下逻辑，或者在模拟输入框里再加一行。";
  }
  return `程序运行出错了：${err}`;
}

function getUnlockedCount() {
  const raw = localStorage.getItem(STORAGE_PROGRESS);
  return raw ? parseInt(raw, 10) : 1;
}

function setUnlockedCount(n) {
  localStorage.setItem(STORAGE_PROGRESS, String(n));
}

function renderSidebar() {
  const unlocked = getUnlockedCount();
  const list = document.getElementById("level-list");
  list.innerHTML = "";

  LEVELS.forEach((level, idx) => {
    const isLocked = idx + 1 > unlocked;
    const isActive = level.id === currentLevelId;
    const item = document.createElement("div");
    item.className = "level-item" + (isLocked ? " locked" : "") + (isActive ? " active" : "");
    const badge = isLocked ? "🔒" : (idx + 1 < unlocked ? "✅" : "▶");
    item.innerHTML = `<span class="badge">${badge}</span><span>${level.title}</span>`;
    if (!isLocked) {
      item.addEventListener("click", () => selectLevel(level.id));
    }
    list.appendChild(item);
  });
}

function selectLevel(id) {
  currentLevelId = id;
  const level = LEVELS.find((l) => l.id === id);

  document.getElementById("level-title").textContent = level.title;
  document.getElementById("level-explain").innerHTML = level.explain;

  const savedCode = localStorage.getItem(codeKey(id));
  document.getElementById("code-editor").value = savedCode !== null ? savedCode : level.starter;

  const inputRow = document.getElementById("input-row");
  const inputEditor = document.getElementById("input-editor");
  if (level.needsInput) {
    inputRow.classList.remove("hidden");
    const savedInput = localStorage.getItem(inputKey(id));
    inputEditor.value = savedInput !== null ? savedInput : (level.defaultInput || "");
  } else {
    inputRow.classList.add("hidden");
  }

  document.getElementById("output-box").textContent = "";
  document.getElementById("feedback-box").className = "feedback-box";
  document.getElementById("feedback-box").textContent = "";
  document.getElementById("hint-box").classList.add("hidden");
  document.getElementById("hint-box").textContent = level.hint || "";

  renderSidebar();
}

const RUNNER_TEMPLATE = `
import io, contextlib, json

_input_lines = [l for l in _input_raw.split("\\n") if l != ""]
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
  const code = document.getElementById("code-editor").value;
  const inputRaw = level.needsInput ? document.getElementById("input-editor").value : "";

  localStorage.setItem(codeKey(level.id), code);
  if (level.needsInput) localStorage.setItem(inputKey(level.id), inputRaw);

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

    const verdict = level.check({ stdout, err });
    feedbackBox.classList.add(verdict.pass ? "success" : "fail");
    feedbackBox.textContent = verdict.message;

    if (verdict.pass) {
      const idx = LEVELS.findIndex((l) => l.id === level.id);
      const unlocked = getUnlockedCount();
      if (idx + 2 > unlocked) {
        setUnlockedCount(idx + 2);
        renderSidebar();
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

  document.getElementById("reset-btn").addEventListener("click", () => {
    const level = LEVELS.find((l) => l.id === currentLevelId);
    document.getElementById("code-editor").value = level.starter;
  });

  document.getElementById("hint-btn").addEventListener("click", () => {
    document.getElementById("hint-box").classList.toggle("hidden");
  });
}

async function init() {
  setupButtons();
  renderSidebar();

  pyodide = await loadPyodide();

  document.getElementById("loading").classList.add("hidden");
  document.getElementById("level-view").classList.remove("hidden");

  const unlocked = getUnlockedCount();
  const startId = LEVELS[Math.min(unlocked, LEVELS.length) - 1].id;
  selectLevel(startId);
}

init();
